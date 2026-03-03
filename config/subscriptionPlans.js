export const SUBSCRIPTION_PLANS = {
    FREE: {
        name: 'FREE',
        price: 0,
        credits: 100,
        validityDays: 30
    },
    STARTER: {
        name: 'STARTER',
        price: 500,
        credits: 500,
        validityDays: 30
    },
    PRO: {
        name: 'PRO',
        price: 2850,
        credits: 3000,
        validityDays: 30
    },
    BUSINESS: {
        name: 'BUSINESS',
        price: 4500,
        credits: 50000,
        validityDays: 30
    },
    ENTERPRISE: {
        name: 'ENTERPRISE',
        price: 8000,
        credits: 100000,
        validityDays: 30
    }
};

export const TOOL_COSTS = {
    chat: 1,
    deep_search: 10,
    real_time_search: 10,
    generate_image: 20,
    generate_video: 70,
    convert_audio: 10,
    convert_document: 10,
    code_writer: 5
};
