async function testPollinations() {
    const prompt = 'كيف حالك';
    const system = 'أنت مساعد ذكي';
    const url = `https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}?system=${encodeURIComponent(system)}`;
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log(text);
    } catch (e) {
        console.error(e);
    }
}
testPollinations();
