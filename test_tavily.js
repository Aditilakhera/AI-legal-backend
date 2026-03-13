import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

async function testTavily() {
    console.log("Testing Tavily with Key:", TAVILY_API_KEY);
    try {
        const response = await axios.post('https://api.tavily.com/search', {
            api_key: TAVILY_API_KEY,
            query: "latest news",
            search_depth: "basic"
        });
        console.log("Success! Results count:", response.data.results?.length);
    } catch (e) {
        console.error("Tavily Error:", e.response?.data || e.message);
    }
}

testTavily();
