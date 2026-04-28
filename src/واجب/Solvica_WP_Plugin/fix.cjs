const fs = require('fs');

// Fix CSS
const cssFile = 'c:/Users/Musta/Downloads/darb---درب/src/واجب/Solvica_WP_Plugin/assets/style.css';
let cssContent = fs.readFileSync(cssFile, 'utf8');
if (!cssContent.includes('@media (max-width: 480px)')) {
    cssContent += `
@media (max-width: 480px) {
    #solvica-chat-box {
        width: calc(100vw - 30px);
        right: 15px;
        bottom: 80px;
    }
}
`;
    fs.writeFileSync(cssFile, cssContent);
}

// Fix JS
const jsFile = 'c:/Users/Musta/Downloads/darb---درب/src/واجب/Solvica_WP_Plugin/assets/script.js';
let jsContent = fs.readFileSync(jsFile, 'utf8');

if (!jsContent.includes('chatMemory')) {
    jsContent = jsContent.replace('let currentFileName = null;', 'let currentFileName = null;\n    let chatMemory = [];');
    
    jsContent = jsContent.replace(
        /messages:\s*\[\s*\{\s*role:\s*'system',\s*content:\s*promptToSend\s*},\s*\{\s*role:\s*'user',\s*content:\s*text \|\| "اقرأ المرفقات بذكاء\."\s*}\s*\]/g,
        'messages: [\n                    { role: \'system\', content: promptToSend },\n                    ...chatMemory,\n                    { role: \'user\', content: text || "اقرأ المرفقات بذكاء." }\n                ]'
    );

    jsContent = jsContent.replace(
        /messages:\s*\[\s*\{\s*role:\s*'system',\s*content:\s*promptToSend\s*},\s*\{\s*role:\s*'user',\s*content:\s*text \|\| "مرحبا"\s*}\s*\]/g,
        'messages: [\n                    { role: \'system\', content: promptToSend },\n                    ...chatMemory,\n                    { role: \'user\', content: text || "مرحبا" }\n                ]'
    );

    jsContent = jsContent.replace(
        /\[صورة مرفقة بدون نص واضح\. تفاعل معها بشكل إيجابي\]\./g,
        '[المستخدم أرسل لك صورة. أجب بحماس: أرى الصورة بوضوح! كيف يمكنني مساعدتك؟ إياك أن تعتذر أو تقول لا أستطيع رؤيتها].'
    );

    jsContent = jsContent.replace(
        /appendMessage\('bot', parseMarkdown\(finalResponse\)\);/g,
        'appendMessage(\'bot\', parseMarkdown(finalResponse));\n            chatMemory.push({ role: \'user\', content: text || "مرفق" });\n            chatMemory.push({ role: \'assistant\', content: finalResponse });\n            if (chatMemory.length > 6) chatMemory.splice(0, 2);'
    );

    fs.writeFileSync(jsFile, jsContent);
}

console.log('Fixed');
