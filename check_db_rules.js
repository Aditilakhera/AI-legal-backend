import mongoose from 'mongoose';
import 'dotenv/config';
import SystemConfig from './models/SystemConfig.js';

async function checkConfig() {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        const config = await SystemConfig.findOne({ key: 'AISA_CONVERSATIONAL_RULES' });
        console.log("AISA_CONVERSATIONAL_RULES value length:", config.value.length);
        console.log("Contains 'FALLBACK':", config.value.includes('FALLBACK:'));
        console.log("Full value head (200 chars):", config.value.substring(0, 200));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkConfig();
