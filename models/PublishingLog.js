import mongoose from 'mongoose';

const PublishingLogSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeneratedPost', required: true, index: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialAgentWorkspace', required: true, index: true },
  platform: { type: String, required: true },
  requestPayload: { type: mongoose.Schema.Types.Mixed },
  responsePayload: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.PublishingLog || mongoose.model('PublishingLog', PublishingLogSchema);
