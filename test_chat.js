import fetch from 'node-fetch';
async function test() {
    const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: 'what is system design',
            sessionId: 'mnr6i9u38z2wtb35qsg',
            history: []
        })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
test();