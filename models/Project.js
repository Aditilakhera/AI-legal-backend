import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // --- Basic Case Info ---
    clientName: {
        type: String,
        trim: true,
        default: ''
    },
    summary: {
        type: String,
        trim: true,
        default: ''
    },
    // Backward compatibility for existing data
    caseSummary: {
        type: String,
        trim: true
    },
    caseType: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Archived'],
        default: 'Active'
    },
    stage: {
        type: String,
        enum: ['Pre-litigation', 'Notice', 'Court', 'Judgment', 'Settled'],
        default: 'Pre-litigation'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    // --- Parties ---
    opponentName: {
        type: String,
        trim: true,
        default: ''
    },
    lawyers: [{
        name: String,
        role: String,
        contact: String
    }],
    // --- Case Content ---
    facts: [{
        id: { type: String },
        title: { type: String, trim: true, default: '' },
        description: { type: String, trim: true, default: '' },
        date: { type: String, default: '' },
        displayDate: { type: String, default: '' },
        isApproximate: { type: Boolean, default: false },
        category: { type: String, default: 'Other' },
        importance: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
        source: { type: String, default: '' },
        confidence: { type: String, default: 'High' },
        createdBy: { type: String, enum: ['AI', 'User'], default: 'AI' }
    }],
    limitationWarnings: [{
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        date: { type: String }
    }],
    upcomingDeadlines: [{
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        date: { type: String }
    }],
    missingDocuments: [{
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        date: { type: String }
    }],
    legalIssues: [{
        type: String,
        trim: true
    }],
    reliefGoals: {
        type: String,
        trim: true,
        default: ''
    },
    // --- Evidence & Documents ---
    documents: [{
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        name: String,
        type: { type: String, enum: ['Notice', 'Agreement', 'Proof', 'Filing', 'Other'] },
        url: String,
        tags: [String],
        extractedData: mongoose.Schema.Types.Mixed,
        uploadDate: { type: Date, default: Date.now }
    }],
    evidence: [{
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        name: { type: String, required: true },
        type: { type: String, default: 'Document' },
        description: { type: String, default: '' },
        notes: { type: String, default: '' },
        exhibitNumber: { type: String, default: '' },
        status: { type: String, enum: ['Verified', 'Pending', 'Rejected', 'Disputed', 'Not Verified'], default: 'Not Verified' },
        tags: [String],
        url: { type: String, default: '' },
        fileSize: { type: String, default: '0 KB' },
        uploadedBy: { type: String, default: 'Advocate' },
        uploadedDate: { type: Date, default: Date.now },
        ocrData: { type: mongoose.Schema.Types.Mixed, default: {} },
        aiAnalysis: { type: mongoose.Schema.Types.Mixed, default: {} },
        relatedLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
        hash: { type: String, default: '' },
        storedName: { type: String, default: '' },
        mimeType: { type: String, default: '' },
        version: { type: Number, default: 1 }
    }],
    savedPrecedents: [],
    // --- AI Intelligence & Risk ---
    intelligence: {
        strengthScore: { type: Number, default: 0 }, // 0-100
        winProbability: { type: Number, default: 0 }, // 0-100
        riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
        weakPoints: [String],
        missingEvidence: [String],
        opponentStrategies: [String],
        strategyRecommendations: [String]
    },
    // --- Tasks & Timeline ---
    tasks: [{
        title: String,
        description: String,
        status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
        deadline: Date,
        priority: String
    }],
    // --- Communication Logs ---
    communicationLogs: [{
        type: { type: String, enum: ['Call', 'Email', 'Note', 'Meeting'] },
        summary: String,
        timestamp: { type: Date, default: Date.now }
    }],
    // --- Legal Research ---
    research: [{
        lawName: String,
        section: String,
        description: String,
        referenceUrl: String
    }],
    // --- Compatibility/Legacy ---
    isLegalCase: {
        type: Boolean,
        default: false
    },
    accused: { // Kept for backward compatibility
        type: String,
        trim: true,
        default: ''
    },
    keyIssue: { // Kept for backward compatibility
        type: String,
        trim: true,
        default: ''
    },
    importantDates: [{ // Kept for backward compatibility
        label: String,
        date: Date
    }],
    hearings: [{
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        title: { type: String, trim: true, default: '' },
        date: { type: String, default: '' },
        time: { type: String, default: '' },
        courtName: { type: String, default: '' },
        courtroom: { type: String, default: '' },
        judge: { type: String, default: '' },
        purpose: { type: String, default: '' },
        notes: { type: String, default: '' },
        status: { 
            type: String, 
            enum: ['Scheduled', 'Completed', 'Adjourned', 'Orders Reserved', 'Cancelled', 'Ongoing'], 
            default: 'Scheduled' 
        },
        linkedDocuments: [{ type: String }],
        orderSummary: { type: String, default: '' },
        isAiEnriched: { type: Boolean, default: false },
        nextHearingDate: { type: String, default: '' },
        checklist: {
            documents: [{ title: String, checked: { type: Boolean, default: false } }],
            evidence: [{ title: String, checked: { type: Boolean, default: false } }],
            witnesses: [{ title: String, checked: { type: Boolean, default: false } }],
            compliance: [{ title: String, checked: { type: Boolean, default: false }, status: { type: String, default: 'Pending' } }]
        }
    }],
    drafts: [{
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        name: { type: String, required: true },
        type: { type: String, default: 'Miscellaneous' },
        content: { type: String, default: '' },
        versions: [{
            version: { type: Number, required: true },
            content: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now },
            changes: { type: String, default: 'Initial draft created' }
        }],
        createdBy: { type: String, default: 'Advocate' },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['Draft', 'In Progress', 'Completed', 'Reviewed'], default: 'Draft' },
        aiSuggestions: [String],
        exportHistory: [String]
    }],
    notes: [{
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        title: { type: String, required: true },
        content: { type: String, default: '' },
        category: { type: String, default: 'Personal' },
        tags: [String],
        priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
        attachments: [{
            name: String,
            url: String,
            type: { type: String }
        }],
        voiceRecordingUrl: { type: String, default: '' },
        relatedHearing: { type: String, default: '' },
        relatedTimelineEvent: { type: String, default: '' },
        relatedEvidence: { type: String, default: '' },
        relatedArgument: { type: String, default: '' },
        relatedResearch: { type: String, default: '' },
        favorite: { type: Boolean, default: false },
        pinned: { type: Boolean, default: false },
        archived: { type: Boolean, default: false },
        aiSummary: {
            shortSummary: { type: String, default: '' },
            keyPoints: [String],
            importantFacts: [String],
            actionItems: [String]
        },
        aiEntities: [{
            text: String,
            type: { type: String }
        }],
        aiSuggestedLinks: [{
            type: { type: String },
            targetId: String,
            targetName: String,
            confirmed: { type: Boolean, default: false }
        }],
        aiSuggestedActions: [{
            type: { type: String },
            description: String,
            accepted: { type: Boolean, default: false }
        }],
        versions: [{
            version: Number,
            content: String,
            createdAt: { type: Date, default: Date.now }
        }]
    }],
    courtOrders: [{
        _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        name: { type: String, required: true },
        url: { type: String, default: '' },
        fileSize: { type: String, default: '0 KB' },
        ocrText: { type: String, default: '' },
        status: { type: String, enum: ['Pending', 'Completed', 'Compliance Pending', 'AI Analyzed'], default: 'Pending' },
        uploadedBy: { type: String, default: 'Advocate' },
        metadata: {
            courtName: { type: String, default: '' },
            judgeName: { type: String, default: '' },
            bench: { type: String, default: '' },
            courtNumber: { type: String, default: '' },
            caseNumber: { type: String, default: '' },
            orderDate: { type: String, default: '' },
            nextHearingDate: { type: String, default: '' },
            orderType: { type: String, default: 'Interim Order' },
            stageOfCase: { type: String, default: '' },
            petitioner: { type: String, default: '' },
            respondent: { type: String, default: '' },
            advocates: { type: String, default: '' },
            caseStatus: { type: String, default: '' }
        },
        aiSummary: {
            shortSummary: { type: String, default: '' },
            keyPoints: [String]
        },
        complianceItems: [{
            description: String,
            status: { type: String, enum: ['Pending', 'Completed', 'Overdue'], default: 'Pending' },
            dueDate: String,
            priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
            responsiblePerson: { type: String, default: 'Advocate' }
        }],
        suggestedTasks: [{
            title: String,
            description: String,
            priority: { type: String, default: 'Medium' },
            accepted: { type: Boolean, default: false }
        }],
        suggestedTimeline: [{
            title: String,
            description: String,
            date: String,
            accepted: { type: Boolean, default: false }
        }],
        suggestedHearings: [{
            title: String,
            date: String,
            courtroom: String,
            judge: String,
            purpose: String,
            accepted: { type: Boolean, default: false }
        }],
        suggestedArguments: [{
            title: String,
            logic: String,
            precedents: String,
            accepted: { type: Boolean, default: false }
        }],
        suggestedResearch: [{
            act: String,
            section: String,
            description: String,
            accepted: { type: Boolean, default: false }
        }],
        suggestedEvidence: [{
            title: String,
            description: String,
            status: { type: String, default: 'Required' },
            accepted: { type: Boolean, default: false }
        }],
        riskAnalysis: {
            proceduralDefects: [String],
            weaknessDetails: [String],
            limitationRisk: { type: String, default: 'Low' },
            jurisdictionIssue: { type: Boolean, default: false },
            objectionsProbability: { type: Number, default: 20 }
        },
        linkedRecords: {
            hearingsCount: { type: Number, default: 0 },
            tasksCount: { type: Number, default: 0 },
            evidenceCount: { type: Number, default: 0 }
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }]
}, { 
    timestamps: true,
    strict: false 
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
