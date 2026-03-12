const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/AISA').then(async () => {
    console.log("Connected to DB AISA to update pricing.");

    const planSchema = new mongoose.Schema({
        planName: String,
        priceMonthly: Number,
        priceYearly: Number,
    }, { strict: false });

    const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);

    const plans = await Plan.find();
    for (let plan of plans) {
        if (plan.planName.toLowerCase().includes('founder')) {
            plan.priceYearly = 699; // Restore Founder plan
        } else if (plan.priceMonthly > 0) {
            // Calculate 30% off monthly price, then multiply by 12
            const monthlyDiscounted = Math.round(plan.priceMonthly * 0.7);
            plan.priceYearly = monthlyDiscounted * 12;
        } else {
            plan.priceYearly = 0;
        }
        await plan.save();
        console.log(`Updated ${plan.planName} - Monthly: ₹${plan.priceMonthly}, Yearly Total: ₹${plan.priceYearly}`);
    }

    console.log("Pricing updated to charge total 12-month amount.");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
