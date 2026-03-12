import express from 'express';
import { generateVideo, getVideoStatus, downloadVideo, getVideoHistory } from '../controllers/videoController.js';
import { verifyToken } from '../middleware/authorization.js';

import { creditMiddleware } from '../middleware/creditSystem.js';
import multer from 'multer';

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

// Generate video from text prompt (and optional image)
router.post('/generate', verifyToken, upload.single('image'), creditMiddleware, generateVideo);

// Get video generation status
router.get('/status/:videoId', verifyToken, getVideoStatus);

// Download video
router.post('/download', verifyToken, downloadVideo);

// Get video history
router.get('/history', verifyToken, getVideoHistory);

export default router;
