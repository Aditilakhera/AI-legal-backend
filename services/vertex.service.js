import { generativeModel, genAIInstance, modelName } from '../config/vertex.js';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { BRAND_SYSTEM_RULES } from '../utils/brandIdentity.js';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

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
        const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
        const location = process.env.GCP_LOCATION || 'asia-south1';
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

        const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
        const location = process.env.GCP_LOCATION || 'asia-south1';
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        // --- STABLE V1 PLURAL RETRIEVAL ---
        const retrieveUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}:retrieveContexts`;

        const corpusName = `projects/${projectId}/locations/${location}/ragCorpora/${corpusId}`;

        const payload = {
            vertexRagStore: {
                ragResources: [
                    { ragCorpus: corpusName }
                ]
            },
            query: {
                text: query
            }
        };

        logger.info(`[Vertex RAG] Querying Mumbai v1 API for corpus: ${corpusId}`);
        const response = await axios.post(retrieveUrl, payload, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
        });

        // v1 uses contexts.contexts, v1beta1 used ragContexts.contexts
        const contexts = response.data?.contexts?.contexts || response.data?.ragContexts?.contexts || [];
        if (contexts.length === 0) {
            logger.info(`[Vertex RAG] No matching documents found in bucket for this query.`);
            return null;
        }

        // Combine the context segments
        const contextText = contexts.map(c => c.text).join('\n\n');
        logger.info(`[Vertex RAG] Successfully retrieved ${contexts.length} context segments.`);
        return contextText;

    } catch (error) {
        logger.error(`[Vertex RAG] Retrieval Error: ${error.response?.data?.error?.message || error.message}`);
        return null;
    }
};

export const askVertex = async (prompt, context = null, options = {}) => {
    try {
        let { systemInstruction, images, documents } = options;

        // Inject Brand Identity if no specific instructions provided
        const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
        const dateContext = `\n### CURRENT DATE & TIME:\nToday is ${currentDate} (India Standard Time). (Aaj ki date aur samay: ${currentDate})\n`;

        if (!systemInstruction) {
            systemInstruction = `You are AISA™, the official AI assistant of the AISA™ platform.
${dateContext}
            
${BRAND_SYSTEM_RULES}`;
        } else {
            // Append date context even to custom instructions for reference
            systemInstruction = systemInstruction + dateContext;
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
