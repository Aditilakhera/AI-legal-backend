import logger from '../utils/logger.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Detects if a query requires real-time information.
 * Uses a small model to save costs.
 */
export const shouldSearch = async (query) => {
    try {
        if (!OPENAI_API_KEY) return false;

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a real-time information detector. 
                        Today is ${new Date().toDateString()}.
                        Analyze if the query requires up-to-date, live, or real-time information.
                        Respond ONLY "YES" or "NO".`
                    },
                    { role: 'user', content: query }
                ],
                max_tokens: 5,
                temperature: 0
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const decision = response.data.choices[0].message.content.trim().toUpperCase();
        return decision === 'YES';
    } catch (error) {
        logger.error(`[WebSearch] Detection Error: ${error.message}`);
        return false;
    }
};

/**
 * Performs search using OpenAI GPT-4o Search Preview.
 * This model inherently does the search and returns a grounded response.
 */
export const performSearch = async (query, userLanguage = 'English') => {
    try {
        logger.info(`[WebSearch] Calling OpenAI Search for query: "${query}"`);

        const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
        const isHindi = userLanguage === 'Hindi' || /[\u0900-\u097F]/.test(query);
        const targetLang = isHindi ? 'Hindi' : 'English';

        if (!OPENAI_API_KEY) {
            logger.error('[WebSearch] OPENAI_API_KEY is missing!');
            return null;
        }

        const modelName = 'gpt-4o-search-preview';
        logger.info(`[WebSearch] Calling OpenAI with model: ${modelName}`);

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: modelName,
                messages: [
                    {
                        role: 'system',
                        content: `You are AISA, an advanced AI with real-time web search capabilities.
                        TODAY'S DATE: ${currentDate}
                        
                        - Task: Provide a comprehensive, accurate answer to the user's query using your built-in search tool.
                        - Language: ${targetLang} (Use natural, professional ${targetLang}).
                        - Citations: Cite your sources clearly using [1], [2], etc.
                        - Veracity: If information is conflicting, mention both sides.
                        - Fallback: If no live data is found, state it clearly but answer based on your knowledge.
                        
                        Respond in a way that feels like a premium search experience.`
                    },
                    { role: 'user', content: query }
                ]
                // Note: No 'tools' parameter needed for gpt-4o-search-preview as it's built-in
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 90000 // 90s timeout for search
            }
        );

        if (response.data && response.data.choices && response.data.choices[0]) {
            const message = response.data.choices[0].message;
            const content = message.content;

            // Extract sources from citations or sources field
            let sources = [];
            const rawSources = message.sources || message.citations;

            if (rawSources && Array.isArray(rawSources)) {
                sources = rawSources.map(c => ({
                    title: c.title || "Source",
                    url: c.url,
                    description: c.snippet || c.description || ""
                }));
            }

            return {
                summary: content,
                sources: sources
            };
        }

        throw new Error('No response from search-preview model');

    } catch (error) {
        logger.error(`[WebSearch] Search Error: ${error.response?.data?.error?.message || error.message}`);
        return null;
    }
};

/**
 * Compatibility wrapper for existing ai.service.js calls.
 */
export const summarizeResults = async (query, searchResponse) => {
    if (searchResponse && searchResponse.summary) {
        return searchResponse;
    }
    return { summary: "Live search results could not be summarized.", sources: [] };
};
