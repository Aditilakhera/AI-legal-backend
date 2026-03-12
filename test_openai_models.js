import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function testSearch(model, useTools = false) {
    console.log(`\n--- Testing Model: ${model} (Tools: ${useTools}) ---`);
    try {
        const payload = {
            model: model,
            messages: [
                { role: 'user', content: 'What is the current time and weather in Mumbai right now?' }
            ]
        };
        if (useTools) {
            payload.tools = [{ type: 'web_search' }];
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );
        console.log(`✅ Success! Status: ${response.status}`);
        console.log(`Response: ${response.data.choices[0].message.content.substring(0, 200)}...`);
        if (response.data.choices[0].message.sources) {
            console.log(`Sources found: ${response.data.choices[0].message.sources.length}`);
        }
    } catch (error) {
        console.error(`❌ Failed!`);
        console.error(`Status: ${error.response?.status}`);
        console.error(`Error: ${JSON.stringify(error.response?.data?.error || error.message)}`);
    }
}

(async () => {
    if (!OPENAI_API_KEY) {
        console.error("No OPENAI_API_KEY found in .env");
        process.exit(1);
    }
    // Try without tools first (automatic search)
    await testSearch('gpt-4o-mini-search-preview', false);
    await testSearch('gpt-4o-search-preview', false);
    // Try with tools
    await testSearch('gpt-4o-mini-search-preview', true);
})();
