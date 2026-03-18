import express from 'express';
import { synthesizeSpeech, synthesizeFile } from '../controllers/voiceController.js';
import { verifyToken } from '../middleware/authorization.js';
import { creditMiddleware } from '../middleware/creditSystem.js';

const router = express.Router();

router.post('/synthesize', verifyToken, creditMiddleware, synthesizeSpeech);
router.post('/synthesize-file', verifyToken, creditMiddleware, synthesizeFile);

export default router;
