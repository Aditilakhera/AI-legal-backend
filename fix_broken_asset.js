// Fix the one broken mock GCS URL in the GeneratedAsset collection
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA');

const assetSchema = new mongoose.Schema({}, { strict: false });
const GeneratedAsset = mongoose.model('GeneratedAsset', assetSchema, 'generatedassets');

// Find and remove the broken mock asset that points to non-existent bucket
const deleted = await GeneratedAsset.deleteOne({ gcsUrl: /aisa-social-assets/ });
console.log('Deleted broken mock assets:', deleted.deletedCount);

// Verify remaining
const remaining = await GeneratedAsset.find({}).lean();
console.log('Remaining valid assets:', remaining.length);
remaining.forEach((a, i) => console.log(`[${i}] ${a.gcsUrl?.substring(0, 80)}`));

process.exit(0);
