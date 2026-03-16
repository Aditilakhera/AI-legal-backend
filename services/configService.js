import SystemConfig from '../models/SystemConfig.js';
import logger from '../utils/logger.js';
import { AISA_CONVERSATIONAL_RULES, BRAND_SYSTEM_RULES } from '../utils/brandIdentity.js';

let configCache = new Map();

/**
 * Initialize Config from Database
 * If keys don't exist, seed them from hardcoded defaults
 */
export const initializeConfigs = async () => {
    try {
        logger.info('[ConfigService] Initializing system configurations...');

        const defaultConfigs = [
            {
                key: 'AISA_CONVERSATIONAL_RULES',
                value: AISA_CONVERSATIONAL_RULES + `
### CITATION & RESOURCE RULES:
- NEVER mention internal filenames like "aisa_documentation.pdf" or "A_SERIES_DOC...".
- If the user asks about a company project, product, or service, refer to it by name and provide its official website URL if available in the context.
- Use the website URL as the primary source reference.
- If only internal documentation is available, refer to it as "Official UWO Case Study" or "Internal Documentation" instead of the filename.`,
                description: 'Core rules for AISA response style, tone, and formatting.'
            },
            {
                key: 'BRAND_SYSTEM_RULES',
                value: BRAND_SYSTEM_RULES,
                description: 'Branding rules for AISA identity and self-reference.'
            },
            {
                key: 'AISA_PERFORMANCE_RULES',
                value: `### CRITICAL PERFORMANCE RULES:
- PROVIDE FINAL ANSWERS ONLY: Do not use placeholders like "[Data loading...]" or "Still searching...".
- USE REAL-TIME DATA: If web search results are provided in the context, use them immediately as a primary source.
- FALLBACK: If live data is unavailable and was specifically requested, say: "I couldn't find real-time information for this query. Based on my existing knowledge..."`,
                description: 'Rules for model execution and fallback behavior.'
            },
            {
                key: 'OFFICIAL_COMPANY_DATA',
                value: `### OFFICIAL COMPANY DATA (UWO™):
Unified Web Options & Services Pvt. Ltd. (UWO™) is an IT-registered technology company founded in 2020 and headquartered in Jabalpur, Madhya Pradesh. Specialized in AI solutions, business automation, CRM/workflow systems, AI agents & chatbots, web & app development, cloud integrations, and enterprise productivity tools. Flagship project: AI Mall™.
- For questions about UWO™, use the above data.
- For missing information, refer users to our official contact channels.`,
                description: 'Official UWO company profile and contact info.'
            },
            {
                key: 'AISA_SELF_INTRO',
                value: `### AISA SELF-INTRODUCTION:
If the user asks about AISA (e.g., "What is AISA?", "Who are you?", "Aap kaun ho?"), provide a professional introduction:
1. Briefly state that AISA™ is an advanced AI assistant developed by UWO™, based in Jabalpur, India.
2. Mention core capabilities: Smart Chat, Image/Video Generation, Document Analysis, and Deep Search.
3. Keep the tone professional and helpful, as per the primary guidelines.`,
                description: 'Instructions on how AISA should introduce itself.'
            },
            {
                key: 'ETHICAL_GUARDRAILS',
                value: `### ETHICAL & COMPLIANCE GUARDRAILS:
- Refuse requests that are illegal, harmful, abusive, or sexually explicit.
- Add a disclaimer for medical, legal, or financial information: "⚠️ This information is for educational purposes only. Please consult a qualified professional before making any decisions."
- Priority: Safety and professional integrity above all.`,
                description: 'Safety and compliance instructions.'
            },
            {
                key: 'WEB_SEARCH_RULES',
                value: `### WEB SEARCH GUIDELINES:
- Task: Provide a comprehensive, accurate answer to the user's query using the live data provided.
- Citations: Cite your sources clearly using [1], [2], etc.
- Veracity: If information is conflicting, mention different perspectives found.
- Identity: You are AISA™, an advanced IT assistant created by UWO™ with real-time web search capabilities.`,
                description: 'Specific rules for the Web Search / Deep Search feature.'
            },
            {
                key: 'QUERY_REWRITE_PROMPT',
                value: `You are an AI assistant that improves search queries for document retrieval.

Rewrite the user's question into a clear and detailed search query that will help retrieve relevant documents from a knowledge base.

Return only the improved search query.

User Question:
{user_question}`,
                description: 'The prompt template used to rewrite user queries for better RAG retrieval.'
            },
            {
                key: 'CONVERSATION_MEMORY_PROMPT',
                value: `### CONTEXTUAL MEMORY:
Use the following relevant conversation history to understand the user's current intent better.

Relevant History:
{memory_context}

Current User Question:
{user_query}

Instructions:
- Use history only if relevant to the current question.
- Do not repeat history in your answer unless specifically asked.
- Answer the user clearly.`,
                description: 'Template for injecting retrieved conversation context into the final AI prompt.'
            },
            {
                key: 'BEHAVIOR_INTELLIGENCE_INIT',
                value: `### 7-DAY ADAPTIVE LEARNING RULES:
- DAY 1-2: If you don't know the user's current work, skills, or goals, subtly ask about them during the conversation. 
- DAY 3-4: Observe their technical level and response length. Adapt your complexity to match theirs.
- DAY 5-7: Finalize the "User Intelligence Profile". Your responses should now be fully personalized to their motivation and learning style.
- PERSISTENCE: Use the "ADAPTIVE RESPONSE RULES" provided in the context to refine every single answer.`,
                description: 'Rules for the 7-day behavioral learning engine.'
            }
        ];

        for (const config of defaultConfigs) {
            let existing = await SystemConfig.findOne({ key: config.key });

            if (!existing) {
                logger.info(`[ConfigService] Seeding default config for: ${config.key}`);
                existing = await SystemConfig.create(config);
            } else if (config.key === 'AISA_CONVERSATIONAL_RULES' && !existing.value.includes('FALLBACK:')) {
                // Feature push: Update rules to include the new Fallback/No-Disclaimer logic
                logger.info(`[ConfigService] Updating ${config.key} to include new Fallback/No-Disclaimer rules.`);
                existing.value = config.value;
                existing.lastUpdated = Date.now();
                await existing.save();
            }

            configCache.set(config.key, existing.value);
        }

        logger.info('[ConfigService] Configurations loaded successfully.');
    } catch (error) {
        logger.error(`[ConfigService] Failed to initialize configs: ${error.message}`);
        // Fallback to memory in case of extreme failure
        configCache.set('AISA_CONVERSATIONAL_RULES', AISA_CONVERSATIONAL_RULES);
        configCache.set('BRAND_SYSTEM_RULES', BRAND_SYSTEM_RULES);
    }
};

/**
 * Get a configuration value by key
 * @param {string} key 
 * @param {string} defaultValue 
 * @returns {string}
 */
export const getConfig = (key, defaultValue = '') => {
    return configCache.get(key) || defaultValue;
};

/**
 * Builds the full system instruction string from dynamic DB configs
 */
export const getFullSystemInstruction = () => {
    const rules = getConfig('AISA_CONVERSATIONAL_RULES');
    const brand = getConfig('BRAND_SYSTEM_RULES');
    const performance = getConfig('AISA_PERFORMANCE_RULES');
    const company = getConfig('OFFICIAL_COMPANY_DATA');
    const intro = getConfig('AISA_SELF_INTRO');
    const ethical = getConfig('ETHICAL_GUARDRAILS');
    const intelligence = getConfig('BEHAVIOR_INTELLIGENCE_INIT');

    return `${rules}\n${brand}\n\n${performance}\n\n${company}\n\n${intro}\n\n${ethical}\n\n${intelligence}`;
};

export const getGeneralSystemInstruction = (adaptiveContext = '') => {
    let rules = getConfig('AISA_CONVERSATIONAL_RULES');
    const brand = getConfig('BRAND_SYSTEM_RULES');
    const performance = getConfig('AISA_PERFORMANCE_RULES');
    const ethical = getConfig('ETHICAL_GUARDRAILS');

    // USER REQUIREMENT: For normal questions, ONLY give the answer.
    // We strip the "SUGGESTIONS" rule block and the "KNOWLEDGE USAGE (RAG)" citations block.
    // This removes instructions that force citing sources or offering help at the end.
    rules = rules.replace(/###\s*SUGGESTIONS[\s\S]*?(?=###|$)/gi, '');
    rules = rules.replace(/###\s*KNOWLEDGE USAGE \(RAG\)[\s\S]*?(?=###|$)/gi, '');
    rules = rules.replace(/5\.\s*SUGGESTIONS[\s\S]*?(?=6\.|$)/gi, '');

    return `${rules}\n${brand}\n\n${performance}\n\n${ethical}\n\n${adaptiveContext}\n\n### MODE: DIRECT ANSWER (ChatGPT Style)
- Provide ONLY the direct answer to the user's question.
- DO NOT provide any website links, sources, citations, or bibliography in your response.
- DO NOT provide "Suggestions", "I can also help you with", or follow-up questions.
- DO NOT use the phrase "If you're interested, I can also help you with:".
- END your response immediately after the answer. No closing conversational filler.
- NEVER cite any external website for general knowledge.
- Answer like a direct intelligence engine (similar to ChatGPT).`;
};

/**

 * Force refresh cache from DB
 */
export const refreshCache = async () => {
    configCache.clear();
    await initializeConfigs();
};
