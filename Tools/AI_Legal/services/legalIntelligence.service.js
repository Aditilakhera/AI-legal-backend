import * as vertexService from '../../../services/vertex.service.js';
import logger from '../../../utils/logger.js';
import { safeParseLLMJson } from '../../../utils/jsonUtils.js';

/**
 * generateUnifiedCaseIntelligence
 * Reads user case summary and generates a single structured Case Intelligence JSON object.
 */
export const generateUnifiedCaseIntelligence = async (rawText, currentData = {}, language = 'English') => {
    let languageInstruction = '';
    if (language && language !== 'English') {
        languageInstruction = `Please generate all text descriptions, summaries, titles, and explanations in ${language}. Do NOT translate client names, case numbers, evidence names, file names, phone numbers, emails, and legal section numbers. Keep them in their original form.`;
    }

    const prompt = [
        'You are an elite autonomous Legal Intelligence Engine.',
        'Your job is to read a legal case summary and generate ONE structured Case Intelligence JSON object that will power an entire legal case management system.',
        '',
        '-------------------------------------',
        '⚠️ CRITICAL RULES (MUST FOLLOW STRICTLY):',
        '1. Output ONLY valid JSON.',
        '2. Do NOT return any markdown formatting, backticks, or explanation outside the JSON.',
        '3. Do NOT invent fake or placeholder parties, contracts, or facts not implied by the input summary.',
        '4. Every section MUST be derived exclusively from the actual Case Summary entered by the user.',
        '5. ZERO SCORE RULE: If the case summary is unclear, gibberish, incomplete, or lacks factual details, set winProbability to 0 and caseStrength to 0, risks.level to "Critical", and return empty arrays for arguments and counterArguments.',
        '-------------------------------------',
        '',
        'INPUT CASE SUMMARY:',
        `Case Name/Title: ${currentData.name || 'Legal Case'}`,
        `Case Summary / Facts: ${rawText}`,
        `Client Name: ${currentData.clientName || 'Client'}`,
        `Opponent Name: ${currentData.opponentName || currentData.accused || 'Opponent'}`,
        `Case Type: ${currentData.caseType || 'General Litigation'}`,
        '-------------------------------------',
        '',
        'OUTPUT JSON FORMAT (STRICT):',
        JSON.stringify({
            parties: {
                plaintiff: { name: "Client Name", role: "Petitioner/Plaintiff" },
                defendant: { name: "Opponent Name", role: "Respondent/Defendant" },
                others: []
            },
            caseType: "Civil Case / Criminal Case / Commercial Dispute / ...",
            facts: [
                "Fact 1 derived from summary",
                "Fact 2 derived from summary"
            ],
            timeline: [
                {
                    title: "Event Title",
                    description: "Details",
                    date: "YYYY-MM-DD",
                    displayDate: "Human readable date",
                    category: "Agreement/Contract/Payment/Notice/Default/Court/...",
                    importance: "High/Medium/Low"
                }
            ],
            events: [
                { title: "Key Event", date: "YYYY-MM-DD", impact: "High/Medium/Low" }
            ],
            issues: [
                "Legal Issue 1 regarding breach or liability",
                "Legal Issue 2 regarding limitation or evidence"
            ],
            evidence: [
                { title: "Evidence item name", type: "Document/Financial/Witness", description: "Relevance", strength: "Strong/Medium/Weak" }
            ],
            missingEvidence: [
                "Missing proof item 1 needed for court",
                "Missing proof item 2 needed for claim"
            ],
            documents: [
                { name: "Document name needed or identified", type: "Notice/Agreement/Affidavit", status: "Uploaded/Pending" }
            ],
            legalSections: [
                { law: "Act Name", section: "Section Number", description: "Relevance to case" }
            ],
            arguments: [
                {
                    id: "arg_1",
                    title: "Winning Petitioner Argument Title",
                    description: "Detailed argument reasoning derived from facts",
                    supportingEvidence: ["Evidence title"],
                    supportingLaws: ["Section & Law name"],
                    supportingTimelineEvents: ["Event date/title"],
                    impact: "High/Critical",
                    category: "Contract Law/Financial Liability/..."
                }
            ],
            counterArguments: [
                {
                    id: "carg_1",
                    title: "Opponent Counter Argument / Defense Title",
                    description: "Possible defense claim by opponent",
                    refutation: "Our strategic rebuttal to defeat this counter argument",
                    impact: "High/Medium",
                    category: "Procedure/Defense"
                }
            ],
            strategy: {
                trialSequence: [
                    { step: 1, title: "Initial Court Step", detail: "Strategic action", status: "Primary/Crucial" }
                ],
                avoidList: ["Weak strategy or trap to avoid"],
                judicialConcerns: ["Potential concern or question the Judge may raise"],
                closingSubmission: "Summary statement for final arguments"
            },
            risks: {
                level: "Low/Medium/High/Critical",
                reason: "Summary of overall legal risks",
                criticalVulnerabilities: ["Vulnerability 1", "Vulnerability 2"]
            },
            winProbability: 75,
            caseStrength: 80,
            tasks: [
                { title: "Action item 1", priority: "High/Medium/Low", deadline: "YYYY-MM-DD or timeframe", status: "Pending" }
            ],
            hearings: [
                { title: "Proposed Next Hearing / Proceeding", date: "YYYY-MM-DD", courtroom: "Courtroom No.", purpose: "Purpose", status: "Scheduled" }
            ],
            recommendations: [
                "Immediate recommended next step 1",
                "Immediate recommended next step 2"
            ],
            aiAssistant: {
                litigationStatus: "Consultation/Pre-Litigation/Legal Notice/Negotiation/Suit Filed/Written Statement/Pleadings/Issues Framed/Evidence Stage/Cross Examination/Final Arguments/Judgment Reserved/Judgment Delivered/Appeal/Execution/Unable to determine litigation stage.",
                latestAdvice: "Single highest-priority legal recommendation based on actual case summary/facts",
                recommendedAction: "Immediate next legal action (e.g. Draft legal notice / File reply / Upload original agreement)",
                evidenceAlerts: "Summary of missing/weak evidence or 'No critical evidence issues detected.'",
                nextDeadline: "Calculated next deadline or 'No pending procedural deadlines.'",
                confidence: 80,
                missingInformation: ["List of missing facts or documents required for full analysis"]
            },
            deadlines: [
                { title: "Limitation / Filing Deadline", description: "Explanation of deadline", date: "YYYY-MM-DD" }
            ]
        }, null, 2),
        '',
        languageInstruction ? `🌐 LANGUAGE INSTRUCTION:\n${languageInstruction}\n-------------------------------------` : '',
        'FINAL INSTRUCTION: Return ONLY JSON.'
    ].join('\n');

    try {
        const response = await vertexService.AskVertexRaw(prompt, {
            maxOutputTokens: 8192,
            temperature: 0.1,
            modelOverride: 'gemini-2.5-flash',
            isJson: true
        });

        const fallback = {
            parties: { plaintiff: { name: currentData.clientName || "Plaintiff", role: "Plaintiff" }, defendant: { name: currentData.opponentName || "Defendant", role: "Defendant" }, others: [] },
            caseType: currentData.caseType || "Legal Case",
            facts: [rawText],
            timeline: [{ title: "Case Overview Logged", description: rawText, date: new Date().toISOString().split('T')[0], displayDate: "Today", category: "Other", importance: "High" }],
            events: [{ title: "Case Created", date: new Date().toISOString().split('T')[0], impact: "High" }],
            issues: ["Verification of facts provided."],
            evidence: [],
            missingEvidence: [],
            documents: [],
            legalSections: [],
            arguments: [{ id: "arg_1", title: "Claim for Relief based on Facts", description: rawText, supportingEvidence: [], supportingLaws: [], supportingTimelineEvents: [], impact: "High", category: "General" }],
            counterArguments: [],
            strategy: { trialSequence: [{ step: 1, title: "Establish Primary Claims", detail: "Present submitted facts before court.", status: "Primary" }], avoidList: [], judicialConcerns: [], closingSubmission: "Pray for relief as stated in petition." },
            risks: { level: "Medium", reason: "Initial evaluation based on summary.", criticalVulnerabilities: [] },
            winProbability: 50,
            caseStrength: 50,
            tasks: [{ title: "Review case documents and verify evidence", priority: "High", deadline: "Within 7 days", status: "Pending" }],
            hearings: [],
            recommendations: ["Compile all physical evidence and verify witness statements."],
            deadlines: []
        };

        return safeParseLLMJson(response, fallback);
    } catch (error) {
        logger.error(`[LegalIntelligence] generateUnifiedCaseIntelligence failed: ${error.message}`);
        return {
            parties: { plaintiff: { name: currentData.clientName || "Plaintiff", role: "Plaintiff" }, defendant: { name: currentData.opponentName || "Defendant", role: "Defendant" }, others: [] },
            caseType: currentData.caseType || "Legal Case",
            facts: [rawText],
            timeline: [],
            events: [],
            issues: [],
            evidence: [],
            missingEvidence: [],
            documents: [],
            legalSections: [],
            arguments: [],
            counterArguments: [],
            strategy: { trialSequence: [], avoidList: [], judicialConcerns: [], closingSubmission: "" },
            risks: { level: "High", reason: "AI generation request encountered an error.", criticalVulnerabilities: [error.message] },
            winProbability: 0,
            caseStrength: 0,
            tasks: [],
            hearings: [],
            recommendations: [],
            deadlines: []
        };
    }
};

/**
 * analyzeCaseDetails
 * Legacy wrapper calling generateUnifiedCaseIntelligence for backward compatibility.
 */
export const analyzeCaseDetails = async (rawText, currentData = {}, language = 'English') => {
    const unified = await generateUnifiedCaseIntelligence(rawText, currentData, language);
    return {
        executive_summary: unified.facts ? unified.facts.join('. ') : rawText,
        case_strength: unified.caseStrength || 50,
        win_probability: unified.winProbability || 50,
        timeline: unified.timeline || [],
        limitation_warnings: unified.deadlines || [],
        upcoming_deadlines: unified.deadlines || [],
        missing_documents: (unified.missingEvidence || []).map(m => typeof m === 'string' ? { title: m, description: m } : m),
        parties: unified.parties || {},
        evidence: unified.evidence || [],
        legal_research: (unified.legalSections || []).map(l => ({ law: l.law, section: l.section, description: l.description })),
        process_steps: (unified.tasks || []).map(t => ({ step: t.title, priority: t.priority })),
        risk_assessment: unified.risks || { level: "Medium", reason: "" },
        critical_vulnerabilities: unified.risks?.criticalVulnerabilities || [],
        opponent_strategy: (unified.counterArguments || []).map(c => c.title),
        primary_relief: unified.issues ? unified.issues.join('; ') : "Legal Relief",
        strategy_recommendation: unified.recommendations || []
    };
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
