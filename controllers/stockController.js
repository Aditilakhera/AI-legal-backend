import * as stockService from '../services/stockService.js';
import logger from '../utils/logger.js';

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
        res.json({ advisory });
    } catch (error) {
        logger.error(`[Stock Controller] Advisory Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch advisory details' });
    }
};

export const getResearch = async (req, res) => {
    try {
        const research = await stockService.getResearch();
        res.json({ research });
    } catch (error) {
        logger.error(`[Stock Controller] Research Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch research' });
    }
};
