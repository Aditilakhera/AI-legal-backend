import * as vertexService from '../../../services/vertex.service.js';
import logger from '../../../utils/logger.js';
import { safeParseLLMJson } from '../../../utils/jsonUtils.js';

/**
 * analyzeCaseDetails
 * Analyzes case details using AI and returns structured legal intelligence.
 */
export const analyzeCaseDetails = async (rawText, currentData = {}, language = 'English') => {
    let languageInstruction = '';
    if (language === 'Hindi') {
        languageInstruction = 'Please generate all description, summary, explanation, and title text values in Hindi. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers. Keep them in their original form.';
    } else if (language === 'Bilingual') {
        languageInstruction = 'Please generate all description, summary, explanation, and title text values in Bilingual style (English + Hindi). Use English for structural titles/terms, and Hindi for descriptions/explanations. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Gujarati') {
        languageInstruction = 'Please generate all description, summary, explanation, and title text values in Gujarati. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Marathi') {
        languageInstruction = 'Please generate all description, summary, explanation, and title text values in Marathi. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Tamil') {
        languageInstruction = 'Please generate all description, summary, explanation, and title text values in Tamil. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    }

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
        languageInstruction ? `🌐 LANGUAGE INSTRUCTION:\n${languageInstruction}\n-------------------------------------` : '',
        'FINAL INSTRUCTION:',
        'Return ONLY JSON.',
        'No markdown.',
        'No explanation.',
        'No extra text.'
    ].join('\n');
 
    try {
        const response = await vertexService.AskVertexRaw(prompt, {
            maxOutputTokens: 8192,
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
export const enrichHearingDetails = async (notes, documentText, documentName, language = 'English') => {
    let languageInstruction = '';
    if (language === 'Hindi') {
        languageInstruction = 'Please generate all notes, purpose, title, orderSummary, and checklist item text values in Hindi. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers. Keep them in their original form.';
    } else if (language === 'Bilingual') {
        languageInstruction = 'Please generate all notes, purpose, title, orderSummary, and checklist item text values in Bilingual style (English + Hindi). Use English for structural titles/terms, and Hindi for descriptions/explanations. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Gujarati') {
        languageInstruction = 'Please generate all notes, purpose, title, orderSummary, and checklist item text values in Gujarati. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Marathi') {
        languageInstruction = 'Please generate all notes, purpose, title, orderSummary, and checklist item text values in Marathi. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Tamil') {
        languageInstruction = 'Please generate all notes, purpose, title, orderSummary, and checklist item text values in Tamil. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    }

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
        languageInstruction ? `🌐 LANGUAGE INSTRUCTION:\n${languageInstruction}\n-------------------------------------` : '',
        'FINAL INSTRUCTION:',
        'Return ONLY JSON.'
    ].join('\n');

    try {
        const response = await vertexService.AskVertexRaw(prompt, {
            maxOutputTokens: 8192,
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

/**
 * generateCompleteCaseAnalysis
 * Exhaustive case intelligence analysis generating the Step 3 report sections.
 */
export const generateCompleteCaseAnalysis = async (project, readinessScore = 100, language = 'English') => {
    let languageInstruction = '';
    if (language === 'Hindi') {
        languageInstruction = 'Please generate all analysis text fields (such as caseSummary, litigationStrategy, settlementPossibility, judgePreparation, crossExaminationNotes) and items in list arrays (such as weaknesses, contradictions, recommendations, questions) in Hindi. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers. Keep them in their original form.';
    } else if (language === 'Bilingual') {
        languageInstruction = 'Please generate all analysis text fields (such as caseSummary, litigationStrategy, settlementPossibility, judgePreparation, crossExaminationNotes) and items in list arrays (such as weaknesses, contradictions, recommendations, questions) in Bilingual style (English + Hindi). Use English for structural titles/terms, and Hindi for descriptions/explanations. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Gujarati') {
        languageInstruction = 'Please generate all analysis text fields and items in list arrays in Gujarati. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Marathi') {
        languageInstruction = 'Please generate all analysis text fields and items in list arrays in Marathi. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers.';
    } else if (language === 'Tamil') {
        languageInstruction = 'Please generate all analysis text fields and items in list arrays in Tamil. Do NOT translate client names, case numbers, evidence names, file numbers, emails, and legal section numbers.';
    }

    const caseTimeline = (project.facts || []).map(f => `${f.date || f.displayDate || 'N/A'}: ${f.title || ''} - ${f.description || ''}`).join('\n');
    const caseHearings = (project.hearings || []).map(h => `${h.date || ''} ${h.time || ''}: ${h.title || ''} (Court: ${h.courtName || ''}, Judge: ${h.judge || ''}, Room: ${h.courtroom || ''}). Notes: ${h.notes || ''}. Enriched: ${h.orderSummary || ''}`).join('\n');
    const caseEvidence = (project.evidence || []).map(e => `${e.exhibitNumber || 'Exhibit'}: ${e.name || ''} (Type: ${e.type || ''}, Status: ${e.status || ''}). Desc: ${e.description || ''}. Notes: ${e.notes || ''}`).join('\n');
    const caseDocuments = (project.documents || []).map(d => `${d.name || ''} (Type: ${d.type || ''})`).join('\n');
    const caseResearch = (project.research || []).map(r => `${r.lawName || ''} Sec ${r.section || ''}: ${r.description || ''}`).join('\n');
    const caseTasks = (project.tasks || []).map(t => `${t.title || ''} (Status: ${t.status || ''}, Priority: ${t.priority || ''}, Deadline: ${t.deadline || ''})`).join('\n');
    const caseNotes = (project.notes || []).map(n => `Title: ${n.title || ''}\nContent: ${n.content || ''}\nSummary: ${n.aiSummary?.shortSummary || ''}`).join('\n---\n');
    const courtOrders = (project.courtOrders || []).map(o => `${o.name || ''} (${o.metadata?.orderType || ''}): Summary: ${o.aiSummary?.shortSummary || ''}. Compliance: ${(o.complianceItems || []).map(c => (c.description || '') + ' [' + (c.status || '') + ']').join(', ')}`).join('\n');

    const contextText = [
        `Case Name: ${project.name || 'Unknown'}`,
        `Client Name: ${project.clientName || 'Unknown'}`,
        `Opponent Name: ${project.opponentName || project.accused || 'Unknown'}`,
        `Case Type: ${project.caseType || 'Unknown'}`,
        `Current Stage: ${project.stage || 'Unknown'}`,
        `Priority: ${project.priority || 'Medium'}`,
        `Executive Summary: ${project.summary || project.caseSummary || ''}`,
        `Primary Relief: ${project.reliefGoals || ''}`,
        `Jurisdiction: ${project.courtName || ''}`,
        `Limitation Warnings: ${JSON.stringify(project.limitationWarnings || [])}`,
        `Upcoming Deadlines: ${JSON.stringify(project.upcomingDeadlines || [])}`,
        `Missing Documents: ${JSON.stringify(project.missingDocuments || [])}`,
        `Legal Issues: ${JSON.stringify(project.legalIssues || [])}`,
        `Saved Precedents: ${JSON.stringify(project.savedPrecedents || [])}`,
        '',
        '--- CASE TIMELINE / FACTS ---',
        caseTimeline || 'No timeline facts logged.',
        '',
        '--- HEARINGS ---',
        caseHearings || 'No hearings scheduled.',
        '',
        '--- EVIDENCE VAULT ---',
        caseEvidence || 'No evidence items logged.',
        '',
        '--- UPLOADED DOCUMENTS ---',
        caseDocuments || 'No case documents uploaded.',
        '',
        '--- LEGAL RESEARCH ---',
        caseResearch || 'No research items logged.',
        '',
        '--- TASKS & ASSIGNMENTS ---',
        caseTasks || 'No tasks assigned.',
        '',
        '--- CASE STRATEGIC NOTES ---',
        caseNotes || 'No notes created.',
        '',
        '--- COURT ORDERS & DECREES ---',
        courtOrders || 'No court orders logged.'
    ].join('\n');

    const prompt = [
        'You are an elite AI Co-Counsel and Lead Legal Strategist operating inside a Zero-Hallucination Architecture.',
        'Your task is to perform an exhaustive, complete AI case analysis on the following Case Workspace context.',
        'CRITICAL RULE: DO NOT INVENT or assume any facts, dates, files, timeline events, evidence, court orders, hearings, parties, or recommendations that are not explicitly present in the Case Workspace context.',
        'If information is not available, you MUST output "Information Not Available" or "Not Available" for that field/value, or return an empty array if it is a list of missing information.',
        '',
        'CASE CONTEXT:',
        contextText,
        '',
        '-------------------------------------',
        `READINESS INDICATORS:`,
        `Readiness Score: ${readinessScore}%`,
        '',
        '-------------------------------------',
        '⚠️ ZERO HALLUCINATION RULES (STRICTLY ENFORCED):',
        '1. NO FABRICATIONS: You are strictly forbidden from inventing details, dates, evidence, hearings, laws, or precedents.',
        '2. CITATIONS REQUIRED: Every list item in your output arrays MUST end with a source citation in the format "(Source: <Field Name>)", where <Field Name> is the workspace field supplying the fact.',
        '   For example: "Defendant failed to reply to legal notice on 12 Jan 2026 (Source: Timeline)".',
        '   Valid Field Names are: "Case Summary", "Timeline", "Evidence", "Hearings", "Court Orders", "Legal Research", "Notes".',
        '   If you are referencing multiple fields, combine them: "(Source: Timeline, Evidence)".',
        '   If NO workspace data supports an item, DO NOT generate it. Do not guess.',
        '3. PRECEDENTS & LAW CONSTRAINT:',
        '   - If Case Type, Jurisdiction, or Legal Issue are missing or empty in the Case Context, you MUST bypass landmark precedents citation entirely.',
        '   - Under this constraint, set "supremeCourtJudgments", "highCourtJudgments", and "importantPrecedents" to empty arrays [], or write "Information Not Available". Do NOT invent generic precedents.',
        '4. WIN PROBABILITY CONSTRAINT:',
        `   - If the Readiness Score is low (below 50%), you are FORBIDDEN from calculating a win probability. You MUST set the "winProbability" key to the exact string "Unavailable".`,
        '5. NOT AVAILABLE FALLBACK: If information is unavailable for any string fields, set the value to "Information Not Available". For array fields, if no items are supported by the workspace context, return an empty array [].',
        '',
        '-------------------------------------',
        '⚠️ STAGE 3 - AI OUTPUT SECTIONS REQUIREMENT:',
        'Generate a highly comprehensive, professional legal report matching these exact keys in valid JSON format:',
        '- strengthScore: Number (0-100, case strength score based on timeline facts, evidence quality, laws)',
        '- winProbability: Number (0-100) or String ("Unavailable") (Note: Set to "Unavailable" if readiness score is under 50%)',
        '- caseSummary: String (detailed executive case summary, facts background, legal context. If missing, "Information Not Available")',
        '- majorLegalIssues: Array of strings (main legal questions to be decided. Must cite source.)',
        '- applicableLaws: Array of strings (e.g. "Negotiable Instruments Act, 1881 (Source: Legal Research)")',
        '- applicableSections: Array of strings (specific sections e.g. "Section 138 (Source: Legal Research)")',
        '- supremeCourtJudgments: Array of strings (landmark Supreme Court judgments relevant to this case. Cite source. Leave empty if jurisdiction/caseType/legalIssue is missing)',
        '- highCourtJudgments: Array of strings (relevant High Court rulings. Cite source. Leave empty if jurisdiction/caseType/legalIssue is missing)',
        '- importantPrecedents: Array of strings (key legal precedents to cite in arguments. Cite source. Leave empty if jurisdiction/caseType/legalIssue is missing)',
        '- evidenceStrength: String ("Strong", "Medium", "Weak")',
        '- missingEvidence: Array of strings (specific proof items needed but not in vault. Cite source.)',
        '- weaknesses: Array of strings (risks, procedural gaps, loopholes in our case. Cite source.)',
        '- contradictions: Array of strings (inconsistent statements, timeline mismatch. Cite source.)',
        '- missingDocuments: Array of strings (official filings, certificates or contracts needed. Cite source.)',
        '- pendingHearings: Array of strings (summary of upcoming hearings and action steps. Cite source.)',
        '- pendingTasks: Array of strings (priority checklist to execute. Cite source.)',
        '- riskAssessment: String ("Low", "Medium", "High", "Critical")',
        '- recommendedNextSteps: Array of strings (immediate action plan. Cite source.)',
        '- litigationStrategy: String (complete step-by-step trial/court strategy based only on context. If unavailable, "Information Not Available")',
        '- settlementPossibility: String (feasibility of out-of-court settlement, suggested terms based on context. If unavailable, "Information Not Available")',
        '- questionsToAskClient: Array of strings (critical questions to ask the client to clarify gaps. Cite source.)',
        '- draftRecommendations: Array of strings (documents/contracts/replies to compile next. Cite source.)',
        '- argumentsToUse: Array of strings (winning arguments to advance in pleadings. Cite source.)',
        '- argumentsToAvoid: Array of strings (weak arguments to avoid raising. Cite source.)',
        '- timelineIssues: Array of strings (date calculations, delays, limitation risks. Cite source.)',
        '- limitationRisks: Array of strings (expiration timelines, latches, bar by limitation. Cite source.)',
        '- complianceChecklist: Array of strings (procedural court rules compliance items. Cite source.)',
        '- judgePreparation: String (advice on how to present before the bench based on context. If unavailable, "Information Not Available")',
        '- crossExaminationNotes: String (key pointers/questions for cross-examining opponent witnesses. If unavailable, "Information Not Available")',
        '',
        '-------------------------------------',
        '⚠️ CRITICAL RULES (MUST FOLLOW):',
        '1. Output ONLY valid JSON matching this exact structure.',
        '2. Do NOT return any markdown formatting, backticks, or explanation outside the JSON.',
        '3. Do NOT invent information. If details are missing, return empty arrays or "Information Not Available".',
        '4. Every string inside an array/list MUST include the source citation "(Source: <Field Name>)" referencing one or more of: "Case Summary", "Timeline", "Evidence", "Hearings", "Court Orders", "Legal Research", "Notes".',
        '-------------------------------------',
        languageInstruction ? `🌐 LANGUAGE INSTRUCTION:\n${languageInstruction}\n-------------------------------------` : '',
        'FINAL INSTRUCTION: Return ONLY JSON.'
    ].join('\n');

    try {
        const response = await vertexService.AskVertexRaw(prompt, {
            maxOutputTokens: 8192,
            temperature: 0.1,
            modelOverride: 'gemini-2.5-pro',
            isJson: true
        });

        const fallback = {
            strengthScore: 50,
            winProbability: readinessScore < 50 ? "Unavailable" : 50,
            caseSummary: "Information Not Available",
            majorLegalIssues: [],
            applicableLaws: [],
            applicableSections: [],
            supremeCourtJudgments: [],
            highCourtJudgments: [],
            importantPrecedents: [],
            evidenceStrength: "Medium",
            missingEvidence: [],
            weaknesses: [],
            contradictions: [],
            missingDocuments: [],
            pendingHearings: [],
            pendingTasks: [],
            riskAssessment: "Medium",
            recommendedNextSteps: [],
            litigationStrategy: "Information Not Available",
            settlementPossibility: "Information Not Available",
            questionsToAskClient: [],
            draftRecommendations: [],
            argumentsToUse: [],
            argumentsToAvoid: [],
            timelineIssues: [],
            limitationRisks: [],
            complianceChecklist: [],
            judgePreparation: "Information Not Available",
            crossExaminationNotes: "Information Not Available"
        };

        const parsed = safeParseLLMJson(response, fallback);

        // Programmatic post-processing constraints for zero-hallucination
        const caseType = (project.caseType || '').trim();
        const jurisdiction = (project.courtName || '').trim();
        const hasLegalIssues = project.legalIssues && project.legalIssues.length > 0;

        if (!caseType || !jurisdiction || !hasLegalIssues) {
            parsed.supremeCourtJudgments = [];
            parsed.highCourtJudgments = [];
            parsed.importantPrecedents = [];
        }

        if (readinessScore < 50) {
            parsed.winProbability = "Unavailable";
        }

        return parsed;
    } catch (error) {
        logger.error(`[LegalIntelligence] generateCompleteCaseAnalysis failed: ${error.message}`);
        throw error;
    }
};
