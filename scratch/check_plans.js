import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const planSchema = new mongoose.Schema({
    planName: String,
    isActive: Boolean
});
const Plan = mongoose.model('Plan', planSchema);

async function checkPlans() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/AISA');
        const plans = await Plan.find({});
        console.log('PLANS:', JSON.stringify(plans, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkPlans();
