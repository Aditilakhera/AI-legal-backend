import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import CreditLog from '../models/CreditLog.js';

const getToolCost = (toolName, body = {}) => {
    switch (toolName) {
        case 'chat': return 2;             // AISA 2.5 Flash ~2 cr/msg (50% margin)
        case 'agent_chat': return 10;      // Advanced agents
        case 'realtime_chat': return 15;   // High-speed low latency
        case 'knowledge_base': return 10;  // RAG Query
        case 'web_search': return 15;      // Web Search Tool
        case 'deep_search': return 30;     // Multi-step Search
        case 'generate_image_hd': return 60;   // AISA Image HD
        case 'generate_image_ultra': return 80; // AISA Image Ultra
        case 'generate_image': return 60;      // Default AISA Image
        case 'edit_image': return 60;          // AISA Edit Image
        case 'generate_video': {
            // Default: 5s, 1080p, Fast (300/s * 5 = 1500)
            const duration = body?.duration || 5;
            const modelId = body?.modelId || 'veo-3.1-fast-generate-001';
            const resolution = body?.resolution || '1080p';
            let multiplier = 800; // default for full
            if (modelId === 'veo-3.1-fast-generate-001') {
                multiplier = resolution === '4k' ? 700 : 300;
            } else if (modelId === 'veo-3.1-generate-001') {
                multiplier = resolution === '4k' ? 1200 : 800;
            }
            return multiplier * duration;
        }
        case 'video': return 1500; // Legacy mapping
        case 'code_writer': return 10;
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

    checkLimit: async () => ({ usage: 0, usageKey: 'mock' }),
    incrementUsage: () => { }
};
