async function testKey() {
    console.log('Testing AgentRouter API Key...');
    const apiKey = 'sk-HQM5jgN8LGXLGZPkQ44JJrHQEN0lB7ZZ4l7Tls8qyvZWoZIQ';
    const endpoint = 'https://agentrouter.org/v1/chat/completions';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Generic model name often supported by proxies
                messages: [{ role: 'user', content: 'Say "Hello, API key is working!"' }]
            })
        });

        const status = response.status;
        const text = await response.text();
        
        console.log(`Status Code: ${status}`);
        console.log(`Response Body: ${text}`);

    } catch (error) {
        console.error('Error connecting to API:', error.message);
    }
}

testKey();
