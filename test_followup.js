import { generateFollowUpPrompts } from './utils/imagePromptController.js';

async function test() {
    console.log("Starting test...");
    const prompts = await generateFollowUpPrompts("a beautiful alien dog", "https://picsum.photos/200/300");
    console.log("Result:", prompts);
}

test();
