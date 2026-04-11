import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA';

async function test() {
  await mongoose.connect(uri);
  const GeneratedAsset = mongoose.connection.collection('generatedassets');
  const assets = await GeneratedAsset.find().sort({ createdAt: -1 }).limit(3).toArray();
  for (const a of assets) {
    console.log(`Asset ID: ${a._id}`);
    console.log(`GCS URL: ${a.gcsUrl}`);
    console.log('---');
  }
  mongoose.disconnect();
}
test();
