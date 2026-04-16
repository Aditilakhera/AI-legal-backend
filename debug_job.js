import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA';

async function debugJob() {
  await mongoose.connect(MONGODB_ATLAS_URI);
  const GenerationJob = mongoose.model('GenerationJob', new mongoose.Schema({}, { strict: false }));
  const SocialAgentWorkspace = mongoose.model('SocialAgentWorkspace', new mongoose.Schema({}, { strict: false }));
  const BrandProfile = mongoose.model('BrandProfile', new mongoose.Schema({}, { strict: false }));
  const PlanUsage = mongoose.model('PlanUsage', new mongoose.Schema({}, { strict: false }));

  const job = await GenerationJob.findOne({}).sort({ createdAt: -1 });
  if (!job) {
    console.log("No jobs found");
    return;
  }

  console.log(`Job ID: ${job._id}`);
  console.log(`Job WorkspaceId: ${job.workspaceId}`);
  console.log(`Job Error: ${job.errorSummary}`);

  const ws = await SocialAgentWorkspace.findById(job.workspaceId);
  console.log(`Workspace Found: ${!!ws}`);

  const brand = await BrandProfile.findOne({ workspaceId: job.workspaceId });
  console.log(`Brand Found: ${!!brand}`);

  const usage = await PlanUsage.findOne({ workspaceId: job.workspaceId });
  console.log(`Usage Found: ${!!usage}`);

  await mongoose.disconnect();
}

debugJob().catch(console.error);
