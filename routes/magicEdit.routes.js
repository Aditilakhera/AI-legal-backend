import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/authorization.js';
import { creditMiddleware } from '../middleware/creditSystem.js';
import { generateImageFromPrompt } from '../controllers/image.controller.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.'), false);
        }
        cb(null, true);
    }
});

router.post('/', verifyToken, upload.single('image'), creditMiddleware, async (req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }
        if (!file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        console.log(`[Magic Image Edit] Processing: "${prompt}"`);

        const imageBase64 = file.buffer.toString('base64');

        const modifiedImageUrl = await generateImageFromPrompt(prompt, imageBase64);

        if (!modifiedImageUrl) {
            throw new Error("Failed to retrieve modified image URL.");
        }

        // Usage increment if needed
        if (req.subscriptionMeta) {
            const { usage, usageKey } = req.subscriptionMeta;
            if (usage && usageKey) {
                const subscriptionService = { incrementUsage: async () => { } };
                await subscriptionService.incrementUsage(usage, usageKey);
            }
        }

        res.status(200).json({
            success: true,
            data: modifiedImageUrl
        });

    } catch (error) {
        console.error(`[Magic Image Edit] Critical Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: `Image editing failed: ${error.message}`
        });
    }
});

export default router;
