import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import CreditPackage from '../models/CreditPackage.js';
import CreditLog from '../models/CreditLog.js';
import SupportTicket from '../models/SupportTicket.js';

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const pendingTickets = await SupportTicket.countDocuments({ status: { $in: ['pending', 'open', 'in_progress'] } });
        const activeSubscriptionsCount = await Subscription.countDocuments({ 
          subscriptionStatus: 'active' 
        });

        // Revenue calculation: Sum of plan prices for all successful/active paid subscriptions
        // Note: Joining with Plan model to get the current price at the time of calculation
        const revenueAggregation = await Subscription.aggregate([
          { $match: { subscriptionStatus: 'active', paymentId: { $exists: true, $ne: "" } } },
          {
            $lookup: {
              from: 'plans',
              localField: 'planId',
              foreignField: '_id',
              as: 'planDetails'
            }
          },
          { $unwind: '$planDetails' },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $cond: [
                    { $eq: ['$billingCycle', 'yearly'] },
                    '$planDetails.priceYearly',
                    '$planDetails.priceMonthly'
                  ]
                }
              }
            }
          }
        ]);
        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

        // Credit usage from real logs
        const creditUsageData = await CreditLog.aggregate([
            { $match: { credits: { $lt: 0 } } },
            { $group: { 
                _id: null, 
                totalUsed: { $sum: { $abs: "$credits" } } 
            } }
        ]);
        const totalCreditsUsed = creditUsageData.length > 0 ? creditUsageData[0].totalUsed : 0;

        // Tool usage analytics grouped by action
        const toolUsage = await CreditLog.aggregate([
            { $match: { credits: { $lt: 0 } } },
            { $group: { 
                _id: "$action", 
                count: { $sum: 1 }, 
                totalCredits: { $sum: { $abs: "$credits" } } 
            } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                activeSubscriptions: activeSubscriptionsCount,
                totalRevenue,
                totalCreditsUsed,
                toolUsage,
                pendingTickets
            }
        });
    } catch (error) {
        console.error("[getAdminStats Error]", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const searchUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email }).select('name email credits role isBlocked');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const subscription = await Subscription.findOne({ userId: user._id }).populate('planId');
        
        res.status(200).json({
            success: true,
            user,
            subscription
        });
    } catch (error) {
        console.error("[searchUserByEmail Error]", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const adjustCredits = async (req, res) => {
    try {
        const { userId, credits } = req.body;
        const adminId = req.user.id;
        
        // Find the target user and admin
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });
        
        const adminUser = await User.findById(adminId);
        if (!adminUser) return res.status(404).json({ success: false, message: 'Admin not found' });
        
        const oldCredits = targetUser.credits || 0;
        const creditsToTransfer = credits - oldCredits;
        
        if (creditsToTransfer > 0) {
            if ((adminUser.credits || 0) < creditsToTransfer) {
                return res.status(400).json({ success: false, message: 'Admin does not have enough credits to transfer.' });
            }
        }
        
        if (creditsToTransfer !== 0) {
            // Deduct/Add from admin
            await User.findByIdAndUpdate(adminId, { $inc: { credits: -creditsToTransfer } });
            await Subscription.findOneAndUpdate(
                { userId: adminId },
                { $inc: { creditsRemaining: -creditsToTransfer } }
            );
            
            // Create CreditLog for admin
            await CreditLog.create({
                userId: adminId,
                action: creditsToTransfer > 0 ? 'Admin Credit Transfer to User' : 'Admin Credit Recovery from User',
                credits: -creditsToTransfer,
                details: `Transferred to/from user ${targetUser.email}`
            });
            
            // Create CreditLog for target user
            await CreditLog.create({
                userId: targetUser._id,
                action: creditsToTransfer > 0 ? 'Credit Received from Admin' : 'Credit Deducted by Admin',
                credits: creditsToTransfer,
                details: `Processed by admin ${adminUser.email}`
            });
        }

        // Update both the user model and the subscription model for consistency
        await User.findByIdAndUpdate(userId, { $set: { credits: credits } });
        
        const subscription = await Subscription.findOneAndUpdate(
            { userId: userId },
            { $set: { creditsRemaining: credits } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Credits adjusted successfully.',
            subscription
        });
    } catch (error) {
        console.error("[adjustCredits Error]", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const manualPlanUpgrade = async (req, res) => {
    try {
        const { userId, planName, expiryDate } = req.body;
        
        // Find the actual plan ID first
        const plan = await Plan.findOne({ planName: new RegExp(`^${planName}$`, 'i') });
        if (!plan) return res.status(404).json({ success: false, message: `Plan '${planName}' not found.` });

        const subscription = await Subscription.findOneAndUpdate(
            { userId: userId },
            { 
                planId: plan._id, 
                renewalDate: expiryDate ? new Date(expiryDate) : undefined,
                subscriptionStatus: 'active',
                creditsRemaining: plan.credits // Reset credits to plan default on manual upgrade
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: `Plan upgraded to ${plan.planName} successfully.`,
            subscription
        });
    } catch (error) {
        console.error("[manualPlanUpgrade Error]", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createPlan = async (req, res) => {
    try {
        const plan = await Plan.create(req.body);
        res.status(201).json({ success: true, plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const plan = await Plan.findByIdAndUpdate(planId, req.body, { new: true });
        if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
        res.status(200).json({ success: true, plan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        await Plan.findByIdAndDelete(planId);
        res.status(200).json({ success: true, message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCreditPackage = async (req, res) => {
    try {
        const packageData = await CreditPackage.create(req.body);
        res.status(201).json({ success: true, packageData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCreditPackage = async (req, res) => {
    try {
        const { packageId } = req.params;
        const packageData = await CreditPackage.findByIdAndUpdate(packageId, req.body, { new: true });
        if (!packageData) return res.status(404).json({ success: false, message: "Package not found" });
        res.status(200).json({ success: true, packageData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCreditPackage = async (req, res) => {
    try {
        const { packageId } = req.params;
        await CreditPackage.findByIdAndDelete(packageId);
        res.status(200).json({ success: true, message: "Package deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
