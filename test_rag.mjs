import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function testRagRetrieval() {
    const query = "Who is the founder of UWO?";
    console.log(`Testing query: "${query}"\n`);

    try {
        const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
        const location = process.env.GCP_LOCATION || 'asia-south1';
        const corpusId = process.env.VERTEX_RAG_CORPUS_ID || '1152921504606846976';

        // Correct v1 endpoint
        const retrieveUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}:retrieveContexts`;
        const corpusName = `projects/${projectId}/locations/${location}/ragCorpora/${corpusId}`;

        // Correct payload structure for v1
        const payload = {
            vertexRagStore: {
                ragResources: [
                    { ragCorpus: corpusName }
                ]
            },
            query: {
                text: query
            }
        };

        console.log(`Endpoint: ${retrieveUrl}`);
        console.log(`Corpus: ${corpusName}`);
        console.log(`Retrieving context...\n`);

        const response = await axios.post(retrieveUrl, payload, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
        });

        const contexts = response.data?.contexts?.contexts || response.data?.ragContexts?.contexts || [];

        if (contexts.length === 0) {
            console.log("❌ No relevant contexts found. Are there actively indexed documents in this corpus?");
        } else {
            console.log(`✅ SUCCESS! Retrieved ${contexts.length} context chunks:\n`);
            contexts.forEach((c, i) => {
                console.log(`--- Chunk ${i + 1} ---`);
                console.log(c.text);
                console.log(`Source: ${c.sourceUri || 'Unknown'}\n`);
            });
        }

    } catch (error) {
        console.error("❌ RETRIEVAL FAILED");
        console.error("Status:", error.response?.status);
        console.error("Error Message:", error.response?.data?.error?.message || error.message);
        console.error(JSON.stringify(error.response?.data, null, 2));
    }
}

testRagRetrieval();
