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
    evidence: [],
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
    }]
}, { 
    timestamps: true,
    strict: false 
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
