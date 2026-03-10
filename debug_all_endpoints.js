import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import 'dotenv/config';

async function testAll() {
    const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
    const location = process.env.GCP_LOCATION || 'asia-south1';
    const corpusId = process.env.VERTEX_RAG_CORPUS_ID || '4611686018427387904';
    const corpusResource = `projects/${projectId}/locations/${location}/ragCorpora/${corpusId}`;

    const versions = ['v1beta1', 'v1'];
    const paths = [
        'ragRetrieval:retrieveContext',
        'ragRetrieval:retrieveContexts',
        `ragCorpora/${corpusId}:retrieveContext`,
        `ragCorpora/${corpusId}:retrieveContexts`
    ];

    for (const v of versions) {
        for (const p of paths) {
            const url = `https://${location}-aiplatform.googleapis.com/${v}/projects/${projectId}/locations/${location}/${p}`;
            console.log(`\nURL: ${url}`);

            // Adapt payload based on path
            const payload = p.startsWith('ragRetrieval')
                ? { vertexRagStore: { ragCorpora: [corpusResource], similarityTopK: 2 }, query: { text: "founder" } }
                : { query: { text: "founder", similarityTopK: 2 } };

            try {
                const res = await axios.post(url, payload, {
                    headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
                });
                console.log(`✅ SUCCESS! [${v}] [${p}] Response received.`);
                console.log(JSON.stringify(res.data).substring(0, 300));
            } catch (err) {
                console.log(`❌ FAILED: ${err.response?.status} - ${err.response?.data?.error?.message || err.message}`);
                if (err.response?.data) {
                    console.log(`   Detail: ${JSON.stringify(err.response.data.error)}`);
                }
            }
        }
    }
}

testAll();
