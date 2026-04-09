import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        const session = await mongoose.connection.db.collection('chatsessions').findOne({ sessionId: 'mnr6i9u38z2wtb35qsg' });
        if (session) {
            console.log('Session ID:', session.sessionId);
            console.log('Title:', session.title);
            session.messages.forEach((m, i) => {
                const role = m.role || 'no-role';
                const content = m.content || m.text || 'no-content';
                console.log(`Msg ${i} [${role}]: ${content.substring(0, 50)}`);
            });
        } else {
            console.log('Session not found');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();