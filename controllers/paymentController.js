import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Subscription from '../models/Subscription.js';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
export const createOrder = async (req, res) => {
    try {
        const { planName } = req.body;
        const plan = SUBSCRIPTION_PLANS[planName];

        if (!plan || planName === 'FREE') {
            return res.status(400).json({ success: false, message: 'Invalid plan selected.' });
        }

        const options = {
            amount: plan.price * 100, // paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({ success: true, order, plan });
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

        if (isAuthentic) {
            const plan = SUBSCRIPTION_PLANS[planName];
            
            // 1. Save Payment record
            await Payment.create({
                user_id: userId,
                plan_name: planName,
                amount: plan.price,
                razorpay_payment_id,
                razorpay_order_id,
                status: 'success'
            });

            // 2. Update Subscription
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + plan.validityDays);

            await Subscription.findOneAndUpdate(
                { user_id: userId },
                {
                    plan_name: planName,
                    total_credits: plan.credits,
                    remaining_credits: plan.credits,
                    start_date: new Date(),
                    expiry_date: expiryDate,
                    status: 'active'
                },
                { upsert: true }
            );

            res.status(200).json({
                success: true,
                message: "Payment verified and subscription activated."
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment verification failed."
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get payment history for logged-in user
export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await Payment.find({ user_id: userId }).sort({ createdAt: -1 }).limit(50);
        res.status(200).json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Debug: Get all transactions (admin/debug only)
export const getAllTransactionsDebug = async (req, res) => {
    try {
        const payments = await Payment.find({}).sort({ createdAt: -1 }).limit(100);
        res.status(200).json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Razorpay Webhook handler (optional but good for production)
export const razorpayWebhook = async (req, res) => {
    res.status(200).send("OK");
};
