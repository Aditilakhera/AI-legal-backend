import express from 'express';
import Project from '../models/Project.js';
import { verifyToken } from '../middleware/authorization.js';
import * as legalIntelligenceService from '../Tools/AI_Legal/services/legalIntelligence.service.js';

const router = express.Router();

const autoAnalyzeAndPopulateProject = async (project, summaryText) => {
    if (!summaryText) return project;
    try {
        console.log(`[AutoAnalysis] Starting Vertex AI analysis on project summary...`);
        const aiResponse = await legalIntelligenceService.analyzeCaseDetails(summaryText, project);
        const aiData = typeof aiResponse === "string" ? JSON.parse(aiResponse) : aiResponse;

        const toStr = (val, fallback = '') => {
            if (!val) return fallback;
            if (typeof val === 'string') return val;
            return JSON.stringify(val);
        };

        const rawTimeline = Array.isArray(aiData.timeline) ? aiData.timeline : [];
        const rawLimitationWarnings = Array.isArray(aiData.limitation_warnings) ? aiData.limitation_warnings : [];
        const rawUpcomingDeadlines = Array.isArray(aiData.upcoming_deadlines) ? aiData.upcoming_deadlines : [];
        const rawMissingDocuments = Array.isArray(aiData.missing_documents) ? aiData.missing_documents : [];

        const incomingTimeline = rawTimeline.map(f => {
            const dateStr = f.date ? String(f.date) : '';
            return {
                id: f.id || `fact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: toStr(f.title || f.event),
                description: toStr(f.description || f.title || f.event),
                date: dateStr,
                displayDate: toStr(f.displayDate || dateStr),
                isApproximate: !!f.isApproximate,
                category: toStr(f.category || 'Other'),
                importance: ['High', 'Medium', 'Low'].includes(f.importance) ? f.importance : 'Medium',
                source: toStr(f.source || 'AI Extraction'),
                confidence: toStr(f.confidence || 'High'),
                createdBy: 'AI'
            };
        });

        // Filter duplicates comparing Title, Date, Category
        const mergedTimeline = [...(project.facts || [])];
        for (const item of incomingTimeline) {
            const hasDuplicate = (project.facts || []).some(fx => 
                (fx.title || fx.event || '').trim().toLowerCase() === item.title.trim().toLowerCase() &&
                (fx.date || '').trim().toLowerCase() === item.date.trim().toLowerCase() &&
                (fx.category || '').trim().toLowerCase() === item.category.trim().toLowerCase()
            );
            if (!hasDuplicate) {
                mergedTimeline.push(item);
            }
        }

        const strength = aiData.case_strength ?? aiData.strengthScore ?? aiData.strength ?? 0;
        const probability = aiData.win_probability ?? aiData.winProbability ?? aiData.probability ?? 0;
        const normalizedRisk = aiData.risk_assessment || aiData.risk || {};
        const vulnerabilities = Array.isArray(aiData.critical_vulnerabilities || aiData.weakPoints) ? (aiData.critical_vulnerabilities || aiData.weakPoints) : [];
        const opponent = Array.isArray(aiData.opponent_strategy || aiData.opponentStrategies) ? (aiData.opponent_strategy || aiData.opponent_strategies) : [];
        const strategy = Array.isArray(aiData.strategy_recommendation || aiData.strategyRecommendations) ? (aiData.strategy_recommendation || aiData.strategyRecommendations) : [];
        const research = Array.isArray(aiData.legal_research || aiData.research) ? (aiData.legal_research || aiData.research) : [];
        const steps = Array.isArray(aiData.process_steps || aiData.steps) ? (aiData.process_steps || aiData.steps) : [];
        const evidence = Array.isArray(aiData.evidence) ? aiData.evidence : [];

        project.clientName = project.clientName || toStr(aiData.parties?.plaintiff?.name || aiData.parties?.plaintiff) || '';
        project.opponentName = project.opponentName || toStr(aiData.parties?.defendant?.name || aiData.parties?.defendant) || '';
        project.reliefGoals = toStr(aiData.primary_relief || aiData.reliefGoals) || project.reliefGoals;
        
        project.intelligence = {
            strengthScore: Number(strength) || 0,
            winProbability: Number(probability) || 0,
            riskLevel: ['Low', 'Medium', 'High', 'Critical'].includes(normalizedRisk?.level) ? normalizedRisk.level : 'Medium',
            weakPoints: [...vulnerabilities, normalizedRisk?.reason].filter(Boolean).map(v => toStr(v)),
            opponentStrategies: opponent.map(s => toStr(s)),
            strategyRecommendations: strategy.map(s => toStr(s)),
            missingEvidence: []
        };

        project.facts = mergedTimeline;
        
        project.limitationWarnings = rawLimitationWarnings.map(w => ({
            title: toStr(w.title),
            description: toStr(w.description),
            date: toStr(w.date || '')
        }));

        project.upcomingDeadlines = rawUpcomingDeadlines.map(d => ({
            title: toStr(d.title),
            description: toStr(d.description),
            date: toStr(d.date || '')
        }));

        project.missingDocuments = rawMissingDocuments.map(m => ({
            title: toStr(m.title),
            description: toStr(m.description),
            date: toStr(m.date || '')
        }));

        // Merge process steps into tasks
        const stepsToTasks = steps
            .filter(p => p && (p.step || p.title))
            .filter(p => !(project.tasks || []).some(tx => tx.title === (p.step || p.title)))
            .map(p => ({
                title: toStr(p.step || p.title),
                status: 'Pending',
                priority: toStr(p.priority) || 'Medium'
            }));
        project.tasks = [...(project.tasks || []), ...stepsToTasks];

        // Merge evidence
        const incomingEvidence = evidence
            .filter(e => e && (e.title || e.name || e.description))
            .filter(e => !(project.evidence || []).some(ex => ex.name === (e.title || e.name || e.description)))
            .map(e => ({
                name: toStr(e.title || e.name || e.description),
                type: toStr(e.type) || 'Document',
                status: toStr(e.strength) || 'Moderate',
                uploadDate: new Date()
            }));
        project.evidence = [...(project.evidence || []), ...incomingEvidence];

        // Merge research
        const incomingResearch = research
            .filter(r => r && (r.law || r.lawName))
            .filter(r => !(project.research || []).some(rx => rx.lawName === (r.law || r.lawName) && rx.section === (r.section || '')))
            .map(r => ({
                lawName: toStr(r.law || r.lawName),
                section: toStr(r.section),
                description: toStr(r.description)
            }));
        project.research = [...(project.research || []), ...incomingResearch];

    } catch (err) {
        console.error('[autoAnalyzeAndPopulateProject] AI analysis integration failed:', err);
    }
    return project;
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
router.post('/', verifyToken, async (req, res) => {
    try {
        const { 
            name, clientName, summary, keyIssue, importantDates, isLegalCase, 
            caseType, accused, status, stage, priority, opponentName, lawyers, 
            facts, legalIssues, reliefGoals, intelligence, tasks, communicationLogs, research, hearings
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        let project = new Project({
            name,
            userId: req.user.id,
            clientName: clientName || '',
            summary: summary || '',
            caseType: caseType || '',
            status: status || 'Active',
            stage: stage || 'Pre-litigation',
            priority: priority || 'Medium',
            opponentName: opponentName || accused || '',
            lawyers: lawyers || [],
            facts: facts || [],
            legalIssues: legalIssues || (keyIssue ? [keyIssue] : []),
            reliefGoals: reliefGoals || '',
            intelligence: intelligence || { strengthScore: 0, winProbability: 0, riskLevel: 'Medium' },
            tasks: tasks || [],
            communicationLogs: communicationLogs || [],
            research: research || [],
            isLegalCase: isLegalCase === undefined ? false : isLegalCase,
            accused: accused || '',
            keyIssue: keyIssue || '',
            importantDates: importantDates || [],
            hearings: hearings || [],
            evidence: req.body.evidence || [],
            savedPrecedents: req.body.savedPrecedents || []
        });

        // Trigger AI analysis if summary is provided
        const caseSummaryText = summary || req.body.caseSummary;
        if (caseSummaryText && caseSummaryText.trim()) {
            project = await autoAnalyzeAndPopulateProject(project, caseSummaryText);
        }

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// @desc    Get all user projects
// @route   GET /api/projects
// @access  Private
router.get('/', verifyToken, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
    try {
        console.log(`[DEBUG] Fetching project: ${req.params.id} for user: ${req.user.id}`);
        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
        if (!project) {
            console.warn(`[DEBUG] Project NOT FOUND: ${req.params.id} for user: ${req.user.id}`);
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project', details: error.message });
    }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updateData = req.body;
        
        // Ensure userId cannot be changed via update
        delete updateData.userId;
        delete updateData._id;

        const existingProject = await Project.findOne({ _id: req.params.id, userId: req.user.id });
        if (!existingProject) return res.status(404).json({ error: 'Project not found' });

        const summaryUpdated = updateData.summary !== undefined && updateData.summary !== existingProject.summary;
        const caseSummaryUpdated = updateData.caseSummary !== undefined && updateData.caseSummary !== existingProject.caseSummary;

        // Apply changes
        Object.assign(existingProject, updateData);

        // Trigger AI analysis if summary is updated
        if (summaryUpdated || caseSummaryUpdated) {
            const summaryText = updateData.summary || updateData.caseSummary || existingProject.summary || existingProject.caseSummary;
            if (summaryText && summaryText.trim()) {
                await autoAnalyzeAndPopulateProject(existingProject, summaryText);
            }
        }

        const updatedProject = await existingProject.save();
        res.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project', details: error.message });
    }
});

// Shared analysis handler to keep code DRY and consistent
const performCaseAnalysis = async (req, res) => {
    try {
        const { rawText } = req.body;
        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
        
        if (!project) {
            return res.status(404).json({ error: 'Case not found' });
        }

        const inputText = rawText || project.summary || project.name;
        await autoAnalyzeAndPopulateProject(project, inputText);
        
        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        console.error('[CaseAnalysis] Error:', error.message);
        res.status(500).json({ error: 'Failed to analyze case', details: error.message });
    }
};

// @desc    Analyze case details and update project
// @route   POST /api/projects/:id/analyze
router.post('/:id/analyze', verifyToken, performCaseAnalysis);

// @desc    Auto-Analyze alias — POST /api/cases/:id/auto-analyze
router.post('/:id/auto-analyze', verifyToken, performCaseAnalysis);


// @desc    Enrich an existing hearing record with AI suggestions by uploading court orders or adding notes
// @route   POST /api/projects/:id/hearings/:hearingId/enrich
// @access  Private
router.post('/:id/hearings/:hearingId/enrich', verifyToken, async (req, res) => {
    try {
        const { notes, documentText, documentName } = req.body;
        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
        if (!project) return res.status(404).json({ error: 'Case workspace not found' });

        const hearingIndex = project.hearings.findIndex(h => String(h.id || h._id) === req.params.hearingId);
        if (hearingIndex === -1) return res.status(404).json({ error: 'Hearing not found' });

        const currentHearing = project.hearings[hearingIndex];

        // Call Vertex AI service to extract and enrich details
        const aiEnriched = await legalIntelligenceService.enrichHearingDetails(notes, documentText, documentName);
        if (!aiEnriched) return res.status(500).json({ error: 'Failed to enrich hearing details using AI' });

        const toStr = (val, fallback = '') => {
            if (!val) return fallback;
            if (typeof val === 'string') return val;
            return JSON.stringify(val);
        };

        if (aiEnriched.courtName) currentHearing.courtName = toStr(aiEnriched.courtName);
        if (aiEnriched.judge) currentHearing.judge = toStr(aiEnriched.judge);
        if (aiEnriched.hearingDate) currentHearing.date = toStr(aiEnriched.hearingDate);
        if (aiEnriched.nextHearingDate) currentHearing.nextHearingDate = toStr(aiEnriched.nextHearingDate);
        if (aiEnriched.courtroom) currentHearing.courtroom = toStr(aiEnriched.courtroom);
        if (aiEnriched.title) currentHearing.title = toStr(aiEnriched.title);
        if (aiEnriched.purpose) currentHearing.purpose = toStr(aiEnriched.purpose);
        if (aiEnriched.notes) currentHearing.notes = toStr(aiEnriched.notes);
        if (aiEnriched.orderSummary) currentHearing.orderSummary = toStr(aiEnriched.orderSummary);
        currentHearing.isAiEnriched = true;

        if (documentName) {
            currentHearing.linkedDocuments = [...new Set([...(currentHearing.linkedDocuments || []), toStr(documentName)])];
        }

        // Merge checklists safely (only append new inferred checklist items, keeping the checked status for items that exist)
        const mergeChecklist = (existingList = [], incomingList = []) => {
            const merged = [...existingList];
            for (const item of incomingList) {
                const titleStr = toStr(item.title);
                const exists = existingList.some(e => toStr(e.title).trim().toLowerCase() === titleStr.trim().toLowerCase());
                if (!exists) {
                    merged.push({
                        title: titleStr,
                        checked: !!item.checked,
                        status: item.status || 'Pending'
                    });
                }
            }
            return merged;
        };

        if (!currentHearing.checklist) {
            currentHearing.checklist = { documents: [], evidence: [], witnesses: [], compliance: [] };
        }

        currentHearing.checklist.documents = mergeChecklist(currentHearing.checklist.documents || [], aiEnriched.checklist?.documents || []);
        currentHearing.checklist.evidence = mergeChecklist(currentHearing.checklist.evidence || [], aiEnriched.checklist?.evidence || []);
        currentHearing.checklist.witnesses = mergeChecklist(currentHearing.checklist.witnesses || [], aiEnriched.checklist?.witnesses || []);
        currentHearing.checklist.compliance = mergeChecklist(currentHearing.checklist.compliance || [], aiEnriched.checklist?.compliance || []);

        project.markModified('hearings');
        await project.save();

        res.json(project);
    } catch (error) {
        console.error('[HearingEnrich] Error:', error);
        res.status(500).json({ error: 'Failed to enrich hearing details', details: error.message });
    }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;
