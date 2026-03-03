import google from 'googlethis';
import logger from '../utils/logger.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Detects if a query requires real-time information.
 */
export const shouldSearch = async (query) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a real-time information detector. 
                        Today is ${new Date().toDateString()}.
                        Analyze the user's query and determine if it requires up-to-date, live, or real-time information from the web.
                        TODAY IS: ${new Date().toDateString()}
                        
                        EXAMPLES REQUIRING WEB SEARCH (Respond YES):
                        - Current events/news (e.g., "Aaj ki news", "what happened in Delhi today")
                        - Live scores or sports updates (e.g., "India vs Pak score", "IPL update")
                        - Market data (e.g., "Gold price today", "Bitcoin price", "Stock market status")
                        - Weather or time (e.g., "Weather in Mumbai", "Current time in NY")
                        - Recent product releases or trending topics.
                        - Any query containing "today", "aaj", "live", "latest", "now", "current".
                        
                        EXAMPLES NOT REQUIRING WEB SEARCH (Respond NO):
                        - Code snippets or help (e.g., "Write a python script", "fix this bug")
                        - General knowledge/History (e.g., "Who was Einstein", "definition of gravity")
                        - Personal opinions or greetings.
                        - Math or logic puzzles.

                        Respond ONLY with "YES" or "NO". Do NOT provide any explanation.`
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
        return decision.includes('YES');
    } catch (error) {
        logger.error(`[WebSearch] Detection Error: ${error.message}`);
        return false;
    }
};

/**
 * Performs a web search and returns top results.
 */
export const performSearch = async (query) => {
    try {
        logger.info(`[WebSearch] Searching for: ${query}`);
        const options = {
            page: 0,
            safe: true,
            additional_params: {
                hl: 'en'
            }
        };

        const response = await google.search(query, options);

        if (!response || !response.results || !Array.isArray(response.results)) {
            logger.warn(`[WebSearch] No results array found in response for: ${query}`);
            return [];
        }

        // Filter and format results
        const results = response.results
            .filter(r => r && r.title && r.url)
            .filter(r => {
                const lowerTitle = r.title.toLowerCase();
                const lowerUrl = r.url.toLowerCase();
                return !lowerUrl.includes('example.com') &&
                    !lowerUrl.includes('test.com') &&
                    !lowerTitle.includes('mock result') &&
                    !r.description?.toLowerCase().includes('placeholder message');
            })
            .filter(r => !r.title.toLowerCase().includes('low-quality') && !r.url.toLowerCase().includes('spam'))
            .slice(0, 5)
            .map(r => ({
                title: r.title,
                url: r.url,
                description: r.description || "No description available."
            }));

        logger.info(`[WebSearch] Found ${results.length} valid results after placeholder filtering.`);
        return results;
    } catch (error) {
        logger.error(`[WebSearch] Search Error: ${error.message}`);
        return [];
    }
};

/**
 * Summarizes search results in the requested language.
 */
export const summarizeResults = async (query, searchResults, userLanguage = 'English') => {
    try {
        const resultsContext = searchResults.map((r, i) =>
            `Source [${i + 1}]: ${r.title}\nURL: ${r.url}\nContent: ${r.description}`
        ).join('\n\n');

        const isHindi = userLanguage === 'Hindi' || /[\u0900-\u097F]/.test(query);
        const targetLang = isHindi ? 'Hindi' : 'English';

        const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant that summarizes web search results.
                        TODAY'S DATE: ${currentDate}
                        
                        Summarize the following search results for the user's query.
                        - Language: ${targetLang} (If Hindi, use natural and simple Hindi).
                        - Provide a concise yet informative answer.
                        - IMPORTANT: Today is ${currentDate}. If search results mention a different year or date as "today", IGNORE THEM and use the absolute current date provided here.
                        - Cite sources as [1], [2], etc. inside the text.
                        - IF results contain only placeholders, mock data, or messages like "enable search", DISREGARD THEM and say "Mujhe abhi live market data ya live information nahi mil pa rahi hai." (I am unable to find live market data or information right now).
                        - DO NOT invent data. If you are not sure, state it clearly.
                        - Do NOT include a separate "Sources:" or URL list at the bottom of your text.
                        - Handle conflicting data by mentioning both perspectives if both sources are reliable.`
                    },
                    {
                        role: 'user',
                        content: `Query: ${query}\n\nResults:\n${resultsContext}`
                    }
                ],
                max_tokens: 1000,
                temperature: 0.5
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            summary: response.data.choices[0].message.content,
            sources: searchResults
        };
    } catch (error) {
        logger.error(`[WebSearch] Summarization Error: ${error.message}`);
        return { summary: "Live data unavailable.", sources: [] };
    }
};
