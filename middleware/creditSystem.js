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
    if (url.includes('/api/chat')) {
        const mode = body?.mode || '';
        if (mode === 'web_search') return { action: 'web_search', description: 'AISA Web Search' };
        if (mode === 'DEEP_SEARCH') return { action: 'deep_search', description: 'AISA Deep Search' };
        if (mode === 'CODING_HELP') return { action: 'code_writer', description: 'AISA Code Writer' };
        if (mode === 'DOCUMENT_CONVERT') return { action: 'document_convert', description: 'AISA Document Magic' };
        return { action: 'chat', description: 'AISA Chat (Text)' };
    }
    if (url.includes('/api/voice')) return { action: 'convert_audio', description: 'AISA Audio Magic' };
    if (url.includes('/api/knowledge/upload') || url.includes('/api/knowledge/upload-url')) return { action: 'knowledge_base', description: 'AISA Knowledge Base' };
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
        req.method !== 'GET' && (
            url.includes('/api/video') ||
            url.includes('/api/image') ||
            url.includes('/api/edit-image') ||
            url.includes('/api/chat/realtime') ||
            url.includes('/api/aibase/chat') ||
            url.includes('/api/aibase/knowledge') ||
            url.includes('/api/voice') ||
            req.body?.mode === 'web_search' ||
            req.body?.mode === 'DEEP_SEARCH'
        );

    // Admins bypass all credit/plan checks
    if (req.user && req.user.role === 'admin') return next();

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

    // ── STARTER & FOUNDER VIDEO GUARD ────────────────────────────────────────
    if (url.includes('/api/video')) {
        const userRec = await User.findById(req.user.id || req.user._id);
        if (userRec && userRec.role !== 'admin') {
            const sub = await Subscription.findOne({
                userId: req.user.id || req.user._id,
                subscriptionStatus: 'active'
            }).populate('planId');
            
            const planName = (sub && sub.planId && sub.planId.planName) ? sub.planId.planName.toLowerCase() : '';
            if (planName.includes('starter') || planName.includes('founder') || (!planName && userRec.founderStatus)) {
                return res.status(403).json({
                    success: false,
                    code: 'PLAN_RESTRICTED',
                    error: `Text to Video features are not available on your current plan. Please upgrade to Pro or Business.`,
                    message: `Text to Video features are not available on your current plan. Please upgrade to Pro or Business.`
                });
            }
        }
    }
    // ── END STARTER & FOUNDER VIDEO GUARD ────────────────────────────────────

    if (url.includes('/api/chat/realtime')) {
        cost = 60;
        isPremiumEndpoint = true;
    }
    else if (url.includes('/api/aibase/chat')) {
        cost = 60;
        isPremiumEndpoint = true;
    }
    else if (url.includes('/api/aibase/knowledge')) {
        cost = 3;
        isPremiumEndpoint = true;
    }
    else if (url.includes('/api/video')) {
        const duration = req.body?.duration || 5;
        const modelId = req.body?.modelId || 'veo-3.1-fast-generate-001';
        const resolution = req.body?.resolution || '1080p';
        let multiplier = 525;
        if (modelId === 'veo-3.1-fast-generate-001') {
            multiplier = resolution === '4k' ? 525 : 225;
        } else if (modelId === 'veo-3.1-generate-001') {
            multiplier = resolution === '4k' ? 900 : 600;
        }
        cost = multiplier * duration;
        isPremiumEndpoint = true;
    }
    else if (req.method !== 'GET' && (url.includes('/api/image') || url.includes('/api/edit-image'))) {
        const modelId = req.body?.modelId || 'imagen-3.0-generate-001';
        // Imagen 3.0: 45 credits | Imagen 4.0 Ultra: 90 credits (50% margin)
        cost = modelId === 'imagen-4.0-ultra-generate-001' ? 90 : 45;
        isPremiumEndpoint = true;
    }
    else if (url.includes('/api/voice')) {
        cost = 90;
        isPremiumEndpoint = true;
    }
    else if (req.method !== 'GET' && url.includes('/api/chat')) {
        // Standard Text Chat is FREE
        // Check for Magic Modes that use the chat endpoint
        const mode = req.body?.mode || '';
        if (mode === 'web_search') cost = 53;
        else if (mode === 'DEEP_SEARCH') cost = 158;
        else if (mode === 'CODING_HELP') cost = 3;
        else if (mode === 'DOCUMENT_CONVERT') cost = 3;
        else cost = 0; // Standard NORMAL_CHAT
        
        if (cost > 0) isPremiumEndpoint = true; // Magic chat modes are premium
    }

    // Pass through if cost is still 0 
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

        // 🚀 ATTACH BALANCE INFO TO REQ
        // Deduction now happens in controllers ONLY on successful output
        const actionLabel = getActionLabel(url, req.body);
        req.creditMeta = {
            userId: user._id,
            cost: cost,
            action: actionLabel.action,
            description: actionLabel.description
        };

        next();
    } catch (error) {
        console.error("Credit deduction failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
