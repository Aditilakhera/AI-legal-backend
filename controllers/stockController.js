import * as stockService from '../services/stockService.js';
import * as cashflowService from '../services/cashflowService.js';
import logger from '../utils/logger.js';
import { subscriptionService } from '../services/subscriptionService.js';
import { retrieveContextFromRag } from '../services/vertex.service.js';
import { AskVertexRaw } from '../services/vertex.service.js';

export const getQuote = async (req, res) => {
    try {
        const { symbol } = req.query;
        if (!symbol) return res.status(400).json({ error: 'Symbol is required' });
        
        const quote = await stockService.getQuote(symbol);
        res.json({ quote });
    } catch (error) {
        logger.error(`[Stock Controller] Quote Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
};

export const getIntraday = async (req, res) => {
    try {
        const { symbol } = req.query;
        if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

        const intraday = await stockService.getIntraday(symbol);
        
        if (req.creditMeta) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.json({ intraday });
    } catch (error) {
        logger.error(`[Stock Controller] Intraday Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch intraday' });
    }
};

export const getNews = async (req, res) => {
    try {
        const { symbol } = req.query;
        if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

        const news = await stockService.getNews(symbol);

        if (req.creditMeta) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.json({ news });
    } catch (error) {
        logger.error(`[Stock Controller] News Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};

export const getHistorical = async (req, res) => {
    try {
        const { symbol } = req.query;
        if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

        const historical = await stockService.getHistorical(symbol);

        if (req.creditMeta) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.json({ historical });
    } catch (error) {
        logger.error(`[Stock Controller] Historical Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
};

export const getAdvisory = async (req, res) => {
    try {
        const { symbol } = req.query;
        if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

        const advisory = await stockService.getAdvisory(symbol);

        if (req.creditMeta) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.json({ advisory });
    } catch (error) {
        logger.error(`[Stock Controller] Advisory Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch advisory details' });
    }
};

export const getResearch = async (req, res) => {
    try {
        const { symbol, name } = req.query;
        if (symbol) {
            const snapshot = await stockService.getAiSnapshot(symbol, name);
            if (req.creditMeta) {
                await subscriptionService.deductCreditsFromMeta(req.creditMeta);
            }
            return res.json({ research: snapshot });
        }
        
        if (req.creditMeta) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.json({ research });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch research' });
    }
};

/**
 * GET /api/stock/graham-analysis
 * Generates a Benjamin Graham-style analysis for a stock,
 * retrieving context from "The Intelligent Investor" in the RAG corpus.
 */
export const getGrahamAnalysis = async (req, res) => {
    try {
        const { symbol, name, price } = req.query;
        if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

        const stockName = name || symbol.split('.')[0];
        // Improved query to include the stock name for better RAG retrieval
        const query = `Benjamin Graham value investing principles applied to ${stockName}: margin of safety, intrinsic value, EPS, P/E ratio, defensive investing, and excerpts from The Intelligent Investor.`;

        // 1. Retrieve relevant passages from "The Intelligent Investor" via RAG
        // Changed category to 'FINANCE' as it's more appropriate for an investment book
        logger.info(`[Graham] Retrieving context from RAG for ${symbol}...`);
        const ragResult = await retrieveContextFromRag(query, 6, 'FINANCE');
        const bookContext = ragResult?.text || '';

        // 2. Get current advisory data for indicators
        const advisory = await stockService.getAdvisory(symbol);

        // 3. Build the Graham analysis prompt
        const prompt = `
You are Benjamin Graham, the father of value investing, author of "The Intelligent Investor".
Analyze the stock ${stockName} (${symbol}) from your core investment philosophy.

Current Market Data:
- Current Price: ₹${price || 'Unknown'}
- RSI: ${advisory.indicators.RSI}
- MACD: ${advisory.indicators.MACD}
- SMA20: ${advisory.indicators.SMA}
- Ichimoku Trend: ${advisory.indicators.Ichimoku}
- 61.8% Fibonacci Level: ₹${advisory.indicators.Fibonacci}

Relevant excerpts from "The Intelligent Investor" (your teachings):
${bookContext || 'Apply your core principles: margin of safety, intrinsic value, and defensive investing.'}

Based on your philosophy from "The Intelligent Investor", provide a structured analysis.
Return ONLY valid JSON with this EXACT structure:
{
  "graham_verdict": "BUY" | "HOLD" | "AVOID",
  "margin_of_safety": "Assessment of whether the current price offers a margin of safety",
  "intrinsic_value_note": "Commentary on the estimated intrinsic value vs current price",
  "defensive_investor": "Is this suitable for a defensive (passive) investor? Why?",
  "enterprising_investor": "Is this suitable for an enterprising (active) investor? Why?",
  "graham_number_note": "Commentary on price-to-earnings and price-to-book considerations",
  "key_principle_applied": "Which specific principle from The Intelligent Investor is most relevant here?",
  "graham_quote": "A relevant quote or paraphrase from your teachings that applies to this stock",
  "final_advice": "Your final one-paragraph advice as Benjamin Graham"
}
`;

        logger.info(`[Graham] Generating Benjamin Graham analysis for ${symbol}...`);
        const aiResponse = await AskVertexRaw(prompt, { temperature: 0.4, maxOutputTokens: 2048 });
        const cleanJson = aiResponse.replace(/```json\s*|\s*```/g, '').trim();
        const grahamData = JSON.parse(cleanJson);

        if (req.creditMeta) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.json({ 
            graham: {
                ...grahamData,
                symbol,
                name: stockName,
                source: 'The Intelligent Investor — Benjamin Graham',
                rag_used: !!ragResult
            }
        });

    } catch (error) {
        logger.error(`[Graham] Analysis Error: ${error.message}`);
        res.json({
            graham: {
                graham_verdict: 'HOLD',
                margin_of_safety: 'Unable to retrieve full analysis. Apply caution.',
                intrinsic_value_note: 'Evaluate P/E ratio and book value independently.',
                defensive_investor: 'Verify earnings stability over 10 years before investing.',
                enterprising_investor: 'Look for net-current-asset value opportunities.',
                graham_number_note: 'Ensure P/E × P/B < 22.5 before committing capital.',
                key_principle_applied: 'Margin of Safety',
                graham_quote: '"The intelligent investor is a realist who sells to optimists and buys from pessimists."',
                final_advice: 'Exercise patience, demand a margin of safety, and never speculate.',
                source: 'The Intelligent Investor — Benjamin Graham',
                rag_used: false
            }
        });
    }
};

/**
 * GET /api/stock/kiyosaki-analysis
 * Generates a Robert Kiyosaki-style analysis for a stock,
 * retrieving context from "Rich Dad Poor Dad" in the RAG corpus.
 */
export const getKiyosakiAnalysis = async (req, res) => {
    try {
        const { symbol, name, price } = req.query;
        if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

        const stockName = name || symbol.split('.')[0];
        const query = `Robert Kiyosaki financial principles from Rich Dad Poor Dad: assets vs liabilities, cashflow, financial literacy, taking risks, and investment advice for building wealth applied to ${stockName}.`;

        logger.info(`[Kiyosaki] Retrieving context from RAG for ${symbol}...`);
        const ragResult = await retrieveContextFromRag(query, 6, 'FINANCE');
        const bookContext = ragResult?.text || '';

        const advisory = await stockService.getAdvisory(symbol);

        const prompt = `
You are Robert Kiyosaki, author of "Rich Dad Poor Dad".
Analyze the stock ${stockName} (${symbol}) from your perspective on wealth building and cashflow.

Current Market Data:
- Current Price: ₹${price || 'Unknown'}
- RSI: ${advisory.indicators.RSI}
- MACD: ${advisory.indicators.MACD}
- Trend: ${advisory.indicators.Ichimoku}

Relevant excerpts from "Rich Dad Poor Dad" (your principles):
${bookContext || 'Focus on assets that put money in your pocket, cashflow, and financial education.'}

Return ONLY valid JSON with this EXACT structure:
{
  "kiyosaki_verdict": "BUY" | "HOLD" | "AVOID",
  "cashflow_perspective": "How does this stock fit into a cashflow-focused portfolio?",
  "asset_vs_liability": "Is this a true asset according to your definition?",
  "financial_literacy_tip": "A tip for the investor to improve their financial IQ regarding this sector",
  "risk_assessment": "How should an investor view the risk of this stock?",
  "rich_dad_advice": "What would the 'Rich Dad' say about this specific opportunity?",
  "kiyosaki_quote": "A relevant quote or principle from your teachings",
  "final_summary": "Your final one-paragraph advice on whether this helps build true wealth"
}
`;

        logger.info(`[Kiyosaki] Generating analysis for ${symbol}...`);
        const aiResponse = await AskVertexRaw(prompt, { temperature: 0.5, maxOutputTokens: 2048 });
        const cleanJson = aiResponse.replace(/```json\s*|\s*```/g, '').trim();
        const kiyosakiData = JSON.parse(cleanJson);

        if (req.creditMeta) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.json({ 
            kiyosaki: {
                ...kiyosakiData,
                symbol,
                name: stockName,
                source: 'Rich Dad Poor Dad — Robert Kiyosaki',
                rag_used: !!ragResult
            }
        });

    } catch (error) {
        logger.error(`[Kiyosaki] Analysis Error: ${error.message}`);
        res.json({
            kiyosaki: {
                kiyosaki_verdict: 'HOLD',
                cashflow_perspective: 'Looking for assets that provide consistent cashflow.',
                asset_vs_liability: 'Remember: An asset puts money in your pocket.',
                financial_literacy_tip: 'Mind your own business and keep your daytime job but start buying real assets.',
                risk_assessment: 'Risk comes from not knowing what you are doing.',
                rich_dad_advice: 'Don’t work for money, make money work for you.',
                kiyosaki_quote: 'It’s not how much money you make. It’s how much money you keep.',
                final_summary: 'Focus on financial education and building an asset column that generates enough income to cover your expenses.',
                source: 'Rich Dad Poor Dad — Robert Kiyosaki',
                rag_used: false
            }
        });
    }
};

export const searchStocks = async (req, res) => {
    try {
        const { q, keywords } = req.query;
        const searchTerm = q || keywords;
        if (!searchTerm) return res.status(400).json({ error: 'Search term is required' });

        const matches = await cashflowService.searchStocks(searchTerm);
        res.json(matches);
    } catch (error) {
        logger.error(`[Stock Controller] Search Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to search stocks' });
    }
};
