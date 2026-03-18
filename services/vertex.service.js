import { generativeModel, genAIInstance, modelName } from '../config/vertex.js';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import * as configService from './configService.js';

dotenv.config();

const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

// Cached Corpus ID - used to avoid redundant listings
let cachedCorpusId = null;

/**
 * Find the aisa_Knowlege_Base corpus or create it if missing
 */
const findOrCreateCorpus = async () => {
    // Debugging logs to see what's actually in process.env
    const envCorpusId = process.env.VERTEX_RAG_CORPUS_ID;
    const envLocation = process.env.GCP_LOCATION;

    logger.info(`[RAG DEBUG] ENV LOCATION: ${envLocation || 'NOT SET'}`);
    logger.info(`[RAG DEBUG] ENV CORPUS_ID: ${envCorpusId || 'NOT SET'}`);

    // Priority 1: Use .env variable if provided
    if (envCorpusId) {
        cachedCorpusId = envCorpusId;
        return cachedCorpusId;
    }

    // Priority 2: Check cache
    if (cachedCorpusId) return cachedCorpusId;

    try {
        const projectId = process.env.GCP_PROJECT_ID;
        const location = process.env.GCP_LOCATION || 'asia-south1';

        if (!projectId) {
            logger.error("[Vertex RAG] GCP_PROJECT_ID not set in environment.");
            return null;
        }
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        const listUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora`;

        logger.info(`[Vertex RAG] Checking corpora in ${location}...`);
        const res = await axios.get(listUrl, {
            headers: { Authorization: `Bearer ${token.token}` }
        });

        const corpora = res.data.ragCorpora || [];
        const existingCorpus = corpora.find(c => c.displayName === 'aisa_knowledge_base');

        if (existingCorpus) {
            cachedCorpusId = existingCorpus.name.split('/').pop();
            logger.info(`[Vertex RAG] Found existing Corpus: ${cachedCorpusId}`);
            return cachedCorpusId;
        }

        // Create if not found
        logger.info(`[Vertex RAG] Creating new Corpus 'aisa_knowledge_base' in ${location}`);
        const createRes = await axios.post(listUrl, { displayName: 'aisa_knowledge_base' }, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
        });
        cachedCorpusId = createRes.data.name.split('/').pop();
        return cachedCorpusId;
    } catch (err) {
        logger.error(`[Vertex RAG] Corpus management failed: ${err.response?.data?.error?.message || err.message}`);
        return null;
    }
};

/**
 * Retrieve search results from Vertex RAG Corpus
 */
export const retrieveContextFromRag = async (query, topK = 8) => {
    try {
        const corpusId = await findOrCreateCorpus();
        if (!corpusId) {
            logger.warn("[Vertex RAG] Retrieval skipped: No Corpus ID.");
            return null;
        }

        const projectId = process.env.GCP_PROJECT_ID;
        const location = process.env.GCP_LOCATION || 'asia-south1';

        if (!projectId) {
            logger.error("[Vertex RAG] Retrieval failed: GCP_PROJECT_ID not set in environment.");
            return null;
        }
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        // --- V1BETA1 RETRIEVAL ---
        const retrieveUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}:retrieveContexts`;

        const corpusName = `projects/${projectId}/locations/${location}/ragCorpora/${corpusId}`;

        const payload = {
            vertexRagStore: {
                ragCorpora: [corpusName]
            },
            query: {
                text: query,
                similarityTopK: topK
            }
        };

        logger.info(`[Vertex RAG] Querying v1beta1 API for corpus: ${corpusId}`);
        const response = await axios.post(retrieveUrl, payload, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
        });

        const contexts = response.data?.contexts?.contexts || [];
        if (contexts.length === 0) {
            logger.info(`[Vertex RAG] No matching documents found in bucket for this query.`);
            return null;
        }

        // Apply Confidence Logic (Filter out highly distant chunks if distance property exists)
        // Distance is usually 0 to 1, where lower is better. We filter out chunks with distance > 0.8
        const validContexts = contexts.filter(c => {
            if (c.distance === undefined || c.distance === null) return true; // Keep if no distance metric
            return c.distance < 0.8; // Reject low confidence chunks
        });

        if (validContexts.length === 0) {
            logger.info(`[Vertex RAG] Found chunks but all were below confidence threshold.`);
            return null;
        }

        // Extract sources and build combined text with source citing
        const Knowledge = (await import('../models/Knowledge.model.js')).default;
        
        const sources = [];
        const contextText = await Promise.all(validContexts.map(async (c, idx) => {
            const gcsUri = c.sourceUri;
            let sourceName = `Document_${idx + 1}`;
            let sourceUrl = '';

            if (gcsUri) {
                const doc = await Knowledge.findOne({ gcsUri });
                if (doc) {
                    sourceUrl = doc.sourceUrl || '';
                    // If we have a URL, try to use a clean title (e.g., domain name)
                    if (sourceUrl) {
                        try {
                            const urlObj = new URL(sourceUrl);
                            sourceName = urlObj.hostname.replace('www.', '');
                        } catch (e) {
                            sourceName = "Official Website";
                        }
                    } else {
                        // Internal file with no URL - use generic brand title instead of filename
                        sourceName = "UWO Internal Resource";
                    }
                }
            }
            sources.push({
                title: sourceName,
                url: sourceUrl || 'https://uwo24.com/',
                snippet: c.text ? c.text.substring(0, 150) + '...' : '',
                document_title: sourceName,
                source_type: 'URL',
                chunk_id: `chunk_${idx}_${Date.now()}`
            });

            const citation = sourceUrl ? `[Ref: ${sourceName}]` : `[Internal Knowledge]`;
            return `${citation}\n${c.text}`;
        }));

        // Deduplicate sources aggressively by Title (since URLs might be internal GCS paths)
        const uniqueSources = [];
        const seenTitles = new Set();
        for (const source of sources) {
            if (!seenTitles.has(source.title)) {
                uniqueSources.push(source);
                seenTitles.add(source.title);
            }
        }

        if (uniqueSources.length === 0) {
            uniqueSources.push({
                title: "Unified Web Options",
                url: "https://uwo24.com/",
                snippet: "Official information about AISA and UWO services.",
                document_title: "Unified Web Options",
                source_type: "URL",
                chunk_id: `default_${Date.now()}`
            });
        }

        const template = configService.getConfig('RAG_CONTEXT_TEMPLATE', 'Use this context: {retrieved_text}');
        const ragContext = template.replace('{retrieved_text}', contextText.join('\n\n'));

        logger.info(`[Vertex RAG] Chunks: ${validContexts.length} | Unique Sources: ${uniqueSources.length}`);
        return { text: ragContext, sources: uniqueSources };

    } catch (error) {
        logger.error(`[Vertex RAG] Retrieval Error: ${error.response?.data?.error?.message || error.message}`);
        return null;
    }
};

/**
 * Rewrites user message into an optimized search query using Gemini
 */
export const rewriteQuery = async (userQuestion) => {
    try {
        const rewriteTemplate = configService.getConfig('QUERY_REWRITE_PROMPT', 'Rewrite the user question for search: {user_question}');
        const rewritePrompt = rewriteTemplate.replace('{user_question}', userQuestion);
        
        const rewriteResult = await AskVertexRaw(rewritePrompt, { 
            maxOutputTokens: 200, 
            temperature: 0.2 
        });
        
        const cleanedQuery = rewriteResult.trim().replace(/^["']|["']$/g, '');
        logger.info(`[QueryRewrite] Original: "${userQuestion}" -> Rewritten: "${cleanedQuery}"`);
        return cleanedQuery;
    } catch (error) {
        logger.error(`[QueryRewrite] Error: ${error.message}`);
        return userQuestion; // Fallback to original
    }
};

/**
 * Detects if the user's query specifically needs company knowledge base information
 */
export const detectRAGNeed = async (query) => {
    try {
        const lower = query.toLowerCase().trim();
        // Fast-path: check for common conversational fillers, greetings, and generic definitions
        const fillers = [
            'hi', 'hello', 'thanks', 'thank you', 'okay', 'dynamic', 'great', 'awesome', 
            'happy to help', 'see you', 'bye', 'hope this helps', 'hope this clears things up',
            'no problem', 'you are welcome', 'got it', 'sure', 'alright', 'what is', 'define',
            'explain', 'how to', 'meaning of'
        ];
        
        // If it starts with a general definition phrase and doesn't mention brand keywords
        const brandKeywords = ['uwo', 'aisa', 'ai mall', 'unified web'];
        const hasBrandKeyword = brandKeywords.some(bk => lower.includes(bk));
        
        const generalPhrases = [
            'what is', 'define', 'how to', 'meaning of', 'explain', 'tell me about', 
            'suggest', 'why is', 'who is', 'give me', 'describe', 'difference between',
            'how does', 'why does', 'what are', 'where is'
        ];
        const isGeneralDefinition = generalPhrases.some(p => lower.startsWith(p)) && !hasBrandKeyword;

        if (fillers.some(f => lower === f) || query.length < 5 || isGeneralDefinition) {
            logger.info(`[RAG-Detector] Fast-path NO (General Content) for: "${query}"`);
            return false;
        }

        const detectorTemplate = configService.getConfig('RAG_DETECTOR_PROMPT', 'Needs RAG? {query}');
        const detectorPrompt = detectorTemplate.replace('{query}', query);

        const result = await AskVertexRaw(detectorPrompt);
        const decision = result.trim().toUpperCase();
        logger.info(`[RAG-Detector] AI Decision for "${query}": ${decision}`);
        
        // Check if decision starts with YES or is just YES
        return decision === 'YES' || decision.startsWith('YES\n') || decision.startsWith('YES ');
    } catch (error) {
        logger.error(`[RAG-Detector] Error: ${error.message}`);
        return false;
    }
}

/**
 * Internal helper for basic text generation
 */
const AskVertexRaw = async (prompt, options = {}) => {
    try {
        const result = await generativeModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (err) {
        throw err;
    }
};

export const askVertex = async (prompt, context = null, options = {}) => {
    try {
        let { systemInstruction, images, documents } = options;

        // Inject Brand Identity if no specific instructions provided
        const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
        const dateContext = `\n### CURRENT DATE & TIME:\nToday is ${currentDate} (India Standard Time). (Aaj ki date aur samay: ${currentDate})\n`;

        if (!systemInstruction) {
            systemInstruction = configService.getFullSystemInstruction() + dateContext;
        } else {
            // Append date context even to custom instructions for reference
            systemInstruction = systemInstruction + dateContext;
        }

        // Add User Name context if provided
        if (options.userName) {
            systemInstruction += `\n### USER INFO:\nYou are talking to ${options.userName}. Address them naturally if appropriate.\n`;
        }

        let finalPrompt = prompt;
        // Combine context with prompt if available (if not using system instruction to carry context)
        if (context) {
            finalPrompt = `CONTEXT:\n${context}\n\nUSER QUESTION:\n${prompt}`;
        }

        let model = generativeModel; // Default model

        // 1. Dynamic Model Creation (if systemInstruction is provided)
        // This is crucial for "File Conversion" mode where specific JSON output instructions are needed.
        if (systemInstruction && genAIInstance) {
            logger.info(`[VERTEX] Creating dynamic model instance with Custom System Instruction.`);
            model = genAIInstance.getGenerativeModel({
                model: modelName,
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Allow some flexibility
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 4096,
                    responseMimeType: systemInstruction.includes("JSON") ? "application/json" : "text/plain"
                },
                systemInstruction: systemInstruction,
            });
        }

        logger.info(`[VERTEX] Sending request to Gemini (Context: ${!!context}, Images: ${images?.length || 0})...`);

        // 2. Prepare Parts (Text + Images)
        let parts = [{ text: finalPrompt }];

        if (images && images.length > 0) {
            const imageParts = images.map(img => ({
                inlineData: {
                    data: img.base64Data,
                    mimeType: img.mimeType
                }
            }));
            // Prepend images to the prompt
            parts = [...imageParts, ...parts];
        }

        // 3. Generate Content
        const result = await model.generateContent(parts);
        const response = await result.response;

        let text = '';
        if (typeof response.text === 'function') {
            text = response.text();
        } else if (response.candidates && response.candidates.length > 0) {
            text = response.candidates[0].content.parts[0].text;
        } else {
            logger.warn(`[VERTEX] Unexpected response format: ${JSON.stringify(response)}`);
            text = "No response generated.";
        }

        // 4. JSON Parsing Attempt (If mode expects JSON)
        // If the instruction asked for JSON, ensure we return it as a string. 
        // The frontend parses it if possible. 
        // We clean up markdown code blocks just in case: ```json ... ```
        if (options.mode === 'FILE_CONVERSION' || (systemInstruction && systemInstruction.includes('JSON'))) {
            text = text.replace(/```json\s*|\s*```/g, '').trim();
        }

        logger.info(`[VERTEX] Response received successfully (${text.length} chars).`);
        return text;

    } catch (error) {
        logger.error(`[VERTEX] Error: ${error.message}`);
        // Fallback for safety blocks
        if (error.message.includes("SAFETY")) {
            return "I cannot fulfill this request due to safety guidelines.";
        }
        throw error;
    }
};

/**
 * Import a file from GCS into the Vertex RAG Corpus
 */
export const importToVertexRag = async (gcsUris, originalName = 'batch_import') => {
    try {
        const corpusId = await findOrCreateCorpus();
        if (!corpusId) {
            logger.warn("[Vertex RAG] Import skipped: No Corpus ID.");
            return null;
        }

        const uris = Array.isArray(gcsUris) ? gcsUris : [gcsUris];
        const projectId = process.env.GCP_PROJECT_ID;
        const location = process.env.GCP_LOCATION || 'asia-south1';

        if (!projectId) {
            throw new Error("GCP_PROJECT_ID not set in environment.");
        }
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        const importUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora/${corpusId}/ragFiles:import`;

        const payload = {
            importRagFilesConfig: {
                gcsSource: {
                    uris: uris
                }
            }
        };

        logger.info(`[Vertex RAG] Triggering import for ${uris.length} files into corpus ${corpusId}`);
        const response = await axios.post(importUrl, payload, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
        });

        logger.info(`[Vertex RAG] Import triggered successfully for ${originalName}. Operation: ${response.data.name || 'Started'}`);
        return response.data;
    } catch (error) {
        logger.error(`[Vertex RAG] Import Error: ${error.response?.data?.error?.message || error.message}`);
        throw error;
    }
};

/**
 * Delete a file from the Vertex RAG Corpus
 */
export const deleteFromVertexRag = async (gcsUri, originalName) => {
    try {
        const corpusId = await findOrCreateCorpus();
        if (!corpusId) return;

        const projectId = process.env.GCP_PROJECT_ID;
        const location = process.env.GCP_LOCATION || 'asia-south1';

        if (!projectId) return;
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        // 1. List files to find the one matching GCS URI
        const listUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora/${corpusId}/ragFiles`;
        
        const res = await axios.get(listUrl, {
            headers: { Authorization: `Bearer ${token.token}` }
        });

        const files = res.data.ragFiles || [];
        const gcsFileName = gcsUri.split('/').pop();
        
        // Find by source URI or display name
        const fileToDelete = files.find(f => 
            f.ragFileConfig?.gcsSource?.uris?.includes(gcsUri) || 
            f.displayName === gcsFileName || 
            f.displayName === originalName
        );

        if (fileToDelete) {
            logger.info(`[Vertex RAG] Deleting file ${fileToDelete.name} from corpus...`);
            const deleteUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/${fileToDelete.name}`;
            await axios.delete(deleteUrl, {
                headers: { Authorization: `Bearer ${token.token}` }
            });
            logger.info(`[Vertex RAG] File deleted successfully: ${originalName}`);
        } else {
            logger.info(`[Vertex RAG] File not found in corpus for deletion: ${originalName}`);
        }
    } catch (error) {
        logger.error(`[Vertex RAG] Delete Error: ${error.response?.data?.error?.message || error.message}`);
        // Non-fatal, don't throw
    }
};
