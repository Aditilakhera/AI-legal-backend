import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyUser = async () => {
    try {
        await connectDB();
        
        const email = 'testuser2@example.com';
        const result = await User.findOneAndUpdate(
            { email: email },
            { isVerified: true },
            { new: true }
        );
        
        if (result) {
            console.log(`\n✅ Success! User ${email} has been verified.`);
            console.log(`isVerified: ${result.isVerified}`);
        } else {
            console.log(`\n❌ User ${email} not found.`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Failed to verify user:", err);
        process.exit(1);
    }
}

verifyUser();
