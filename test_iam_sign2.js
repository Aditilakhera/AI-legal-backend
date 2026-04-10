import { Storage } from '@google-cloud/storage';
import { GoogleAuth } from 'google-auth-library';
import crypto from 'crypto';

async function run() {
    try {
        const targetPrincipal = 'video-signer@ai-mall-484810.iam.gserviceaccount.com';
        const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
        const client = await auth.getClient();
        
        // Custom authClient that proxies sign() to IAM Credentials API
        const customAuthClient = {
            async getCredentialsAsync() { return { client_email: targetPrincipal }; },
            async sign(blobToSign) {
                const b64Encoded = Buffer.from(blobToSign).toString('base64');
                const url = https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/\:signBlob;
                const res = await client.request({
                    url: url,
                    method: 'POST',
                    data: { delegates: [], payload: b64Encoded }
                });
                return Buffer.from(res.data.signedBlob, 'base64');
            }
        };

        const storage = new Storage({ authClient: customAuthClient, projectId: 'ai-mall-484810' });
        const bucket = storage.bucket('aisa_objects');
        const file = bucket.file('generated_images/aisa_magic_edit_1775645841172.png');
        
        const [url] = await file.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 60000,
        });
        
        console.log('SIGNED URL IAM:', url);
    } catch(e) {
        console.error('ERROR:', e.message);
        if (e.response) { console.error('RES:', e.response.data); }
    }
}
run();