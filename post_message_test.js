import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        const session = await mongoose.connection.db.collection('chatsessions').findOne();
        
        console.log("Found session", session.sessionId);
        
        // Let's add a message with an imageUrl and see what the DB natively saves
        const updateResult = await mongoose.connection.db.collection('chatsessions').updateOne(
            { _id: session._id },
            { "$set": { "messages.0.imageUrl": "https://example.com/test.png" } }
        );
        
        console.log("Manual update result:", updateResult);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();
