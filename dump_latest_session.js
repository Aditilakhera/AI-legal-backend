import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function dump() {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        const latest = await mongoose.connection.db.collection('chatsessions').find().sort({ lastModified: -1 }).limit(1).toArray();
        if (latest.length > 0) {
            console.log(JSON.stringify(latest[0], null, 2));
        } else {
            console.log('No sessions found.');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
dump();