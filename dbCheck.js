import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import mongoose from 'mongoose';

const uri = "mongodb+srv://admin_db_user:gwmmWiKmK4wCit1L@cluster0.u5wdauj.mongodb.net/AISA?appName=Cluster0";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected successfully!");
        
        const count = await User.countDocuments();
        console.log(`Total users in DB: ${count}`);
        
        const users = await User.find({}).select('name email role').limit(20);
        console.log("First 20 Users:");
        users.forEach(u => {
            console.log(`- Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
        });
        
        await mongoose.disconnect();
        console.log("Disconnected.");
    } catch (err) {
        console.error("DB Error:", err);
    }
}

run();
