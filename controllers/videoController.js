import axios from 'axios';
import logger from '../utils/logger.js';
import { GoogleAuth } from 'google-auth-library';
import { uploadToCloudinary } from '../services/cloudinary.service.js';
import { Storage } from '@google-cloud/storage';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import GeneratedVideo from '../models/GeneratedVideo.js';
import { subscriptionService } from '../services/subscriptionService.js';
import { selectVideoModel } from '../services/modelSelector.js';
import { executeVideoPipeline } from '../services/generationPipeline.js';

// Initialize Google Cloud Storage
// In production (App Engine), uses the App Engine default service account (ADC) automatically.
// Locally, uses gcloud auth application-default login credentials.
let storage;
try {
  const storageOptions = { projectId: process.env.GCP_PROJECT_ID };
  // Use service account key file if available (local dev or explicit config)
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath) {
    storageOptions.keyFilename = credPath;
  }
  storage = new Storage(storageOptions);
  logger.info('[GCS] Storage initialized' + (credPath ? ` with key file: ${credPath}` : ' with ADC (App Engine service account in prod)'));
} catch (err) {
  logger.warn(`[GCS] Failed to initialize Google Cloud Storage: ${err.message}`);
}

import { refineBrandPrompt } from '../utils/brandIdentity.js';

// Video generation using external APIs (e.g., Replicate, Runway, or similar)
export const generateVideo = async (req, res) => {
  try {
    let { prompt, duration = 5, quality = 'fast', aspectRatio, modelId } = req.body;
    let imageFile = req.file;
    const userId = req.user?.id;

    let finalAspectRatio = aspectRatio || '16:9';
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });

    const isPremium = req.user?.isPremium || false;
    const resolvedModelId = selectVideoModel(modelId, quality, isPremium);

    // 1. Prepare assets if any (Keep existing GCS upload for Veo)
    let imageGcsUri = null;
    let imageMimeType = null;
    if (imageFile) {
        const bucketName = 'aisageneratedvideo';
        const fileName = `uploads/img_${uuidv4()}_${imageFile.originalname}`;
        const fileRef = storage.bucket(bucketName).file(fileName);
        await fileRef.save(imageFile.buffer, { metadata: { contentType: imageFile.mimetype } });
        imageGcsUri = `gs://${bucketName}/${fileName}`;
        imageMimeType = imageFile.mimetype;
    }

    // 2. Execute via Pipeline
    const pipelineResult = await executeVideoPipeline(
        prompt,
        async (refinedPrompt, activeModel) => {
            return await generateVideoFromPrompt(
                refinedPrompt, duration, quality, finalAspectRatio, 
                activeModel, '1080p', imageGcsUri, imageMimeType
            );
        },
        {
            modelId: resolvedModelId,
            enhance: true
        }
    );

    const videoUrl = pipelineResult.url;
    if (!videoUrl) throw new Error('Generation failed to return a URL');

    // 💰 Deduct credits
    if (req.creditMeta && req.creditMeta.cost > 0) {
      await subscriptionService.deductCreditsFromMeta(req.creditMeta);
    }

    // Save to database
    if (userId) {
      await GeneratedVideo.create({
        userId,
        prompt: pipelineResult.finalPrompt,
        videoUrl,
        originalImage: imageGcsUri,
        aspectRatio: finalAspectRatio,
        duration,
        modelId: pipelineResult.modelId,
        status: 'completed'
      }).catch(e => logger.error(`[VIDEO DB ERROR] ${e.message}`));
    }

    return res.status(200).json({
      success: true,
      videoUrl,
      prompt: pipelineResult.finalPrompt,
      modelUsed: pipelineResult.modelId
    });

  } catch (error) {
    logger.error(`[VIDEO ERROR] ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function to generate video using Vertex AI (Veo Model) via @google/genai
// Removed `createImpersonatedStorageClient` and `getVideoSignedUrl` as we now upload to Cloudinary


export const generateVideoFromPrompt = async (prompt, duration, quality, aspectRatio = '16:9', selectedModelId = 'veo-3.1-fast-generate-001', resolution = '1080p', imageGcsUri = null, imageMimeType = null) => {
  const logDebug = (msg) => {
    try { fs.appendFileSync('debug_video.log', `${new Date().toISOString()} - ${msg}\n`); } catch (e) { }
  };

  try {
    const projectId = process.env.GCP_PROJECT_ID;
    const location = 'us-central1';
    const bucketName = 'aisageneratedvideo';

    logDebug(`Starting generation for prompt: ${prompt}`);
    logger.info(`[VIDEO] Starting generation flow via Vertex AI (Standard ADC)...`);

    // 1. INITIALIZE VERTEX AI CLIENT (Standard ADC)
    const client = new GoogleGenAI({
      vertexai: true,
      project: projectId,
      location: location,
    });

    // 2. PREPARE OUTPUT URI
    const fileName = `${uuidv4()}.mp4`;
    const outputGcsUri = `gs://${bucketName}/${fileName}`;
    logDebug(`Output URI: ${outputGcsUri}`);
    logger.info(`[VIDEO] Output URI: ${outputGcsUri}`);

    // Guard against 4k failing on fast models
    if (resolution === '4k' && selectedModelId.includes('fast')) {
      logger.warn("[VIDEO] 4K is not supported on Fast models. Falling back to 1080p.");
      resolution = '1080p';
    }

    // 3. START GENERATION
    let generationConfig = {
      model: selectedModelId,
      prompt: prompt,
      config: {
        resolution: resolution, // Supported in 2026: "720p", "1080p", "4k"
        aspectRatio: aspectRatio,
        outputGcsUri: outputGcsUri,
        // Optional crop mode will be set below if image-to-video
        
        // Using lowercase 'allow_all' as required by @google/genai enum, although 
        // child-safety blocks may still apply if the GCP project isn't specifically whitelisted.
        personGeneration: 'allow_all',
      },
    };

    if (imageGcsUri && imageMimeType) {
        generationConfig.config.resizeMode = "crop"; // Optimize mapping for image to video
    }

    if (imageGcsUri && imageMimeType) {
      generationConfig.image = {
        gcsUri: imageGcsUri,
        mimeType: imageMimeType,
      };
    }

    let operation = await client.models.generateVideos(generationConfig);

    logDebug(`Operation started: ${operation.name}`);
    logger.info(`[VIDEO] Operation started (Name: ${operation.name}). Polling...`);

    // 4. POLL FOR COMPLETION
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 15000)); // 15s interval
      operation = await client.operations.get({ operation: operation });
      logDebug(`Polling status: ${operation.done ? 'Done' : 'In Progress'}`);
      logger.info(`[VIDEO] Polling status: ${operation.done ? 'Done' : 'In Progress'}`);
    }

    // 5. CHECK FOR ERRORS
    if (operation.error) {
      logDebug(`Operation Error: ${JSON.stringify(operation.error)}`);
      logger.error(`[VIDEO] Operation Error: ${JSON.stringify(operation.error, null, 2)}`);
      throw new Error(`Video generation failed: ${operation.error.message || 'Unknown error from Vertex AI'}`);
    }

    // 6. PROCESS SUCCESS RESPONSE
    if (operation.response && operation.response.generatedVideos && operation.response.generatedVideos.length > 0) {
      const videoUri = operation.response.generatedVideos[0].video.uri;
      logDebug(`Generation complete. URI: ${videoUri}`);
      logger.info(`[VIDEO] Generation complete. GCS URI: ${videoUri}`);

      // GCS URI actual path (may be nested like uuid.mp4/number/sample_0.mp4)
      const bucketPrefix = `gs://${bucketName}/`;
      let finalFileName = fileName;
      if (videoUri.startsWith(bucketPrefix)) {
        finalFileName = videoUri.slice(bucketPrefix.length);
      }

      logDebug(`Processing video: ${finalFileName}`);
      logger.info(`[VIDEO] Processing video: ${finalFileName}`);

      // 7. DELIVERY STRATEGY: Use shared GCS SDK client (ADC) to download → Cloudinary upload
      // In production (App Engine), ADC = App Engine default service account auto-auth
      // In local dev, ADC = gcloud auth application-default login
      try {
        logDebug(`Attempting GCS SDK download via ADC (project: ${projectId})...`);
        logger.info(`[VIDEO] Attempting GCS SDK download → Cloudinary upload... (ENV: ${process.env.NODE_ENV || 'development'})`);

        // Reuse module-level storage client (already initialized with correct credentials)
        const fileRef = storage.bucket(bucketName).file(finalFileName);

        // Download to memory buffer using SDK (internally uses ADC OAuth token)
        const [fileBuffer] = await fileRef.download({ timeout: 180000 });

        logDebug(`GCS SDK download success (${fileBuffer.byteLength} bytes). Uploading to Cloudinary...`);
        logger.info(`[VIDEO] Downloaded ${fileBuffer.byteLength} bytes. Uploading to Cloudinary...`);

        const cloudResult = await uploadToCloudinary(fileBuffer, {
          folder: 'generated_videos',
          resource_type: 'video',
          public_id: `aisa_vid_${Date.now()}`,
        });

        const url = cloudResult.secure_url;
        logDebug(`Success! Cloudinary URL: ${url}`);
        logger.info(`[VIDEO] Successfully uploaded to Cloudinary: ${url}`);
        return url;

      } catch (downloadError) {
        logDebug(`GCS SDK download failed: ${downloadError.message} (code: ${downloadError.code}) — trying makePublic fallback...`);
        logger.warn(`[VIDEO] GCS SDK download failed [${downloadError.code}]: ${downloadError.message}`);
        logger.warn(`[VIDEO] HINT: In production, grant 'Storage Object Admin' role to App Engine service account: ${projectId}@appspot.gserviceaccount.com on bucket '${bucketName}'`);

        // Fallback: makePublic → return direct public GCS URL (no download needed)
        try {
          const fileRef = storage.bucket(bucketName).file(finalFileName);

          logDebug(`Attempting makePublic()...`);
          logger.info(`[VIDEO] Attempting makePublic() on GCS file...`);
          await fileRef.makePublic();

          const publicUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(finalFileName)}`;
          logDebug(`makePublic success! Public URL: ${publicUrl}`);
          logger.info(`[VIDEO] makePublic success! URL: ${publicUrl}`);
          return publicUrl;

        } catch (makePublicError) {
          logDebug(`makePublic also failed: ${makePublicError.message}`);
          logger.error(`[VIDEO] makePublic also failed: ${makePublicError.message}`);
          throw new Error(
            `[PRODUCTION FIX NEEDED] Video was generated on GCS (${videoUri}) but delivery failed. ` +
            `Grant 'Storage Object Admin' role to service account '${projectId}@appspot.gserviceaccount.com' ` +
            `on bucket '${bucketName}' in Google Cloud Console → IAM & Admin.`
          );
        }
      }

    } else {
      logDebug(`No videos returned. Full op: ${JSON.stringify(operation)}`);
      logger.error(`[VIDEO] Operation returned no videos. full op: ${JSON.stringify(operation, null, 2)}`);
      throw new Error('Video generation completed but returned no results.');
    }

  } catch (error) {
    logger.error(`[VERTEX VIDEO ERROR] ${error.message}`);
    try { fs.appendFileSync('debug_video.log', `${new Date().toISOString()} - ERROR: ${error.message}\n`); } catch (e) { }
    return null;
  }
};

// Poll Replicate for video generation result
const pollReplicateResult = async (predictionId, apiKey, maxAttempts = 60) => {
  try {
    for (let i = 0; i < maxAttempts; i++) {
      // ... (implementation preserved if needed, or can be removed if unused)
      // Since I removed the call to this, I can also remove this function or leave it as utility
      const response = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${apiKey}`
          }
        }
      );

      if (response.data.status === 'succeeded') {
        return response.data.output?.[0] || null;
      } else if (response.data.status === 'failed') {
        throw new Error('Video generation failed on server');
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Video generation timeout');
  } catch (error) {
    logger.error(`[POLL ERROR] ${error.message}`);
    throw error;
  }
};

// Get video generation status
export const getVideoStatus = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Video ID is required'
      });
    }

    // You would implement status tracking based on your video service
    // This is a placeholder implementation

    return res.status(200).json({
      success: true,
      status: 'completed',
      videoId: videoId
    });

  } catch (error) {
    logger.error(`[VIDEO STATUS ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to get video status'
    });
  }
};

// Download video through backend proxy to bypass CORS
export const downloadVideo = async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ success: false, message: 'Video URL is required' });
    }

    const response = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', 'attachment; filename="aisa-generated-video.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    response.data.pipe(res);
  } catch (error) {
    logger.error(`[DOWNLOAD ERROR] Failed to download video: ${error.message}`);
    res.status(500).json({ success: false, message: 'Failed to download video' });
  }
};

export const getVideoHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { type } = req.query;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let filter = { userId };

    // Distinguish between Text-to-Video and Image-to-Video based on originalImage
    if (type === 'imageToVideo') {
      filter.originalImage = { $ne: null, $exists: true };
    } else if (type === 'textToVideo') {
      filter.originalImage = { $in: [null, undefined] };
    }

    const history = await GeneratedVideo.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    logger.error(`[VIDEO HISTORY ERROR] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch video history'
    });
  }
};
