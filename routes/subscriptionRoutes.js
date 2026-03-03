import express from 'express';
import { verifyToken } from '../middleware/authorization.js';
import { 
    getSubscriptionStatus, 
    getUserCredits, 
    getCreditUsageHistory, 
    purchasePlan, 
    useToolEndpoint,
    verifyPayment
} from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/status', verifyToken, getSubscriptionStatus);
router.get('/user-credits', verifyToken, getUserCredits);
router.get('/credit-usage-history', verifyToken, getCreditUsageHistory);
router.post('/purchase-plan', verifyToken, purchasePlan);
router.post('/verify-payment', verifyToken, verifyPayment);
router.post('/use-tool', verifyToken, useToolEndpoint);

export default router;
