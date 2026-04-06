import express from 'express';
import * as stockController from '../controllers/stockController.js';
import { verifyToken } from '../middleware/authorization.js';

const router = express.Router();

// Existing search route (from cashflow) can stay or we can move it. We'll map exact what was asked.
// But wait, the Frontend still searches using /api/cashflow/search, we'll keep that working.
router.get('/quote', verifyToken, stockController.getQuote);
router.get('/intraday', verifyToken, stockController.getIntraday);
router.get('/news', verifyToken, stockController.getNews);
router.get('/historical', verifyToken, stockController.getHistorical);
router.get('/advisory', verifyToken, stockController.getAdvisory);
router.get('/research', verifyToken, stockController.getResearch);

export default router;
