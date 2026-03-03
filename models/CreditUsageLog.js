import mongoose from 'mongoose';

const creditUsageLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tool_name: {
        type: String,
        required: true
    },
    credits_used: {
        type: Number,
        required: true
    },
    request_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('CreditUsageLog', creditUsageLogSchema);
