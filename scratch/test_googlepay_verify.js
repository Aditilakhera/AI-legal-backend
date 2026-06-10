import dotenv from 'dotenv';
dotenv.config();

const { verifyGooglePayment } = await import('../controllers/googlePayController.js');
const { verifyApplePayment } = await import('../controllers/applePayController.js');

async function runTests() {
    console.log("=== RUNNING GOOGLE PAY & APPLE PAY VERIFICATION ENDPOINT TESTS ===");

    // Mock request and response helpers
    const createMockReq = (envVars = {}, hostname = 'localhost', body = {}) => {
        // Set environment variables for the test duration
        Object.assign(process.env, envVars);
        return {
            hostname,
            body,
            user: { id: 'test_user_123' }
        };
    };

    const createMockRes = () => {
        const res = {
            statusCode: 200,
            jsonPayload: null,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(payload) {
                this.jsonPayload = payload;
                return this;
            }
        };
        return res;
    };

    // --- GOOGLE PAY TESTS ---
    console.log("\n--- GOOGLE PAY TESTS ---");

    // Test Case 1: Localhost request
    {
        console.log("[Google Pay - Test Case 1] Localhost Request");
        const req = createMockReq({ NODE_ENV: 'development' }, 'localhost', { planId: 'plan_123' });
        const res = createMockRes();
        await verifyGooglePayment(req, res);

        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response:", JSON.stringify(res.jsonPayload, null, 2));
        if (res.statusCode === 200 && res.jsonPayload.success && res.jsonPayload.isTest) {
            console.log("✅ SUCCESS: Google Pay correctly bypassed DB and returned test success message.");
        } else {
            console.error("❌ FAILURE: Google Pay test mode bypass failed.");
        }
    }

    // Test Case 2: Sandbox / Dev NODE_ENV request
    {
        console.log("[Google Pay - Test Case 2] Sandbox environment request");
        const req = createMockReq({ NODE_ENV: 'sandbox', GOOGLE_PAY_ENV: 'TEST' }, 'aisa-sandbox.com', { planId: 'plan_123' });
        const res = createMockRes();
        await verifyGooglePayment(req, res);

        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response:", JSON.stringify(res.jsonPayload, null, 2));
        if (res.statusCode === 200 && res.jsonPayload.success && res.jsonPayload.isTest) {
            console.log("✅ SUCCESS: Google Pay correctly bypassed DB for sandbox domain.");
        } else {
            console.error("❌ FAILURE: Google Pay sandbox bypass failed.");
        }
    }

    // Test Case 3: Production request with missing signature
    {
        console.log("[Google Pay - Test Case 3] Production environment with missing signature params");
        const req = createMockReq({
            NODE_ENV: 'production',
            GOOGLE_PAY_ENV: 'PRODUCTION',
            RAZORPAY_KEY_ID: 'rzp_live_abc123'
        }, 'aisa24.com', { planId: 'plan_123' });
        const res = createMockRes();
        await verifyGooglePayment(req, res);

        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response:", JSON.stringify(res.jsonPayload, null, 2));
        if (res.statusCode === 400 && !res.jsonPayload.success && res.jsonPayload.message.includes("missing signature")) {
            console.log("✅ SUCCESS: Google Pay correctly rejected missing parameters in production.");
        } else {
            console.error("❌ FAILURE: Google Pay production guard failed.");
        }
    }

    // --- APPLE PAY TESTS ---
    console.log("\n--- APPLE PAY TESTS ---");

    // Test Case 4: Localhost request
    {
        console.log("[Apple Pay - Test Case 4] Localhost Request");
        const req = createMockReq({ NODE_ENV: 'development' }, 'localhost', { planId: 'plan_123' });
        const res = createMockRes();
        await verifyApplePayment(req, res);

        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response:", JSON.stringify(res.jsonPayload, null, 2));
        if (res.statusCode === 200 && res.jsonPayload.success && res.jsonPayload.isTest) {
            console.log("✅ SUCCESS: Apple Pay correctly bypassed DB and returned test success message.");
        } else {
            console.error("❌ FAILURE: Apple Pay test mode bypass failed.");
        }
    }

    // Test Case 5: Sandbox / Dev NODE_ENV request
    {
        console.log("[Apple Pay - Test Case 5] Sandbox environment request");
        const req = createMockReq({ NODE_ENV: 'sandbox', APPLE_PAY_ENV: 'TEST' }, 'aisa-sandbox.com', { planId: 'plan_123' });
        const res = createMockRes();
        await verifyApplePayment(req, res);

        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response:", JSON.stringify(res.jsonPayload, null, 2));
        if (res.statusCode === 200 && res.jsonPayload.success && res.jsonPayload.isTest) {
            console.log("✅ SUCCESS: Apple Pay correctly bypassed DB for sandbox domain.");
        } else {
            console.error("❌ FAILURE: Apple Pay sandbox bypass failed.");
        }
    }

    // Test Case 6: Production request with missing signature
    {
        console.log("[Apple Pay - Test Case 6] Production environment with missing signature params");
        const req = createMockReq({
            NODE_ENV: 'production',
            APPLE_PAY_ENV: 'PRODUCTION',
            RAZORPAY_KEY_ID: 'rzp_live_abc123'
        }, 'aisa24.com', { planId: 'plan_123' });
        const res = createMockRes();
        await verifyApplePayment(req, res);

        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response:", JSON.stringify(res.jsonPayload, null, 2));
        if (res.statusCode === 400 && !res.jsonPayload.success && res.jsonPayload.message.includes("missing signature")) {
            console.log("✅ SUCCESS: Apple Pay correctly rejected missing parameters in production.");
        } else {
            console.error("❌ FAILURE: Apple Pay production guard failed.");
        }
    }

    console.log("\n=== TESTS COMPLETE ===");
    process.exit(0);
}

runTests().catch(err => {
    console.error("Test execution error:", err);
    process.exit(1);
});
