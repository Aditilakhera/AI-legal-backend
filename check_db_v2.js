import mongoose from 'mongoose';
import SupportTicket from './models/SupportTicket.js';

async function check() {
    try {
        await mongoose.connect('mongodb://localhost:27017/AISA');
        const tickets = await SupportTicket.find();
        tickets.forEach(t => {
            console.log(`Ticket ID: ${t._id}, Status: ${t.status}, Email: ${t.email}`);
        });
    } catch (err) {
        console.error('Error checking DB:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

check();
