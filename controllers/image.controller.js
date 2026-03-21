import { uploadToCloudinary } from '../services/cloudinary.service.js';
import axios from 'axios';
import logger from '../utils/logger.js';
import { GoogleAuth } from 'google-auth-library';
import { refineBrandPrompt } from '../utils/brandIdentity.js';
import { getConfig } from '../services/configService.js';
import { subscriptionService } from '../services/subscriptionService.js';

// -------------------------------------------------------------------
// Smart editMode detection for imagen-3.0-capability-001
// Supported modes: bgremoval, product-image, outpainting,
//                  inpainting-insert, inpainting-remove
// -------------------------------------------------------------------
const detectEditMode = (prompt) => {
    const lower = prompt.toLowerCase();

    if (/remove\s+background|background\s+remove|bg\s+remove|remove\s+bg|transparent\s+background|background\s+hatao|bg\s+hatao/.test(lower)) {
        return 'bgremoval';
    }
    if (/product|white\s+background|studio\s+shot|clean\s+background/.test(lower)) {
        return 'product-image';
    }
    if (/expand|extend|outpaint|wider|larger|zoom\s+out/.test(lower)) {
        return 'outpainting';
    }
    if (/remove|delete|erase|hata\s+do|hata|mitao/.test(lower)) {
        return 'inpainting-remove';
    }
    // Default: add / modify something in the image
    return 'inpainting-insert';
};

// -------------------------------------------------------------------
// Core Vertex AI helper — used by both chat and API endpoints
// -------------------------------------------------------------------
export const generateImageFromPrompt = async (prompt, originalImage = null, aspectRatio = '1:1', selectedModelId = 'imagen-3.0-generate-001') => {
    try {
        console.log(`[VERTEX IMAGE] Triggered for: "${prompt}" (Edit: ${!!originalImage}, Ratio: ${aspectRatio})`);

        if (!process.env.GCP_PROJECT_ID) {
            console.warn('[VERTEX IMAGE] Missing GCP_PROJECT_ID');
            throw new Error('Missing GCP_PROJECT_ID');
        }

        // Auth: uses ADC (gcloud auth application-default login) or
        //       GOOGLE_APPLICATION_CREDENTIALS if explicitly set
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
            projectId: process.env.GCP_PROJECT_ID
        });

        const client = await auth.getClient();
        const projectId = await auth.getProjectId();
        const { token } = await client.getAccessToken();
        const location = 'us-central1';
        const callVertex = async (modelId) => {
            const isGemini = modelId.startsWith('gemini-');
            const method = isGemini ? 'generateContent' : 'predict';
            const endpoint =
                `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}` +
                `/locations/${location}/publishers/google/models/${modelId}:${method}`;

            console.log(`[VERTEX] Calling ${modelId} (${originalImage ? 'edit' : 'generate'}) via ${method}...`);

            let payload;
            if (isGemini) {
                // Gemini "Nano Banana" Style Structure
                let finalPrompt = prompt;
                if (originalImage) {
                    const systemInstruction = getConfig('IMAGE_EDIT_INSTRUCTIONS', `You are an advanced AI image editing assistant. Return only the edited image.`);
                    finalPrompt = `${systemInstruction}\n\nUser Request: ${prompt}`;
                }

                const parts = [{ text: finalPrompt }];
                if (originalImage) {
                    let base64Data = typeof originalImage === 'string'
                        ? originalImage
                        : (originalImage.base64Data || originalImage.image || originalImage.data);

                    if (typeof base64Data === 'string' && base64Data.includes('base64,')) {
                        base64Data = base64Data.split('base64,')[1];
                    }

                    parts.push({
                        inlineData: {
                            mimeType: 'image/png',
                            data: base64Data
                        }
                    });
                }
                payload = { contents: [{ parts }] };

                // Optional: Add generation config for safety/guidance if supported by the specific model
                payload.generationConfig = {
                    candidateCount: 1,
                    // guidanceScale: 25.0 // Some Gemini-image versions might use this
                };
            } else {
                // Imagen Style Structure
                let instanceStruct = { prompt };
                let paramStruct = {
                    sampleCount: 1,
                    guidanceScale: 25.0,
                    personGeneration: 'allow_all'
                };

                if (originalImage) {
                    let base64Data = typeof originalImage === 'string'
                        ? originalImage
                        : (originalImage.base64Data || originalImage.image || originalImage.data);

                    if (typeof base64Data === 'string' && base64Data.includes('base64,')) {
                        base64Data = base64Data.split('base64,')[1];
                    }

                    const rawEditMode = detectEditMode(prompt);
                    instanceStruct.referenceImages = [
                        {
                            referenceType: 'REFERENCE_TYPE_RAW',
                            referenceId: 1,
                            referenceImage: { bytesBase64Encoded: base64Data }
                        }
                    ];
                    paramStruct.editConfig = { editMode: rawEditMode };
                } else {
                    let vertexRatio = '1:1';
                    if (aspectRatio === '16:9') vertexRatio = '16:9';
                    else if (aspectRatio === '4:5') vertexRatio = '3:4';
                    else if (aspectRatio === '4:7') vertexRatio = '9:16';
                    paramStruct.aspectRatio = vertexRatio;
                }
                payload = { instances: [instanceStruct], parameters: paramStruct };
            }

            return axios.post(
                endpoint,
                payload,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 60000 }
            );
        };

        // Model selection:
        // User requested "Nano Banana" (gemini-2.5-flash-image) for editing.
        const primaryModel = originalImage ? 'gemini-2.5-flash-image' : selectedModelId;
        const fallbackModel = originalImage ? 'imagen-3.0-capability-001' : (selectedModelId === 'imagen-4.0-ultra-generate-001' ? 'imagen-3.0-generate-001' : 'imagen-3.0-generate-002');

        let response;
        let usedModel = primaryModel;

        try {
            response = await callVertex(primaryModel);
        } catch (err) {
            const detail = err.response?.data?.error?.message || err.message;
            console.warn(`[VERTEX] ${primaryModel} failed: ${detail}`);

            if (fallbackModel) {
                console.warn(`[VERTEX] Trying fallback model: ${fallbackModel}`);
                usedModel = fallbackModel;
                response = await callVertex(fallbackModel);
            } else {
                throw err;
            }
        }

        console.log(`[VERTEX RESPONSE] HTTP ${response.status} from ${usedModel}`);

        // Parsing prediction based on model type
        let base64Data = null;
        if (usedModel.startsWith('gemini-')) {
            const candidate = response.data?.candidates?.[0];
            const part = candidate?.content?.parts?.find(p => p.inlineData);
            base64Data = part?.inlineData?.data;
        } else {
            const prediction = response.data?.predictions?.[0];
            base64Data = prediction?.bytesBase64Encoded || (typeof prediction === 'string' ? prediction : null);
        }

        if (base64Data) {
            console.log(`[CLOUDINARY] Uploading result from ${usedModel}...`);
            const buffer = Buffer.from(base64Data, 'base64');
            const cloudResult = await uploadToCloudinary(buffer, {
                folder: 'generated_images',
                public_id: `aisa_${originalImage ? 'edit' : 'gen'}_${Date.now()}`
            });

            if (cloudResult?.secure_url) {
                console.log(`[IMAGE SUCCESS] ${cloudResult.secure_url}`);
                return cloudResult.secure_url;
            }
        }

        throw new Error(`Vertex AI (${usedModel}) returned no image data.`);

    } catch (error) {
        const errorMsg = error.message || 'Unknown error';
        const vertexMsg = error.response?.data?.error?.message || errorMsg;

        if (originalImage) {
            console.error(`[VERTEX EDIT FAILED] ${vertexMsg}`);
            throw new Error(`Image modification failed: ${vertexMsg}`);
        }

        console.error(`[VERTEX GEN FAILED] ${vertexMsg}`);
        throw new Error(`Google Vertex AI Image Generation Failed: ${vertexMsg}`);
    }
};

// -------------------------------------------------------------------
// @route  POST /api/image/generate
// -------------------------------------------------------------------
export const generateImage = async (req, res, next) => {
    try {
        let { prompt, aspectRatio = '1:1', modelId = 'imagen-3.0-generate-001' } = req.body || {};

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }

        prompt = refineBrandPrompt(prompt, 'image');
        if (logger && logger.info) logger.info(`[Image Generation] "${prompt}" (Ratio: ${aspectRatio}, Model: ${modelId})`);
        else console.log(`[Image Generation] "${prompt}" (Ratio: ${aspectRatio}, Model: ${modelId})`);

        const imageUrl = await generateImageFromPrompt(prompt, null, aspectRatio, modelId);
        if (!imageUrl) throw new Error('Failed to retrieve image URL.');

        // 💰 Deduct credits on successful output
        if (req.creditMeta && req.creditMeta.cost > 0) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.status(200).json({ success: true, data: imageUrl });
    } catch (error) {
        logger?.error
            ? logger.error(`[Image Generation] Error: ${error.message}`)
            : console.error('[Image Generation] Error:', error);
        res.status(500).json({ success: false, message: `Image generation failed: ${error.message}` });
    }
};

// -------------------------------------------------------------------
// @route  POST /api/image/edit
// -------------------------------------------------------------------
export const editImage = async (req, res, next) => {
    try {
        const { prompt, imageUrl, imageBase64, modelId = 'imagen-3.0-generate-001', aspectRatio = '1:1' } = req.body || {};

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Editing prompt is required' });
        }
        if (!imageUrl && !imageBase64) {
            return res.status(400).json({ success: false, message: 'Image (URL or Base64) is required for editing' });
        }

        console.log(`[Image Editing] Processing: "${prompt}"`);

        let imageToProcess = imageBase64;

        if (imageUrl && !imageToProcess) {
            if (imageUrl.startsWith('data:')) {
                imageToProcess = imageUrl.split(',')[1];
            } else {
                try {
                    const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                    imageToProcess = Buffer.from(resp.data).toString('base64');
                } catch (err) {
                    throw new Error(`Failed to fetch source image: ${err.message}`);
                }
            }
        }

        if (!imageToProcess) {
            return res.status(400).json({ success: false, message: 'Valid image data required' });
        }

        const modifiedImageUrl = await generateImageFromPrompt(prompt, imageToProcess, aspectRatio, modelId);
        if (!modifiedImageUrl) throw new Error('Failed to retrieve modified image URL.');

        // 💰 Deduct credits on successful output
        if (req.creditMeta && req.creditMeta.cost > 0) {
            await subscriptionService.deductCreditsFromMeta(req.creditMeta);
        }

        res.status(200).json({ success: true, data: modifiedImageUrl });
    } catch (error) {
        console.error(`[Image Editing] Error: ${error.message}`);
        res.status(500).json({ success: false, message: `Image editing failed: ${error.message}` });
    }
};
