import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI || 'mongodb://localhost:27017/AISA';

async function checkEntries() {
  await mongoose.connect(MONGODB_ATLAS_URI);
  const CalendarEntry = mongoose.model('CalendarEntry', new mongoose.Schema({}));

  const entries = await CalendarEntry.find({}).limit(5);
  entries.forEach(e => {
    console.log(`Entry ID: ${e._id}, Title: ${e.get('title')}, ContentType: ${e.get('contentType')}`);
  });

  await mongoose.disconnect();
}

checkEntries().catch(console.error);
