import logger from '../utils/logger.js';
import path from 'path';
import stream from 'stream';
import util from 'util';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import Knowledge from '../models/Knowledge.model.js';
import * as aiService from '../services/ai.service.js';
import { uploadToCloudinary } from '../services/cloudinary.service.js';
import mammoth from 'mammoth';
import xlsx from 'xlsx';
import officeParser from 'officeparser';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const pipeline = util.promisify(stream.pipeline);

// @desc    Upload a document
// @route   POST /api/knowledge/upload
// @access  Public
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const fileBuffer = req.file.buffer;
        const originalName = req.file.originalname;
        const mimeType = req.file.mimetype;
        const fileSize = req.file.size;

        logger.info(`Received file for GCS upload: ${originalName} (${fileSize} bytes)`);

        // 1. Upload to Google Cloud Storage (Vertex AI RAG bucket)
        let gcsUri = null;
        try {
            logger.info("Uploading to Google Cloud Storage (aisa_knowledge_base)...");
            const { Storage } = await import('@google-cloud/storage');
            // Assuming GCP_PROJECT_ID is in env, or it uses Application Default Credentials
            const storageOptions = process.env.GCP_PROJECT_ID ? { projectId: process.env.GCP_PROJECT_ID } : {};
            const storageClient = new Storage(storageOptions);
            const bucketName = 'aisa_knowledge_base';
            const bucket = storageClient.bucket(bucketName);
            const gcsFileName = `${Date.now()}-${originalName.replace(/\s+/g, '_')}`;
            const fileRef = bucket.file(gcsFileName);

            await fileRef.save(fileBuffer, {
                contentType: mimeType,
                resumable: false
            });
            gcsUri = `gs://${bucketName}/${gcsFileName}`;
            logger.info(`GCS Upload Success: ${gcsUri}`);
        } catch (gcsError) {
            logger.error(`GCS Upload Failed: ${gcsError.message}`);
            // Throw the actual error so the frontend stops and reports it
            throw new Error(`Google Cloud Storage Error: ${gcsError.message}`);
        }

        // 2. Dispatch Vertex AI RAG Engine Import (Run asynchronously)
        if (gcsUri) {
            importToVertexRag(gcsUri, originalName).catch(err => {
                logger.error(`Background Vertex RAG error for ${originalName}: ${err.message}`);
            });
        }

        const category = req.body.category || 'General';

        // 3. Always Store Metadata (for listing)
        try {
            await Knowledge.create({
                filename: originalName,
                gcsUri: gcsUri,
                mimetype: mimeType,
                size: fileSize,
                category: category
            });
            logger.info(`Document metadata saved to MongoDB for track. GCS URI: ${gcsUri}`);
        } catch (dbError) {
            logger.error(`MongoDB Save Error: ${dbError.message}`);
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded and sent to Vertex RAG Engine',
            data: {
                filename: originalName,
                gcsUri: gcsUri,
                mimetype: mimeType,
                size: fileSize,
                category: category,
                gcsSuccess: !!gcsUri
            }
        });

    } catch (error) {
        logger.error(`Upload Error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message || 'Server error during upload' });
    }
};

// @desc    Get all uploaded documents
// @route   GET /api/knowledge/documents
// @access  Public
export const getDocuments = async (req, res) => {
    try {
        const documents = await Knowledge.find({}, 'filename uploadDate gcsUri mimetype size category');
        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        logger.error(`Get Documents Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server error fetching documents' });
    }
};

// @desc    Delete a document
// @route   DELETE /api/knowledge/:id
// @access  Public
export const deleteDocument = async (req, res) => {
    try {
        const document = await Knowledge.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        const gcsUri = document.gcsUri;
        const originalName = document.filename;

        // 1. Delete from GCS
        if (gcsUri) {
            try {
                const { Storage } = await import('@google-cloud/storage');
                const storageOptions = process.env.GCP_PROJECT_ID ? { projectId: process.env.GCP_PROJECT_ID } : {};
                const storageClient = new Storage(storageOptions);
                const urlParts = gcsUri.replace('gs://', '').split('/');
                const bucketName = urlParts[0];
                const gcsFileName = urlParts.slice(1).join('/');

                await storageClient.bucket(bucketName).file(gcsFileName).delete();
                logger.info(`Deleted file from GCS: ${gcsUri}`);
            } catch (err) {
                logger.error(`Failed to delete from GCS: ${err.message}`);
            }

            // 2. Delete from Vertex RAG
            deleteFromVertexRag(gcsUri, originalName).catch(err => {
                logger.error(`Background Vertex RAG delete error: ${err.message}`);
            });
        }

        await Knowledge.findByIdAndDelete(req.params.id);

        // Reload Vector Store to remove the document context
        await aiService.reloadVectorStore();

        res.status(200).json({
            success: true,
            message: 'Document deleted and knowledge base updated'
        });
    } catch (error) {
        logger.error(`Delete Document Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server error deleting document' });
    }
};

// @desc    Download/view a document by streaming it from GCS
// @route   GET /api/knowledge/download/:id
// @access  Public
export const downloadDocument = async (req, res) => {
    try {
        const document = await Knowledge.findById(req.params.id);
        if (!document || !document.gcsUri) {
            return res.status(404).send('Document not found');
        }

        const { Storage } = await import('@google-cloud/storage');
        const storageOptions = process.env.GCP_PROJECT_ID ? { projectId: process.env.GCP_PROJECT_ID } : {};
        const storageClient = new Storage(storageOptions);

        const urlParts = document.gcsUri.replace('gs://', '').split('/');
        const bucketName = urlParts[0];
        const gcsFileName = urlParts.slice(1).join('/');

        const file = storageClient.bucket(bucketName).file(gcsFileName);

        res.setHeader('Content-Type', document.mimetype || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${document.filename}"`);

        file.createReadStream()
            .on('error', (err) => {
                logger.error(`Error reading from GCS: ${err.message}`);
                if (!res.headersSent) {
                    res.status(500).send('Error reading file from storage');
                }
            })
            .pipe(res);
    } catch (error) {
        logger.error(`Download Error: ${error.message}`);
        res.status(500).send('Server error streaming document');
    }
};

// --- Helper Functions ---

/**
 * Automatically creates (or finds) a Vertex AI RAG Corpus and triggers
 * the import of a newly uploaded GCS file into that corpus.
 */
async function importToVertexRag(gcsUri, originalName) {
    const projectId = process.env.GCP_PROJECT_ID;
    const location = process.env.GCP_LOCATION || 'asia-south1';
    let corpusId = process.env.VERTEX_RAG_CORPUS_ID;

    logger.info(`[RAG IMPORT DEBUG] Project: ${projectId}, Location: ${location}, Corpus: ${corpusId}`);

    if (!projectId) {
        logger.warn("Skipping Vertex RAG ingestion: GCP_PROJECT_ID is not configured in environment.");
        return;
    }

    try {
        const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        // 1. Check or Create RAG Corpus
        if (!corpusId) {
            logger.info("VERTEX_RAG_CORPUS_ID not set. Checking for 'aisa_Knowlege_Base'...");
            const listUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora`;

            try {
                const listRes = await axios.get(listUrl, {
                    headers: { Authorization: `Bearer ${token.token}` }
                });
                const corpora = listRes.data.ragCorpora || [];
                const existingCorpus = corpora.find(c => c.displayName === 'aisa_knowledge_base');

                if (existingCorpus) {
                    corpusId = existingCorpus.name.split('/').pop();
                    logger.info(`Found existing RAG Corpus ID: ${corpusId}`);
                } else {
                    logger.info("Creating new RAG Corpus: 'aisa_knowledge_base'...");
                    const createRes = await axios.post(listUrl, {
                        displayName: 'aisa_knowledge_base'
                    }, {
                        headers: {
                            Authorization: `Bearer ${token.token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    corpusId = createRes.data.name.split('/').pop();
                    logger.info(`Created new RAG Corpus ID: ${corpusId}.`);
                }
            } catch (corpusErr) {
                logger.error(`Error managing RAG Corpus: ${corpusErr.response?.data?.error?.message || corpusErr.message}`);
                return;
            }
        }

        // 2. Import the GCS file into the Corpus
        const importUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora/${corpusId}/ragFiles:import`;

        const importData = {
            importRagFilesConfig: {
                gcsSource: {
                    uris: [gcsUri]
                }
            }
        };

        const importRes = await axios.post(importUrl, importData, {
            headers: {
                Authorization: `Bearer ${token.token}`,
                'Content-Type': 'application/json'
            }
        });

        logger.info(`[Vertex RAG] Successfully triggered import for '${originalName}' (${gcsUri}) into Corpus '${corpusId}'`);
        // The import response might contain an operation name for tracking
        if (importRes.data?.name) {
            logger.debug(`[Vertex RAG] Import Operation Name: ${importRes.data.name}`);
        }

    } catch (error) {
        logger.error(`[Vertex RAG] Import Error: ${error.response?.data?.error?.message || error.message}`);
    }
}

async function deleteFromVertexRag(gcsUri, originalName) {
    const projectId = process.env.GCP_PROJECT_ID;
    const location = process.env.GCP_LOCATION || 'asia-south1';
    let corpusId = process.env.VERTEX_RAG_CORPUS_ID;

    if (!projectId) return;

    try {
        const { GoogleAuth } = await import('google-auth-library');
        const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
        const client = await auth.getClient();
        const token = await client.getAccessToken();

        if (!corpusId) {
            const listUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora`;
            const listRes = await axios.get(listUrl, { headers: { Authorization: `Bearer ${token.token}` } });
            const corpora = listRes.data.ragCorpora || [];
            const existingCorpus = corpora.find(c => c.displayName === 'aisa_knowledge_base');
            if (existingCorpus) {
                corpusId = existingCorpus.name.split('/').pop();
            } else {
                return;
            }
        }

        const listFilesUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/ragCorpora/${corpusId}/ragFiles`;
        const listFilesRes = await axios.get(listFilesUrl, { headers: { Authorization: `Bearer ${token.token}` } });
        const files = listFilesRes.data.ragFiles || [];

        const gcsFileName = gcsUri.split('/').pop();

        const fileToDelete = files.find(f => {
            return f.displayName === gcsFileName || f.displayName === originalName;
        });

        if (fileToDelete) {
            const delUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/${fileToDelete.name}`;
            await axios.delete(delUrl, { headers: { Authorization: `Bearer ${token.token}` } });
            logger.info(`[Vertex RAG] Deleted file ${fileToDelete.name}`);
        } else {
            logger.info(`[Vertex RAG] Could not find file to delete for ${gcsUri}`);
        }
    } catch (e) {
        logger.error(`[Vertex RAG] Delete Error: ${e.response?.data?.error?.message || e.message}`);
    }
}
