import Subscription from '../models/Subscription.js';
import User from '../models/User.js';
import CreditUsageLog from '../models/CreditUsageLog.js';
import Payment from '../models/Payment.js';
import { SUBSCRIPTION_PLANS, TOOL_COSTS } from '../config/subscriptionPlans.js';
import { checkCredits, deductCredits, createOrResetFreePlan } from '../utils/creditManager.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const getSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        let subscription = await Subscription.findOne({ user_id: userId });

        // Determine correct plan from User model
        const legacyPlan = user.plan?.toUpperCase() || 'FREE';
        const targetPlanName = legacyPlan === 'BASIC' ? 'FREE' : (legacyPlan === 'KING' ? 'ENTERPRISE' : legacyPlan);
        const planData = SUBSCRIPTION_PLANS[targetPlanName] || SUBSCRIPTION_PLANS.FREE;

        // SYNC LOGIC: If no sub, or plan mismatch, or credits are zero (invalid state)
        if (!subscription || subscription.plan_name !== targetPlanName || (subscription.total_credits === 0 && planData.credits > 0)) {
            console.log(`[SUBSCRIPTION SYNC] Syncing ${user.email} from ${subscription?.plan_name || 'NONE'} to ${targetPlanName}`);
            
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            subscription = await Subscription.findOneAndUpdate(
                { user_id: userId },
                {
                    plan_name: planData.name,
                    total_credits: planData.credits,
                    remaining_credits: planData.credits,
                    status: 'active',
                    expiry_date: expiryDate
                },
                { upsert: true, new: true }
            );
        }

        // Check for expiry
        if (subscription.status === 'active' && subscription.expiry_date < new Date()) {
            subscription.status = 'expired';
            await subscription.save();
        }

        res.status(200).json({
            success: true,
            subscription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserCredits = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscription = await Subscription.findOne({ user_id: userId });
        res.status(200).json({
            success: true,
            remainingCredits: subscription ? subscription.remaining_credits : 0,
            totalCredits: subscription ? subscription.total_credits : 0
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCreditUsageHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await CreditUsageLog.find({ user_id: userId }).sort({ created_at: -1 }).limit(50);
        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const purchasePlan = async (req, res) => {
    try {
        const { planName } = req.body;
        const plan = SUBSCRIPTION_PLANS[planName];

        if (!plan || planName === 'FREE') {
            return res.status(400).json({ success: false, message: 'Invalid plan selected.' });
        }

        const options = {
            amount: plan.price * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            plan
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const useToolEndpoint = async (req, res) => {
    try {
        const { tools } = req.body;
        const userId = req.user.id;

        const creditCheck = await checkCredits(userId, tools);
        if (!creditCheck.allowed) {
            return res.status(403).json({ success: false, message: creditCheck.message });
        }

        // Simulate tool execution
        // ...
        
        const result = await deductCredits(userId, tools);

        res.status(200).json({
            success: true,
            message: 'Tools executed successfully.',
            remainingCredits: result.remainingCredits
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName } = req.body;
        const userId = req.user.id;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature.' });
        }

        const plan = SUBSCRIPTION_PLANS[planName];
        if (!plan) throw new Error('Plan not found');

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + (plan.validityDays || 30));

        // 1. Update Subscription
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { user_id: userId },
            {
                plan_name: plan.name,
                total_credits: plan.credits,
                remaining_credits: plan.credits,
                status: 'active',
                start_date: new Date(),
                expiry_date: expiryDate
            },
            { upsert: true, new: true }
        );

        // 2. Sync legacy User plan
        await User.findByIdAndUpdate(userId, {
            plan: plan.name.toLowerCase(),
            planStartDate: new Date(),
            planEndDate: expiryDate
        });

        // 3. Record Payment
        await Payment.create({
            user_id: userId,
            razorpay_order_id,
            razorpay_payment_id,
            plan_name: plan.name,
            amount: plan.price,
            status: 'completed'
        });

        res.status(200).json({
            success: true,
            message: 'Payment verified and plan updated.',
            subscription: updatedSubscription
        });
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
