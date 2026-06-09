import YahooFinance from 'yahoo-finance2';

async function test() {
    try {
        const yahooFinance = new YahooFinance();
        const result = await yahooFinance.search('TCS.BO', {}, { validateResult: false });
        console.log("Raw News Item 0:", result.news[0]);
    } catch (err) {
        console.error("Error:", err);
    }
}

test();
