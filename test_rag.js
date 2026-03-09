import mongoose from 'mongoose';
import 'dotenv/config';
import { retrieveContextFromRag } from './services/vertex.service.js';
import Knowledge from './models/Knowledge.model.js';

async function testRag() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        const count = await Knowledge.countDocuments();
        console.log(`Document count in Knowledge: ${count}`);

        if (count > 0) {
            console.log("Attempting Vertex RAG retrieval for 'founder'...");
            const context = await retrieveContextFromRag("who is the founder of uwo");
            console.log("Retrieved context:", context || "NULL");
        } else {
            console.log("No documents in Knowledge base.");
        }
    } catch (err) {
        console.error("Test Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

testRag();
