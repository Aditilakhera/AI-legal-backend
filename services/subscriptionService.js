import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import * as creditManager from '../utils/creditManager.js';

class SubscriptionService {
    /**
     * Check if a user can use tools based on their credits
     */
    async checkCredits(userId, tools) {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const result = await creditManager.checkCredits(userId, tools);
        if (!result.allowed) {
            const error = new Error(result.message || "Insufficient credits");
            error.code = "PLAN_LIMIT_REACHED";
            error.status = 403;
            throw error;
        }

        return { cost: result.cost };
    }

    /**
     * Deduct credits after successful execution
     */
    async deductCredits(userId, tools, requestId) {
        return await creditManager.deductCredits(userId, tools, requestId);
    }

    /**
     * Get user usage and plan info for dashboard
     */
    async getUsageStatus(userId) {
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            subscription = await creditManager.createOrResetFreePlan(userId);
        }

        return {
            plan_name: subscription.plan_name,
            remaining_credits: subscription.remaining_credits,
            total_credits: subscription.total_credits,
            expiry_date: subscription.expiry_date,
            status: subscription.status
        };
    }
}

export default new SubscriptionService();
