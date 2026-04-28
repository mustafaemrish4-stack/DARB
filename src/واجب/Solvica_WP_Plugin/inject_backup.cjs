const fs = require('fs');
const jsFile = 'c:/Users/Musta/Downloads/darb---درب/src/واجب/Solvica_WP_Plugin/assets/script.js';
let content = fs.readFileSync(jsFile, 'utf8');

const backupGeminiFunc = `
    async function callGeminiBackup(promptToSend, text, base64Image) {
        // مفتاح احتياطي (مختلف عن الأول)
        const GEMINI_KEY_2 = 'AIzaSyBNtp1gNZkTKtb0o4r8EuFA-DRAY43g2X8';
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + GEMINI_KEY_2;
        
        let parts = [];
        if (text) parts.push({ text: text });
        if (!text && !base64Image) parts.push({ text: 'مرحبا' });
        
        if (base64Image) {
            let mimeType = 'image/jpeg';
            let base64Data = base64Image;
            if (base64Image.includes('data:')) {
                mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
                base64Data = base64Image.split(',')[1];
            }
            parts.push({
                inline_data: { mime_type: mimeType, data: base64Data }
            });
        }
        
        const history = (typeof chatMemory !== 'undefined' ? chatMemory : []).map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));
        history.push({ role: 'user', parts: parts });

        const body = { system_instruction: { parts: [{ text: promptToSend }] }, contents: history };
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        
        if (!res.ok) throw new Error('Gemini Backup API Error: ' + res.status);
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    }
`;

if (!content.includes('callGeminiBackup')) {
    content = content.replace('async function callChatAnywhere', backupGeminiFunc + '\n    async function callChatAnywhere');
    
    // Add Gemini Backup to aiLayers array as the second option
    content = content.replace(
        /\{ name: "Gemini Vision", fn: callGemini \},/,
        '{ name: "Gemini Vision (Main)", fn: callGemini },\n                { name: "Gemini Vision (Backup)", fn: callGeminiBackup },'
    );
    
    fs.writeFileSync(jsFile, content);
    console.log('Backup Gemini Injected!');
}
