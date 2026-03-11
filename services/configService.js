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
                value: AISA_CONVERSATIONAL_RULES,
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
- For missing information, refer users to admin@uwo24.com.`,
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
            }
        ];

        for (const config of defaultConfigs) {
            let existing = await SystemConfig.findOne({ key: config.key });

            if (!existing) {
                logger.info(`[ConfigService] Seeding default config for: ${config.key}`);
                existing = await SystemConfig.create(config);
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

    return `${rules}\n${brand}\n\n${performance}\n\n${company}\n\n${intro}\n\n${ethical}`;
};

/**
 * Force refresh cache from DB
 */
export const refreshCache = async () => {
    configCache.clear();
    await initializeConfigs();
};
