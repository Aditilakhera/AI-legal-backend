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

        // PRIORITY -1: PERSONA INJECTION (Adaptive System)
        const personaContext = await userIntelligenceService.getPersonaInjection(userId);
        const dynamicSystemInstruction = (systemInstruction || "") + personaContext;

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
                const isForcedSearch = mode === 'web_search' || mode === 'DEEP_SEARCH';
                const needsSearch = isForcedSearch || await webSearchService.shouldSearch(message);
                if (needsSearch) {
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
        } else if (dynamicSystemInstruction || (activeDocContent && activeDocContent.length > 0) || (images && images.length > 0)) {
            // PRIORITY 1: Chat-Uploaded Document / Images
            const promptWithMemory = buildMemoryPrompt(message);
            if (images && images.length > 0) {
                const vertexResponse = await vertexService.askVertex(promptWithMemory, activeDocContent, {
                    systemInstruction: dynamicSystemInstruction, mode, images, documents
                });
                finalResponseData = { text: vertexResponse, isRealTime: false };
            } else {
                const openaiResponse = await openaiService.askOpenAI(promptWithMemory, activeDocContent, {
                    systemInstruction: dynamicSystemInstruction, mode, documents, userName
                });
                finalResponseData = { text: openaiResponse, isRealTime: false };
            }
        } else {
            // PRIORITY 2: Company Knowledge Base (Vertex RAG)
            const docCount = await Knowledge.countDocuments();
            let ragContext = null;
            let rewrittenQuery = message;

            if (docCount > 0) {
                // Step 0: Detect Intent (Only use RAG for company-specific queries)
                const needsRAG = await vertexService.detectRAGNeed(message);

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

            if (ragContext && ragContext.text) {
                const promptWithMemory = buildMemoryPrompt(message);
                // Step 4: Answer Generation (Context + Original Question)
                const ragResponse = await vertexService.askVertex(promptWithMemory, ragContext.text, { 
                    userName, 
                    systemInstruction: dynamicSystemInstruction,
                    mode: 'RAG' 
                });
                finalResponseData = { text: ragResponse, isRealTime: false, sources: ragContext.sources };
            } else {
                // PRIORITY 3: General Knowledge
                const promptWithMemory = buildMemoryPrompt(message);
                const aiResponse = await openaiService.askOpenAI(promptWithMemory, null, { 
                    userName, 
                    systemInstruction: dynamicSystemInstruction 
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

export const ragChat = async (message) => {
    return chat(message);
};
