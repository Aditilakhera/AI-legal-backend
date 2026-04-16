import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA';

async function checkJobs() {
  await mongoose.connect(MONGODB_ATLAS_URI);
  const GenerationJob = mongoose.model('GenerationJob', new mongoose.Schema({}, { strict: false }));
  const jobs = await GenerationJob.find({}).sort({ createdAt: -1 }).limit(3);
  
  jobs.forEach(j => {
    console.log(`\n--- Job: ${j._id} ---`);
    console.log(`Status: ${j.status}`);
    console.log(`Logs: ${JSON.stringify(j.logs, null, 2)}`);
    console.log(`Error: ${j.errorSummary}`);
  });

  await mongoose.disconnect();
}

checkJobs().catch(console.error);
