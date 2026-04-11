import { Storage } from '@google-cloud/storage';
import { GoogleAuth } from 'google-auth-library';
import crypto from 'crypto';

async function run() {
    try {
        const targetPrincipal = 'video-signer@ai-mall-484810.iam.gserviceaccount.com';
        const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
        const client = await auth.getClient();
        
        const storage = new Storage({ authClient: client, projectId: 'ai-mall-484810' });
        const bucket = storage.bucket('aisa_objects');
        const file = bucket.file('generated_images/aisa_magic_edit_1775645841172.png');
        
        // Use custom IAM signer
        async function customSigner(blobToSign) {
            const B64_ENCODED = Buffer.from(blobToSign).toString('base64');
            const res = await client.request({
                url: \https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/\:signBlob\,
                method: 'POST',
                data: { delegates: [], payload: B64_ENCODED }
            });
            return Buffer.from(res.data.signedBlob, 'base64');
        }

        const [url] = await file.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 60000,
            serviceAccountEmail: targetPrincipal,
            extensionHeaders: {
                'x-goog-custom-time': '2022-01-01T00:00:00Z',
            }
        });
        
        console.log('SIGNED URL IAM:', url);
    } catch(e) {
        console.error('ERROR:', e.message);
    }
}
run();