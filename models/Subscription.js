import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    plan_name: {
        type: String,
        required: true,
        enum: ['FREE', 'STARTER', 'PRO', 'BUSINESS', 'ENTERPRISE'],
        default: 'FREE'
    },
    total_credits: {
        type: Number,
        required: true,
        default: 100
    },
    remaining_credits: {
        type: Number,
        required: true,
        default: 100
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    expiry_date: {
        type: Date,
        required: true,
        default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    }
}, { timestamps: true });

// Index for expiry checks
subscriptionSchema.index({ expiry_date: 1 });

export default mongoose.model('Subscription', subscriptionSchema);
