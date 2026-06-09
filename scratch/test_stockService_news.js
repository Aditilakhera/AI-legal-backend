import { getNews } from '../services/stockService.js';

async function test() {
    try {
        console.log("Calling getNews('TCS.BSE') from stockService...");
        const news = await getNews('TCS.BSE');
        console.log("News returned:", news);
    } catch (err) {
        console.error("Error calling getNews:", err);
    }
}

test();
