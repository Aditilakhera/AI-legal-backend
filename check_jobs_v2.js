import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA';

async function checkJobs() {
  await mongoose.connect(MONGODB_ATLAS_URI);
  const GenerationJob = mongoose.model('GenerationJob', new mongoose.Schema({}, { strict: false }));

  const jobs = await GenerationJob.find({}).sort({ createdAt: -1 }).limit(3).lean();
  jobs.forEach(j => {
    console.log(`Job ID: ${j._id}, Status: ${j.status}, Created: ${j.createdAt}`);
    console.log(`Logs: ${JSON.stringify(j.logs)}`);
    console.log(`ErrorSummary: ${j.errorSummary}`);
    console.log('---');
  });

  await mongoose.disconnect();
}

checkJobs().catch(console.error);
