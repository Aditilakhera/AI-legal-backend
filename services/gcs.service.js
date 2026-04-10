import { Storage } from '@google-cloud/storage';
import logger from '../utils/logger.js';
import path from 'path';

// ---------------------------------------------------------------------------
// Google Cloud Storage — aisa_objects bucket
// Uses Application Default Credentials (ADC).
// On GCP (Cloud Run / App Engine) this is automatic.
// Locally: run `gcloud auth application-default login`
// ---------------------------------------------------------------------------

const BUCKET_NAME = 'aisa_objects';

const storageOptions = {
    projectId: process.env.GCP_PROJECT_ID,
};

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credPath) {
    storageOptions.keyFilename = credPath;
}

const storage = new Storage(storageOptions);

const bucket = storage.bucket(BUCKET_NAME);

/**
 * Generates a Signed URL for a GCS object.
 * Default expiration is 7 days (maximum for V4 signing).
 *
 * @param {string} gcsPath - Path within the bucket
 * @param {number} [expiresInMinutes=10080] - (7 days default)
 * @returns {Promise<string>}
 */
import crypto from 'crypto';

export const getSignedUrl = async (gcsPath, expiresInMinutes = 360) => {
    try {
        const targetPrincipal = process.env.VIDEO_SERVICE_ACCOUNT;
        if (!targetPrincipal) {
            // Fallback to standard SDK method if no impersonator is defined
            const file = bucket.file(gcsPath);
            const [url] = await file.getSignedUrl({
                version: 'v4', action: 'read', expires: Date.now() + expiresInMinutes * 60 * 1000
            });
            return url;
        }

        // Custom Native V4 Construction calling IAM SignBlob directly
        const { GoogleAuth } = await import('google-auth-library');
        const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
        const client = await auth.getClient();
        
        const method = 'GET';
        const expiresSeconds = expiresInMinutes * 60;
        const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
        const dateStr = timestamp.substring(0, 8);
        
        const host = 'storage.googleapis.com';
        const canonicalUri = `/${BUCKET_NAME}/${encodeURIComponent(gcsPath).replace(/%2F/g, '/')}`;
        const canonicalQueryString = [
            `X-Goog-Algorithm=GOOG4-RSA-SHA256`,
            `X-Goog-Credential=${encodeURIComponent(targetPrincipal + '/' + dateStr + '/auto/storage/goog4_request')}`,
            `X-Goog-Date=${timestamp}`,
            `X-Goog-Expires=${expiresSeconds}`,
            `X-Goog-SignedHeaders=host`
        ].join('&');
        
        const canonicalRequest = [ method, canonicalUri, canonicalQueryString, `host:${host}\n`, 'host', 'UNSIGNED-PAYLOAD' ].join('\n');
        const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex');
        
        const stringToSign = [
            'GOOG4-RSA-SHA256',
            timestamp,
            `${dateStr}/auto/storage/goog4_request`,
            canonicalRequestHash
        ].join('\n');
        
        const b64Encoded = Buffer.from(stringToSign).toString('base64');
        
        const res = await client.request({
            url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${targetPrincipal}:signBlob`,
            method: 'POST',
            data: { delegates: [], payload: b64Encoded }
        });
        
        const signature = Buffer.from(res.data.signedBlob, 'base64').toString('hex');
        return `https://${host}${canonicalUri}?${canonicalQueryString}&X-Goog-Signature=${signature}`;

    } catch (err) {
        console.error("[GCS NATIVE SIGNING ERROR]", err.response?.data || err);
        logger.error(`[GCS] Failed to generate signed URL natively: ${err.message}`);
        return `https://storage.googleapis.com/${BUCKET_NAME}/${gcsPath}`;
    }
};

/**
 * Uploads a Buffer to the aisa_objects GCS bucket.
 *
 * @param {Buffer}  fileBuffer  - Raw file data
 * @param {Object}  options
 * @param {string}  options.folder      - Logical folder prefix (e.g. 'generated_images')
 * @param {string}  [options.filename]  - Override the filename (without folder)
 * @param {string}  [options.mimeType]  - MIME type (default: 'image/png')
 * @param {boolean} [options.isPublic]  - Make the object publicly readable (default: true)
 * @param {boolean} [options.useSignedUrl] - If true, returns a signed URL instead of the public one
 *
 * @returns {Promise<{ publicUrl: string, gcsPath: string }>}
 */
export const uploadToGCS = async (fileBuffer, options = {}) => {
    const {
        folder = 'uploads',
        filename = `file_${Date.now()}.png`,
        mimeType = 'image/png',
        isPublic = true,
        useSignedUrl = false,
    } = options;

    const gcsPath = `${folder}/${filename}`;
    const file = bucket.file(gcsPath);

    logger.info(`[GCS] Uploading to gs://${BUCKET_NAME}/${gcsPath} ...`);

    await file.save(fileBuffer, {
        metadata: { contentType: mimeType },
        resumable: false,          // small files — single-shot upload
    });

    if (isPublic && !useSignedUrl) {
        try {
            await file.makePublic();
        } catch (err) {
            if (err.message.includes('uniform bucket-level access')) {
                logger.warn(`[GCS] Uniform bucket-level access enabled. Skipping granular makePublic().`);
            } else {
                logger.error(`[GCS] Failed to make file public: ${err.message}`);
            }
        }
    }

    let resultUrl;
    if (useSignedUrl) {
        resultUrl = await getSignedUrl(gcsPath);
    } else {
        resultUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${gcsPath}`;
    }

    logger.info(`[GCS] Upload success → ${resultUrl}`);

    return { publicUrl: resultUrl, gcsPath };
};

/**
 * Convenience: derive a clean filename from an optional base + timestamp.
 * Example: gcsFilename('aisa_magic_edit') → 'aisa_magic_edit_1712345678901.png'
 */
export const gcsFilename = (base = 'file', ext = 'png') =>
    `${base}_${Date.now()}.${ext}`;

export default { uploadToGCS, gcsFilename, getSignedUrl };
