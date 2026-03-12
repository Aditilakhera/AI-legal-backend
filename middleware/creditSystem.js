import User from '../models/User.js';
import { verifyToken } from './authorization.js';
import { checkPremiumAccess } from '../services/subscriptionService.js';
import Subscription from '../models/Subscription.js';
import CreditLog from '../models/CreditLog.js';

// Returns true if user has any paid/active subscription or founder status
const isFreeTierUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return true;
    if (user.founderStatus) return false;

    const sub = await Subscription.findOne({
        userId,
        subscriptionStatus: 'active'
    }).populate('planId');

    if (!sub || !sub.planId) return true;
    return sub.planId.priceMonthly === 0 && sub.planId.priceYearly === 0;
};

// Map URL → human-readable action label
const getActionLabel = (url, body) => {
    if (url.includes('/api/chat/realtime')) return { action: 'realtime_chat', description: 'AISA Realtime Chat' };
    if (url.includes('/api/aibase/knowledge')) return { action: 'knowledge_base', description: 'AISA Knowledge Base' };
    if (url.includes('/api/aibase/chat')) return { action: 'agent_chat', description: 'AISA Agent Chat' };
    if (url.includes('/api/edit-image')) return { action: 'edit_image', description: 'AISA Edit Image' };
    if (url.includes('/api/image')) {
        const model = body?.modelId || '';
        const label = model.includes('ultra') ? 'AISA Image Ultra' : 'AISA Image HD';
        return { action: 'image', description: label };
    }
    if (url.includes('/api/video')) {
        if (body?.isImageToVideo === 'true') {
            return { action: 'video', description: 'Image to Video Magic' };
        }
        const model = body?.modelId || '';
        const res = body?.resolution || '1080p';
        const label = model.includes('fast') ? `AISA Video Fast (${res})` : `AISA Video Pro (${res})`;
        return { action: 'video', description: label };
    }
    if (url.includes('/api/chat')) return { action: 'chat', description: 'AISA Chat (Text)' };
    return { action: 'other', description: 'AISA Feature' };
};

export const creditMiddleware = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    let cost = 0;
    const url = req.originalUrl || req.url;
    let isPremiumEndpoint = false;

    // ── FREE TIER GUARD ──────────────────────────────────────────────────────
    const isPaidOnlyRoute =
        url.includes('/api/video') ||
        url.includes('/api/image') ||
        url.includes('/api/edit-image') ||
        url.includes('/api/chat/realtime') ||
        url.includes('/api/aibase/chat') ||
        url.includes('/api/aibase/knowledge');

    if (isPaidOnlyRoute) {
        const freeTier = await isFreeTierUser(req.user.id || req.user._id);
        if (freeTier) {
            return res.status(403).json({
                success: false,
                code: 'PLAN_RESTRICTED',
                error: 'This feature is only available on paid plans. Please upgrade to access images, videos, and advanced chat.',
                message: 'This feature is only available on paid plans. Please upgrade to access images, videos, and advanced chat.'
            });
        }
    }
    // ── END FREE TIER GUARD ──────────────────────────────────────────────────

    if (url.includes('/api/chat/realtime')) {
        cost = 15;
        isPremiumEndpoint = true;
    }
    else if (url.includes('/api/aibase/chat') || url.includes('/api/aibase/knowledge')) {
        cost = 10;
        isPremiumEndpoint = true;
    }
    else if (url.includes('/api/video')) {
        if (req.body?.isImageToVideo === 'true') {
            cost = 50;
        } else {
            const duration = req.body?.duration || 5;
            const modelId = req.body?.modelId || 'veo-3.1-fast-generate-001';
            const resolution = req.body?.resolution || '1080p';
            let multiplier = 800;
            if (modelId === 'veo-3.1-fast-generate-001') {
                multiplier = resolution === '4k' ? 700 : 300;
            } else if (modelId === 'veo-3.1-generate-001') {
                multiplier = resolution === '4k' ? 1200 : 800;
            }
            cost = multiplier * duration;
        }
        isPremiumEndpoint = true;
    }
    else if (url.includes('/api/image') || url.includes('/api/edit-image')) {
        const modelId = req.body?.modelId || 'imagen-3.0-generate-001';
        // Imagen 3.0: 60 credits | Imagen 4.0 Ultra: 80 credits (50% margin)
        cost = modelId === 'imagen-4.0-ultra-generate-001' ? 80 : 60;
        isPremiumEndpoint = true;
    }
    else if (url.includes('/api/chat')) {
        // Standard Text Chat (Gemini 2.5 Flash)
        // Average charge to user (50% margin): ~2 credits per message
        cost = 2;
    }

    // Pass through if cost is still 0 (shouldn't happen for the above routes)
    if (cost === 0) return next();

    try {
        if (isPremiumEndpoint) {
            const hasAccess = await checkPremiumAccess(req.user.id || req.user._id);
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    code: "PREMIUM_ONLY",
                    error: "This feature is not available in the free plan. Please upgrade your plan to access premium magic tools.",
                    message: "This feature is not available in the free plan. Please upgrade your plan to access premium magic tools."
                });
            }
        }

        const user = await User.findById(req.user.id || req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.credits < cost) {
            return res.status(403).json({
                error: "Insufficient credits",
                code: "OUT_OF_CREDITS",
                required: cost,
                available: user.credits
            });
        }

        user.credits -= cost;
        await user.save();

        // 📝 Log credit deduction
        try {
            const { action, description } = getActionLabel(url, req.body);
            await CreditLog.create({
                userId: user._id,
                action,
                description,
                credits: -cost,
                balanceAfter: user.credits
            });
        } catch (logErr) {
            console.error('CreditLog write failed (non-fatal):', logErr.message);
        }

        req.user.credits = user.credits;
        next();
    } catch (error) {
        console.error("Credit deduction failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
