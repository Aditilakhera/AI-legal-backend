import { getAdvisory, getAiSnapshot } from '../services/stockService.js';

async function test() {
    try {
        console.log("Calling getAdvisory('TCS.BSE')...");
        const advisory = await getAdvisory('TCS.BSE');
        console.log("Advisory returned successfully:", Object.keys(advisory));
        console.log("Advisory report:", advisory.report);
        
        console.log("\nCalling getAiSnapshot('TCS.BSE', 'Tata Consultancy')...");
        const snapshot = await getAiSnapshot('TCS.BSE', 'Tata Consultancy');
        console.log("Snapshot returned successfully:", snapshot ? Object.keys(snapshot) : null);
    } catch (err) {
        console.error("Error calling stockService:", err);
    }
}

test();
