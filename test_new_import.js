import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import 'dotenv/config';

async function testImport() {
    const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
    const location = process.env.GCP_LOCATION || 'asia-south1';
    const corpusId = process.env.VERTEX_RAG_CORPUS_ID || '1152921504606846976';

    const testGcsUri = "gs://aisa_knowledge_base/UWO_-_Company_Profile_Deck.pdf"; // This might not exist but the API should first find the corpus

    const importUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/ragCorpora/${corpusId}/ragFiles:import`;

    const payload = {
        importRagFilesConfig: {
            gcsSource: {
                uris: [testGcsUri]
            }
        }
    };

    console.log(`Connecting to: ${importUrl}`);
    try {
        const res = await axios.post(importUrl, payload, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
        });
        console.log("RESPONSE SUCCESS:", res.data);
    } catch (err) {
        console.error("FAILED STATUS:", err.response?.status);
        console.error("ERROR MESSAGE:", err.response?.data?.error?.message || err.message);
    }
}

testImport();
