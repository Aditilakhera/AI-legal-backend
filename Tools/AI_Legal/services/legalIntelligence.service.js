import * as vertexService from '../../../services/vertex.service.js';
import logger from '../../../utils/logger.js';
import { safeParseLLMJson } from '../../../utils/jsonUtils.js';

/**
 * analyzeCaseDetails
 * Analyzes case details using AI and returns structured legal intelligence.
 */
export const analyzeCaseDetails = async (rawText, currentData = {}) => {
    const prompt = [
        'You are an advanced autonomous Legal Intelligence Engine.',
        'Your job is to fully analyze a legal case and generate COMPLETE structured output for a legal dashboard system.',
        '',
        '-------------------------------------',
        '⚠️ CRITICAL RULES (MUST FOLLOW):',
        '1. Output ONLY valid JSON',
        '2. Do NOT return any explanation or text outside JSON',
        '3. Do NOT leave any field empty',
        '4. If input data is incomplete, intelligently generate realistic legal assumptions',
        '5. NEVER return null or empty arrays',
        '6. Ensure all sections are filled with meaningful data',
        '7. If analysis fails, return fallback structured data (do NOT break JSON)',
        '-------------------------------------',
        '',
        'INPUT CASE:',
        `Case Summary: ${rawText}`,
        `Client: ${currentData.clientName || 'Not specified'}`,
        `Opponent: ${currentData.opponentName || 'Not specified'}`,
        `Case Type: ${currentData.caseType || 'Not specified'}`,
        '-------------------------------------',
        '',
        'OUTPUT FORMAT (STRICT):',
        JSON.stringify({
            executive_summary: "Clear summary of the case",
            case_strength: 0,
            win_probability: 0,
            timeline: [{
                title: "Event title",
                description: "Explanation",
                date: "YYYY-MM-DD (e.g. 2025-01-15, estimate if approximate/relative)",
                displayDate: "Human readable date string (e.g. 15 Jan 2025 or within 30 days)",
                isApproximate: true,
                category: "Agreement/Contract/Possession/...",
                importance: "High/Medium/Low",
                confidence: "High/Medium/Low"
            }],
            limitation_warnings: [{ title: "Recovery suit limitation", description: "Recovery suit limitation expires on 15 Apr 2028." }],
            upcoming_deadlines: [{ title: "Summons Notice", description: "Defendant must appear before court within 10 days." }],
            missing_documents: [{ title: "Sale Deed missing", description: "Sale Deed is missing from case file." }],
            parties: {
                plaintiff: { name: "Name", role: "Role" },
                defendant: { name: "Name", role: "Role" }
            },
            evidence: [{ title: "Evidence name", type: "document/email/witness", description: "Details", strength: "weak/medium/strong" }],
            legal_research: [{ law: "Law name", section: "Section", description: "Explanation" }],
            process_steps: [{ step: "Legal step", priority: "low/medium/high" }],
            risk_assessment: { level: "low/medium/high", reason: "Why" },
            critical_vulnerabilities: ["Weakness 1", "Weakness 2"],
            opponent_strategy: ["Possible opponent move"],
            primary_relief: "What the user wants legally",
            strategy_recommendation: ["Step 1", "Step 2"]
        }, null, 2),
        '',
        '-------------------------------------',
        '📊 QUALITY CONSTRAINTS:',
        '- timeline MUST have at least 3 events',
        '- timeline date field MUST be normalized to YYYY-MM-DD. Estimate the date as YYYY-MM-DD if relative or approximate (e.g. "three months later").',
        '- if date is relative or approximate, displayDate should contain the relative/approximate string, and isApproximate must be true.',
        '- timeline categories MUST be one of: Case Filing, Agreement, Contract, Property, Payment, Notice, Default, Police, Court, Hearing, Evidence, Registration, Possession, Communication, Reply, Judgment, Deadline, Document, AI Generated, Other.',
        '- timeline importance MUST be one of: High, Medium, Low. Use High for Agreement Signed, Legal Notice, FIR Filed, Court Filing, Registration, Judgment, Possession; Medium for Payment, Communication, Reminder, Meeting; Low for Internal notes/misc updates.',
        '- limitation_warnings: Identify any legal limitation warnings based on the events (e.g. recovery suit limitation, filing deadlines under relevant acts).',
        '- upcoming_deadlines: Identify key procedural deadlines (e.g. appearance before court, response windows).',
        '- missing_documents: Identify any documents that are legally required but missing from the case context.',
        '- evidence MUST have at least 2 items',
        '- legal_research MUST include real applicable laws (prefer Indian laws if relevant)',
        '- process_steps MUST be realistic legal workflow',
        '- risk_assessment MUST NOT be empty',
        '- strategy_recommendation MUST be actionable',
        '',
        '-------------------------------------',
        '🛑 FAILSAFE MODE:',
        'If you cannot analyze properly, STILL return full JSON using intelligent assumptions.',
        'Example fallback:',
        '- Generate reasonable timeline',
        '- Generate generic but realistic evidence',
        '- Assign medium risk',
        '- Provide general legal strategy',
        '',
        '-------------------------------------',
        'FINAL INSTRUCTION:',
        'Return ONLY JSON.',
        'No markdown.',
        'No explanation.',
        'No extra text.'
    ].join('\n');
 
    try {
        const response = await vertexService.AskVertexRaw(prompt, {
            maxOutputTokens: 3000,
            temperature: 0.1,
            modelOverride: 'gemini-2.5-flash',
            isJson: true
        });
 
        const fallback = {
            executive_summary: `AI Analysis Error: The system could not process the request. It returned: "${response.substring(0, 200)}..."`,
            case_strength: 0,
            win_probability: 0,
            timeline: [],
            limitation_warnings: [],
            upcoming_deadlines: [],
            missing_documents: [],
            parties: { plaintiff: { name: "Unknown", role: "Unknown" }, defendant: { name: "Unknown", role: "Unknown" } },
            evidence: [],
            legal_research: [],
            process_steps: [],
            risk_assessment: { level: "high", reason: "AI Analysis failed to return structured data." },
            critical_vulnerabilities: ["Data parsing failed."],
            opponent_strategy: [],
            primary_relief: "Unknown",
            strategy_recommendation: ["Please try running the analysis again or contact support if the issue persists."]
        };
 
        return safeParseLLMJson(response, fallback);
    } catch (error) {
        logger.error(`[LegalIntelligence] Analysis failed: ${error.message}`);
        logger.error(`[LegalIntelligence] Stack trace: ${error.stack}`);
        
        // Return fallback instead of throwing to prevent 500 error
        return {
            executive_summary: `AI Request Failed: ${error.message}`,
            case_strength: 0,
            win_probability: 0,
            timeline: [],
            limitation_warnings: [],
            upcoming_deadlines: [],
            missing_documents: [],
            parties: { plaintiff: { name: "Unknown", role: "Unknown" }, defendant: { name: "Unknown", role: "Unknown" } },
            evidence: [],
            legal_research: [],
            process_steps: [],
            risk_assessment: { level: "high", reason: "Backend request failed." },
            critical_vulnerabilities: [],
            opponent_strategy: [],
            primary_relief: "Unknown",
            strategy_recommendation: []
        };
    }
};

/**
 * analyzeDocumentContent
 * Extracts structured data from a specific document.
 */
export const analyzeDocumentContent = async (content, fileName) => {
    const prompt = [
        'Analyze the following legal document and extract key information.',
        `File: ${fileName}`,
        '',
        'Content:',
        content,
        '',
        'Return ONLY this JSON structure:',
        JSON.stringify({
            docType: "Notice",
            tags: ["tag1", "tag2"],
            summary: "Short summary of the document",
            keyClauses: [{ title: "Clause Name", description: "Why it matters" }]
        }, null, 2)
    ].join('\n');

    try {
        const response = await vertexService.AskVertexRaw(prompt, {
            maxOutputTokens: 1024,
            temperature: 0.1,
            modelOverride: 'gemini-2.5-flash',
            isJson: true
        });

        return safeParseLLMJson(response);
    } catch (error) {
        logger.error(`[LegalIntelligence] Document analysis failed: ${error.message}`);
        logger.error(`[LegalIntelligence] Stack trace: ${error.stack}`);
        return null;
    }
};

/**
 * enrichHearingDetails
 * Analyzes hearing notes or court order texts and extracts/generates structured data.
 */
export const enrichHearingDetails = async (notes, documentText, documentName) => {
    const prompt = [
        'You are an advanced autonomous Legal Intelligence Engine.',
        'Your job is to analyze case hearing notes or a court order text, and extract structured legal hearing info.',
        '',
        '-------------------------------------',
        'INPUT CASE DETAIL:',
        notes ? `Advocate Notes: ${notes}` : '',
        documentText ? `Order Document Content: ${documentText}` : '',
        documentName ? `Document File Name: ${documentName}` : '',
        '-------------------------------------',
        '',
        '⚠️ CRITICAL RULES (MUST FOLLOW):',
        '1. Output ONLY valid JSON.',
        '2. Do NOT return any markdown formatting or text outside the JSON.',
        '3. Extract or intelligently infer the following structured fields.',
        '4. Extract or infer checklist items for Preparation (documents, evidence, witnesses, compliance). Each checklist item MUST have a title and a checked boolean (default false). For compliance items, set status to "Pending".',
        '5. If a next hearing date or compliance deadline is detected, return it in YYYY-MM-DD or standard display format.',
        '6. Keep summaries concise and professional.',
        '',
        'OUTPUT FORMAT (STRICT):',
        JSON.stringify({
            courtName: "Extracted Court Name",
            judge: "Extracted Judge Name",
            hearingDate: "YYYY-MM-DD or date string",
            nextHearingDate: "YYYY-MM-DD or date string",
            courtroom: "Extracted Courtroom/Room Number",
            title: "Descriptive hearing title",
            purpose: "Purpose of this hearing",
            notes: "Refined/cleaned advocate notes or summary",
            orderSummary: "AI summary of orders passed (e.g. Interim injunction granted. Defendant ordered to file Written Statement within 30 days.)",
            isAiEnriched: true,
            checklist: {
                documents: [{ title: "Original Agreement", checked: false }],
                evidence: [{ title: "Proof of Payment", checked: false }],
                witnesses: [{ title: "Plaintiff Witness 1", checked: false }],
                compliance: [
                    { title: "Written Statement", checked: false, status: "Pending" },
                    { title: "Affidavit Submission", checked: false, status: "Pending" }
                ]
            }
        }, null, 2),
        '',
        '-------------------------------------',
        'FINAL INSTRUCTION:',
        'Return ONLY JSON.'
    ].join('\n');

    try {
        const response = await vertexService.AskVertexRaw(prompt, {
            maxOutputTokens: 2500,
            temperature: 0.1,
            modelOverride: 'gemini-2.5-flash',
            isJson: true
        });

        const fallback = {
            courtName: "",
            judge: "",
            hearingDate: "",
            nextHearingDate: "",
            courtroom: "",
            title: "Enriched Court Hearing",
            purpose: "Court Proceeding",
            notes: notes || "AI analysis completed.",
            orderSummary: "Summary could not be parsed from document content.",
            isAiEnriched: true,
            checklist: {
                documents: [],
                evidence: [],
                witnesses: [],
                compliance: []
            }
        };

        return safeParseLLMJson(response, fallback);
    } catch (error) {
        logger.error(`[LegalIntelligence] enrichHearingDetails failed: ${error.message}`);
        return null;
    }
};
