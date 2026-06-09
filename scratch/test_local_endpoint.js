import axios from 'axios';

async function run() {
    try {
        console.log("Fetching active session token from localhost:8080/api/stock/debug-session...");
        const sessionRes = await axios.get('http://localhost:8080/api/stock/debug-session');
        const token = sessionRes.data.token;
        if (!token) {
            console.error("No active session found in database!");
            return;
        }
        console.log("Found Active Session Token:", token.substring(0, 30) + "...");

        const endpoints = ['news', 'advisory', 'research'];
        for (const endpointName of endpoints) {
            try {
                console.log(`\nCalling ${endpointName} endpoint...`);
                const res = await axios.get(`http://localhost:8080/api/stock/${endpointName}`, {
                    params: { symbol: 'TCS.BSE', name: 'Tata Consultancy' },
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log(`Success! ${endpointName} response keys:`, Object.keys(res.data));
                console.log(`Sample of ${endpointName} data:`, JSON.stringify(res.data, null, 2).substring(0, 500));
            } catch (err) {
                console.error(`Error calling ${endpointName} endpoint:`, err.response ? {
                    status: err.response.status,
                    data: err.response.data
                } : err.message);
            }
        }
    } catch (err) {
        console.error("Script execution failed:", err.message);
    }
}

run();
