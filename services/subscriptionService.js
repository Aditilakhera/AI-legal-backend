import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import CreditLog from '../models/CreditLog.js';

const getToolCost = (toolName, body = {}) => {
    switch (toolName) {
        case 'chat': {
            // Normal Chat is now FREE as per requirements
            // Only Magic modes (Deep Search, Web Search, etc) will deduct if they use the chat endpoint
            const mode = body?.mode || '';
            if (mode === 'web_search') return 53;
            if (mode === 'DEEP_SEARCH') return 158;
            if (mode === 'CODING_HELP') return 3;
            if (mode === 'DOCUMENT_CONVERT') return 3;
            return 0; // Standard NORMAL_CHAT
        }
        case 'agent_chat': return 60;      // Advanced agents
        case 'realtime_chat': return 60;   // High-speed low latency
        case 'knowledge_base': return 3;   // RAG Query
        case 'web_search': return 53;      // Web Search Tool
        case 'deep_search': return 158;     // Multi-step Search
        case 'generate_image_hd': return 90;   // AISA Image HD
        case 'generate_image_ultra': return 90; // AISA Image Ultra
        case 'generate_image': return 45;      // Default AISA Image
        case 'edit_image': return 45;          // AISA Edit Image
        case 'generate_video': {
            const duration = body?.duration || 5;
            const modelId = body?.modelId || 'veo-3.1-fast-generate-001';
            const resolution = body?.resolution || '1080p';
            let multiplier = 525;
            if (modelId === 'veo-3.1-fast-generate-001') {
                multiplier = resolution === '4k' ? 525 : 225;
            } else if (modelId === 'veo-3.1-generate-001') {
                multiplier = resolution === '4k' ? 900 : 600;
            }
            return multiplier * duration;
        }
        case 'video': return 1125;
        case 'code_writer': return 3;
        case 'convert_audio': return 90; // New: Convert to Audio
        default: return 0;
    }
};

const getToolLabel = (toolName) => {
    switch (toolName) {
        case 'chat': return 'AISA Chat (Text)';
        case 'agent_chat': return 'AISA Agent Chat';
        case 'realtime_chat': return 'AISA Realtime Chat';
        case 'knowledge_base': return 'AISA Knowledge Base';
        case 'web_search': return 'AISA Web Search';
        case 'deep_search': return 'AISA Deep Search';
        case 'generate_image_hd': return 'AISA Image HD';
        case 'generate_image_ultra': return 'AISA Image Ultra';
        case 'generate_image': return 'AISA Image';
        case 'edit_image': return 'AISA Edit Image';
        case 'generate_video': return 'AISA Video Generation';
        case 'code_writer': return 'AISA Code Writer';
        default: return 'AISA Service';
    }
};

const premiumTools = [
    'generate_video',
    'generate_image',
    'generate_image_hd',
    'generate_image_ultra',
    'edit_image',
    'web_search',
    'deep_search',
    'realtime_chat',
    'agent_chat'
];

export const checkPremiumAccess = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return false;
    if (user.founderStatus) return true;

    const sub = await Subscription.findOne({
        userId,
        subscriptionStatus: 'active'
    }).populate('planId');

    if (sub && sub.planId && (sub.planId.priceMonthly > 0 || sub.planId.priceYearly > 0)) {
        return true;
    }
    return false;
};

export const subscriptionService = {
    checkCredits: async (userId, toolsRequested = [], metadata = {}) => {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const hasPremiumTool = toolsRequested.some(tool => premiumTools.includes(tool));
        if (hasPremiumTool) {
            const hasAccess = await checkPremiumAccess(userId);
            if (!hasAccess) {
                throw new Error("PREMIUM_RESTRICTED");
            }
        }

        const totalCost = toolsRequested.reduce((acc, tool) => acc + getToolCost(tool, metadata), 0);
        if ((user.credits || 0) < totalCost) {
            throw new Error("Insufficient credits");
        }
        return true;
    },

    deductCredits: async (userId, toolsUsed = [], sessionId, metadata = {}) => {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const totalCost = toolsUsed.reduce((acc, tool) => acc + getToolCost(tool, metadata), 0);
        if (totalCost === 0) return true;

        if ((user.credits || 0) < totalCost) {
            throw new Error("Insufficient credits");
        }

        user.credits -= totalCost;
        await user.save();

        // 📝 Log to Database - Use the first primary tool as action label
        try {
            const primaryTool = toolsUsed[0];
            await CreditLog.create({
                userId: user._id,
                action: primaryTool,
                description: getToolLabel(primaryTool) + (toolsUsed.length > 1 ? ` (+${toolsUsed.length-1} more)` : ''),
                credits: -totalCost,
                balanceAfter: user.credits
            });
        } catch (logErr) {
            console.error('CreditLog save failed in subscriptionService:', logErr.message);
        }

        return true;
    },

    deductCreditsFromMeta: async (creditMeta) => {
        if (!creditMeta || !creditMeta.userId || !creditMeta.cost || creditMeta.cost <= 0) {
            return true;
        }

        const user = await User.findById(creditMeta.userId);
        if (!user) throw new Error("User not found during credit deduction");

        user.credits -= creditMeta.cost;
        await user.save();

        // 📝 Log to Database
        try {
            await CreditLog.create({
                userId: user._id,
                action: creditMeta.action || 'feature_usage',
                description: creditMeta.description || 'AISA Magic Feature',
                credits: -creditMeta.cost,
                balanceAfter: user.credits
            });
        } catch (logErr) {
            console.error('CreditLog save failed in deductCreditsFromMeta:', logErr.message);
        }

        return true;
    },

    checkLimit: async () => ({ usage: 0, usageKey: 'mock' }),
    incrementUsage: () => { }
};
