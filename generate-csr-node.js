/**
 * generate-csr-node.js
 * Generates Apple Pay Merchant Identity CSR using pure Node.js (no OpenSSL needed)
 * Run: node generate-csr-node.js
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🍎 Generating Apple Pay CSR...\n');

// ── Generate RSA 2048 key pair ────────────────────────────────────────────────
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding:  { type: 'spki',   format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8',  format: 'pem' }
});

// Save private key
const keyPath = path.join(__dirname, 'apple-pay-merchant-NEW.key');
fs.writeFileSync(keyPath, privateKey);
console.log('✅ Private key saved:', keyPath);

// ── Build ASN.1 CSR manually ─────────────────────────────────────────────────
// Subject: CN=merchant.com.aisa24.pay, O=Unified Web Options, C=IN
function encodeAsn1Length(len) {
    if (len < 128) return Buffer.from([len]);
    if (len < 256) return Buffer.from([0x81, len]);
    return Buffer.from([0x82, (len >> 8) & 0xff, len & 0xff]);
}

function asn1Seq(content) {
    const buf = Buffer.isBuffer(content) ? content : Buffer.concat(content);
    return Buffer.concat([Buffer.from([0x30]), encodeAsn1Length(buf.length), buf]);
}

function asn1Set(content) {
    const buf = Buffer.isBuffer(content) ? content : Buffer.concat(content);
    return Buffer.concat([Buffer.from([0x31]), encodeAsn1Length(buf.length), buf]);
}

function asn1Utf8(str) {
    const s = Buffer.from(str, 'utf8');
    return Buffer.concat([Buffer.from([0x0c]), encodeAsn1Length(s.length), s]);
}

function asn1PrintableString(str) {
    const s = Buffer.from(str, 'ascii');
    return Buffer.concat([Buffer.from([0x13]), encodeAsn1Length(s.length), s]);
}

function asn1OID(oidStr) {
    const parts = oidStr.split('.').map(Number);
    const encoded = [parts[0] * 40 + parts[1]];
    for (let i = 2; i < parts.length; i++) {
        let v = parts[i];
        const bytes = [];
        bytes.unshift(v & 0x7f);
        v >>= 7;
        while (v > 0) { bytes.unshift((v & 0x7f) | 0x80); v >>= 7; }
        encoded.push(...bytes);
    }
    const buf = Buffer.from(encoded);
    return Buffer.concat([Buffer.from([0x06]), encodeAsn1Length(buf.length), buf]);
}

function rdnAttr(oidStr, value, printable = false) {
    const oid = asn1OID(oidStr);
    const val = printable ? asn1PrintableString(value) : asn1Utf8(value);
    const attrSeq = asn1Seq(Buffer.concat([oid, val]));
    return asn1Set(attrSeq);
}

// Subject attributes
const subjectName = asn1Seq(Buffer.concat([
    rdnAttr('2.5.4.6',  'IN',  true),                        // C
    rdnAttr('2.5.4.10', 'Unified Web Options'),               // O
    rdnAttr('2.5.4.3',  'merchant.com.aisa24.pay'),           // CN
]));

// Public key info from the generated key
const pubKeyDer = crypto.createPublicKey(publicKey).export({ type: 'spki', format: 'der' });
const pubKeyInfo = Buffer.from(pubKeyDer);

// Extensions placeholder (none)
const attrs = Buffer.concat([Buffer.from([0xa0, 0x00])]);

// CertificationRequestInfo
const csrInfo = asn1Seq(Buffer.concat([
    Buffer.from([0x02, 0x01, 0x00]),  // version = 0
    subjectName,
    pubKeyInfo,
    attrs
]));

// Sign with SHA-256
const sign = crypto.createSign('SHA256');
sign.update(csrInfo);
const signature = sign.sign(privateKey);

// SHA256withRSA OID: 1.2.840.113549.1.1.11
const sigAlgSeq = asn1Seq(Buffer.concat([
    asn1OID('1.2.840.113549.1.1.11'),
    Buffer.from([0x05, 0x00])  // NULL
]));

// Bit string for signature
const sigBitString = Buffer.concat([
    Buffer.from([0x03]),
    encodeAsn1Length(signature.length + 1),
    Buffer.from([0x00]),
    signature
]);

// Full CSR DER
const csrDer = asn1Seq(Buffer.concat([csrInfo, sigAlgSeq, sigBitString]));

// Convert to PEM
const csrB64 = csrDer.toString('base64').match(/.{1,64}/g).join('\n');
const csrPem = `-----BEGIN CERTIFICATE REQUEST-----\n${csrB64}\n-----END CERTIFICATE REQUEST-----\n`;

const csrPath = path.join(__dirname, 'apple-pay-merchant-NEW.csr');
fs.writeFileSync(csrPath, csrPem);

console.log('✅ CSR saved:', csrPath);
console.log('\n🎯 Upload this file to Apple Developer Console:');
console.log('   📄', csrPath);
console.log('\n⚠️  Keep this file SAFE — you need the .key to match the .cer Apple gives you!');
console.log('\n📂 Files created:');
console.log('   🔑 apple-pay-merchant-NEW.key  ← Private Key (NEVER share)');
console.log('   📄 apple-pay-merchant-NEW.csr  ← Upload to Apple Developer Portal');
