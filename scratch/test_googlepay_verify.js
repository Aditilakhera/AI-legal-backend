import dotenv from 'dotenv';
dotenv.config();

const { verifyGooglePayment } = await import('../controllers/googlePayController.js');

async function runTests() {
    console.log("=== RUNNING GOOGLE PAY VERIFICATION ENDPOINT TESTS ===");

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

    // Test Case 1: Localhost request (default test mode)
    {
        console.log("\n[Test Case 1] Localhost Request");
        const req = createMockReq({ NODE_ENV: 'development' }, 'localhost', { planId: 'plan_123' });
        const res = createMockRes();
        await verifyGooglePayment(req, res);

        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response:", JSON.stringify(res.jsonPayload, null, 2));
        if (res.statusCode === 200 && res.jsonPayload.success && res.jsonPayload.isTest) {
            console.log("✅ SUCCESS: Correctly bypassed DB and returned test success message.");
        } else {
            console.error("❌ FAILURE: Test mode bypass failed.");
        }
    }

    // Test Case 2: Sandbox / Dev NODE_ENV request
    {
        console.log("\n[Test Case 2] Sandbox/Dev environment variable request");
        const req = createMockReq({ NODE_ENV: 'sandbox', GOOGLE_PAY_ENV: 'TEST' }, 'aisa-sandbox.com', { planId: 'plan_123' });
        const res = createMockRes();
        await verifyGooglePayment(req, res);

        console.log(`Status Code: ${res.statusCode}`);
        console.log("Response:", JSON.stringify(res.jsonPayload, null, 2));
        if (res.statusCode === 200 && res.jsonPayload.success && res.jsonPayload.isTest) {
            console.log("✅ SUCCESS: Correctly bypassed DB for sandbox domain.");
        } else {
            console.error("❌ FAILURE: Sandbox bypass failed.");
        }
    }

    // Test Case 3: Production request with missing signature
    {
        console.log("\n[Test Case 3] Production environment with missing signature params");
        // Force production env
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
            console.log("✅ SUCCESS: Correctly rejected missing parameters in production.");
        } else {
            console.error("❌ FAILURE: Production guard failed.");
        }
    }

    console.log("\n=== TESTS COMPLETE ===");
    process.exit(0);
}

runTests().catch(err => {
    console.error("Test execution error:", err);
    process.exit(1);
});
