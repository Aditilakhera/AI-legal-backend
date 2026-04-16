import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const uri = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA';

async function test() {
  await mongoose.connect(uri);
  const GeneratedAsset = mongoose.connection.collection('generatedassets');
  const assets = await GeneratedAsset.find().sort({ createdAt: -1 }).limit(3).toArray();
  let out = '';
  for (const a of assets) {
    out += `\n${a.gcsUrl}\n`;
  }
  fs.writeFileSync('urls.txt', out, 'utf8');
  mongoose.disconnect();
}
test();
