import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        const sessions = await mongoose.connection.db.collection('chatsessions').find().toArray();
        console.log(`Total Sessions: ${sessions.length}`);
        
        let found = false;
        sessions.forEach(session => {
            session.messages.forEach((m, i) => {
                // Check for ANY image related field
                const img = m.imageUrl || m.image || m.data?.imageUrl;
                if (img) {
                    console.log(`FOUND IMAGE in Session ${session.sessionId}, Msg ${i}: ${img}`);
                    found = true;
                }
            });
        });
        
        if (!found) {
            console.log("No imageUrl found in any messages in the DB.");
            // Let's see ONE model message to see its keys
            const oneModel = sessions.find(s => s.messages.some(m => m.role === 'model'))?.messages.find(m => m.role === 'model');
            if (oneModel) {
                 console.log("Keys in a typical model message:", Object.keys(oneModel));
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();