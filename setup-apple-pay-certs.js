/**
 * setup-apple-pay-certs.js
 * ─────────────────────────
 * Run: node setup-apple-pay-certs.js
 *
 * This script:
 * 1. Reads your apple-pay-cert.cer (from Apple Developer)
 * 2. Converts it from DER format to PEM format (Node.js compatible)
 * 3. Copies your private key to the certs/ folder
 * 4. Creates the certs/ directory if it doesn't exist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🍎 Apple Pay Certificate Setup\n' + '─'.repeat(40));

// ── Paths ─────────────────────────────────────────────────────────────────────
const cerPath    = path.join(__dirname, 'apple-pay-cert.cer');         // Input: from Apple
const keyPath    = path.join(__dirname, 'apple-pay-merchant.key');      // Input: generated earlier
const certsDir   = path.join(__dirname, 'certs');
const outCertPem = path.join(certsDir, 'apple-pay-merchant.pem');       // Output: cert PEM
const outKeyPem  = path.join(certsDir, 'apple-pay-merchant.key');       // Output: key copy

// ── Check files exist ─────────────────────────────────────────────────────────
let hasErrors = false;

if (!fs.existsSync(cerPath)) {
    console.error('❌ apple-pay-cert.cer NOT FOUND at:', cerPath);
    console.error('   → Please copy your .cer file from Downloads and rename it to: apple-pay-cert.cer');
    hasErrors = true;
}

if (!fs.existsSync(keyPath)) {
    console.error('❌ apple-pay-merchant.key NOT FOUND at:', keyPath);
    console.error('   → Run: node generate-apple-pay-csr.js first');
    hasErrors = true;
}

if (hasErrors) {
    console.error('\n❗ Fix the above errors and run this script again.\n');
    process.exit(1);
}

// ── Create certs/ directory ───────────────────────────────────────────────────
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
    console.log('✅ Created certs/ directory');
}

// ── Convert .cer (DER format) → .pem (Base64 format) ─────────────────────────
try {
    const derBuffer = fs.readFileSync(cerPath);
    
    // Convert DER binary to Base64 PEM format
    const base64 = derBuffer.toString('base64');
    
    // Split into 64-character lines (PEM standard)
    const lines = base64.match(/.{1,64}/g).join('\n');
    
    const pemContent = `-----BEGIN CERTIFICATE-----\n${lines}\n-----END CERTIFICATE-----\n`;
    
    fs.writeFileSync(outCertPem, pemContent);
    console.log('✅ Certificate converted and saved:', outCertPem);
} catch (err) {
    console.error('❌ Failed to convert .cer file:', err.message);
    process.exit(1);
}

// ── Copy private key to certs/ ────────────────────────────────────────────────
try {
    fs.copyFileSync(keyPath, outKeyPem);
    console.log('✅ Private key copied to:', outKeyPem);
} catch (err) {
    console.error('❌ Failed to copy private key:', err.message);
    process.exit(1);
}

// ── Create .gitignore for certs/ ──────────────────────────────────────────────
const gitignorePath = path.join(certsDir, '.gitignore');
fs.writeFileSync(gitignorePath, '# Apple Pay certificates — NEVER commit these!\n*\n!.gitignore\n');
console.log('✅ .gitignore created in certs/ (certificates will not be committed to git)');

// ── Print next steps ──────────────────────────────────────────────────────────
console.log(`
${'─'.repeat(40)}
🎉 Apple Pay certificates are ready!

Files created:
  📄 certs/apple-pay-merchant.pem  ← Certificate
  🔑 certs/apple-pay-merchant.key  ← Private Key

⚠️  SECURITY REMINDER:
  - NEVER share these files
  - NEVER commit them to GitHub
  - They are protected by .gitignore

Next Steps:
  1. Add domain verification in Apple Developer Console
  2. Download the domain association file
  3. Place it at: public/.well-known/apple-developer-merchantid-domain-association
  4. Deploy to your live server (aimall24.com)
  5. Apple Pay will work on Safari on Apple devices!
${'─'.repeat(40)}
`);
