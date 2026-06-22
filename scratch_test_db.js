import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Configure DNS servers to resolve MongoDB SRV records on Windows
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const uri = process.env.MONGODB_ATLAS_URI;
console.log('Attempting to connect to MongoDB URI (with Google DNS):', uri);

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});
