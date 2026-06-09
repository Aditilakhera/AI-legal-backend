import { getNews, getAdvisory, getResearch } from '../controllers/stockController.js';
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to MongoDB as the models might need it
await mongoose.connect(process.env.MONGODB_ATLAS_URI);
console.log("Connected to MongoDB");

const mockReq = {
    query: { symbol: 'TCS.BSE', name: 'Tata Consultancy' },
    user: { id: '65e38d72dfa4f00123456789' }, // mock user ID
    creditMeta: null // skip credit deduction for test
};

const mockRes = {
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(data) {
        this.data = data;
        console.log(`[Response ${this.statusCode || 200}]`, JSON.stringify(data, null, 2).substring(0, 1000));
        return this;
    }
};

async function runTests() {
    try {
        console.log("\n--- Testing getNews ---");
        await getNews(mockReq, mockRes);
        
        console.log("\n--- Testing getAdvisory ---");
        await getAdvisory(mockReq, mockRes);
        
        console.log("\n--- Testing getResearch ---");
        await getResearch(mockReq, mockRes);
        
    } catch (err) {
        console.error("Test execution failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

runTests();
