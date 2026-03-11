import connectDB from './config/db.js';
import User from './models/User.js';

async function run() {
  await connectDB();
  const res = await User.updateOne({ email: 'admin@uwo24.com' }, { $set: { credits: 1000000 } });
  console.log('Update result:', res);
  process.exit();
}
run();
0