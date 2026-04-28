const fs = require('fs');
const jsFile = 'c:/Users/Musta/Downloads/darb---درب/src/واجب/Solvica_WP_Plugin/assets/script.js';
let content = fs.readFileSync(jsFile, 'utf8');

content = content.replace(/models\/gemini-1\.5-flash:generateContent\?key=' \+ GEMINI_KEY/g, "models/gemini-flash-latest:generateContent?key=' + GEMINI_KEY");
content = content.replace(/AIzaSyC74tlxBOXR5U6pnENHI-AQLTFp4n78Mvc/g, "AIzaSyAdBRsZXrtUr795muhnDKFMtD7Wzifaq70");

fs.writeFileSync(jsFile, content);
console.log('Gemini Model and Key Updated!');
