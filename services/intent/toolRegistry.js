/**
 * AISA Magic Tools — Tool Registry
 * Single source of truth for all available tools.
 * Add new tools here without touching any core routing logic.
 */

export const TOOL_REGISTRY = {

    normal_chat: {
        name: 'Normal Chat',
        description: 'General AI conversation, Q&A, and assistance',
        inputs: ['text', 'image', 'document'],
        outputs: ['text'],
        handler: 'chatRoutes',
        endpoint: '/api/chat',
        creditCost: 0,
        isPremium: false,
        requiresAssets: false,
        dependencies: [],
        isInternal: false,
        emoji: '💬'
    },

    text_to_image: {
        name: 'AISA Image Generation',
        description: 'Generate high-quality images from text prompts using Imagen',
        inputs: ['text'],
        outputs: ['image/png'],
        handler: 'imageRoutes',
        endpoint: '/api/image',
        creditCost: 60,
        isPremium: true,
        requiresAssets: false,
        dependencies: [],
        isInternal: false,
        emoji: '🖼️',
        models: ['imagen-3.0-generate-001', 'imagen-4.0-ultra-generate-001'],
        configOptions: {
            aspectRatio: ['1:1', '16:9', '9:16', '4:3'],
            modelId: 'imagen-3.0-generate-001'
        }
    },

    image_edit: {
        name: 'AISA Image Editor',
        description: 'Edit or modify an existing uploaded image',
        inputs: ['text', 'image'],
        outputs: ['image/png'],
        handler: 'magicEditRoutes',
        endpoint: '/api/edit-image',
        creditCost: 60,
        isPremium: true,
        requiresAssets: true,
        requiredAssetTypes: ['image'],
        dependencies: [],
        isInternal: false,
        emoji: '🎨'
    },

    text_to_video: {
        name: 'AISA Video Generation',
        description: 'Generate video clips from text descriptions using Veo models',
        inputs: ['text'],
        outputs: ['video/mp4'],
        handler: 'videoRoutes',
        endpoint: '/api/video',
        creditCost: 1500,
        isPremium: true,
        requiresAssets: false,
        dependencies: [],
        isInternal: false,
        emoji: '🎬',
        models: ['veo-3.1-fast-generate-001', 'veo-3.1-generate-001'],
        configOptions: {
            duration: { min: 5, max: 60, default: 5 },
            resolution: ['1080p', '4k'],
            aspectRatio: ['16:9', '9:16', '1:1']
        }
    },

    image_to_video: {
        name: 'AISA Image-to-Video',
        description: 'Animate a still image into a short video clip',
        inputs: ['text', 'image'],
        outputs: ['video/mp4'],
        handler: 'videoRoutes',
        endpoint: '/api/video',
        creditCost: 50,
        isPremium: true,
        requiresAssets: true,
        requiredAssetTypes: ['image'],
        dependencies: [],
        isInternal: false,
        emoji: '🎞️'
    },

    text_to_audio: {
        name: 'AISA Audio Synthesis',
        description: 'Convert text or documents to natural human speech using Chirp',
        inputs: ['text', 'document'],
        outputs: ['audio/mpeg'],
        handler: 'voiceRoutes',
        endpoint: '/api/voice/synthesize',
        creditCost: 25,
        isPremium: true,
        requiresAssets: false,
        dependencies: [],
        isInternal: false,
        emoji: '🔊',
        configOptions: {
            languageCode: 'en-US',
            voiceName: 'en-US-Chirp3-HD-Autonoe',
            speed: { min: 0.5, max: 2.0, default: 1.0 },
            pitch: { min: -10, max: 10, default: 0 }
        }
    },

    web_search: {
        name: 'AISA Web Search',
        description: 'Real-time web search with live results and citations',
        inputs: ['text'],
        outputs: ['text', 'sources'],
        handler: 'chatRoutes',
        endpoint: '/api/chat',
        creditCost: 15,
        isPremium: true,
        requiresAssets: false,
        dependencies: [],
        isInternal: false,
        emoji: '🔍',
        modeKey: 'web_search'
    },

    deep_search: {
        name: 'AISA Deep Research',
        description: 'Multi-step deep research: search, analyze, and synthesize',
        inputs: ['text'],
        outputs: ['text', 'sources', 'report'],
        handler: 'chatRoutes',
        endpoint: '/api/chat',
        creditCost: 30,
        isPremium: true,
        requiresAssets: false,
        dependencies: [],
        isInternal: false,
        emoji: '🔬',
        modeKey: 'DEEP_SEARCH'
    },

    code_writer: {
        name: 'AISA Code Writer',
        description: 'AI-powered code generation, debugging, and explanation',
        inputs: ['text', 'document'],
        outputs: ['text', 'code'],
        handler: 'chatRoutes',
        endpoint: '/api/chat',
        creditCost: 10,
        isPremium: false,
        requiresAssets: false,
        dependencies: [],
        isInternal: false,
        emoji: '💻',
        modeKey: 'CODING_HELP'
    },

    file_analysis: {
        name: 'AISA Document Intelligence',
        description: 'Analyze, summarize, and extract insights from uploaded files',
        inputs: ['document', 'image'],
        outputs: ['text', 'summary'],
        handler: 'chatRoutes',
        endpoint: '/api/chat',
        creditCost: 5,
        isPremium: false,
        requiresAssets: true,
        requiredAssetTypes: ['document', 'image'],
        dependencies: [],
        isInternal: false,
        emoji: '📄',
        modeKey: 'FILE_ANALYSIS'
    },

    file_conversion: {
        name: 'AISA Document Magic',
        description: 'Convert between file formats (PDF ↔ DOCX, etc.)',
        inputs: ['document'],
        outputs: ['document'],
        handler: 'chatRoutes',
        endpoint: '/api/chat',
        creditCost: 15,
        isPremium: false,
        requiresAssets: true,
        requiredAssetTypes: ['document'],
        dependencies: [],
        isInternal: false,
        emoji: '🔄',
        modeKey: 'FILE_CONVERSION'
    },

    knowledge_base: {
        name: 'AISA Knowledge Base',
        description: 'Query the internal RAG-powered knowledge corpus',
        inputs: ['text'],
        outputs: ['text', 'sources'],
        handler: 'knowledgeRoutes',
        endpoint: '/api/aibase/knowledge',
        creditCost: 10,
        isPremium: true,
        requiresAssets: false,
        dependencies: [],
        isInternal: false,
        emoji: '🧠'
    }
};

// ─── Helper Exports ────────────────────────────────────────────────────────────

export const getToolByName = (name) => TOOL_REGISTRY[name] || null;

export const getAllTools = () => Object.entries(TOOL_REGISTRY);

export const getPublicTools = () =>
    Object.entries(TOOL_REGISTRY)
        .filter(([_, t]) => !t.isInternal)
        .map(([k, v]) => ({ key: k, ...v }));

export const getPremiumTools = () =>
    Object.entries(TOOL_REGISTRY)
        .filter(([_, t]) => t.isPremium)
        .map(([k]) => k);

export const getToolCost = (toolName) =>
    TOOL_REGISTRY[toolName]?.creditCost || 0;

export const totalPipelineCost = (toolNames = []) =>
    toolNames.reduce((sum, name) => sum + getToolCost(name), 0);

export const toolRequiresAssets = (toolName) =>
    TOOL_REGISTRY[toolName]?.requiresAssets || false;

export const getRequiredAssetTypes = (toolName) =>
    TOOL_REGISTRY[toolName]?.requiredAssetTypes || [];

/**
 * Build a tool registry summary string for the LLM classifier prompt
 */
export const buildToolListForPrompt = () => {
    return Object.entries(TOOL_REGISTRY)
        .filter(([_, t]) => !t.isInternal)
        .map(([key, tool]) => {
            const assetNote = tool.requiresAssets
                ? ` [REQUIRES: ${tool.requiredAssetTypes?.join(', ')}]`
                : '';
            return `- ${key}: ${tool.description}${assetNote}`;
        })
        .join('\n');
};
