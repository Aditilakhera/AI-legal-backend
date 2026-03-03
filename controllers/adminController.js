import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import Payment from '../models/Payment.js';
import CreditUsageLog from '../models/CreditUsageLog.js';

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
        
        const payments = await Payment.find({ status: 'success' });
        const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

        const creditLogs = await CreditUsageLog.find();
        const totalCreditsUsed = creditLogs.reduce((acc, log) => acc + log.credits_used, 0);

        // Tool usage analytics
        const toolUsage = await CreditUsageLog.aggregate([
            { $group: { _id: "$tool_name", count: { $sum: 1 }, totalCredits: { $sum: "$credits_used" } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                activeSubscriptions,
                totalRevenue,
                totalCreditsUsed,
                toolUsage
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const searchUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email }).select('name email');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const subscription = await Subscription.findOne({ user_id: user._id });
        
        res.status(200).json({
            success: true,
            user,
            subscription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adjustCredits = async (req, res) => {
    try {
        const { userId, credits } = req.body;
        const subscription = await Subscription.findOneAndUpdate(
            { user_id: userId },
            { $set: { remaining_credits: credits } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Credits adjusted successfully.',
            subscription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const manualPlanUpgrade = async (req, res) => {
    try {
        const { userId, planName, expiryDate } = req.body;
        const subscription = await Subscription.findOneAndUpdate(
            { user_id: userId },
            { 
                plan_name: planName, 
                expiry_date: expiryDate ? new Date(expiryDate) : undefined,
                status: 'active'
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Plan updated successfully.',
            subscription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
