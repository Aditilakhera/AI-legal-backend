import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import Knowledge from "../models/Knowledge.model.js";
import { Worker } from 'worker_threads';
import path from 'path';
import * as vertexService from './vertex.service.js';
import * as openaiService from './openai.service.js';
import * as webSearchService from './webSearch.service.js';
import memoryService from './memory.service.js';
import QueryLog from '../models/QueryLog.model.js';
import userIntelligenceService from './userIntelligence.service.js';
import * as configService from './configService.js';


// Real RAG Storage (MongoDB Atlas)
let vectorStore = null;
let embeddings = null;

// Web Search Cache
const searchCache = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

const initializeVectorStore = async () => {
    if (!embeddings) {
        logger.info("Initializing Local Embeddings (Xenova/all-MiniLM-L6-v2) for Chat...");
        embeddings = new HuggingFaceTransformersEmbeddings({
            modelName: "Xenova/all-MiniLM-L6-v2",
        });
    }
    if (!vectorStore) {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB not connected yet");
        }
        const collection = mongoose.connection.db.collection("knowledge_vectors");
        vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
            collection: collection,
            indexName: "default",
            textKey: "text",
            embeddingKey: "embedding",
        });
        logger.info("MongoDB Atlas Vector Store initialized.");
    }
};

export const storeDocument = async (text, docId = null) => {
    try {
        await initializeVectorStore();
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docs = await splitter.createDocuments([text]);
        logger.info(`[RAG] Split into ${docs.length} chunks.`);
        if (docs.length === 0) {
            logger.warn("[RAG] No chunks to embed.");
            return false;
        }
        const vectors = await embeddings.embedDocuments(docs.map(d => d.pageContent));
        logger.info(`[RAG] Generated ${vectors.length} vectors.`);
        await vectorStore.addVectors(vectors, docs);
        logger.info("[RAG] SUCCESSFULLY called vectorStore.addVectors().");
        return true;
    } catch (error) {
        logger.error(`[RAG UPLOAD ERROR] ${error.message}`);
        return false;
    }
};

export const chat = async (message, activeDocContent = null, options = {}) => {
    let finalResponseData = { text: "" };
    try {
        if (!message || typeof message !== 'string') {
            message = String(message || "");
        }

        const { systemInstruction, mode, images, documents, userName, language, conversationId, userId } = options;

        // --- CONVERSATION MEMORY RAG ---
        let retrievedHistory = [];
        if (conversationId) {
            logger.info(`[Memory] Retrieving memory for conversation: ${conversationId}`);
            retrievedHistory = await memoryService.retrieveMemory(conversationId, message, 5);
        }
        
        // Save User Message (async)
        if (conversationId) {
            memoryService.saveMessageWithEmbedding(conversationId, userId, 'user', message).catch(err => {
                logger.error(`[Memory] Failed to save user message: ${err.message}`);
            });
        }

        // PRIORITY -1: PERSONA INJECTION & TOOL RESTRICTIONS
        const personaContext = await userIntelligenceService.getPersonaInjection(userId);
        
        const isActuallyImageMode = mode === 'IMAGE_GEN' || mode === 'IMAGE_EDIT';
        const isActuallyVideoMode = mode === 'VIDEO_GEN';
        const isActuallySearchMode = mode === 'web_search' || mode === 'DEEP_SEARCH';
        
        let toolRestrictions = "";
        if (isActuallyImageMode) {
            toolRestrictions = "\n\n### MODE: IMAGE GENERATION ENABLED. You can generate images using JSON action strictly if explicitly asked.";
        } else if (isActuallyVideoMode) {
            toolRestrictions = "\n\n### MODE: VIDEO GENERATION ENABLED. You can generate videos using JSON action strictly if explicitly asked.";
        } else if (isActuallySearchMode) {
            toolRestrictions = "\n\n### MODE: WEB SEARCH ENABLED. Answer based on real-time data.";
        } else {
            toolRestrictions = "\n\n### MODE: NORMAL CHAT. Strictly avoid executing magic actions. Answer questions using text only. If the user wants to generate media, tell them to use the AISA Magic Tools menu.";
        }

        const dynamicSystemInstruction = (systemInstruction || "") + personaContext + toolRestrictions;

        // Helper to build context-aware prompt
        const buildMemoryPrompt = (query) => {
            if (retrievedHistory.length > 0) {
                return memoryService.buildContext(dynamicSystemInstruction, retrievedHistory, query);
            }
            return query;
        };

        // PRIORITY 0: REAL-TIME WEB SEARCH
        if (message.length > 5 && !images?.length && !documents?.length && !activeDocContent?.length) {
            const cacheKey = message.toLowerCase().trim();
            if (searchCache.has(cacheKey)) {
                const cached = searchCache.get(cacheKey);
                if (Date.now() - cached.timestamp < CACHE_TTL) {
                    logger.info(`[WebSearch] Cache HIT for: ${message}`);
                    finalResponseData = { text: cached.result.summary, isRealTime: true, sources: cached.result.sources };
                }
            }

            if (!finalResponseData.text) {
                const isForcedSearch = mode === 'web_search' || mode === 'DEEP_SEARCH' || mode === 'SEARCH';
                // Only perform web search if explicitly requested via mode.
                // This ensures "normal questions" go to Vertex AI without extra resources.
                if (isForcedSearch) {
                    logger.info(`[WebSearch] ROUTING TO LIVE WEB SEARCH for: ${message}`);
                    const searchResult = await webSearchService.performSearch(message, language);

                    if (searchResult && searchResult.summary) {
                        searchCache.set(cacheKey, { result: searchResult, timestamp: Date.now() });
                        finalResponseData = { text: searchResult.summary, isRealTime: true, sources: searchResult.sources };
                    } else {
                        logger.warn("[WebSearch] Search yielded no results.");
                    }
                }
            }
        }

        if (finalResponseData.text) {
            // Memory save handled at end
        } else if ((activeDocContent && activeDocContent.length > 0) || (images && images.length > 0)) {
            // PRIORITY 1: Chat-Uploaded Document / Images
            const promptWithMemory = buildMemoryPrompt(message);
            const vertexResponse = await vertexService.askVertex(promptWithMemory, activeDocContent, {
                systemInstruction: dynamicSystemInstruction, 
                mode, 
                images, 
                documents,
                userName
            });
            finalResponseData = { text: vertexResponse, isRealTime: false };
        } else {
            // PRIORITY 2: Company Knowledge Base (Vertex RAG)
            const docCount = await Knowledge.countDocuments();
            let ragContext = null;
            let rewrittenQuery = message;

            const manualCorpusId = process.env.VERTEX_RAG_CORPUS_ID;
            if (docCount > 0 || manualCorpusId) {
                // Step 0: Robust Detection (Only use RAG for company-specific queries)
                const lowerMsg = message.toLowerCase().trim();
                const companyKeywords = ['uwo', 'aisa', 'ai mall', 'unified web'];
                const generalPhrases = ['what is', 'how to', 'explain', 'define', 'meaning of', 'tell me about', 'why is', 'suggest', 'give me', 'who is'];
                
                // If it looks like a general question and lacks company keywords, SKIP RAG immediately (No Resources)
                const hasCompanyKeyword = companyKeywords.some(k => lowerMsg.includes(k));
                const startsWithGeneral = generalPhrases.some(p => lowerMsg.startsWith(p));
                
                logger.info(`[RAG-Logic] Msg: "${lowerMsg}" | hasKeyword: ${hasCompanyKeyword} | startsGen: ${startsWithGeneral}`);

                let needsRAG = false;

                if (startsWithGeneral && !hasCompanyKeyword) {
                    // USER REQUIREMENT: Normal questions like "What is..." should NEVER trigger RAG unless brands are mentioned.
                    needsRAG = false;
                    logger.warn(`[RAG-Logic] FORCED NO for generic question: "${lowerMsg}"`);
                } else if (hasCompanyKeyword) {
                    needsRAG = true; // High confidence it's about the company
                    logger.info(`[RAG-Logic] Decision: YES (Keyword match) for: "${lowerMsg}"`);
                } else {
                    // Ambiguous - ask the AI detector for a decision
                    needsRAG = await vertexService.detectRAGNeed(message);
                    logger.info(`[RAG-Logic] Decision: ${needsRAG ? 'YES' : 'NO'} (AI Detector) for: "${lowerMsg}"`);
                }

                if (needsRAG) {
                    // Step 1: Query Rewriting
                    rewrittenQuery = await vertexService.rewriteQuery(message);
                    
                    // Step 2: Retrieval using Rewritten Query
                    ragContext = await vertexService.retrieveContextFromRag(rewrittenQuery, 8);
                    
                    // --- Step 3: Logging (Optional but requested) ---
                    try {
                        await QueryLog.create({
                            user_question: message,
                            rewritten_query: rewrittenQuery,
                            retrieved_documents: ragContext?.sources?.map(s => ({
                                document_title: s.document_title,
                                source_type: s.source_type,
                                chunk_id: s.chunk_id,
                                snippet: s.snippet
                            })) || [],
                            userId: userId || 'admin'
                        });
                    } catch (logErr) {
                        logger.error(`[QueryLog] Failed: ${logErr.message}`);
                    }
                } else {
                    logger.info(`[RAG] Skipping retrieval. Query "${message}" is generic.`);
                }
            }

            if (hasCompanyKeyword || (ragContext && ragContext.text)) {
                if (!ragContext || !ragContext.sources || ragContext.sources.length === 0) {
                    if (hasCompanyKeyword) {
                        ragContext = ragContext || {};
                        ragContext.sources = [{
                            title: "Unified Web Options",
                            url: "https://uwo24.com/",
                            snippet: "Official information about AISA and UWO services.",
                            document_title: "Unified Web Options",
                            source_type: "URL",
                            chunk_id: `brand_${Date.now()}`
                        }];
                    }
                }

                const promptWithMemory = buildMemoryPrompt(message);
                // Step 4: Answer Generation (Context + Original Question)
                const ragInstructionWithLink = `${dynamicSystemInstruction}\n\n### WEBSITE CITATION RULE:\nWhenever you provide information about AISA or UWO based on the provided company documents, you MUST mention the official website: https://uwo24.com/`;

                const ragResponse = await vertexService.askVertex(promptWithMemory, ragContext?.text, { 
                    userName, 
                    systemInstruction: ragInstructionWithLink,
                    mode: 'RAG' 
                });
                finalResponseData = { text: ragResponse, isRealTime: true, sources: ragContext?.sources || [], mode: 'RAG' };
            } else {
                // PRIORITY 3: General Knowledge (Normal Questions)
                const promptWithMemory = buildMemoryPrompt(message);
                
                // USER REQUIREMENT: For normal questions, ONLY give the answer.
                // We use a specialized instruction set that forbids suggestions and citations.
                const generalInstruction = configService.getGeneralSystemInstruction(personaContext);
                logger.warn(`[RAG-Logic] EXECUTING GENERAL CHAT for: "${message}"`);

                const aiResponse = await vertexService.askVertex(promptWithMemory, null, { 
                    userName, 
                    systemInstruction: generalInstruction 
                });
                finalResponseData = { text: aiResponse, isRealTime: false };
            }
        }

        // --- Post-Processing: Trigger Intelligence Engine (Async) ---
        userIntelligenceService.processInteraction(userId, message, 'user').catch(err => {
            logger.error(`[Intelligence] Processing failed: ${err.message}`);
        });

        // --- Save Assistant Message to Memory ---
        if (conversationId && finalResponseData.text) {
            memoryService.saveMessageWithEmbedding(conversationId, userId, 'assistant', finalResponseData.text).catch(err => {
                logger.error(`[Memory] Failed to save assistant message: ${err.message}`);
            });
        }

        return finalResponseData;

    } catch (error) {
        logger.error(`Chat Handling Error: ${error.message}`);
        return { text: "I'm having trouble connecting to my brain right now. Please try again later.", error: true };
    }
};

export const initializeFromDB = async () => {
    try {
        await initializeVectorStore();
    } catch (error) {
        logger.error(`Failed to initialize Vector Store: ${error.message}`);
    }
};

export const reloadVectorStore = async () => {
    vectorStore = null;
    await initializeFromDB();
};

export const generateConversationTitle = async (message) => {
    try {
        const prompt = `Convert the following user message into a very short, clean title (3-5 words max).
        
Rules:
- NO QUOTES.
- NO CONVERSATIONAL FILLER.
- DO NOT answer the user. Just title it.
- Title Case for principal words.
- If it's a greeting, just say "Greeting". 
- ALWAYS try to summarize the topic if it's longer than 2 words.

User Message: "${message}"

Title:`;

        const fullPrompt = prompt;

        // Log the request
        logger.debug(`[AI-TITLE] Prompt: ${fullPrompt}`);

        const title = await vertexService.AskVertexRaw(fullPrompt, {
            maxOutputTokens: 50,
            temperature: 0.1
        });

        // Log raw response
        logger.debug(`[AI-TITLE] Raw response: "${title}"`);

        // Clean up the potentially generated string (remove surrounding quotes if any)
        const cleanTitle = title.trim().replace(/^["']|["']$/g, '').replace(/\.\.\.$/, '');
        
        // If it's a safety block or too long, use fallback
        if (cleanTitle.toLowerCase().includes("cannot fulfill") || cleanTitle.length > 60 || !cleanTitle) {
            throw new Error(`Invalid AI title response: "${cleanTitle}"`);
        }

        return cleanTitle;
    } catch (error) {
        logger.error(`[AI-TITLE] Error generateConversationTitle: ${error.message}`);
        // Last resort: substring of the message (ChatGPT-style fallback)
        const words = message.trim().split(/\s+/);
        if (words.length <= 2) return "General Chat";
        return words.slice(0, 5).join(' ') + (words.length > 5 ? '' : '');
    }
};

export const ragChat = async (message) => {
    return chat(message);
};
