import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to check if cert and key match
function verifyCertKeyPair(certContent, keyContent) {
    try {
        const privKey = crypto.createPrivateKey(keyContent);
        const pubFromKey = crypto.createPublicKey(privKey).export({ type: 'spki', format: 'der' });
        const pubFromCert = new crypto.X509Certificate(certContent).publicKey.export({ type: 'spki', format: 'der' });
        const keyHash = crypto.createHash('md5').update(pubFromKey).digest('hex');
        const certHash = crypto.createHash('md5').update(pubFromCert).digest('hex');
        return { match: keyHash === certHash, certHash, keyHash };
    } catch (e) {
        return { match: false, error: e.message };
    }
}

// Option 2: Root committed files
const rootCerPath = path.join(__dirname, '../merchant_id.cer');
const rootKeyPath = path.join(__dirname, '../apple-pay-merchant-NEW.key');

console.log('Root CER path exists:', fs.existsSync(rootCerPath));
console.log('Root KEY path exists:', fs.existsSync(rootKeyPath));

if (fs.existsSync(rootCerPath) && fs.existsSync(rootKeyPath)) {
    const derBuffer = fs.readFileSync(rootCerPath);
    const base64 = derBuffer.toString('base64');
    const lines = base64.match(/.{1,64}/g).join('\n');
    const pemContent = `-----BEGIN CERTIFICATE-----\n${lines}\n-----END CERTIFICATE-----\n`;
    const keyContent = fs.readFileSync(rootKeyPath, 'utf8');
    
    const result = verifyCertKeyPair(pemContent, keyContent);
    console.log('Verification result:', result);
}
