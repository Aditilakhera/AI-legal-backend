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
import { BRAND_SYSTEM_RULES } from '../utils/brandIdentity.js';


// Initialize Groq Chat Model - REMOVED (Replaced by groq.service.js)
// const model = new ChatGroq({ ... });

// Real RAG Storage (MongoDB Atlas)
let vectorStore = null;
let embeddings = null;

// Web Search Cache
const searchCache = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

const initializeVectorStore = async () => {
    if (!embeddings) {
        // Keeping a local instance for CHAT queries (low latency, single embedding)
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

// Helper: Run embedding task in worker - REMOVED

export const storeDocument = async (text, docId = null) => {
    try {
        await initializeVectorStore();

        // 1. Processing in Main Thread (Reverted Worker due to V8 Crash)
        // Note: ONNX Runtime uses its own thread pool, so this is still relatively non-blocking.

        // Split Text
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

        // Generate Embeddings
        const vectors = await embeddings.embedDocuments(docs.map(d => d.pageContent));
        logger.info(`[RAG] Generated ${vectors.length} vectors.`);

        // 3. Add to Atlas Vector Store
        await vectorStore.addVectors(vectors, docs);
        logger.info("[RAG] SUCCESSFULLY called vectorStore.addVectors().");

        return true;
    } catch (error) {
        logger.error(`[RAG UPLOAD ERROR] ${error.message}`);
        return false;
    }
};

export const chat = async (message, activeDocContent = null, options = {}) => {
    try {
        if (!message || typeof message !== 'string') {
            message = String(message || "");
        }

        const { systemInstruction, mode, images, documents, userName, language } = options;

        // PRIORITY 0: REAL-TIME WEB SEARCH
        // - Skip web search if images or formal docs are present for specific tasks (like image editing / pdf processing)
        if (message.length > 5 && !images?.length && !documents?.length && !activeDocContent?.length) {

            // Check Cache First
            const cacheKey = message.toLowerCase().trim();
            if (searchCache.has(cacheKey)) {
                const cached = searchCache.get(cacheKey);
                if (Date.now() - cached.timestamp < CACHE_TTL) {
                    logger.info(`[WebSearch] Cache HIT for: ${message}`);
                    return { text: cached.result.summary, isRealTime: true, sources: cached.result.sources };
                }
            }

            const isForcedSearch = mode === 'web_search' || mode === 'DEEP_SEARCH';
            const needsSearch = isForcedSearch || await webSearchService.shouldSearch(message);
            if (needsSearch) {
                logger.info(`[WebSearch] ROUTING TO LIVE WEB SEARCH for: ${message}`);
                const searchResults = await webSearchService.performSearch(message);
                if (searchResults && searchResults.length > 0) {
                    const finalResult = await webSearchService.summarizeResults(message, searchResults, language || 'English');

                    // Cache the result
                    searchCache.set(cacheKey, { result: finalResult, timestamp: Date.now() });

                    return { text: finalResult.summary, isRealTime: true, sources: finalResult.sources };
                } else {
                    logger.warn("[WebSearch] Search yielded no results. Falling back to base AI.");
                    // FALLBACK: Get normal AI response but prepend a note
                    const systemMsg = options.systemInstruction || "You are AISA, a helpful AI assistant.";
                    const fallbackResponse = await openaiService.askOpenAI(message, activeDocContent, {
                        systemInstruction: systemMsg,
                        mode,
                        documents,
                        userName
                    });
                    return {
                        text: `⚠️ **Note: Live data unavailable.**\n(Abhi live data uplabdh nahi hai, isliye main apne base knowledge se jawab de raha hoon.)\n\n${fallbackResponse}`,
                        isRealTime: false,
                        sources: []
                    };
                }
            }
        }


        // PRIORITY 1: Chat-Uploaded Document and System Instructions
        // If we have specific system instructions (like Conversion Mode), we prioritize passing them.
        if (systemInstruction || (activeDocContent && activeDocContent.length > 0) || (images && images.length > 0)) {
            logger.info("[Chat Routing] Using Custom Request (System Instruction / Active Doc / Images).");

            if (images && images.length > 0) {
                logger.info("[Chat Routing] Image(s) detected. Routing to Vertex.");
                const vertexResponse = await vertexService.askVertex(message, activeDocContent, {
                    systemInstruction,
                    mode,
                    images,
                    documents
                });
                return { text: vertexResponse, isRealTime: false };
            }

            logger.info("[Chat Routing] Text/Doc detected. Routing to OpenAI.");
            const openaiResponse = await openaiService.askOpenAI(message, activeDocContent, {
                systemInstruction,
                mode,
                documents,
                userName
            });
            return { text: openaiResponse, isRealTime: false };
        }


        // PRIORITY 2: Company Knowledge Base (Vertex RAG)
        const docCount = await Knowledge.countDocuments(); // Check if we should even bother
        const hasDocs = docCount > 0;

        logger.info(`[Chat Routing] Checking Vertex AI RAG. Docs tracked: ${docCount}`);

        if (hasDocs) {
            // Attempt to retrieve context from Vertex AI RAG Engine
            const ragContext = await vertexService.retrieveContextFromRag(message, 4);

            if (ragContext) {
                logger.info(`[Vertex RAG] Found relevant context for query.`);

                // Grounding prompt for Vertex RAG results
                const groundedContext = "SOURCE: VERTEX AI KNOWLEDGE BASE\nIMPORTANT: Use the information below ONLY if it directly answers the user's question about the company (UWO/AI Mall). If the question is general, prioritize general intelligence.\n\n" + ragContext;

                // Answer using retrieved context - Routing to OpenAI
                const ragResponse = await openaiService.askOpenAI(message, groundedContext, { userName });
                return { text: ragResponse, isRealTime: false };
            } else {
                logger.info(`[Vertex RAG] No relevant context found for this query.`);
            }
        }

        // PRIORITY 3: Answer from General Knowledge (Explicit No Context) - Routing to OpenAI
        logger.info("[Chat Routing] Answering from General Knowledge (OpenAI).");
        const aiResponse = await openaiService.askOpenAI(message, null, { userName });
        return { text: aiResponse, isRealTime: false };

    } catch (error) {
        logger.error(`Chat Handling Error: ${error.message}`);
        return { text: "I'm having trouble connecting to my brain right now. Please try again later.", error: true };
    }
};

// Initialize from DB (Now just a placeholder/connection check)
export const initializeFromDB = async () => {
    try {
        logger.info("Using MongoDB Atlas Vector Search. Persistence is handled natively.");
        await initializeVectorStore();
    } catch (error) {
        logger.error(`Failed to initialize Vector Store: ${error.message} `);
    }
};

export const reloadVectorStore = async () => {
    vectorStore = null;
    await initializeFromDB();
};

export const ragChat = async (message) => {
    return chat(message);
};
