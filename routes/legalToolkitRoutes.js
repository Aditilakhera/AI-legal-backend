// import express from 'express';
// import { verifyToken } from '../middleware/authorization.js';
// import { creditMiddleware } from '../middleware/creditSystem.js';
// import { generateChatResponse } from '../services/geminiService.js';
// import { getLegalPrompt, LEGAL_DISCLAIMER } from '../services/legal/legalPrompts.js';
// import { getToolByName } from '../services/intent/toolRegistry.js';
// import logger from '../utils/logger.js';

// const router = express.Router();

// /**
//  * POST /api/legal-toolkit/execute
//  * Executes a specific legal tool with specialized system prompts.
//  */
// router.post('/execute', verifyToken, creditMiddleware, async (req, res) => {
//     try {
//         const { message, toolName, sessionId, attachments = [], conversationHistory = [] } = req.body;

//         if (!toolName) {
//             return res.status(400).json({ success: false, error: 'toolName is required' });
//         }

//         const tool = getToolByName(toolName);
//         if (!tool) {
//             return res.status(404).json({ success: false, error: `Tool ${toolName} not found` });
//         }

//         // ── Get specialized legal prompt ────────────────────────────────────────
//         const systemPrompt = getLegalPrompt(toolName);

//         logger.info(`[LegalToolkit] Executing ${toolName} for user ${req.user?._id || 'unknown'}`);

//         // ── Call AI Service ─────────────────────────────────────────────────────
//         // We use geminiService for high-quality reasoning and large context
//         const responseData = await generateChatResponse(
//             conversationHistory,
//             message,
//             systemPrompt,
//             attachments,
//             'English', // Default to English for professional legal docs
//             null,
//             'LEGAL_TOOLKIT',
//             null // Project ID handled by chatStorageService if needed
//         );

//         if (responseData && responseData.reply) {
//             // Append disclaimer to legal output
//             const finalReply = responseData.reply + LEGAL_DISCLAIMER;

//             return res.json({
//                 success: true,
//                 reply: finalReply,
//                 toolUsed: toolName,
//                 creditsUsed: tool.creditCost || 0,
//                 suggestions: responseData.suggestions || []
//             });
//         } else {
//             throw new Error('Empty response from AI service');
//         }

//     } catch (error) {
//         logger.error(`[LegalToolkit] Error: ${error.message}`);
//         res.status(500).json({
//             success: false,
//             error: 'Legal tool execution failed',
//             details: error.message
//         });
//     }
// });

// export default router;
// import express from 'express';
// import { verifyToken } from '../middleware/authorization.js';
// import { creditMiddleware } from '../middleware/creditSystem.js';
// import { generateChatResponse } from '../services/geminiService.js';
// import { getLegalPrompt, LEGAL_DISCLAIMER } from '../services/legal/legalPrompts.js';
// import { getToolByName } from '../services/intent/toolRegistry.js';
// import logger from '../utils/logger.js';

// const router = express.Router();

// /**
//  * POST /api/legal-toolkit/execute
//  * Executes a specific legal tool with STRICT SYSTEM CONTROL
//  */
// router.post('/execute', verifyToken, creditMiddleware, async (req, res) => {
//     try {
//         const { message, toolName, attachments = [] } = req.body;

//         if (!toolName) {
//             return res.status(400).json({ success: false, error: 'toolName is required' });
//         }

//         const tool = getToolByName(toolName);
//         if (!tool) {
//             return res.status(404).json({ success: false, error: `Tool ${toolName} not found` });
//         }

//         // 🔥 STEP 1: Get strict legal prompt
//         const systemPrompt = getLegalPrompt(toolName);

//         logger.info(`[LegalToolkit] Executing ${toolName} for user ${req.user?._id || 'unknown'}`);

//         // 🔥 STEP 2: Force clean message (tool mode)
//          const cleanMessage = `🚨 TOOL MODE ACTIVE: ${toolName}\n\n${message}`;

//         // 🔥 STEP 3: REMOVE conversation history (CRITICAL FIX)
//         const responseData = await generateChatResponse(
//             [], // ❗ NO history → prevents override
//             cleanMessage,
//             systemPrompt,
//             attachments,
//             'English',
//             null,
//             'LEGAL_TOOLKIT',
//             null
//         );

//         if (responseData && responseData.reply) {

//             let finalReply = responseData.reply;

//             // 🔥 STEP 4: Ensure tool header exists (UI fix)
//             if (!finalReply.includes('[ACTIVE TOOL:')) {
//                 const toolDisplayName = tool.name || toolName;
//                 finalReply = `[ACTIVE TOOL: ${toolDisplayName}]\n\n` + finalReply;
//             }

//             // 🔥 STEP 5: Append disclaimer safely
//             finalReply = finalReply + '\n\n' + LEGAL_DISCLAIMER;

//             return res.json({
//                 success: true,
//                 reply: finalReply,
//                 toolUsed: toolName,
//                 creditsUsed: tool.creditCost || 0,
//                 suggestions: responseData.suggestions || []
//             });

//         } else {
//             throw new Error('Empty response from AI service');
//         }

//     } catch (error) {
//         logger.error(`[LegalToolkit] Error: ${error.message}`);

//         return res.status(500).json({
//             success: false,
//             error: 'Legal tool execution failed',
//             details: error.message
//         });
//     }
// });

// export default router;
import express from 'express';
import { verifyToken } from '../middleware/authorization.js';
import { creditMiddleware } from '../middleware/creditSystem.js';
import { generateChatResponse } from '../services/geminiService.js';
import { getToolByName } from '../services/intent/toolRegistry.js';
import { getLegalPrompt, LEGAL_DISCLAIMER } from '../services/legal/legalPrompts.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * Note: getStrictToolPrompt was removed in favor of centralized services/legal/legalPrompts.js
 */

/**
 * POST /api/legal-toolkit/execute
 */
router.post('/execute', verifyToken, creditMiddleware, async (req, res) => {
    try {
        const {
            message,
            toolName,
            sessionId,
            attachments = [],
            conversationHistory = []
        } = req.body;

        if (!toolName) {
            return res.status(400).json({
                success: false,
                error: 'toolName is required'
            });
        }

        const tool = getToolByName(toolName);
        if (!tool) {
            return res.status(404).json({
                success: false,
                error: `Tool ${toolName} not found`
            });
        }

        // 🔥 STEP 1: Get STRICT TOOL PROMPT from Centralized Service
        const systemPrompt = getLegalPrompt(toolName);

        // 🔥 STEP 2: FORCE TOOL MODE (ALIGNED WITH DRAFT-FIRST WORKFLOW)
        const isArgumentBuilder = toolName === 'legal_argument_builder';
        const enforcedMessage = isArgumentBuilder 
            ? `🚨 TOOL MODE ACTIVE: ${toolName}\n\nSTRICT INSTRUCTIONS:\n- DO NOT generate a PREVIEW DRAFT.\n- DO NOT ask for MISSING DETAILS.\n- Provide the final structured arguments directly.\n\nUser Request:\n${message}`
            : `🚨 TOOL MODE ACTIVE: ${toolName}\n\nSTRICT INSTRUCTIONS:\n- You MUST follow the tool workflow defined in the system prompt.\n- ALWAYS generate a PREVIEW DRAFT even if some details are missing.\n- Use [Placeholders] for any missing information.\n- Provide the list of missing details AFTER the draft.\n\nUser Request:\n${message}`;

        logger.info(`[LegalToolkit] Tool: ${toolName} | User: ${req.user?._id}`);

        // 🔥 STEP 3: CALL AI
        const responseData = await generateChatResponse(
            conversationHistory,
            enforcedMessage,
            systemPrompt,
            attachments,
            null, // Auto-detect language (English/Hindi/Hinglish)
            null,
            'LEGAL_TOOLKIT',
            sessionId,
            null, // projectId
            toolName
        );


        if (!responseData || !responseData.reply) {
            throw new Error('Empty response from AI');
        }

        // 🔥 STEP 4: FINAL RESPONSE CLEAN + TOOL TAG + DISCLAIMER
        let finalReply = responseData.reply.trim();
        
        // 🧪 SAFETY: Strip any legacy disclaimers if they appear at the top from model hallucinations
        const disclaimerRegex = /^(⚠️|🚨)?[ \t]*(IMPORTANT|DISCLAIMER|NOTICE):.*?\n+/i;
        finalReply = finalReply.replace(disclaimerRegex, '').trim();

        // 🔗 ATTACH CENTRAL DISCLAIMER AT THE VERY BOTTOM
        finalReply = finalReply + '\n\n' + LEGAL_DISCLAIMER;


        return res.json({
            success: true,
            reply: finalReply,
            toolUsed: toolName,
            creditsUsed: tool.creditCost || 0,
            suggestions: responseData.suggestions || []
        });

    } catch (error) {
        logger.error(`[LegalToolkit] Error: ${error.message}`);

        return res.status(500).json({
            success: false,
            error: 'Legal tool execution failed',
            details: error.message
        });
    }
});

export default router;