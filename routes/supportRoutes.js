import express from 'express';
import SupportTicket from '../models/SupportTicket.js';
import { verifyAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        let { name, email, issueType, message, userId } = req.body;
        
        // Provide default name if missing to prevent validation failure
        if (!name) name = "AISA User";

        if (!email || !issueType || !message) {
            return res.status(400).json({ error: 'Missing required fields (email, issueType, or message)' });
        }

        const newTicket = new SupportTicket({
            name,
            email,
            issueType,
            message,
            userId: userId || null
        });

        await newTicket.save();

        res.status(201).json({ message: 'Support ticket created successfully', ticket: newTicket });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Admin Route: Get all support tickets
router.get('/tickets', verifyAdmin, async (req, res) => {
    try {
        const tickets = await SupportTicket.find().sort({ createdAt: -1 });
        console.log(`[SUPPORT API] Fetched ${tickets.length} tickets for admin.`);
        res.status(200).json({ tickets });
    } catch (error) {
        console.error('[SUPPORT API ERROR] Error fetching support tickets:', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

export default router;
