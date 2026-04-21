import dotenv from 'dotenv';
dotenv.config();
console.log('GCP_PROJECT_ID:', process.env.GCP_PROJECT_ID);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
