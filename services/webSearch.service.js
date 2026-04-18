import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import * as configService from './configService.js';
import { performWebSearch } from './searchService.js';
import { askVertex, AskVertexRaw } from '../services/vertex.service.js';

dotenv.config();

/**
 * Detects if a query requires real-time information.
 * Uses a small Gemini model to save costs.
 */
export const shouldSearch = async (query) => {
    try {
        const decision = await AskVertexRaw(`
            Today is ${new Date().toDateString()}.
            Analyze if the query requires up-to-date, live, or real-time information.
            Respond ONLY "YES" or "NO".
            Query: "${query}"
        `, { 
            modelOverride: 'gemini-1.5-flash',
            maxOutputTokens: 5,
            temperature: 0 
        });

        return decision.trim().toUpperCase() === 'YES';
    } catch (error) {
        logger.error(`[WebSearch] Detection Error: ${error.message}`);
        return false;
    }
};

/**
 * Performs search using Gemini 1.5 Flash with Google Search Grounding.
 */
export const performSearch = async (query, userLanguage = 'English') => {
    try {
        logger.info(`[WebSearch] Calling Gemini Grounded Search for: "${query}"`);

        const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
        const targetLang = userLanguage === 'Hinglish' ? 'Hinglish (Romanized Hindi)' : userLanguage;

        const systemPrompt = configService.getConfig('WEB_SEARCH_RULES') + `
            TODAY'S DATE: ${currentDate}
            LANGUAGE: ${targetLang}
            MANDATORY RULE: You MUST match the EXACT script and tongue used by the user. If the user asks in ${targetLang}, you MUST respond 100% in ${targetLang}.
            Always provide a grounded response using Google Search if relevant.`;

        // Using askVertex with useSearch: true (which we just added)
        const summary = await askVertex(query, null, {
            systemInstruction: systemPrompt,
            useSearch: true,
            modelOverride: 'gemini-1.5-flash'
        });

        // Note: Gemini returns grounding citations in text, but extracting URLs 
        // into a 'sources' array would require parsing metadata. 
        // For now, we rely on the grounded text.
        
        return {
            summary: summary,
            sources: [] // Citations are usually in-text [1], [2] with Gemini grounding
        };

    } catch (error) {
        logger.error(`[WebSearch] Primary Gemini Search Failed: ${error.message}`);

        // --- FALLBACK MECHANISM (Explicit Search) ---
        try {
            logger.info(`[WebSearch] Attempting fallback explicit search for: "${query}"`);
            const searchData = await performWebSearch(query, 5);

            if (!searchData || !searchData.results || searchData.results.length === 0) {
                logger.warn('[WebSearch] Fallback search also yielded no results.');
                return { summary: "I couldn't find any recent information on this topic.", sources: [] };
            }

            const formattedSources = searchData.results.map(r => ({
                title: r.title,
                url: r.link,
                description: r.snippet
            }));

            const snippetsText = searchData.results.map((r, i) => `${i + 1}. [${r.title}] ${r.snippet} (Source: ${r.link})`).join('\n\n');

            const fallbackSystemPrompt = configService.getConfig('WEB_SEARCH_RULES') + `
            TODAY'S DATE: ${new Date().toDateString()}
            
            Below are search results for the query: "${query}"
            ${snippetsText}
            
            Task: Using ONLY the data above, provide a clear and concise answer in ${userLanguage}. Keep it helpful and direct.`;

            const summary = await askVertex(query, null, {
                systemInstruction: fallbackSystemPrompt,
                modelOverride: 'gemini-1.5-flash'
            });

            return {
                summary: summary,
                sources: formattedSources
            };
        } catch (fallbackError) {
            logger.error(`[WebSearch] Fallback Search also failed: ${fallbackError.message}`);
            return { summary: "Search services are currently unavailable.", sources: [] };
        }
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
