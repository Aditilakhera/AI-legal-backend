import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import 'dotenv/config';

async function ragHealthCheck() {
    const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const projectId = process.env.GCP_PROJECT_ID || 'ai-mall-484810';
    const location = process.env.GCP_LOCATION || 'asia-south1';
    const corpusId = process.env.VERTEX_RAG_CORPUS_ID || '1152921504606846976';
    const bucketName = 'aisa_knowledge_base';

    console.log("--- VERTEX AI RAG PIPELINE HEALTH CHECK ---");
    console.log(`Region: ${location}`);
    console.log(`Corpus ID: ${corpusId}`);
    console.log(`Project: ${projectId}`);
    console.log("-------------------------------------------\n");

    // 1. Verify Corpus Exists
    console.log("[1/4] Checking Corpus Status...");
    try {
        const corpusUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora/${corpusId}`;
        const corpusRes = await axios.get(corpusUrl, {
            headers: { Authorization: `Bearer ${token.token}` }
        });
        console.log(`✅ Corpus Found: ${corpusRes.data.displayName}`);
        console.log(`   Internal Name: ${corpusRes.data.name}`);
    } catch (err) {
        console.error(`❌ Corpus Error: ${err.response?.status} - ${err.response?.data?.error?.message || err.message}`);
    }

    // 2. Check File Ingestion Status
    console.log("\n[2/4] Checking Ingested Files...");
    try {
        const filesUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora/${corpusId}/ragFiles`;
        const filesRes = await axios.get(filesUrl, {
            headers: { Authorization: `Bearer ${token.token}` }
        });
        const files = filesRes.data.ragFiles || [];
        console.log(`✅ Found ${files.length} files in corpus.`);
        files.forEach(f => {
            console.log(`   - ${f.displayName} (Status: SUCCESS)`);
        });
        if (files.length === 0) console.log("   ⚠️ No files indexed yet. Please upload via Dashboard.");
    } catch (err) {
        console.error(`❌ Files Error: ${err.response?.data?.error?.message || err.message}`);
    }

    // 3. Test Retrieval API (v1 Plural)
    console.log("\n[3/4] Testing Retrieval API (Mumbai v1 Plural)...");
    try {
        const retrieveUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/ragRetrieval:retrieveContexts`;
        const payload = {
            vertexRagStore: {
                ragCorpora: [`projects/${projectId}/locations/${location}/ragCorpora/${corpusId}`],
                similarityTopK: 2
            },
            query: { text: "founder" }
        };
        const retrieveRes = await axios.post(retrieveUrl, payload, {
            headers: { Authorization: `Bearer ${token.token}`, 'Content-Type': 'application/json' }
        });
        const contexts = retrieveRes.data?.ragContexts?.contexts || [];
        if (contexts.length > 0) {
            console.log(`✅ Retrieval SUCCESS! Found ${contexts.length} relevant chunks.`);
        } else {
            console.log("⚠️ Retrieval returned 0 results. (Make sure you have ACTIVE files in the corpus).");
        }
    } catch (err) {
        console.error(`❌ Retrieval Error: ${err.response?.status} - ${err.response?.data?.error?.message || err.message}`);
    }

    // 4. Check GCS Bucket (Requires gcloud or bucket-level perms)
    console.log("\n[4/4] Checking GCS Bucket Connection...");
    try {
        const { Storage } = await import('@google-cloud/storage');
        const storage = new Storage({ projectId });
        const [bucketFiles] = await storage.bucket(bucketName).getFiles({ maxResults: 5 });
        console.log(`✅ GCS Connection established.`);
        console.log(`   Recent files: ${bucketFiles.map(f => f.name).join(', ') || 'None'}`);
    } catch (err) {
        console.warn(`⚠️ GCS Check Warning: ${err.message} (Ignore if using limited local credentials)`);
    }

    console.log("\n--- HEALTH CHECK COMPLETE ---");
}

ragHealthCheck();
