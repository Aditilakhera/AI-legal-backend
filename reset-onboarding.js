import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/AISA').then(async () => {
  const db = mongoose.connection.db;
  await db.collection('socialagentworkspaces').updateMany({}, { $set: { 'onboarding.completed': false } });
  console.log('Reset onboarding successfully!');
  process.exit(0);
}).catch(e => {
  console.log(e);
  process.exit(1);
});
