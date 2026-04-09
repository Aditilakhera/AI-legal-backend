import express from 'express';
import { Storage } from '@google-cloud/storage';
import logger from '../utils/logger.js';

const router = express.Router();

// Initialize minimal GCS client for reading
const storageOptions = {
    projectId: process.env.GCP_PROJECT_ID,
};

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (credPath) {
    storageOptions.keyFilename = credPath;
}
const storage = new Storage(storageOptions);
const bucket = storage.bucket('aisa_objects');

/**
 * GET /api/storage/view?path=...
 * Streams a private file from GCS to the client.
 */
router.get('/view', async (req, res) => {
    try {
        const { path } = req.query;

        if (!path) {
            return res.status(400).send('Path is required');
        }

        // Basic security check (only allow paths we expect)
        if (!path.startsWith('generated_images/') && !path.startsWith('generated_videos/') && !path.startsWith('chat_uploads/')) {
            return res.status(403).send('Forbidden directory');
        }

        const file = bucket.file(path);

        // Check if file exists to prevent hard crash on piping non-existent file
        const [exists] = await file.exists();
        if (!exists) {
            logger.warn(`[STORAGE PROXY] File not found: ${path}`);
            return res.status(404).send('File not found');
        }

        // Get metadata to set correct Content-Type (e.g. image/png, video/mp4)
        const [metadata] = await file.getMetadata();
        if (metadata.contentType) {
            res.setHeader('Content-Type', metadata.contentType);
        }

        // Stream the file directly to the response
        const readStream = file.createReadStream();
        
        readStream.on('error', (err) => {
            logger.error(`[STORAGE PROXY] Error reading stream for ${path}:`, err.message);
            if (!res.headersSent) {
                res.status(500).send('Error retrieving file');
            }
        });

        readStream.pipe(res);

    } catch (err) {
        logger.error(`[STORAGE PROXY] Internal error:`, err);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
