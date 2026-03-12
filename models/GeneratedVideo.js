import mongoose from 'mongoose';

const generatedVideoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    originalImage: { type: String },
    aspectRatio: { type: String },
    duration: { type: Number, default: 5 },
    modelId: { type: String },
    status: { type: String, default: 'completed' }
}, { timestamps: true });

export default mongoose.model('GeneratedVideo', generatedVideoSchema);
