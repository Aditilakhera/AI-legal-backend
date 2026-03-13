import mongoose from 'mongoose';

const KnowledgeSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    cloudinaryUrl: {
        type: String
    },
    cloudinaryId: {
        type: String // Public ID
    },
    gcsUri: {
        type: String
    },
    mimetype: {
        type: String
    },
    size: {
        type: Number // In bytes
    },
    category: {
        type: String,
        default: 'General'
    },
    // content: { type: String } // Removed to save metadata only
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('AIBaseKnowledge', KnowledgeSchema);
