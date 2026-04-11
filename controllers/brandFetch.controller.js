import * as brandProcessor from '../services/brandProcessor.service.js';
import logger from '../utils/logger.js';
import { uploadToGCS } from '../services/socialAgent.service.js';
import UploadAsset from '../models/UploadAsset.js';
import BrandProfile from '../models/BrandProfile.js';

/**
 * Stage 4: THE REAL MAGIC — Website-to-DNA Synthesis
 * Returns an auto-fill preview WITHOUT saving to DB.
 */
/**
 * Stage 4: THE REAL MAGIC — Website-to-DNA Synthesis
 * Returns an auto-fill preview WITHOUT saving to DB.
 */
export const fetchBrandAssets = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Website URL is required." });
    }

    console.log(`[Real Magic] Synthesizing DNA for: ${url}`);

    // Process Identity (Stage 1 logic but as a read-only fetch)
    const result = await brandProcessor.processBrandIdentity({
      websiteUrl: url,
      manualDescription: "" // Empty for pure fetch
    });

    const dna = result.structuredIdentity;

    // Map back to frontend expected keys
    res.status(200).json({
      brandName: dna.brand_name,
      description: result.rawKnowledgeBase.substring(0, 1000), // More descriptive
      brandColors: dna.color_palette,
      toneOfVoice: dna.tone,
      targetRegion: dna.target_audience,
      industry: dna.industry,
      products_services: dna.products_services,
      brand_values: dna.brand_values,
      logoUrl: result.webData?.logo || null,
      faviconUrl: result.webData?.favicon || null,
      domain: url.replace(/^https?:\/\//, '').split('/')[0],
      success: true
    });

  } catch (error) {
    logger.error(`[Real Magic] Synthesis failed: ${error.message}`);
    res.status(500).json({
      error: "AI Synthesis failed. Please manually enter brand details.",
      details: error.message
    });
  }
};

/**
 * Stage 4: THE REAL MAGIC — Asset-to-DNA Synthesis
 * Analyze a single file (Logo or PDF) and return data for Auto-Fill.
 * PLUS: Save to GCS in dedicated folder.
 */
export const quickAnalysis = async (req, res) => {
  try {
    const file = req.file;
    const { workspaceId } = req.body;

    if (!file) {
      console.warn(`[Real Magic] QuickAnalysis called without file.`);
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    console.log(`[Real Magic] Analyzing DNA for file: ${file.originalname} (Mime: ${file.mimetype}, Size: ${file.size}, Workspace: ${workspaceId || 'None'})`);

    const { extractColorsFromLogo, parseBrandDocument } = await import('../services/brandProcessor.service.js');
    const { AskVertexRaw } = await import('../services/vertex.service.js');

    let gcsUrl = null;

    // --- 1. PERSISTENT STORAGE (Dedicated Folder) ---
    if (workspaceId && workspaceId !== 'undefined' && workspaceId !== 'null') {
      try {
        const folder = file.mimetype.startsWith('image/')
          ? `brands/${workspaceId}/logo`
          : `brands/${workspaceId}/guidelines`;

        const uploadRes = await uploadToGCS(file, folder);
        gcsUrl = uploadRes.url;

        // Track the asset
        await new UploadAsset({
          workspaceId,
          assetType: file.mimetype.startsWith('image/') ? 'logo' : 'overview',
          gcsUrl,
          fileName: file.originalname,
          mimeType: file.mimetype
        }).save();

        // Update Brand Profile link if possible
        const brand = await BrandProfile.findOne({ workspaceId });
        if (brand) {
          if (file.mimetype.startsWith('image/')) brand.logoUrl = gcsUrl;
          else brand.companyOverviewFileUrl = gcsUrl;
          await brand.save();
        }
      } catch (uploadErr) {
        console.error(`[Real Magic] Upload/Save failed, continuing with analysis: ${uploadErr.message}`);
      }
    }

    // --- 2. AI ANALYSIS ---
    if (file.mimetype.startsWith('image/')) {
      const colors = await extractColorsFromLogo(file.buffer);
      console.log(`[Real Magic] Colors extracted: ${colors.join(', ')}`);
      return res.json({ brandColors: colors, gcsUrl, success: true });
    } else {
      console.log(`[Real Magic] Parsing document text...`);
      const text = await parseBrandDocument(file.buffer, file.mimetype);
      
      if (!text || text.trim().length < 10) {
        console.warn(`[Real Magic] Document parsing returned empty or very short text.`);
        return res.json({ success: false, error: "Could not extract enough text from the document. Please try a different format or manual entry." });
      }

      console.log(`[Real Magic] Sending to Vertex for DNA Synthesis...`);
      const aiPrompt = `Analyze this brand document and extract its identity.
      Return strictly valid JSON format:
      {
        "brandName": "...",
        "summary": "Full mission/vision description",
        "tone": "Bold / Professional / etc"
      }
      
      TEXT: ${text.substring(0, 5000)}`;

      const aiRes = await AskVertexRaw(aiPrompt);
      const dna = JSON.parse(aiRes.replace(/```json|```/g, ''));

      console.log(`[Real Magic] DNA Synthesis complete for: ${dna.brandName}`);
      return res.json({
        brandName: dna.brandName,
        extractedBrandSummary: dna.summary,
        toneOfVoice: dna.tone,
        gcsUrl,
        success: true
      });
    }
  } catch (error) {
    console.error(`[Real Magic] Analysis failed: ${error.message}`);
    res.json({ success: false, error: `DNA analysis failed: ${error.message}. Manual entry suggested.` });
  }
};
