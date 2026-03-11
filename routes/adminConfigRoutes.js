import express from 'express';
import { getConfig, refreshCache } from '../services/configService.js';
import SystemConfig from '../models/SystemConfig.js';
import { verifyToken } from '../middleware/authorization.js';

const router = express.Router();

/**
 * GET /api/admin/configs
 * Fetch all configurations from the database
 */
router.get('/configs', async (req, res) => {
    try {
        // In production, you should protect this with verifyToken
        const configs = await SystemConfig.find().sort({ key: 1 });
        res.json({
            success: true,
            count: configs.length,
            data: configs
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/admin/configs/refresh
 * Manually refresh the server cache from DB
 */
router.post('/configs/refresh', async (req, res) => {
    try {
        await refreshCache();
        res.json({ success: true, message: 'Configuration cache refreshed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
