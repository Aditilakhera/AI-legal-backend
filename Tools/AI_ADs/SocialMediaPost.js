import mongoose from 'mongoose';

const SocialMediaPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  postType: { type: String, enum: ['Image', 'Carousel', 'Video'], required: true },
  scheduledDate: { type: Date, required: true },
  content: {
    hook: String,
    caption: String,
    hashtags: [String]
  },
  visualUrl: { type: String }, // Links to GCS output
  status: { type: String, enum: ['Pending', 'Processing', 'Generated', 'Failed'], default: 'Pending' },
  planType: { type: String, enum: ['Low', 'Medium', 'High'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SocialMediaPost || mongoose.model('SocialMediaPost', SocialMediaPostSchema);
