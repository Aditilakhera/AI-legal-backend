import express from 'express';
import * as stockController from '../controllers/stockController.js';
import { creditMiddleware } from '../middleware/creditSystem.js';
import { verifyToken } from '../middleware/authorization.js';

const router = express.Router();

// Dynamic Stock Search
router.get('/debug-session', async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const Session = (await import('../models/Session.js')).default;
        const jwt = (await import('jsonwebtoken')).default;

        const user = await User.findOne({});
        if (!user) throw new Error("No users in database!");

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET);
        
        await Session.create({
            userId: user._id,
            token,
            lastActive: Date.now()
        });

        res.json({ success: true, token, userId: user._id, email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/search', verifyToken, stockController.searchStocks);

router.get('/quote', verifyToken, stockController.getQuote);

// Unlock status check (no credit middleware — read-only status query)
router.get('/unlocked-tabs', verifyToken, stockController.getUnlockedTabs);

router.get('/intraday', verifyToken, creditMiddleware, stockController.getIntraday);
router.get('/news', verifyToken, creditMiddleware, stockController.getNews);
router.get('/historical', verifyToken, creditMiddleware, stockController.getHistorical);
router.get('/advisory', verifyToken, creditMiddleware, stockController.getAdvisory);
router.get('/research', verifyToken, creditMiddleware, stockController.getResearch);
router.get('/graham-analysis', verifyToken, creditMiddleware, stockController.getGrahamAnalysis);
router.get('/kiyosaki-analysis', verifyToken, creditMiddleware, stockController.getKiyosakiAnalysis);

export default router;

