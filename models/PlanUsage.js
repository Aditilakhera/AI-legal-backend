import mongoose from 'mongoose';

const PlanUsageSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialAgentWorkspace', required: true },
  billingMonth: { type: String, required: true }, // Format: YYYY-MM
  imageUsed: { type: Number, default: 0 },
  carouselUsed: { type: Number, default: 0 },
  videoUsed: { type: Number, default: 0 },
  imageLimit: { type: Number, default: 0 },
  carouselLimit: { type: Number, default: 0 },
  videoLimit: { type: Number, default: 0 },
  resetAt: { type: Date }
}, { timestamps: true });

export default mongoose.models.PlanUsage || mongoose.model('PlanUsage', PlanUsageSchema);
