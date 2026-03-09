import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function checkImportStatus() {
    try {
        const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        const location = process.env.GCP_LOCATION || 'asia-south1';

        // The operation name from your logs
        const operationName = 'projects/743928421487/locations/asia-south1/ragCorpora/1152921504606846976/operations/4172068559171616768';
        const operationUrl = `https://${location}-aiplatform.googleapis.com/v1/${operationName}`;

        console.log(`Checking Operation Status...`);

        let response = await axios.get(operationUrl, {
            headers: { Authorization: `Bearer ${token.token}` }
        });

        console.log(`\n--- IMPORT JOB STATUS ---`);
        console.log(`Done: ${response.data.done ? 'Yes' : 'No'}`);
        if (response.data.error) {
            console.log(`Error:`, response.data.error);
        } else if (response.data.response) {
            console.log(`Result:`, JSON.stringify(response.data.response, null, 2));
        }

        // Now let's check the files in the corpus
        const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
        const corpusId = process.env.VERTEX_RAG_CORPUS_ID || '1152921504606846976';
        const filesUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/ragCorpora/${corpusId}/ragFiles`;

        console.log(`\nChecking Files in Corpus...`);
        const filesRes = await axios.get(filesUrl, {
            headers: { Authorization: `Bearer ${token.token}` }
        });

        const files = filesRes.data.ragFiles || [];
        console.log(`\n--- FILES IN RAG CORPUS (${files.length}) ---`);
        files.forEach(f => {
            console.log(`- ${f.displayName}`);
            console.log(`   State: ${f.ragFileState}`);
            console.log(`   Created: ${f.createTime}`);
        });

    } catch (error) {
        console.error("❌ FAILED TO CHECK STATUS");
        console.error(error.response?.data?.error?.message || error.message);
    }
}

checkImportStatus();
