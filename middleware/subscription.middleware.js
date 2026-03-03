import User from '../models/User.js';
import * as creditManager from '../utils/creditManager.js';
import Subscription from '../models/Subscription.js';

/**
 * NEW CREDIT-BASED SUBSCRIPTION MIDDLEWARE
 */
export const checkSubscriptionLimit = (feature) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id || req.user?._id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Authentication required' });
            }

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            if (user.isBlocked) return res.status(403).json({ success: false, message: 'Account blocked' });

            // Map frontend features to tool costs
            const keyMap = {
                'image': 'generate_image',
                'video': 'generate_video',
                'deepSearch': 'deep_search',
                'audio': 'convert_audio',
                'document': 'convert_document',
                'codeWriter': 'code_writer',
                'chat': 'chat'
            };
            const tool = keyMap[feature] || feature;

            const hasCredits = await creditManager.checkCredits(userId, [tool]);
            if (!hasCredits) {
                return res.status(403).json({
                    success: false,
                    code: 'PLAN_LIMIT_REACHED',
                    message: `Insufficient credits for ${feature}. Please upgrade.`,
                    upgradeRequired: true
                });
            }

            // Attach for incrementUsage
            req.subscriptionMeta = { userId, tool };
            next();

        } catch (error) {
            console.error(`[SUBSCRIPTION] Middleware error:`, error.message);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };
};

/**
 * Deduct credits after successful execution
 */
export const incrementUsage = async (req) => {
    try {
        const meta = req.subscriptionMeta;
        if (!meta) return;

        const { userId, tool } = meta;
        await creditManager.deductCredits(userId, [tool], 'req-' + Date.now());

    } catch (error) {
        console.error('[SUBSCRIPTION] incrementUsage error:', error.message);
    }
};

export const requireActivePlan = async (req, res, next) => {
    const userId = req.user?.id;
    const sub = await Subscription.findOne({ userId });
    if (!sub || sub.status !== 'active' || (sub.expiry_date && new Date() > sub.expiry_date)) {
        // If expired, reset to free
        await creditManager.createOrResetFreePlan(userId);
    }
    next();
};
