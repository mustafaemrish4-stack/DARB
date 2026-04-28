const fs = require('fs');
const file = 'C:/xampp/htdocs/wordpress/wp-content/plugins/Solvica_WP_Plugin/assets/script.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/const searchRes = await fetch\(\`https:\/\/ar\.wikipedia\.org.*?\n                    \}/s, `const searchRes = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://html.duckduckgo.com/html/?q=' + text));
                    const searchData = await searchRes.json();
                    if (searchData.contents) {
                        const snippetRegex = /class="result__snippet"[^>]*>(.*?)<\\/a>/gi;
                        let match;
                        let snippets = [];
                        while ((match = snippetRegex.exec(searchData.contents)) !== null) {
                            snippets.push(match[1].replace(/<\\/?[^>]+(>|$)/g, ""));
                            if (snippets.length >= 3) break;
                        }
                        if (snippets.length > 0) {
                            promptToSend += \`[معلومات حية من محرك البحث لتجاوب عليها: "\${snippets.join(' | ')}"]. وفر روابط إذا توفرت.\\n\`;
                        }
                    }`);
fs.writeFileSync(file, content, 'utf8');
console.log('Replaced successfully');
