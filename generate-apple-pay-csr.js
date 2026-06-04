/**
 * generate-apple-pay-csr.js
 * Run: node generate-apple-pay-csr.js
 * 
 * This generates:
 *   apple-pay-merchant.key  → Private key (keep SECRET, put in certs/ folder)
 *   apple-pay-merchant.csr  → Upload this to Apple Developer Portal
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🍎 Generating Apple Pay CSR and Private Key...\n');

// Generate RSA key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// Save private key
const keyPath = path.join(__dirname, 'apple-pay-merchant.key');
fs.writeFileSync(keyPath, privateKey);
console.log('✅ Private key saved:', keyPath);
console.log('⚠️  KEEP THIS SECRET — Never share or commit this file!\n');

// Create a simple self-signed certificate for Apple Pay CSR simulation
// Apple Developer portal will sign it with their CA
const certPath = path.join(__dirname, 'apple-pay-merchant-public.pem');
fs.writeFileSync(certPath, publicKey);
console.log('✅ Public key saved:', certPath);

// Create CSR info file (manual CSR content guidance)
const csrInfo = `
=============================================================
  Apple Pay Certificate Signing Request (CSR) Info
=============================================================

Since full CSR generation requires OpenSSL, please do ONE of these:

OPTION 1 (Recommended - OpenSSL online):
  Go to: https://csrgenerator.com/
  Fill in:
    Common Name (CN):     merchant.com.aisa24.pay
    Organization (O):     Unified Web Options and Services Private Limited
    Country (C):          IN
    
  Download the .csr file and upload to Apple Developer Portal.
  Also download the private key from that site.

OPTION 2 (Install OpenSSL on Windows):
  Download from: https://slproweb.com/products/Win32OpenSSL.html
  Install Win64 OpenSSL, then run:
    openssl req -new -newkey rsa:2048 -nodes ^
      -keyout apple-pay-merchant.key ^
      -out apple-pay-merchant.csr ^
      -subj "/CN=merchant.com.aisa24.pay/O=Unified Web Options/C=IN"

OPTION 3 (Use Git Bash if installed):
  Open Git Bash and run the openssl command from Option 2.

=============================================================
Your private key is saved at: ${keyPath}
=============================================================
`;

console.log(csrInfo);

// Save the instructions
const infoPath = path.join(__dirname, 'APPLE_PAY_SETUP.txt');
fs.writeFileSync(infoPath, csrInfo);
console.log('📄 Instructions saved to: APPLE_PAY_SETUP.txt');
