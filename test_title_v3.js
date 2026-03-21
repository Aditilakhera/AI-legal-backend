import { generateConversationTitle } from './services/ai.service.js';
import 'dotenv/config';

async function test() {
    console.log('Testing title generation (v2)...');
    try {
        const t1 = await generateConversationTitle("How to cook pasta with tomato sauce?");
        console.log(`Test 1 (Pasta): "${t1}"`);
        
        const t2 = await generateConversationTitle("hi");
        console.log(`Test 2 (Hi): "${t2}"`);

        const t3 = await generateConversationTitle("Write a python script to scrape a website");
        console.log(`Test 3 (Python): "${t3}"`);
    } catch (err) {
        console.error('Test Execution Error:', err);
    }
}

test().then(() => process.exit(0)).catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
