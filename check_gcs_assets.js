import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const MONGODB = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA';
await mongoose.connect(MONGODB);

const assetSchema = new mongoose.Schema({}, { strict: false });
const GeneratedAsset = mongoose.model('GeneratedAsset', assetSchema, 'generatedassets');
const UploadAsset = mongoose.model('UploadAsset', assetSchema, 'uploadassets');
const wsSchema = new mongoose.Schema({}, { strict: false });
const Workspace = mongoose.model('SocialAgentWorkspace', wsSchema, 'socialagentworkspaces');

const genAssets = await GeneratedAsset.find({}).lean();
const uploadAssets = await UploadAsset.find({}).lean();
const workspaces = await Workspace.find({}).lean();

const output = {
  generatedAssets: genAssets.map(a => ({ _id: a._id, workspaceId: a.workspaceId, gcsUrl: a.gcsUrl })),
  uploadAssets: uploadAssets.map(a => ({ _id: a._id, workspaceId: a.workspaceId, gcsUrl: a.gcsUrl, assetType: a.assetType })),
  workspaces: workspaces.map(w => ({ _id: w._id, name: w.workspaceName }))
};

fs.writeFileSync('./debug_output.json', JSON.stringify(output, null, 2));
console.log('Written to debug_output.json');
process.exit(0);
