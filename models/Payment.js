import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan_name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true,
        unique: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
