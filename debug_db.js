import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const KnowledgeSchema = new mongoose.Schema({
    title: String,
    gcsUri: String,
    sourceUrl: String
});
const Knowledge = mongoose.model('Knowledge', KnowledgeSchema, 'knowledges'); // Forced collection name if needed

async function checkDocs() {
    try {
        console.log('Connecting to:', process.env.MONGODB_ATLAS_URI);
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        const count = await Knowledge.countDocuments();
        console.log('Total documents in Knowledge:', count);
        const docs = await Knowledge.find().limit(10);
        console.log('Sample docs:', JSON.stringify(docs, null, 2));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
    }
}

checkDocs();
