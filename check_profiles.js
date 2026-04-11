import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA';

async function checkProfiles() {
  await mongoose.connect(MONGODB_ATLAS_URI);
  const BrandProfile = mongoose.model('BrandProfile', new mongoose.Schema({}, { strict: false }));
  const SocialAgentWorkspace = mongoose.model('SocialAgentWorkspace', new mongoose.Schema({}, { strict: false }));
  const PlanUsage = mongoose.model('PlanUsage', new mongoose.Schema({}, { strict: false }));

  console.log(`Workspaces: ${await SocialAgentWorkspace.countDocuments({})}`);
  console.log(`BrandProfiles: ${await BrandProfile.countDocuments({})}`);
  console.log(`PlanUsages: ${await PlanUsage.countDocuments({})}`);

  const ws = await SocialAgentWorkspace.findOne({});
  if (ws) {
    console.log(`\nExample WS ID: ${ws._id}`);
    const brand = await BrandProfile.findOne({ workspaceId: ws._id });
    console.log(`Brand for this WS: ${brand ? 'FOUND' : 'MISSING'}`);
    const usage = await PlanUsage.findOne({ workspaceId: ws._id });
    console.log(`Usage for this WS: ${usage ? 'FOUND' : 'MISSING'}`);
  }

  await mongoose.disconnect();
}

checkProfiles().catch(console.error);
