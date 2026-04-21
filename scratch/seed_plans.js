import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const planSchema = new mongoose.Schema({
    planId: { type: String, required: true, unique: true },
    planName: { type: String, required: true },
    priceMonthly: { type: Number, required: true },
    priceYearly: { type: Number, required: true },
    credits: { type: Number, required: true },
    creditsYearly: { type: Number },
    isActive: { type: Boolean, default: true }
});
const Plan = mongoose.model('Plan', planSchema);

async function seedPlans() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/AISA');
        
        const count = await Plan.countDocuments();
        if (count > 0) {
            console.log('Plans already exist.');
            process.exit(0);
        }

        const defaultPlans = [
            { planId: 'free', planName: 'Free', priceMonthly: 0, priceYearly: 0, credits: 10, isActive: true },
            { planId: 'pro', planName: 'Pro', priceMonthly: 999, priceYearly: 9999, credits: 1000, isActive: true },
            { planId: 'founder', planName: 'Founder', priceMonthly: 4999, priceYearly: 49999, credits: 10000, isActive: true }
        ];

        await Plan.insertMany(defaultPlans);
        console.log('Default plans seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedPlans();
