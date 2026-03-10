/**
 * updatePlans50pct.js
 * Updates all subscription plans in MongoDB to reflect 50% profit margin.
 * Formula: Retail Price = Google Base Cost × 2.0
 * Run: node scripts/updatePlans50pct.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/Plan.js';

dotenv.config();

const UPDATED_PLANS = [
    {
        planId: 'free',
        planName: 'Free Tier',
        priceMonthly: 0,
        priceYearly: 0,
        credits: 500,
        badge: '',
        isPopular: false,
        features: [
            'Gemini 2.5 Flash Chat',
            'Document Analysis (Basic)',
            'Standard Priority GPU'
        ]
    },
    {
        planId: 'starter',
        planName: 'Starter Plan',
        priceMonthly: 499,
        priceYearly: 419,
        credits: 2940,       // was 5800 — 50% margin (₹499 / 2 = ₹249.50 Google cost = ~2940 credits)
        badge: '',
        isPopular: false,
        features: [
            'Gemini 2.5 Chat (Priority)',
            'Imagen 3.0 Access',
            'Veo 3.1 Fast (1080p)',
            'Deep Search Grounding',
            'Advanced Document Suite'
        ]
    },
    {
        planId: 'founder',
        planName: 'Founder Plan',
        priceMonthly: 699,
        priceYearly: 589,
        credits: 4112,       // was 8500 — 50% margin (₹699 / 2 = ₹349.50 Google cost = ~4112 credits)
        badge: 'Early Adopter',
        isPopular: true,
        features: [
            'Founder Exclusive Badge (Badge Only)',
            'Imagen 4.0 Ultra Access',
            'Veo 3.1 Fast (4K UHD)',
            'Priority GPU Allocation',
            'Google Search Grounding',
            'Up to 1M Context Window'
        ]
    },
    {
        planId: 'pro',
        planName: 'Pro Plan',
        priceMonthly: 999,
        priceYearly: 839,
        credits: 5876,       // was 12000 — 50% margin (₹999 / 2 = ₹499.50 Google cost = ~5876 credits)
        badge: 'Creator Choice',
        isPopular: false,
        features: [
            'Veo 3.1 Full Mode (Cinematic)',
            'All Visuals at 4K Resolution',
            'Expert Code Execution Suite',
            'Private Knowledge Bases',
            'Imagen 4.0 Ultra (Photorealism)'
        ]
    },
    {
        planId: 'business',
        planName: 'Business Plan',
        priceMonthly: 2499,
        priceYearly: 2099,
        credits: 14700,      // was 32000 — 50% margin (₹2499 / 2 = ₹1249.50 Google cost = ~14700 credits)
        badge: 'Enterprise Ready',
        isPopular: false,
        features: [
            'Long-form Video (70s+)',
            'Team Collaboration Workspace',
            'Dedicated Account Manager',
            'Commercial Usage Rights',
            'Bulk Document Analysis Pro'
        ]
    }
];

async function updatePlans() {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        let updated = 0;
        let created = 0;

        for (const planData of UPDATED_PLANS) {
            const existing = await Plan.findOne({ planId: planData.planId });

            if (existing) {
                await Plan.updateOne(
                    { planId: planData.planId },
                    {
                        $set: {
                            credits: planData.credits,
                            priceMonthly: planData.priceMonthly,
                            priceYearly: planData.priceYearly,
                            features: planData.features,
                            badge: planData.badge,
                            isPopular: planData.isPopular,
                            isActive: true
                        }
                    }
                );
                console.log(`🔄 Updated: ${planData.planName} → ${planData.credits} credits`);
                updated++;
            } else {
                await Plan.create({ ...planData, isActive: true });
                console.log(`➕ Created: ${planData.planName} → ${planData.credits} credits`);
                created++;
            }
        }

        console.log(`\n✅ Done! ${updated} plans updated, ${created} plans created.`);
        console.log('\n📊 New credit allocations (50% margin):');
        console.log('  Free Tier:     500 credits  (₹0)');
        console.log('  Starter:     2,940 credits  (₹499/mo)  — Profit: ₹249.50/user');
        console.log('  Founder:     4,112 credits  (₹699/mo)  — Profit: ₹349.50/user');
        console.log('  Pro:         5,876 credits  (₹999/mo)  — Profit: ₹499.50/user');
        console.log('  Business:   14,700 credits  (₹2499/mo) — Profit: ₹1249.50/user');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

updatePlans();
