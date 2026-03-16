import mongoose from 'mongoose';
import Knowledge from './models/Knowledge.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkDocs() {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    const count = await Knowledge.countDocuments();
    console.log('Total documents in Knowledge:', count);
    const docs = await Knowledge.find().limit(5);
    console.log('Sample docs:', docs.map(d => ({ title: d.title, gcsUri: d.gcsUri, sourceUrl: d.sourceUrl })));
    await mongoose.connection.close();
}

checkDocs();
