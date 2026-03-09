import mongoose from 'mongoose';
import 'dotenv/config';
import Knowledge from './models/Knowledge.model.js';

async function checkDocs() {
    try {
        console.log("URI:", process.env.MONGODB_ATLAS_URI ? "LOADED" : "MISSING");
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        const docs = await Knowledge.find({});
        console.log(`TOTAL DOCUMENTS: ${docs.length}`);
        docs.forEach(d => {
            console.log(`- File: ${d.filename}, GCS: ${d.gcsUri}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
checkDocs();
