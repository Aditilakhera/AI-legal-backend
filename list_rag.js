import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The path used in vertex.js is ../google_cloud_credentials.json relative to config/
// So if this script is in root, it should just be ./google_cloud_credentials.json
const keyFilePath = path.join(__dirname, 'google_cloud_credentials.json');

async function listCorpora() {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
    const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });

    try {
        const client = await auth.getClient();
        const token = await client.getAccessToken();
        const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
        const location = process.env.GCP_LOCATION || 'asia-south1';

        console.log(`Checking Region: ${location}`);
        console.log(`Project: ${projectId}`);

        const url = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora`;

        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token.token}` }
        });

        const corpora = res.data.ragCorpora || [];
        console.log(`\nFound ${corpora.length} corpora:`);
        corpora.forEach(c => {
            console.log(`- Display Name: ${c.displayName}`);
            console.log(`  Full Name: ${c.name}`);
        });

    } catch (err) {
        console.error("ERROR:", err.response?.status, err.response?.data?.error?.message || err.message);
    }
}

listCorpora();
