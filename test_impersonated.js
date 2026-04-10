import { Storage } from '@google-cloud/storage';
import { GoogleAuth, Impersonated } from 'google-auth-library';

async function run() {
    try {
        const targetPrincipal = 'video-signer@ai-mall-484810.iam.gserviceaccount.com';
        const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
        const sourceClient = await auth.getClient();
        
        const impersonatedClient = new Impersonated({
            sourceClient,
            targetPrincipal,
            lifetime: 3600,
            delegates: [],
            targetScopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        // Test explicit sign auth
        await impersonatedClient.getAccessToken(); // Ensure it can impersonate
        console.log('Impersonated token acquired.');

        const storage = new Storage({ authClient: impersonatedClient, projectId: 'ai-mall-484810' });
        const bucket = storage.bucket('aisa_objects');
        const file = bucket.file('generated_images/aisa_magic_edit_1775645841172.png');
        
        const [url] = await file.getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 60000,
            // we might need to explicitly pass this when using IAM credentials API
        });
        
        console.log('SIGNED URL:', url);
    } catch(e) {
        console.error('ERROR:', e.message);
        console.error(e.stack);
    }
}
run();