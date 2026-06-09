import YahooFinance from 'yahoo-finance2';

async function test() {
    try {
        console.log("Instantiating YahooFinance...");
        const yahooFinance = new YahooFinance();
        console.log("Searching Yahoo Finance for TCS.BO...");
        const result = await yahooFinance.search('TCS.BO', {}, { validateResult: false });
        console.log("Success! Search returned:", result ? Object.keys(result) : null);
        console.log("News length:", result?.news?.length);
    } catch (err) {
        console.error("YF API error:", err);
    }
}

test();
