const fs = require('fs');
const jsFile = 'c:/Users/Musta/Downloads/darb---درب/src/واجب/Solvica_WP_Plugin/assets/script.js';
let content = fs.readFileSync(jsFile, 'utf8');

const geminiFunc = `
    async function callGemini(promptToSend, text, base64Image) {
        const GEMINI_KEY = 'AIzaSyC74tlxBOXR5U6pnENHI-AQLTFp4n78Mvc';
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_KEY;
        
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

        const body = {
            system_instruction: { parts: [{ text: promptToSend }] },
            contents: history
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (!res.ok) {
            const errData = await res.text();
            throw new Error('Gemini API Error: ' + res.status);
        }
        
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    }
`;

if (!content.includes('callGemini')) {
    content = content.replace('async function callChatAnywhere', geminiFunc + '\n    async function callChatAnywhere');
    
    content = content.replace(
        /let tempResponse = await aiLayers\[i\]\.fn\(promptToSend, text\);/g,
        'let tempResponse = await aiLayers[i].fn(promptToSend, text, savedImageData);'
    );
    
    content = content.replace(
        /const aiLayers = \[/,
        'const aiLayers = [\n                { name: "Gemini Vision", fn: callGemini },'
    );
    
    // Disable OCR fallback prompt injection if using Gemini
    content = content.replace(
        /if \(hasImage\) \{[\s\S]*?\}\s*\}/g,
        `if (hasImage) {
                if (extractedImageText.trim().length > 0) {
                    promptToSend += "\\n[نص مستخرج من الصورة للمساعدة: " + extractedImageText.trim() + "].";
                }
            }`
    );
    
    fs.writeFileSync(jsFile, content);
    console.log('Gemini Native Vision Injected successfully!');
} else {
    console.log('Gemini Native Vision is already injected.');
}
