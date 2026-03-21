import mongoose from 'mongoose';
import SupportTicket from './models/SupportTicket.js';

async function check() {
    try {
        await mongoose.connect('mongodb://localhost:27017/AISA');
        const count = await SupportTicket.countDocuments();
        console.log(`Support Tickets in DB: ${count}`);
        const last = await SupportTicket.findOne().sort({ createdAt: -1 });
        if (last) {
            console.log(`Last Ticket: "${last.message}" from ${last.email}`);
        }
    } catch (err) {
        console.error('Error checking DB:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

check();
