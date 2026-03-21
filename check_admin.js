import mongoose from 'mongoose';
import User from './models/User.js';

async function check() {
    try {
        await mongoose.connect('mongodb://localhost:27017/AISA');
        const admin = await User.findOne({ email: 'admin@uwo24.com' });
        if (admin) {
            console.log(`Admin User: ${admin.email}, Role: ${admin.role}, ID: ${admin._id}`);
        } else {
            console.log(`admin@uwo24.com NOT FOUND in User collection.`);
            // Check for any user with role 'admin'
            const anyAdmin = await User.findOne({ role: 'admin' });
            if (anyAdmin) {
                console.log(`Found another admin: ${anyAdmin.email}`);
            }
        }
    } catch (err) {
        console.error('Error checking Admin User:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

check();
