import express from 'express';
import { verifyToken } from '../middleware/authorization.js';
// Assuming there is an isAdmin middleware or we check role
import { 
    getAdminStats, 
    searchUserByEmail, 
    adjustCredits, 
    manualPlanUpgrade 
} from '../controllers/adminController.js';

const router = express.Router();

// Middleware to check if user is admin (simplified for now)
const isAdmin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
};

router.get('/stats', verifyToken, isAdmin, getAdminStats);
router.get('/search-user', verifyToken, isAdmin, searchUserByEmail);
router.post('/adjust-credits', verifyToken, isAdmin, adjustCredits);
router.post('/manual-upgrade', verifyToken, isAdmin, manualPlanUpgrade);

export default router;
