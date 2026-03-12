import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function testOpenAI() {
    console.log("Testing OpenAI with Key starting with:", OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) : 'MISSING');
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'hello' }]
        }, {
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
        });
        console.log("OpenAI Success! Reply:", response.data.choices[0].message.content);
    } catch (e) {
        console.error("OpenAI Error:", e.response?.data || e.message);
    }
}

testOpenAI();
