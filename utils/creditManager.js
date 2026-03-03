import Subscription from '../models/Subscription.js';
import CreditUsageLog from '../models/CreditUsageLog.js';
import { TOOL_COSTS, SUBSCRIPTION_PLANS } from '../config/subscriptionPlans.js';
import { v4 as uuidv4 } from 'uuid';

export const calculateToolCost = (tools) => {
    let total = 0;
    tools.forEach(tool => {
        total += TOOL_COSTS[tool] || 0;
    });
    return total;
};

export const checkCredits = async (userId, tools) => {
    const cost = calculateToolCost(tools);
    const subscription = await Subscription.findOne({ user_id: userId, status: 'active' });

    if (!subscription) {
        // Fallback or create free plan if missing
        return { allowed: false, message: 'No active subscription found.' };
    }

    if (subscription.expiry_date < new Date()) {
        subscription.status = 'expired';
        await subscription.save();
        return { allowed: false, message: 'Subscription expired. Please renew.' };
    }

    if (subscription.remaining_credits < cost) {
        return { allowed: false, message: 'Insufficient Credits. Please Upgrade.' };
    }

    return { allowed: true, cost, subscription };
};

export const deductCredits = async (userId, tools, requestId = uuidv4()) => {
    const cost = calculateToolCost(tools);
    
    // Find and update atomically to prevent over-deduction
    const subscription = await Subscription.findOneAndUpdate(
        { 
            user_id: userId, 
            status: 'active',
            remaining_credits: { $gte: cost }
        },
        { 
            $inc: { remaining_credits: -cost } 
        },
        { new: true }
    );

    if (!subscription) {
        throw new Error('Insufficient credits or no active subscription.');
    }

    // Log individual tools
    const logs = tools.map(tool => ({
        user_id: userId,
        tool_name: tool,
        credits_used: TOOL_COSTS[tool] || 0,
        request_id: requestId
    }));

    await CreditUsageLog.insertMany(logs);

    return { remainingCredits: subscription.remaining_credits };
};

export const createOrResetFreePlan = async (userId) => {
    const freePlan = SUBSCRIPTION_PLANS.FREE;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + freePlan.validityDays);

    return await Subscription.findOneAndUpdate(
        { user_id: userId },
        {
            plan_name: 'FREE',
            total_credits: freePlan.credits,
            remaining_credits: freePlan.credits,
            start_date: new Date(),
            expiry_date: expiryDate,
            status: 'active'
        },
        { upsert: true, new: true }
    );
};
