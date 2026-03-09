import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import 'dotenv/config';

async function debugRag() {
    const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
    const location = process.env.GCP_LOCATION || 'asia-south1';
    const corpusId = process.env.VERTEX_RAG_CORPUS_ID || '4611686018427387904';
    const corpusResource = `projects/${projectId}/locations/${location}/ragCorpora/${corpusId}`;

    const endpoints = [
        // 1. PLURAL retrieveContexts on ragRetrieval (v1beta1)
        {
            name: "v1beta1 ragRetrieval:retrieveContexts",
            url: `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragRetrieval:retrieveContexts`,
            payload: {
                vertexRagStore: { ragCorpora: [corpusResource], similarityTopK: 2 },
                query: { text: "founder" }
            }
        },
        // 2. SINGULAR retrieveContext on ragRetrieval (v1beta1) - current code
        {
            name: "v1beta1 ragRetrieval:retrieveContext",
            url: `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragRetrieval:retrieveContext`,
            payload: {
                vertexRagStore: { ragCorpora: [corpusResource], similarityTopK: 2 },
                query: { text: "founder" }
            }
        },
        // 3. Direct corpus retrieveContexts (v1beta1)
        {
            name: "v1beta1 Corpus Direct:retrieveContexts",
            url: `https://${location}-aiplatform.googleapis.com/v1beta1/${corpusResource}:retrieveContexts`,
            payload: { query: { text: "founder", similarityTopK: 2 } }
        },
        // 4. Direct corpus retrieveContext (v1beta1)
        {
            name: "v1beta1 Corpus Direct:retrieveContext",
            url: `https://${location}-aiplatform.googleapis.com/v1beta1/${corpusResource}:retrieveContext`,
            payload: { query: { text: "founder", similarityTopK: 2 } }
        }
    ];

    for (const ep of endpoints) {
        process.stdout.write(`\nTesting: ${ep.name}... `);
        try {
            const res = await axios.post(ep.url, ep.payload, {
                headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
            });
            console.log(`\nSUCCESS! Found context.`);
            process.exit(0);
        } catch (err) {
            console.log(`FAILED (${err.response?.status})`);
        }
    }
}

debugRag();
