/**
 * applePayController.js
 * ─────────────────────
 * Handles Apple Pay for Web (ApplePaySession API).
 *
 * HOW APPLE PAY WEB WORKS:
 * 1. Frontend checks if ApplePaySession is available (Safari only)
 * 2. Frontend starts an ApplePaySession
 * 3. Apple calls your backend to VALIDATE the merchant (onvalidatemerchant)
 * 4. Backend calls Apple's servers with your merchant certificate → gets session
 * 5. Frontend sends session back to Apple → payment sheet opens
 * 6. User approves → Apple sends encrypted payment token to frontend
 * 7. Frontend sends token to your backend → backend charges via Razorpay → activates plan
 *
 * REQUIREMENTS (before this works in production):
 * - Apple Pay Merchant ID: merchant.com.aisa24.pay ✅ (created)
 * - Payment Processing Certificate (.cer file from Apple Developer)
 * - Merchant Identity Certificate (.p12 file - for server validation)
 * - Domain verification file at /.well-known/apple-developer-merchantid-domain-association
 * - HTTPS domain (won't work on localhost)
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Subscription from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import CreditPackage from '../models/CreditPackage.js';
import User from '../models/User.js';
import CreditLog from '../models/CreditLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ─── STEP 1: Create Razorpay Order for Apple Pay ────────────────────────────

export const createApplePayOrder = async (req, res) => {
    try {
        const { planId, packageId, billingCycle, currency = 'INR' } = req.body;

        let amount = 0;
        let itemName = '';

        if (planId) {
            const plan = await Plan.findById(planId);
            if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
            // ✅ Always convert to Number to avoid NaN.toFixed() → "The string did not match the expected pattern."
            amount = Number(billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly) || 0;
            itemName = plan.planName || 'Plan';
        } else if (packageId) {
            const creditPackage = await CreditPackage.findById(packageId);
            if (!creditPackage) return res.status(404).json({ success: false, message: "Package not found" });
            amount = Number(creditPackage.price) || 0;
            itemName = creditPackage.packageName || 'Credit Pack';
        } else {
            return res.status(400).json({ success: false, message: "planId or packageId is required" });
        }

        if (amount === 0) {
            return res.status(200).json({ success: true, isFree: true });
        }

        // ✅ Guard: if amount is still not a valid positive number, reject
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: `Invalid plan price: ${amount}` });
        }

        let finalAmount = amount;
        let finalCurrency = currency.toUpperCase();

        if (finalCurrency === 'USD') {
            finalAmount = Math.round((amount / 83.5) * 100) / 100;
        }

        // ✅ Ensure finalAmount is a clean number (no floating point artifacts)
        finalAmount = Math.round(finalAmount * 100) / 100;

        const amountInSmallestUnit = Math.round(finalAmount * 100);

        const order = await razorpay.orders.create({
            amount: amountInSmallestUnit,
            currency: finalCurrency === 'USD' ? 'USD' : 'INR',
            receipt: `apay_${Date.now()}`,
            notes: {
                gateway: 'apple_pay',
                itemName,
                planId: planId || '',
                packageId: packageId || ''
            }
        });

        console.log(`[ApplePay] Order created: ${order.id} for ${finalCurrency} ${finalAmount}`);

        // ✅ amount string: Apple Pay requires format "^[0-9]+(\\.[0-9][0-9])?$"
        //    toFixed(2) guarantees e.g. "499.00" — NEVER "NaN", never scientific notation
        const amountString = finalAmount.toFixed(2);

        // ✅ Sanitize label: only ASCII printable chars. Em dash (—) can cause pattern errors on some iOS versions.
        const safeLabel = `AISA - ${itemName.replace(/[^\x20-\x7E]/g, '')}`;

        return res.status(200).json({
            success: true,
            orderId: order.id,
            amount: finalAmount,
            currency: finalCurrency,
            amountDisplay: finalCurrency === 'INR' ? `\u20B9${amount}` : `$${finalAmount}`,
            itemName,
            // Apple Pay payment request config (used by ApplePaySession on frontend)
            applePayRequest: {
                countryCode: finalCurrency === 'USD' ? 'US' : 'IN',
                currencyCode: finalCurrency === 'USD' ? 'USD' : 'INR',
                // ✅ Only visa & masterCard for India (discover not widely supported in IN)
                supportedNetworks: ['visa', 'masterCard'],
                merchantCapabilities: ['supports3DS'],
                total: {
                    label: safeLabel,
                    amount: amountString,  // e.g. "499.00"
                    type: 'final'
                }
            }
        });
    } catch (error) {
        console.error('[ApplePay] createApplePayOrder error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── STEP 2: Validate Apple Merchant (called by Apple's servers) ─────────────
/**
 * Apple Pay requires a "merchant validation" step.
 * When the user clicks Apple Pay, Apple calls YOUR backend to verify you're a real merchant.
 * Your backend must call Apple's validation URL with your Merchant Identity Certificate.
 *
 * This endpoint is called by your FRONTEND (not Apple directly),
 * which then passes the session to Apple.
 */
export const validateAppleMerchant = async (req, res) => {
    try {
        const { validationURL } = req.body;

        if (!validationURL) {
            return res.status(400).json({ success: false, message: "validationURL is required" });
        }

        // Verify the URL is an Apple URL (security check)
        if (!validationURL.includes('apple.com')) {
            return res.status(400).json({ success: false, message: "Invalid validation URL" });
        }

        const merchantId = process.env.APPLE_PAY_MERCHANT_ID;
        const domain = process.env.APPLE_PAY_DOMAIN;
        const displayName = process.env.APPLE_PAY_DISPLAY_NAME || 'AISA';

        // ── Load certificates (3 methods, in priority order) ─────────────────
        // Method 1: Environment variables (base64 encoded) — best for Cloud Run
        // Method 2: Mounted volume paths (GCP Secret Manager volume mounts)
        // Method 3: Local certs/ folder (development)
        let certContent = null;
        let keyContent  = null;

        if (process.env.APPLE_PAY_CERT_B64 && process.env.APPLE_PAY_KEY_B64) {
            // Method 1: Decode from environment variables
            certContent = Buffer.from(process.env.APPLE_PAY_CERT_B64, 'base64').toString('utf8');
            keyContent  = Buffer.from(process.env.APPLE_PAY_KEY_B64,  'base64').toString('utf8');
            console.log('[ApplePay] Using certificates from environment variables.');
        } else {
            // Method 2 & 3: Read from file paths
            let certPath = path.join(__dirname, '../certs/apple-pay-merchant.pem');
            let keyPath  = path.join(__dirname, '../certs/apple-pay-merchant.key');

            const prodCertPath = '/app/certs-pem/apple-pay-merchant.pem';
            const prodKeyPath  = '/app/certs-key/apple-pay-merchant.key';
            if (fs.existsSync(prodCertPath)) certPath = prodCertPath;
            if (fs.existsSync(prodKeyPath))  keyPath  = prodKeyPath;

            if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
                console.warn('[ApplePay] Merchant Identity Certificate not found at:', certPath);
                return res.status(503).json({
                    success: false,
                    message: "Apple Pay merchant certificate not configured. Please add your Merchant Identity Certificate.",
                    setupRequired: true
                });
            }
            certContent = fs.readFileSync(certPath);
            keyContent  = fs.readFileSync(keyPath);
        }

        // Call Apple's merchant validation endpoint
        const merchantSession = await callAppleValidationEndpoint({
            validationURL,
            certContent,
            keyContent,
            merchantId,
            domain,
            displayName
        });

        return res.status(200).json({ success: true, merchantSession });
    } catch (error) {
        console.error('[ApplePay] validateAppleMerchant error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── STEP 3: Verify Apple Pay Payment & Activate Plan ───────────────────────

export const verifyApplePayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            applePayToken,  // The encrypted payment token from Apple Pay
            planId,
            packageId,
            billingCycle
        } = req.body;

        const userId = req.user.id || req.user._id;

        // Verify Razorpay signature if present
        if (razorpay_payment_id && razorpay_signature) {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                console.warn('[ApplePay] Signature mismatch!');
                return res.status(400).json({ success: false, message: "Payment verification failed — invalid signature." });
            }
        }

        console.log(`[ApplePay] Payment verified: ${razorpay_payment_id} for user ${userId}`);

        if (planId) {
            return await _activatePlan({ userId, planId, billingCycle, paymentId: razorpay_payment_id, res });
        } else if (packageId) {
            return await _addCredits({ userId, packageId, paymentId: razorpay_payment_id, res });
        } else {
            return res.status(400).json({ success: false, message: "planId or packageId is required" });
        }
    } catch (error) {
        console.error('[ApplePay] verifyApplePayment error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Internal: Call Apple's Validation Endpoint ──────────────────────────────

function callAppleValidationEndpoint({ validationURL, certContent, keyContent, merchantId, domain, displayName }) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            merchantIdentifier: merchantId,
            domainName: domain,
            displayName: displayName
        });

        const cert = certContent;
        const key  = keyContent;

        const urlObj = new URL(validationURL);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            cert,
            key,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const appleReq = https.request(options, (appleRes) => {
            let data = '';
            appleRes.on('data', chunk => data += chunk);
            appleRes.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Invalid response from Apple: ' + data));
                }
            });
        });

        appleReq.on('error', reject);
        appleReq.write(payload);
        appleReq.end();
    });
}

// ─── Internal: Activate Plan ─────────────────────────────────────────────────

async function _activatePlan({ userId, planId, billingCycle, paymentId, res }) {
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    const user = await User.findById(userId);

    if (plan.planName === 'Founder Plan') {
        const founderCount = await User.countDocuments({ founderStatus: true });
        if (founderCount >= 500 && !user.founderStatus) {
            return res.status(400).json({ success: false, message: "Founder plan limit reached." });
        }
        user.founderStatus = true;
    }

    await Subscription.updateMany({ userId, subscriptionStatus: 'active' }, { subscriptionStatus: 'cancelled' });

    let finalCredits = billingCycle === 'yearly'
        ? (plan.creditsYearly || plan.credits * 12)
        : plan.credits;

    const isFirstPurchase = await Subscription.countDocuments({ userId }) === 0;
    if (isFirstPurchase && !plan.planName.toLowerCase().includes('founder')) {
        finalCredits += finalCredits * 0.5;
    }

    user.credits = Math.floor(finalCredits);

    let renewalDate = new Date();
    if (plan.planName.toLowerCase().includes('founder')) {
        renewalDate.setFullYear(renewalDate.getFullYear() + 100);
    } else if (billingCycle === 'yearly') {
        renewalDate.setMonth(renewalDate.getMonth() + (plan.validityYearly || 12));
    } else {
        renewalDate.setMonth(renewalDate.getMonth() + (plan.validityMonthly || 1));
    }

    const newSubscription = await Subscription.create({
        userId,
        planId: plan._id,
        creditsRemaining: user.credits,
        billingCycle,
        subscriptionStart: new Date(),
        renewalDate,
        subscriptionStatus: 'active',
        paymentId: paymentId || 'apay_payment',
        paymentMethod: 'apple_pay'
    });

    await user.save();

    await CreditLog.create({
        userId,
        action: 'plan_credit',
        description: `Apple Pay — ${plan.planName}`,
        credits: finalCredits,
        balanceAfter: user.credits
    });

    return res.status(200).json({
        success: true,
        subscription: newSubscription,
        credits: user.credits,
        message: `✅ Payment successful via Apple Pay! ${plan.planName} activated.`
    });
}

async function _addCredits({ userId, packageId, paymentId, res }) {
    const creditPackage = await CreditPackage.findById(packageId);
    if (!creditPackage) return res.status(404).json({ success: false, message: "Package not found" });

    const user = await User.findById(userId);
    user.credits += creditPackage.credits;
    await user.save();

    await CreditLog.create({
        userId,
        action: 'purchase',
        description: `Apple Pay — ${creditPackage.packageName}`,
        credits: creditPackage.credits,
        balanceAfter: user.credits
    });

    return res.status(200).json({
        success: true,
        credits: user.credits,
        message: `✅ ${creditPackage.credits} credits added via Apple Pay!`
    });
}
