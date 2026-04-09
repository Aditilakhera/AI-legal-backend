import { GoogleAuth } from 'google-auth-library';
async function test() {
    const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    console.log('Client type:', client.constructor.name);
    console.log('Has sign?', typeof client.sign === 'function');
    if (client.credentials) console.log('Client email:', client.credentials.client_email);
}
test().catch(console.error);