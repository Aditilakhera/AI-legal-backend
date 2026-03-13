import { performDeepSearch } from './services/deepSearch.service.js';

async function test() {
    console.log("Testing Deep Search...");
    try {
        const result = await performDeepSearch("latest space x launch");
        console.log("RESULT SUMMARY:", result.summary.substring(0, 200));
        console.log("SOURCES COUNT:", result.sources.length);
    } catch (e) {
        console.error("TEST FAILED:", e.message);
    }
}

test();
