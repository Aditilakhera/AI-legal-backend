import express from 'express';
import { getPaymentHistory, createOrder, verifyPayment } from '../controllers/paymentController.js';
import { verifyToken } from '../middleware/authorization.js';

const router = express.Router();

router.get('/history', verifyToken, getPaymentHistory);
router.post('/create-order', verifyToken, createOrder);
router.post('/verify-payment', verifyToken, verifyPayment);

export default router;
