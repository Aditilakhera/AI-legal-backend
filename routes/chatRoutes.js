import mongoose from "mongoose";
import express from "express"
import ChatSession from "../models/ChatSession.js"
import { generativeModel, genAIInstance, modelName as primaryModelName, systemInstructionText } from "../config/vertex.js";
import userModel from "../models/User.js";
import Guest from "../models/Guest.js";
import { verifyToken, optionalVerifyToken } from "../middleware/authorization.js";
import { identifyGuest } from "../middleware/guestMiddleware.js";
import { uploadToCloudinary, upload } from "../services/cloudinary.service.js";
import mammoth from "mammoth";
import { detectMode, getModeSystemInstruction } from "../utils/modeDetection.js";
import { detectIntent, extractReminderDetails, detectLanguage, getVoiceSystemInstruction } from "../utils/voiceAssistant.js";
import Reminder from "../models/Reminder.js";
import { requiresWebSearch, extractSearchQuery, processSearchResults, getWebSearchSystemInstruction, getCachedSearch, setCachedSearch } from "../utils/webSearch.js";
import { performWebSearch } from "../services/searchService.js";
import { convertFile } from "../utils/fileConversion.js";
import { generateVideoFromPrompt } from "../controllers/videoController.js";
import { generateImageFromPrompt } from "../controllers/image.controller.js";
import { getMemoryContext, extractUserMemory, updateMemory } from "../utils/memoryService.js";
import { subscriptionService, checkPremiumAccess } from '../services/subscriptionService.js';
import { retrieveContextFromRag, detectRAGNeed } from "../services/vertex.service.js";
import * as configService from "../services/configService.js";
import Knowledge from "../models/Knowledge.model.js";
import * as webSearchService from "../services/webSearch.service.js";
import * as deepSearchService from "../services/deepSearch.service.js";
import memoryService from "../services/memory.service.js";

import axios from "axios";


const router = express.Router();

// Helper to check guest limits
const checkGuestLimits = async (req, sessionId) => {
  if (req.user) return { allowed: true };
  if (!req.guest) return { allowed: true }; // Should not happen with middleware

  const MAX_SESSIONS = 10;
  const MAX_MESSAGES = 5;

  // 1. Check Sessions Count
  if (req.guest.sessionIds.length >= MAX_SESSIONS && !req.guest.sessionIds.includes(sessionId)) {
    return { allowed: false, reason: "MAX_SESSIONS_REACHED" };
  }

  // 2. Check Messages Count in current session if sessionId is provided
  if (sessionId) {
    const session = await ChatSession.findOne({ sessionId });
    if (session && session.messages && session.messages.length >= MAX_MESSAGES) {
      return { allowed: false, reason: "MAX_MESSAGES_REACHED" };
    }
  }

  return { allowed: true };
};

// Get all chat sessions (summary)
router.post("/", optionalVerifyToken, identifyGuest, async (req, res) => {
  const { content, history, systemInstruction, image, video, document, language, model, mode, sessionId } = req.body;

  try {
    // Enforce limits for guests
    const limitCheck = await checkGuestLimits(req, sessionId);
    if (!limitCheck.allowed) {
      return res.status(403).json({ error: "LIMIT_REACHED", reason: limitCheck.reason });
    }

    // --- SUBSCRIPTION PLAN & CREDIT CHECKS ---
    let toolsRequested = ['chat'];
    if (mode === 'DEEP_SEARCH') toolsRequested.push('deep_search');
    else if (mode === 'web_search') toolsRequested.push('web_search');

    if (mode === 'CODE_WRITER') toolsRequested.push('code_writer');

    // Check if document exists AND is not an empty array
    const hasDocuments = document && (Array.isArray(document) ? document.length > 0 : Object.keys(document).length > 0);
    if (hasDocuments) {
      toolsRequested.push('convert_document');
    }

    if (req.user) {
      try {
        await subscriptionService.checkCredits(req.user.id, toolsRequested);
      } catch (subError) {
        if (subError.message === "PREMIUM_RESTRICTED") {
          return res.status(403).json({
            success: false,
            code: "PREMIUM_ONLY",
            message: "This feature is not available in the free plan. Please upgrade your plan to access premium magic tools."
          });
        }
        // Insufficient credits — free plan used all 100 credits
        return res.status(403).json({
          success: false,
          code: "OUT_OF_CREDITS",
          message: "You've used all your credits! Upgrade your plan to continue chatting with AISA."
        });
      }
    }

    // --- WEB SEARCH MAGIC TOOL (PRIORITY) ---
    console.log("[DEBUG] Starting Web Search check...");
    let searchResult = null;
    let isWebSearchResponse = false;
    let searchSources = [];
    const isDeepSearch = (systemInstruction && systemInstruction.includes('DEEP SEARCH MODE ENABLED')) || mode === 'DEEP_SEARCH';

    // Check for company keywords early to ensure sources box
    const companyKeywords = ['uwo', 'aisa', 'ai mall', 'unified web'];
    const lowerMsgFull = content ? content.toLowerCase().trim() : "";
    const hasCompanyKeyword = content ? companyKeywords.some(k => lowerMsgFull.includes(k)) : false;

    // Auto web search from keywords is only available to premium users
    let hasPremium = false;
    if (req.user) {
      try {
        hasPremium = await checkPremiumAccess(req.user.id || req.user._id);
      } catch (e) {
        console.error("Error checking premium status for search:", e);
      }
    }

    // Determine mode for search logic - DECLARE THESE AT THE TOP
    const allAttachments = [];
    if (Array.isArray(image)) allAttachments.push(...image);
    else if (image) allAttachments.push(image);
    if (Array.isArray(document)) allAttachments.push(...document);
    else if (document) allAttachments.push(document);
    if (Array.isArray(video)) allAttachments.push(...video);
    else if (video) allAttachments.push(video);

    // MAGIC TOOLS ENFORCEMENT: Strictly use features ONLY if the user explicitly selected the card (passed as 'mode')
    const magicTools = [
      'IMAGE_GEN', 'VIDEO_GEN', 'web_search', 'DEEP_SEARCH',
      'AUDIO_TALK', 'FILE_CONVERSION', 'CODE_WRITER',
      'IMAGE_EDIT', 'IMAGE_TO_VIDEO', 'CODING_HELP'
    ];

    let detectedMode = mode;
    if (!detectedMode) {
      // Auto-detect only for non-Magic Tools (like FILE_ANALYSIS)
      const autoDetected = detectMode(content, allAttachments);
      if (magicTools.includes(autoDetected)) {
        detectedMode = 'CHAT';
      } else {
        detectedMode = autoDetected;
      }
    }

    if (detectedMode === 'DOCUMENT_CONVERT') detectedMode = 'FILE_CONVERSION';

    // FINAL DECISION: Strictly use web search ONLY if the user explicitly selected the card
    const isExplicitSearchCard = (mode === 'web_search' || mode === 'DEEP_SEARCH');
    const shouldDoWebSearch = isDeepSearch || isExplicitSearchCard;

    console.log(`[DEBUG] MODE DECISION: mode=${mode}, detectedMode=${detectedMode}, shouldDoWebSearch=${shouldDoWebSearch}`);

    if (shouldDoWebSearch) {
      const isDeep = isDeepSearch || mode === 'DEEP_SEARCH' || detectedMode === 'DEEP_SEARCH';
      console.log(`[SEARCH] Mode: ${isDeep ? 'DEEP RESEARCH' : 'WEB SEARCH'} | Query: "${content.substring(0, 50)}..."`);

      try {
        if (isDeep) {
          searchResult = await deepSearchService.performDeepSearch(content, language || 'English');
        } else {
          searchResult = await webSearchService.performSearch(content, language || 'English');
        }

        console.log(`[DEBUG] searchResult status: ${searchResult ? 'SUCCESS' : 'FAILED/NULL'} (Summary Length: ${searchResult?.summary?.length || 0})`);

        if (searchResult && searchResult.summary) {
          console.log(`[WEB SEARCH] Search results obtained via GPT-4o.`);
          isWebSearchResponse = true;
          searchSources = searchResult.sources || [];
          let searchReply = searchResult.summary;

          // Return immediately if search succeeded to prevent falling through to model generation
          const finalSearchResponse = {
            reply: searchReply,
            detectedMode,
            isRealTime: true,
            sources: searchSources,
            language: language || 'English'
          };

          // --- CREDIT DEDUCTION ---
          if (req.user) {
            await subscriptionService.deductCredits(req.user.id, toolsRequested, sessionId || 'chat-' + Date.now());
          }

          if (sessionId) {
            const mUserId = req.user ? req.user.id : (req.guest ? req.guest.id : null);
            memoryService.saveMessageWithEmbedding(sessionId, mUserId, 'user', content);
            memoryService.saveMessageWithEmbedding(sessionId, mUserId, 'assistant', searchReply);
          }

          return res.status(200).json(finalSearchResponse);
        }
      } catch (error) {
        console.error('[WEB SEARCH ERROR]', error);
      }
    }
    console.log("[DEBUG] Web Search check complete.");

    // --- CONVERSATION MEMORY RAG ---
    let combinedMemoryPrompt = systemInstructionText; // Default fallback
    let conversationHistoryMemory = [];
    if (content && sessionId) {
      try {
        const userId = req.user ? req.user.id : (req.guest ? req.guest.id : null);

        // Retrieve relevant past messages BEFORE saving the current one, to avoid self-retrieval
        conversationHistoryMemory = await memoryService.retrieveMemory(sessionId, content, 5);
        conversationHistoryMemory = conversationHistoryMemory.filter(msg => msg.content !== content); // Prevent echo

        // Async save user message to Vector DB Memory
        memoryService.saveMessageWithEmbedding(sessionId, userId, 'user', content);

        let personalizationContext = "";
        let nameUsageInstruction = "";
        if (req.user) {
          personalizationContext = await getMemoryContext(req.user.id);
          if (req.user.name) {
            nameUsageInstruction = `\nUser's Name is "${req.user.name}". You may use it naturally.\n`;
          }
        }

        // Build Full Memory-RAG System Prompt
        const finalSystemPrompt = `${systemInstructionText}\n${personalizationContext}\n${nameUsageInstruction}\n\n${systemInstruction || ""}`;
        combinedMemoryPrompt = memoryService.buildContext(finalSystemPrompt, conversationHistoryMemory, content);

      } catch (memError) {
        console.error("[Memory RAG] Error:", memError);
      }
    }

    // --- MULTI-MODEL DISPATCHER ---
    if (model && !model.startsWith('gemini')) {
      try {
        let reply = "";

        // Standard OpenAI Format Preparation
        const formattedMessages = [
          { role: 'system', content: combinedMemoryPrompt },

          ...(history || []).map(msg => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.content
          })),
          { role: 'user', content: content }
        ];

        if (model.includes('groq')) {
          const resp = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.3-70b-versatile',
            messages: formattedMessages
          }, { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } });
          reply = resp.data.choices[0].message.content;

        } else if (model.includes('openai')) {
          const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o',
            messages: formattedMessages
          }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });
          reply = resp.data.choices[0].message.content;

        } else if (model.includes('kimi')) {
          const kimiModel = model.includes('k1.5') ? 'moonshot-v1-32k' : 'moonshot-v1-8k';
          const resp = await axios.post('https://api.moonshot.ai/v1/chat/completions', {
            model: kimiModel,
            messages: formattedMessages
          }, { headers: { Authorization: `Bearer ${process.env.KIMI_API_KEY}` } });
          reply = resp.data.choices[0].message.content;

        } else if (model.includes('claude')) {
          // Claude Specific Format
          const claudeMsgs = (history || []).map(msg => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.content
          }));
          claudeMsgs.push({ role: 'user', content: content });

          const resp = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-3-opus-20240229',
            max_tokens: 4096,
            system: combinedMemoryPrompt,
            messages: claudeMsgs
          }, { headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' } });
          reply = resp.data.content[0].text;
        }

        const mUserId = req.user ? req.user.id : (req.guest ? req.guest.id : null);
        memoryService.saveMessageWithEmbedding(sessionId, mUserId, 'assistant', reply);

        if (req.user) {
          extractUserMemory(content, history).then(mem => updateMemory(req.user.id, mem, model));
        }

        return res.status(200).json({ reply });

      } catch (apiError) {
        console.error(`Error calling ${model}:`, apiError.response?.data || apiError.message);
        // Fallback: Do not return 500. Let it fall through to Gemini logic.
        // We will append a note to the final reply later if needed, or just let Gemini answer.
        console.log(`Falling back to Gemini due to ${model} failure.`);
      }
    }
    const modeSystemInstruction = getModeSystemInstruction(detectedMode, language || 'English', {
      fileCount: allAttachments.length
    });

    console.log(`[MODE DETECTION] Detected mode: ${detectedMode} for message: "${content?.substring(0, 50)}..."`);

    // Construct parts from history + current message
    let parts = [];

    // --- DUPLICATE QUESTION DETECTION (DISABLED) ---
    let duplicateNote = "";

    // --- PERSONAL MEMORY CONTEXT (OPTIONAL/AUTHENTICATED) ---
    let memoryContext = "";
    let nameUsageInstruction = "";
    if (req.user) {
      memoryContext = await getMemoryContext(req.user.id);
      if (req.user.name) {
        nameUsageInstruction = `
[NAME USAGE RULE]:
User's Name is "${req.user.name}". 
- You may use the user's name naturally if appropriate, but do not repeat it frequently.
- Maintain a professional and helpful tone.
`;
      }
    }

    // --- VERTEX AI RAG INTEGRATION (COMPANY KNOWLEDGE) ---
    let ragContext = "";
    let isGeneralQuestion = false;
    try {
      // Check if we have documents in DB OR if a manual Corpus ID is set
      const docCount = await Knowledge.countDocuments().catch(() => 0);
      const manualCorpusId = process.env.VERTEX_RAG_CORPUS_ID;

      if ((docCount > 0 || manualCorpusId) && content) {
        // Robust Detection (Priority 1: General Phrase filtering)
        const generalPhrases = [
          'what is', 'how to', 'explain', 'define', 'meaning of', 'tell me about',
          'why is', 'suggest', 'give me', 'who is', 'describe', 'difference between',
          'how does', 'why does', 'what are', 'where is'
        ];

        const lowerMsg = content.toLowerCase().trim();
        const startsWithGeneral = generalPhrases.some(p => lowerMsg.startsWith(p));

        let needsRAG = true;
        if (startsWithGeneral && !hasCompanyKeyword) {
          needsRAG = false;
          isGeneralQuestion = true;
          console.log(`[RAG-Logic] FORCED NO for generic question: "${content}"`);
        } else {
          needsRAG = await detectRAGNeed(content);
        }

        // --- NEW: FORCE COMPANY SOURCE FOR BRANDED QUERIES ---
        if (hasCompanyKeyword) {
          console.log(`[RAG-Logic] Branded keyword detected. Ensuring company source exists.`);
          if (searchSources.length === 0) {
            searchSources.push({
              title: "Unified Web Options",
              url: "https://uwo24.com/",
              snippet: "Official information about AISA and UWO services.",
              document_title: "Unified Web Options",
              source_type: "URL",
              chunk_id: `brand_${Date.now()}`
            });
          }
        }

        if (needsRAG) {
          console.log(`[RAG] Checking Knowledge Base (Vertex RAG) for: "${content.substring(0, 30)}..."`);
          const retrieved = await retrieveContextFromRag(content, 8); // TopK=8 as per expert guideline
          if (retrieved) {
            if (retrieved.sources && Array.isArray(retrieved.sources)) {
              searchSources = [...searchSources, ...retrieved.sources];
            }
            if (retrieved.text) {
              console.log("[RAG] Relevant context FOUND and injected.");
              ragContext = `
You are AISA, an intelligent super AI assistant.

Use the provided context to answer the user's question accurately.

Context may come from multiple retrieval systems such as semantic search and keyword search.

Context:
${retrieved.text}

Instructions:
- Carefully read all the provided context.
- Combine information from multiple context sections if necessary.
- Base your answer strictly on the provided context.
- If multiple pieces of information are relevant, summarize them clearly.
- If the answer is not found in the context, say:
"I could not find this information in the available knowledge base."

Response Guidelines:
- Start with the direct answer.
- Provide a short explanation if necessary.
- **WEBSITE CITATION**: Whenever you provide information about AISA or UWO products/services from this context, you MUST include the official website link: https://uwo24.com/
- Keep the response clear and concise.
- Avoid unnecessary filler text.
`;
            }
          }
        }
      }
    } catch (ragError) {
      console.error("[RAG ERROR]", ragError.message);
    }

    // Use mode-specific system instruction, or fallback to provided systemInstruction
    // CRITICAL: Merge with official branding from vertex.js to prevent hallucination
    const currentDateLong = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
    const dateContext = `### CURRENT DATE & TIME:\nToday is ${currentDateLong} (India Standard Time). (Aaj ki date aur samay: ${currentDateLong})\n`;

    let baseInstruction = systemInstruction || modeSystemInstruction;
    let dynamicSystemInstruction = (await import('../config/vertex.js')).getDynamicSystemInstruction();

    if (isGeneralQuestion) {
      // Switch to strict direct-answer mode for general questions
      dynamicSystemInstruction = configService.getGeneralSystemInstruction(memoryContext);
    }

    let finalSystemInstruction = `${dynamicSystemInstruction}\n${dateContext}\n${ragContext}\n${memoryContext}\n${nameUsageInstruction}\n${duplicateNote}\n\n[SESSION CONTEXT]:\n${baseInstruction}`;

    if (detectedMode === 'FILE_CONVERSION' || detectedMode === 'FILE_ANALYSIS') {
      finalSystemInstruction = modeSystemInstruction;
    } else {
      // Check if the user explicitly activated magic tools via the card (mode)
      const isActuallyImageMode = mode === 'IMAGE_GEN' || mode === 'IMAGE_EDIT' || detectedMode === 'IMAGE_EDIT';
      const isActuallyVideoMode = mode === 'VIDEO_GEN' || mode === 'IMAGE_TO_VIDEO';
      const isActuallySearchMode = mode === 'web_search' || mode === 'DEEP_SEARCH';
      const isActuallyCodeMode = mode === 'CODE_WRITER' || mode === 'CODING_HELP';
      const isActuallyConvertMode = mode === 'FILE_CONVERSION';

      // Only add standard rules for non-specialized modes to avoid instruction collision
      let MANDATORY_JSON_RULES = `
CRITICAL LANGUAGE RULE:
ALWAYS respond using ROMAN SCRIPT (English letters).
- If the user writes in Hindi or Hinglish, respond in HINGLISH (Romanized Hindi).
- NEVER use Devanagari script (Hindi characters) unless explicitly asked.

MANDATORY INTERACTIVE RULES (AISA):
- ROMAN SCRIPT ONLY: For any Hindi or Hinglish response, you MUST use English letters (Roman script).
- BALANCED LENGTH: Provide detailed, helpful answers (aim for 10-15 lines for detailed queries).
- Maintain a professional, calm, and intelligent personality (AISA).
`;

      if (isGeneralQuestion) {
        MANDATORY_JSON_RULES += `
- DIRECT ANSWER MODE: Provide ONLY the direct answer.
- DO NOT provide website links, sources, citations, or bibliography in your response.
- DO NOT provide "Suggestions", "I can also help you with", or follow-up questions.
- END your response immediately after the answer. No closing conversational filler.
`;
      } else {
        MANDATORY_JSON_RULES += `
- RICH SUGGESTIONS: End with a conversational lead-in (e.g., "I can also help you with:"), 2-4 bulleted suggestions, and a final friendly sentence with an emoji.
`;
      }

      // MEDIA & TOOL RULES: Strictly enforced based on current mode
      let TOOL_RULES = "";

      if (isActuallyImageMode) {
        TOOL_RULES += `
MANDATORY IMAGE GENERATION RULES:
- You are in IMAGE GENERATION MODE. 
- Output ONLY {"action": "generate_image", "prompt": "..."} to create the image.
- The prompt MUST be in English, highly descriptive (mention lighting, style, colors), and professional.
`;
      } else if (isActuallyVideoMode) {
        TOOL_RULES += `
MANDATORY VIDEO GENERATION RULES:
- You are in VIDEO GENERATION MODE.
- Output ONLY {"action": "generate_video", "prompt": "..."} to create the video.
- The prompt MUST be in English and cinematic.
`;
      } else if (isActuallySearchMode) {
        TOOL_RULES += `
MANDATORY SEARCH RULES:
- You are in WEB SEARCH / DEEP SEARCH MODE.
- Use the provided search results to answer precisely.
- Cite sources clearly.
`;
      } else if (isActuallyCodeMode) {
        TOOL_RULES += `
MANDATORY CODE WRITER RULES:
- You are in CODE WRITER MODE.
- Provide production-ready code with explanations.
`;
      } else if (isActuallyConvertMode) {
        TOOL_RULES += `
MANDATORY CONVERSION RULES:
- You are in DOCUMENT CONVERSION MODE.
- Output ONLY the JSON action for file_conversion.
`;
      } else {
        // CHAT MODE - Strictly forbid JSON Magic Actions
        TOOL_RULES += `
MANDATORY TOOL RESTRICTIONS (NORMAL CHAT):
- You are in NORMAL CHAT mode.
- You are FORBIDDEN from executing magic actions (Do NOT output JSON like {"action": "..."}).
- You SHOULD answer all "How-to" questions, general queries, and conversations using plain text.
- If the user explicitly asks you to generate/create an image, video, search, or convert a file right now, explain that they must activate the specific tool from the "AISA Magic Tools" menu to perform the actual generation.
`;
      }

      MANDATORY_JSON_RULES += TOOL_RULES;

      finalSystemInstruction = `${finalSystemInstruction}\n\n${MANDATORY_JSON_RULES}`;
    }

    // Wrap with Conversation Memory RAG Service
    let finalSystemPromptWithMemory = memoryService.buildContext(finalSystemInstruction, conversationHistoryMemory, content);

    // Add conversation history if available (Only push if retrieved memory is empty to prevent double-context, or omit)
    if (history && Array.isArray(history) && conversationHistoryMemory.length === 0) {
      history.forEach(msg => {
        parts.push({ text: `${msg.role === 'user' ? 'User' : 'Model'}: ${msg.content} ` });
      });
    }

    // Add current message
    parts.push({ text: `User: ${content} ` });

    // Handle Multiple Images
    if (Array.isArray(image)) {
      image.forEach(img => {
        if (img.mimeType && img.base64Data) {
          parts.push({
            inlineData: {
              mimeType: img.mimeType,
              data: img.base64Data
            }
          });
        }
      });
    } else if (image && image.mimeType && image.base64Data) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.base64Data
        }
      });
    }

    // Handle Multiple Videos
    if (Array.isArray(video)) {
      video.forEach(vid => {
        if (vid.mimeType && vid.base64Data) {
          parts.push({
            inlineData: {
              mimeType: vid.mimeType,
              data: vid.base64Data
            }
          });
        }
      });
    } else if (video && video.mimeType && video.base64Data) {
      parts.push({
        inlineData: {
          mimeType: video.mimeType,
          data: video.base64Data
        }
      });
    }

    // Handle Multiple Documents
    if (Array.isArray(document)) {
      for (const doc of document) {
        await processDocumentPart(doc, parts);
      }
    } else if (document && document.base64Data) {
      await processDocumentPart(document, parts);
    }

    async function processDocumentPart(doc, partsArray) {
      const mimeType = doc.mimeType || 'application/pdf';

      // For PDF documents, we can pass binary data directly to Gemini
      if (mimeType === 'application/pdf') {
        partsArray.push({
          inlineData: {
            data: doc.base64Data,
            mimeType: mimeType
          }
        });
      }

      // Extract text for all document types (Word, etc.)
      if (mimeType.includes('word') || mimeType.includes('officedocument') || mimeType.includes('text')) {
        try {
          const buffer = Buffer.from(doc.base64Data, 'base64');
          const result = await mammoth.extractRawText({ buffer });
          if (result.value) {
            partsArray.push({ text: `[Fallback Text Content of ${doc.name || 'document'}]: \n${result.value} ` });
          }
        } catch (e) {
          console.warn("Text extraction fallback failed, using binary only", e.message);
        }
      } else if (doc.mimeType && (doc.mimeType.includes('text') || doc.mimeType.includes('spreadsheet') || doc.mimeType.includes('presentation'))) {
        try {
          const buffer = Buffer.from(doc.base64Data, 'base64');
          let text = `[Attached File: ${doc.name || 'document'}]`;
          if (doc.mimeType.includes('spreadsheet') || doc.mimeType.includes('excel')) {
            // Basic indicator for excel, complex parsing omitted for brevity
            text = `[Attached Spreadsheet: ${doc.name || 'document'}]`;
          }
          partsArray.push({ text: `[Attached Document Content(${doc.name || 'document'})]: \n${text} ` });
        } catch (e) {
          console.error("Extraction failed", e);
          partsArray.push({ text: `[Error reading attached document: ${e.message}]` });
        }
      }
    }

    // Voice Assistant: Detect intent for reminder/alarm
    const userIntent = detectIntent(content);
    const detectedLanguage = detectLanguage(content);
    let reminderData = null;
    let voiceConfirmation = '';

    console.log(`[VOICE ASSISTANT]Intent: ${userIntent}, Language: ${detectedLanguage} `);

    // If intent is reminder/alarm related, extract details and create reminder
    if (userIntent !== 'casual_chat' && userIntent !== 'clarification_needed') {
      try {
        reminderData = extractReminderDetails(content);
        console.log('[VOICE ASSISTANT] Reminder details:', reminderData);

        // Save reminder to database
        if (req.user) {
          // Save reminder to database (Only for logged-in users)
          const newReminder = new Reminder({
            userId: req.user.id,
            title: reminderData.title,
            datetime: reminderData.datetime,
            notification: reminderData.notification,
            alarm: reminderData.alarm,
            voice: reminderData.voice,
            voiceMessage: reminderData.voice_message,
            intent: reminderData.intent
          });
          await newReminder.save();
          console.log('[VOICE ASSISTANT] Reminder saved to DB:', newReminder._id);

          // Generate voice-friendly confirmation
          const time = new Date(reminderData.datetime).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          const date = new Date(reminderData.datetime).toLocaleDateString('en-IN');

          if (detectedLanguage === 'Hinglish' || detectedLanguage === 'Hindi') {
            voiceConfirmation = `Okay, main ${time} par ${reminderData.alarm ? 'alarm aur ' : ''}${reminderData.voice ? 'voice ke saath ' : ''}reminder set kar dungi`;
          } else {
            voiceConfirmation = `Okay, I'll set a ${reminderData.alarm ? 'alarm and ' : ''}${reminderData.voice ? 'voice ' : ''}reminder for ${time}`;
          }
        } else {
          console.log('[VOICE ASSISTANT] Guest user - skipping reminder save.');
          voiceConfirmation = "I can only set reminders for logged-in users. Please log in to use this feature.";
        }
      } catch (error) {
        console.error('[VOICE ASSISTANT] Error extracting/saving reminder:', error);
      }
    }


    // --- VERTEX AI RAG INTEGRATION (ALREADY PROCESSED ABOVE) ---


    // File Conversion: Check if this is a conversion request
    let conversionResult = null;

    if (detectedMode === 'FILE_CONVERSION') {
      console.log('[FILE CONVERSION] Conversion request detected');
      console.log(`[FILE CONVERSION] Attachments count: ${allAttachments.length}`);

      // First, get AI response to extract conversion parameters
      // We pass the full parts + explicit instruction to be super clear
      let aiResponse = "";
      try {
        const tempContentPayload = { role: "user", parts: parts };
        const modelForParams = genAIInstance.getGenerativeModel({
          model: primaryModelName,
          systemInstruction: finalSystemPromptWithMemory
        });

        const tempStreamingResult = await modelForParams.generateContent({
          contents: [tempContentPayload],
          generationConfig: { maxOutputTokens: 1024 }
        });
        const tempResponse = await tempStreamingResult.response;

        if (typeof tempResponse.text === 'function') {
          aiResponse = await tempResponse.text();
        } else if (tempResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiResponse = tempResponse.candidates[0].content.parts[0].text;
        }
        console.log('[FILE CONVERSION] AI Response:', aiResponse);
      } catch (e) {
        console.error('[FILE CONVERSION] Failed to get AI parameters (will use fallback):', e.message);
      }

      // Try to extract JSON from AI response (handle markdown backticks too)
      let jsonMatch = null;
      let conversionParams = null;

      // 1. Try Code Block Regex
      const codeBlockRegex = /```(?:json)?\s*(\{[\s\S]*?"action":\s*"file_conversion"[\s\S]*?\})\s*```/;
      const codeBlockMatch = aiResponse.match(codeBlockRegex);

      if (codeBlockMatch) {
        try {
          conversionParams = JSON.parse(codeBlockMatch[1]);
          jsonMatch = { 1: codeBlockMatch[1] }; // Mock match object for existing logic compatibility
        } catch (e) { console.warn("[FILE CONVERSION] Code block parse failed", e); }
      }

      // 2. Try Raw JSON Regex (if no code block)
      if (!conversionParams) {
        const rawJsonRegex = /(\{[\s\S]*?"action":\s*"file_conversion"[\s\S]*?\})/;
        const rawMatch = aiResponse.match(rawJsonRegex);
        if (rawMatch) {
          try {
            conversionParams = JSON.parse(rawMatch[1]);
            jsonMatch = { 1: rawMatch[1] };
          } catch (e) { console.warn("[FILE CONVERSION] Raw regex parse failed", e); }
        }
      }

      // 3. Fallback: Find first '{' and last '}'
      if (!conversionParams) {
        try {
          const firstBrace = aiResponse.indexOf('{');
          const lastBrace = aiResponse.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            const potentialJson = aiResponse.substring(firstBrace, lastBrace + 1);
            const parsed = JSON.parse(potentialJson);
            if (parsed.action === 'file_conversion') {
              conversionParams = parsed;
              jsonMatch = { 1: potentialJson };
            }
          }
        } catch (e) {
          console.warn("[FILE CONVERSION] Fallback parse failed", e);
        }
      }

      // --- DETERMINISTIC FALLBACK (If AI extracted nothing) ---
      if (!conversionParams && allAttachments.length > 0) {
        console.warn("[FILE CONVERSION] AI failed to extract params. Using deterministic logic.");
        const att = allAttachments[0];
        const name = att.name || 'document';
        const ext = name.split('.').pop().toLowerCase();

        let target = 'pdf';
        let source = ext;

        if (ext === 'pdf') target = 'docx';
        else if (['doc', 'docx'].includes(ext)) target = 'pdf';
        else if (['jpg', 'jpeg', 'png', 'webp', 'xls', 'xlsx'].includes(ext)) target = 'pdf';

        conversionParams = {
          action: "file_conversion",
          source_format: source,
          target_format: target,
          file_name: name
        };
        console.log(`[FILE CONVERSION] Fallback Params: ${source} -> ${target}`);
      }

      if (conversionParams && allAttachments.length > 0) {
        try {
          console.log('[FILE CONVERSION] Parsed params:', conversionParams);

          // Get the first attachment (assuming single file conversion)
          const attachment = allAttachments[0];

          // Convert base64 to buffer
          const base64Data = attachment.base64Data || attachment.data;

          if (!base64Data) {
            throw new Error('No file data received for conversion');
          }

          const fileBuffer = Buffer.from(base64Data, 'base64');

          // Perform conversion
          const convertedBuffer = await convertFile(
            fileBuffer,
            conversionParams.source_format,
            conversionParams.target_format
          );

          // Convert result to base64
          const convertedBase64 = convertedBuffer.toString('base64');

          // Determine output filename
          const originalName = conversionParams.file_name || 'document';
          const baseName = originalName.replace(/\.(pdf|docx?|doc)$/i, '');
          const outputExtension = conversionParams.target_format === 'pdf' ? 'pdf' : 'docx';
          const outputFileName = `${baseName}_converted.${outputExtension}`;

          conversionResult = {
            success: true,
            file: convertedBase64,
            fileName: outputFileName,
            mimeType: conversionParams.target_format === 'pdf'
              ? 'application/pdf'
              : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            message: (jsonMatch && jsonMatch[1])
              ? aiResponse.replace(jsonMatch[1], '').replace(/```json|```/g, '').trim()
              : "Here is your converted document."
          };

          console.log('[FILE CONVERSION] Conversion successful:', outputFileName);

        } catch (conversionError) {
          console.error('[FILE CONVERSION] Conversion failed:', conversionError);
          conversionResult = {
            success: false,
            error: conversionError.message
          };
        }
      } else {
        console.log('[FILE CONVERSION] NO JSON MATCH found in AI response. AI said:', aiResponse.substring(0, 200));
        conversionResult = {
          success: false,
          error: "AI did not trigger conversion parameters. Please be more specific (e.g., 'Convert this to PDF')."
        };
      }
    }

    // Correct usage for single-turn content generation with this SDK
    const contentPayload = { role: "user", parts: parts };

    let reply = "";
    let retryCount = 0;
    const maxRetries = 3;

    const attemptGeneration = async () => {
      console.log("[GEMINI] Starting generation attempt...");

      const tryModel = async (mName) => {
        try {
          console.log(`[GEMINI] Trying model: ${mName}`);
          // Always create fresh model instance with correct system instruction
          const model = genAIInstance.getGenerativeModel({
            model: mName,
            systemInstruction: finalSystemPromptWithMemory
          });

          // Add timeout to prevent hanging (increased to 60s for cold starts)
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 60000));
          const resultPromise = model.generateContent({ contents: [contentPayload] });

          const result = await Promise.race([resultPromise, timeoutPromise]);
          const response = await result.response;
          let text = '';
          if (typeof response.text === 'function') {
            text = response.text();
          } else if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
            text = response.candidates[0].content.parts[0].text;
          }
          if (text) return text;
          throw new Error("Empty response");
        } catch (mErr) {
          console.error(`[GEMINI] Model ${mName} failed:`, mErr.message);
          throw mErr;
        }
      };

      try {
        // Use the model from vertex.js config
        return await tryModel(primaryModelName);
      } catch (err) {
        throw new Error(`Model generation failed: ${err.message}`);
      }
    };

    // --- SKIP GENERATION IF CONVERSION OR SEARCH SUCCESSFUL ---
    if ((conversionResult && conversionResult.success) || isWebSearchResponse) {
      console.log(`[CHAT] ${isWebSearchResponse ? 'Search' : 'Conversion'} successful, skipping text generation.`);
      if (!reply && conversionResult?.message) reply = conversionResult.message;
    } else {
      while (retryCount < maxRetries) {
        try {
          reply = await attemptGeneration();
          break; // Success!
        } catch (err) {
          if (err.status === 429 && retryCount < maxRetries - 1) {
            retryCount++;
            const waitTime = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          throw err;
        }
      }
    }

    if (!reply) {
      reply = "I understood your request but couldn't generate a text response.";
    }

    // Construct final response object
    const finalResponse = {
      reply,
      detectedMode: (searchSources.length > 0 && !isWebSearchResponse) ? 'RAG' : detectedMode,
      isRealTime: isWebSearchResponse || searchSources.length > 0 || hasCompanyKeyword,
      sources: searchSources,
      language: detectedLanguage || language || 'English'
    };

    // --- CREDIT DEDUCTION AFTER SUCCESS ---
    if (req.user) {
      // Re-detect tools based on AI action if any
      let finalTools = [...toolsRequested];
      if (reply.includes('"action": "generate_image"')) finalTools.push('generate_image');
      if (reply.includes('"action": "generate_video"')) finalTools.push('generate_video');

      // Deduct Credits
      await subscriptionService.deductCredits(req.user.id, finalTools, sessionId || 'chat-' + Date.now());
    }

    // Check for Media (Video/Image) Generation Action
    // Check for Media (Video/Image) Generation Action
    try {
      console.log(`[MEDIA GEN] Analyzing reply: "${reply.substring(0, 100)}..."`);

      // Helper to extract JSON object with balanced braces
      const extractActionJson = (text) => {
        // 1. Try to anchor on "action": "..." (support single/double quotes)
        // We match strictly to avoid false positives, but allow slight whitespace variance
        const anchorRegex = /["']action["']\s*:\s*["'](generate_video|generate_image)["']/;
        const actionMatch = text.match(anchorRegex);

        if (actionMatch) {
          const actionIndex = actionMatch.index;
          // Find the starting brace '{' before the action
          let startIndex = text.lastIndexOf('{', actionIndex);

          if (startIndex !== -1) {
            // Attempt balanced brace counting
            let openBraces = 0;
            let endIndex = -1;
            let inString = false;
            let escape = false;

            for (let i = startIndex; i < text.length; i++) {
              const char = text[i];
              if (escape) { escape = false; continue; }
              if (char === '"' || char === "'") { inString = !inString; continue; } // Simplistic quote handling

              if (!inString) {
                if (char === '{') {
                  openBraces++;
                } else if (char === '}') {
                  openBraces--;
                  if (openBraces === 0) {
                    endIndex = i + 1;
                    break;
                  }
                }
              }
            }

            if (endIndex !== -1) {
              const jsonStr = text.substring(startIndex, endIndex);
              try {
                const parsed = JSON.parse(jsonStr); // Strict JSON header check
                return { data: parsed, raw: jsonStr };
              } catch (e) {
                // Try loose parsing (e.g. if keys are not quoted or single quoted)
                // We can't use eval safely, but we can try simple regex extraction if strict parse failed
                console.warn("[MEDIA GEN] Strict JSON parse failed, trying fallback regex extraction...");
              }
            }
          }
        }

        // 2. Fallback: classic greedy Regex (works for 99% of simple cases)
        // Matches { ... "action": "generate_video" ... }
        const simpleRegex = /\{[\s\S]*?["']action["']\s*:\s*["'](generate_video|generate_image|modify_image)["'][\s\S]*?\}/;
        const simpleMatch = text.match(simpleRegex);
        if (simpleMatch) {
          try {
            return { data: JSON.parse(simpleMatch[0]), raw: simpleMatch[0] };
          } catch (e) {
            console.error("[MEDIA GEN] Fallback regex matched but parse failed:", e.message);
          }
        }

        // 3. Fallback for Array format [ { ... } ]
        const arrayRegex = /\[\s*\{[\s\S]*?["']action["']\s*:\s*["'](generate_video|generate_image|modify_image)["'][\s\S]*?\}\s*\]/;
        const arrayMatch = text.match(arrayRegex);
        if (arrayMatch) {
          try {
            const arr = JSON.parse(arrayMatch[0]);
            if (Array.isArray(arr) && arr[0]) {
              return { data: arr[0], raw: arrayMatch[0] };
            }
          } catch (e) {
            console.error("[MEDIA GEN] Array regex matched but parse failed:", e.message);
          }
        }

        return null;
      };

      const extracted = extractActionJson(reply);

      if (extracted) {
        const { data, raw } = extracted;
        console.log(`[MEDIA GEN] Found trigger JSON: ${raw}`);

        // REMOVE processed JSON from the reply text immediately
        reply = reply.replace(raw, '').trim();

        if (data.action === 'generate_video' && data.prompt) {
          console.log(`[VIDEO GEN] Calling generator for: ${data.prompt}`);
          let canGenerate = true;
          let limitErrorMsg = null;
          let limitUsageData = null;

          if (req.user) {
            try {
              limitUsageData = await subscriptionService.checkLimit(req.user.id, 'video');
            } catch (limitErr) {
              canGenerate = false;
              limitErrorMsg = limitErr.message;
            }
          }

          if (!canGenerate) {
            finalResponse.reply = `Sorry, you have reached your monthly Video limit. Please upgrade your plan to generate more.`;
          } else {
            const videoUrl = await generateVideoFromPrompt(data.prompt, 5, 'medium');
            if (videoUrl) {
              finalResponse.videoUrl = videoUrl;
              finalResponse.reply = (reply && reply.trim()) ? reply : `Sure, I've generated a video based on your request: "${data.prompt}"`;
              if (limitUsageData) subscriptionService.incrementUsage(limitUsageData.usage, limitUsageData.usageKey);
            } else {
              // Fallback logic for video generation
              console.warn(`[VIDEO GEN] Primary generation failed.`);
              finalResponse.reply = (reply && reply.trim()) ? reply : `I attempted to generate a video for "${data.prompt}" but encountered an error.`;
            }
          }
        }
        else if (data.action === 'modify_image' && data.prompt) {
          console.log(`[IMAGE MOD] Calling modifier for: ${data.prompt}`);

          // Find the source image to modify
          let sourceImage = null;

          // 1. Check current turn attachments
          if (Array.isArray(image) && image.length > 0) {
            sourceImage = image[0];
          } else if (image && image.base64Data) {
            sourceImage = image;
          }

          // 2. If nothing in current turn, look back in history
          if (!sourceImage && history && Array.isArray(history)) {
            console.log("[IMAGE MOD] No image in current turn, searching history...");
            for (let i = history.length - 1; i >= 0; i--) {
              const prevMsg = history[i];
              if (prevMsg.attachments && Array.isArray(prevMsg.attachments)) {
                const prevImage = prevMsg.attachments.find(a =>
                  a.type === 'image' || (a.mimeType && a.mimeType.startsWith('image/'))
                );
                // In history, images might be stored as Cloudinary URLs or data URLs
                // If it's a data URL, we can extract base64
                if (prevImage && prevImage.url && prevImage.url.startsWith('data:')) {
                  sourceImage = {
                    mimeType: prevImage.url.substring(prevImage.url.indexOf(':') + 1, prevImage.url.indexOf(';')),
                    base64Data: prevImage.url.split(',')[1]
                  };
                  console.log("[IMAGE MOD] Found image data in recent history.");
                  break;
                }
                // If it's a Cloudinary URL, we'd need to fetch and convert to base64
                // For now, let's prioritize data URLs which are common in recent history before saving
              }
            }
          }

          if (sourceImage) {
            let canGenerate = true;
            let limitUsageData = null;

            if (req.user) {
              try {
                limitUsageData = await subscriptionService.checkLimit(req.user.id, 'image');
              } catch (limitErr) {
                canGenerate = false;
              }
            }

            if (!canGenerate) {
              finalResponse.reply = `Sorry, you have reached your monthly Image limit. Please upgrade your plan to continue using this feature.`;
            } else {
              try {
                // We'll need to update generateImageFromPrompt to handle modification
                const imageUrl = await generateImageFromPrompt(data.prompt, sourceImage);
                if (imageUrl) {
                  finalResponse.imageUrl = imageUrl;
                  finalResponse.reply = (reply && reply.trim()) ? reply : `I've updated the image according to your request: "${data.prompt}"`;
                  if (limitUsageData) subscriptionService.incrementUsage(limitUsageData.usage, limitUsageData.usageKey);
                }
              } catch (imgError) {
                console.error(`[IMAGE MOD] Modification failed: ${imgError.message}`);
                finalResponse.reply = (reply && reply.trim()) ? reply : `I tried to modify the image but encountered an error: ${imgError.message}`;
              }
            }
          } else {
            finalResponse.reply = "I couldn't find an image to modify. Please make sure you've uploaded an image.";
          }
        }
        else if (data.action === 'generate_image' && data.prompt) {
          // ===== AISA BRANDED IMAGE INTERCEPT =====
          // Smart detection: "aisa" alone is too broad (it's a common Hindi word meaning "like this")
          // We only intercept if the user is CLEARLY talking about the AISA AI product.
          const contentLower = (content || '').toLowerCase();
          const imageCreationWords = /\b(post|banner|image|photo|design|graphic|poster|thumbnail|logo|flyer|card|generate|bana|banao|create)\b/i;
          const aisaProductPhrases = [
            /\baisa\s*(ka|ke|ki|ko|ke\s+liye|ai|app|agent|assistant)\b/i,  // "AISA ka", "AISA ke liye", "AISA AI"
            /\baisa™\b/i,                                                    // "AISA™"
            /\bai\s*super\s*assistant\b/i,                                   // "AI Super Assistant"
            /\buwo\b/i,                                                      // "UWO" brand
            /artificial\s+intelligence\s+super/i,                           // Full product name
          ];

          const isAboutAISAProduct = aisaProductPhrases.some(p => p.test(content || '')) && imageCreationWords.test(content || '');
          // Also check if AI already mentioned AISA product in its own generated prompt
          const aiPromptMentionsAISA = /\baisa™?\b/i.test(data.prompt) && /\b(uwo|super\s*assistant|neural|purple|branded)\b/i.test(data.prompt);

          const isAisaRelatedRequest = isAboutAISAProduct || aiPromptMentionsAISA;

          let finalImagePrompt = data.prompt;
          if (isAisaRelatedRequest) {
            const userReqLower = contentLower;
            let style = 'social media post (vertical 1080x1080)';
            if (userReqLower.includes('instagram')) style = 'Instagram post (square 1080x1080)';
            else if (userReqLower.includes('facebook')) style = 'Facebook post (landscape 1200x630)';
            else if (userReqLower.includes('banner')) style = 'website banner (wide 1920x600)';
            else if (userReqLower.includes('logo')) style = 'logo design (square minimal)';
            else if (userReqLower.includes('poster')) style = 'vertical poster (portrait 1080x1920)';
            else if (userReqLower.includes('thumbnail')) style = 'YouTube thumbnail (1280x720)';
            else if (userReqLower.includes('whatsapp')) style = 'WhatsApp status (vertical 1080x1920)';

            finalImagePrompt = `A premium ultra-modern ${style} for AISA™ — Artificial Intelligence Super Assistant by UWO™. Color palette: deep purple (#6C3CE1) to electric blue (#4A90D9) gradient background. Center: Large bold futuristic white text "AISA™". Below it: tagline "Your AI Super Assistant" in clean white. Background elements: glowing AI brain / neural network lines, subtle particle effects, soft light rays. Bottom: "Powered by UWO™" in small white text. Style: Apple / Google product launch level quality. No human faces. No random photos. Pure digital graphic product poster.`;
            console.log(`[IMAGE GEN] ✅ AISA product image detected. Using branded prompt.`);
          } else {
            console.log(`[IMAGE GEN] Standard image request. Using AI-generated prompt.`);
          }
          // ===== END AISA INTERCEPT =====

          console.log(`[IMAGE GEN] Calling generator for: ${finalImagePrompt}`);
          const safePrompt = finalImagePrompt.length > 500 ? finalImagePrompt.substring(0, 500) : finalImagePrompt;

          let canGenerate = true;
          let limitUsageData = null;

          if (req.user) {
            try {
              limitUsageData = await subscriptionService.checkLimit(req.user.id, 'image');
            } catch (limitErr) {
              canGenerate = false;
            }
          }

          if (!canGenerate) {
            finalResponse.reply = `Sorry, you have reached your monthly Image generation limit.`;
          } else {
            try {
              const imageUrl = await generateImageFromPrompt(finalImagePrompt);
              if (imageUrl) {
                finalResponse.imageUrl = imageUrl;
                finalResponse.reply = (reply && reply.trim()) ? reply : (isAisaRelatedRequest ? `Yeh raha AISA™ ke liye branded image! 🚀` : `Here is the image you requested.`);
                if (limitUsageData) subscriptionService.incrementUsage(limitUsageData.usage, limitUsageData.usageKey);
              }
            } catch (imgError) {
              console.error(`[IMAGE GEN] Vertex AI generation failed: ${imgError.message}`);
              finalResponse.reply = `Sorry, I couldn't generate the image right now. Please try again.`;
            }
          }
        }
      }

      // Note: Pollinations markdown trigger removed — all images go through Vertex AI

      // Final cleanup: Remove backticks if the model output the JSON inside a code block
      reply = reply.replace(/```json\s*```|```\s*```/g, '').trim();
      // Ensure finalResponse.reply has a value if we didn't hit the blocks above
      if (!finalResponse.reply && !finalResponse.imageUrl && !finalResponse.videoUrl) {
        finalResponse.reply = reply || "Processed your request.";
      } else if (!finalResponse.reply) {
        finalResponse.reply = reply; // Sync back just in case
      }

    } catch (e) {
      console.warn("[MEDIA GEN] Critical failure in media handling logic:", e);
    }

    if (voiceConfirmation) {
      finalResponse.voiceConfirmation = voiceConfirmation;
    }

    if (conversionResult) {
      if (conversionResult.success) {
        finalResponse.conversion = {
          file: conversionResult.file,
          fileName: conversionResult.fileName,
          mimeType: conversionResult.mimeType
        };
        finalResponse.reply = conversionResult.message || reply;
      } else {
        finalResponse.reply = `Conversion failed: ${conversionResult.error}`;
      }
    }

    const mUserId = req.user ? req.user.id : (req.guest ? req.guest.id : null);
    if (finalResponse.reply) {
      memoryService.saveMessageWithEmbedding(sessionId, mUserId, 'assistant', finalResponse.reply);
    }

    if (req.user) {
      extractUserMemory(content, history).then(mem => updateMemory(req.user.id, mem, detectedMode));
    }


    return res.status(200).json(finalResponse);
  } catch (err) {
    if (mongoose.connection.readyState !== 1) {
      console.warn('[DB] MongoDB unreachable during generation. Returning translation key.');
      return res.status(200).json({ reply: "dbDemoModeMessage", detectedMode: 'NORMAL_CHAT' });
    }
    const fs = await import('fs');
    try {
      const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      const logData = `
Timestamp: ${new Date().toISOString()}
Error: ${err.message}
Code: ${err.code}
Env Project: ${process.env.GCP_PROJECT_ID}
Env Creds Path: '${credPath}'
Creds File Exists: ${credPath ? fs.existsSync(credPath) : 'N/A'}
Stack: ${err.stack}
-------------------------------------------
`;
      fs.appendFileSync('error.log', logData);
    } catch (e) { console.error("Log error:", e); }

    console.error("AISA backend error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      details: err.details || err.response?.data
    });
    const statusCode = err.status || 500;
    return res.status(statusCode).json({ error: "AI failed to respond", details: err.message });
  }
});
// Get all chat sessions (summary) for the authenticated user or guest
router.get('/', optionalVerifyToken, identifyGuest, async (req, res) => {
  try {
    const userId = req.user?.id;
    const guestId = req.guest?.guestId;

    if (!userId && !guestId) {
      return res.json([]);
    }

    // Check DB connection
    if (mongoose.connection.readyState !== 1) {
      console.warn('[DB] MongoDB unreachable. Returning empty sessions.');
      return res.json([]);
    }

    let sessions = [];

    if (userId) {
      const user = await userModel.findById(userId).populate({
        path: 'chatSessions',
        select: 'sessionId title lastModified userId',
        options: { sort: { lastModified: -1 } }
      });
      sessions = (user?.chatSessions || []).filter(s => s !== null);
    } else if (guestId) {
      // STRICTLY filter by guestId for non-logged-in users
      sessions = await ChatSession.find({ guestId: guestId })
        .select('sessionId title lastModified guestId')
        .sort({ lastModified: -1 });
    } else {
      // No user, no guest ID -> No sessions should be returned
      return res.json([]);
    }

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get chat history for a specific session
router.get('/:sessionId', optionalVerifyToken, identifyGuest, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;
    const guestId = req.guest?.guestId;

    // Check DB connection
    if (mongoose.connection.readyState !== 1) {
      console.warn('[DB] MongoDB unreachable. Returning empty history.');
      return res.json({ sessionId, messages: [] });
    }

    // Verify that the session belongs to this user or guest
    let session = await ChatSession.findOne({ sessionId });

    if (!session) {
      console.warn(`[CHAT] Session ${sessionId} not found in DB.`);
      return res.status(404).json({ message: 'Session not found' });
    }

    // Ownership check
    if (userId) {
      if (session.userId && session.userId.toString() !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      // If session is unowned, try to link it to the logged-in user
      if (!session.userId) {
        const currentGuestId = req.cookies.aisa_guest_id;
        const fingerprint = req.headers['x-device-fingerprint'];

        let canLink = (session.guestId === currentGuestId);

        if (!canLink && fingerprint) {
          const guestByFingerprint = await Guest.findOne({ fingerprint });
          if (guestByFingerprint && guestByFingerprint.guestId === session.guestId) {
            canLink = true;
          }
        }

        // Emergency fallback: If it's a guest session and user is accessing it right after login
        // we can be slightly more lenient if needed, but fingerprint/cookie covers most cases.

        if (canLink || !session.guestId) { // !session.guestId handles legacy/edge cases
          session.userId = userId;
          await session.save();
          await userModel.findByIdAndUpdate(userId, { $addToSet: { chatSessions: session._id } });
          console.log(`[CHAT] Linked guest session ${sessionId} to user ${userId}`);
        }
      }
    } else if (guestId) {
      if (session.guestId !== guestId) {
        return res.status(403).json({ error: "Access denied" });
      }
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(`[CHAT] Found session ${sessionId} with ${session.messages?.length || 0} messages.`);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Create or Update message in session
router.post('/:sessionId/message', optionalVerifyToken, identifyGuest, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, title } = req.body;
    const userId = req.user?.id;
    const guest = req.guest;

    if (!message?.role || !message?.content) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    // Enforce limits for guests
    const limitCheck = await checkGuestLimits(req, sessionId);
    if (!limitCheck.allowed) {
      return res.status(403).json({ error: "LIMIT_REACHED", reason: limitCheck.reason });
    }

    // Cloudinary Upload Logic for Multiple Attachments
    if (message.attachments && Array.isArray(message.attachments)) {
      for (const attachment of message.attachments) {
        if (attachment.url && attachment.url.startsWith('data:')) {
          try {
            const matches = attachment.url.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
              const mimeType = matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');

              // Upload to Cloudinary
              const uploadResult = await uploadToCloudinary(buffer, {
                resource_type: 'auto',
                folder: 'chat_attachments',
                public_id: `chat_${sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              });

              // Update attachment with Cloudinary URL
              attachment.url = uploadResult.secure_url;
            }
          } catch (uploadError) {
            console.error("Cloudinary upload failed for attachment:", uploadError);
          }
        }
      }
    }

    // Check DB connection
    if (mongoose.connection.readyState !== 1) {
      console.warn('[DB] MongoDB unreachable. Skipping message save.');
      return res.json({ sessionId, messages: [message], dummy: true });
    }

    // Ownership check before saving
    let existingSession = await ChatSession.findOne({ sessionId });
    if (existingSession) {
      if (userId) {
        if (existingSession.userId && existingSession.userId.toString() !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
        if (!existingSession.userId && existingSession.guestId) {
          const currentGuestId = req.cookies.aisa_guest_id;
          const fingerprint = req.headers['x-device-fingerprint'];
          let canLink = (existingSession.guestId === currentGuestId);
          if (!canLink && fingerprint) {
            const guestByFingerprint = await Guest.findOne({ fingerprint });
            if (guestByFingerprint && guestByFingerprint.guestId === existingSession.guestId) {
              canLink = true;
            }
          }
          if (!canLink) return res.status(403).json({ error: "Access denied" });
        }
      } else if (guest) {
        if (existingSession.guestId && existingSession.guestId !== guest.guestId) {
          return res.status(403).json({ error: "Access denied" });
        }
      }
    }

    const updateData = {
      $push: { messages: message },
      $set: {
        lastModified: Date.now(),
        ...(title && { title })
      }
    };

    if (userId) {
      updateData.$set.userId = userId;
    } else if (guest) {
      updateData.$set.guestId = guest.guestId;
    }

    const session = await ChatSession.findOneAndUpdate(
      { sessionId },
      updateData,
      { new: true, upsert: true }
    );

    // Update guest's sessionIds tracker if guest session
    if (guest && !guest.sessionIds.includes(sessionId)) {
      guest.sessionIds.push(sessionId);
      await guest.save();
    }

    // If logged in, associate with user profile
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      await userModel.findByIdAndUpdate(
        userId,
        { $addToSet: { chatSessions: session._id } },
        { new: true }
      );
      console.log(`[CHAT] Associated session ${session._id} with user ${userId}.`);
    }

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});


// Delete individual message from session
router.delete('/:sessionId/message/:messageId', optionalVerifyToken, identifyGuest, async (req, res) => {
  try {
    const { sessionId, messageId } = req.params;
    const userId = req.user?.id;
    const guestId = req.guest?.guestId;

    // Optional: Also delete the subsequent model response if it exists
    // (Logic moved from frontend to backend for consistency)
    const session = await ChatSession.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Ownership check
    if (userId) {
      if (session.userId && session.userId.toString() !== userId) return res.status(403).json({ error: 'Access denied' });
    } else if (guestId) {
      if (session.guestId !== guestId) return res.status(403).json({ error: 'Access denied' });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const msgIndex = session.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return res.status(404).json({ error: 'Message not found' });

    const msgsToDelete = [messageId];
    if (msgIndex + 1 < session.messages.length) {
      const nextMsg = session.messages[msgIndex + 1];
      if (nextMsg && nextMsg.role === 'model' && nextMsg.id) {
        msgsToDelete.push(nextMsg.id);
      }
    }

    // Filter out any undefined/null IDs just in case
    const validMsgsToDelete = msgsToDelete.filter(id => id);

    console.log(`[DELETE] Session: ${sessionId}, Removing IDs:`, validMsgsToDelete);

    if (validMsgsToDelete.length > 0) {
      await ChatSession.findOneAndUpdate(
        { sessionId },
        { $pull: { messages: { id: { $in: validMsgsToDelete } } } }
      );
    }

    res.json({ success: true, removedCount: validMsgsToDelete.length });
  } catch (err) {
    console.error(`[DELETE ERROR] Session: ${req.params.sessionId}, Msg: ${req.params.messageId}`, err);
    res.status(500).json({
      error: 'Failed to delete message',
      details: err.message
    });
  }
});

// (The POST /:sessionId/message route is defined above around line 702)

// Update chat session title
router.patch('/:sessionId/title', optionalVerifyToken, identifyGuest, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    const userId = req.user?.id;
    const guestId = req.guest?.guestId;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    if (mongoose.connection.readyState !== 1) {
      console.warn('[DB] MongoDB unreachable during rename.');
      return res.status(503).json({ error: 'Database unavailable' });
    }

    const session = await ChatSession.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Ownership check
    if (userId) {
      if (session.userId && session.userId.toString() !== userId) return res.status(403).json({ error: 'Access denied' });
    } else if (guestId) {
      if (session.guestId !== guestId) return res.status(403).json({ error: 'Access denied' });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    session.title = title;
    session.lastModified = Date.now();
    if (userId && !session.userId) session.userId = userId; // Claim ownership if unclaimed
    await session.save();

    if (!session) {
      console.warn(`[CHAT] Rename failed: Session ${sessionId} not found or not owned by ${userId}`);
      return res.status(404).json({ error: 'Session not found or access denied' });
    }

    console.log(`[CHAT] Successfully renamed session ${sessionId} to "${title}" for user ${userId}`);
    res.json(session);
  } catch (err) {
    console.error(`[CHAT RENAME ERROR] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:sessionId', optionalVerifyToken, identifyGuest, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;
    const guestId = req.guest?.guestId;

    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: 'History cleared (Mock)' });
    }

    const session = await ChatSession.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Ownership check
    if (userId) {
      if (session.userId && session.userId.toString() !== userId) {
        // Allow if linking logic applies? No, strict deletion.
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (guestId) {
      if (session.guestId !== guestId) return res.status(403).json({ error: 'Access denied' });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await ChatSession.deleteOne({ sessionId });

    if (userId) {
      await userModel.findByIdAndUpdate(userId, { $pull: { chatSessions: session._id } });
    }
    res.json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================
// PDF UPLOAD ENDPOINT — for WhatsApp/In-App sharing
// Accepts PDF blob, uploads to Cloudinary, returns public URL
// =========================================================

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'raw',
      folder: 'aisa_pdfs',
      format: 'pdf',
      public_id: `aisa_pdf_${Date.now()}`,
    });
    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('[PDF UPLOAD ERROR]', err);
    return res.status(500).json({ error: 'PDF upload failed', details: err.message });
  }
});

export default router;
