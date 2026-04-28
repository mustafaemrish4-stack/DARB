jQuery(document).ready(function($) {
    const chatBox = $('#solvica-chat-box');
    const triggerBtn = $('#solvica-trigger-btn');
    const closeBtn = $('#solvica-close-btn');
    const sendBtn = $('#solvica-send-btn');
    const userInput = $('#solvica-user-input');
    const chatHistory = $('#solvica-chat-history');
    const micBtn = $('#solvica-mic-btn');
    const fileUpload = $('#solvica-file-upload');
    const attachmentPreview = $('#solvica-attachment-preview');
    const previewImg = $('#solvica-preview-img');
    const fileInfo = $('#solvica-file-info');
    const removeAttachmentBtn = $('#solvica-remove-attachment');

    let currentImageData = null;
    let currentFileContent = null;
    let currentFileName = null;
    let chatMemory = [];

    triggerBtn.on('click', function() { chatBox.removeClass('solvica-hidden'); });
    closeBtn.on('click', function() { chatBox.addClass('solvica-hidden'); });

    fileUpload.on('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        currentFileName = file.name;
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                currentImageData = evt.target.result;
                currentFileContent = null;
                previewImg.attr('src', currentImageData).show();
                fileInfo.hide();
                attachmentPreview.removeClass('solvica-hidden');
            }
            reader.readAsDataURL(file);
        } else {
            const reader = new FileReader();
            reader.onload = function(evt) {
                currentFileContent = evt.target.result;
                currentImageData = null;
                previewImg.hide();
                fileInfo.text('ملف مرفق: ' + file.name).show();
                attachmentPreview.removeClass('solvica-hidden');
            }
            reader.readAsText(file);
        }
    });

    removeAttachmentBtn.on('click', function() {
        currentImageData = null;
        currentFileContent = null;
        currentFileName = null;
        fileUpload.val('');
        attachmentPreview.addClass('solvica-hidden');
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        micBtn.on('click', function() {
            if (micBtn.hasClass('recording')) {
                recognition.stop();
            } else {
                recognition.start();
                micBtn.addClass('recording');
            }
        });

        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            userInput.val(userInput.val() + " " + speechResult);
            micBtn.removeClass('recording');
        };

        recognition.onerror = function() { micBtn.removeClass('recording'); };
        recognition.onend = function() { micBtn.removeClass('recording'); };
    } else {
        micBtn.hide();
    }

    function parseMarkdown(text) {
        if (!text) return "";
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:#60a5fa;text-decoration:underline;">$1</a>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    async function extractTextFromImage(base64) {
        try {
            const formData = new FormData();
            formData.append('apikey', 'helloworld'); 
            formData.append('language', 'ara');
            formData.append('base64Image', base64);
            
            const res = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data && data.ParsedResults && data.ParsedResults.length > 0) {
                return data.ParsedResults[0].ParsedText || "";
            }
        } catch (e) {
            console.error("OCR Failed:", e);
        }
        return "";
    }

    // --- INDESTRUCTIBLE MULTI-LAYER AI ENGINE ---
    
    
    async function callGemini(promptToSend, text, base64Image) {
        const GEMINI_KEY = 'AIzaSyAdBRsZXrtUr795muhnDKFMtD7Wzifaq70';
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + GEMINI_KEY;
        
        let parts = [];
        if (text) parts.push({ text: text });
        if (!text && !base64Image) parts.push({ text: 'مرحبا' });
        
        if (base64Image) {
            let mimeType = 'image/jpeg';
            let base64Data = base64Image;
            if (base64Image.includes('data:')) {
                mimeType = base64Image.match(/data:([a-zA-Z0-9]+/[a-zA-Z0-9-.+]+).*,.*/)[1];
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
                mimeType = base64Image.match(/data:([a-zA-Z0-9]+/[a-zA-Z0-9-.+]+).*,.*/)[1];
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

    async function callChatAnywhere(promptToSend, text) {
        const response = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer sk-etOZ1MRieFwZwdmd26dQ62oZC0pme8ooScH9eqSTwz5lnUAC' },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: promptToSend },
                    ...chatMemory,
                    { role: 'user', content: text || "اقرأ المرفقات بذكاء." }
                ]
            })
        });
        if (!response.ok) throw new Error('ChatAnywhere API failed');
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async function callPollinations(promptToSend, text) {
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: promptToSend },
                    ...chatMemory,
                    { role: 'user', content: text || "اقرأ المرفقات بذكاء." }
                ],
                model: 'openai'
            })
        });
        if (!response.ok) throw new Error('Pollinations API failed');
        return await response.text();
    }

    async function callG4F(promptToSend, text) {
        const response = await fetch('https://chat.g4f.ai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: promptToSend },
                    ...chatMemory,
                    { role: 'user', content: text || "مرحبا" }
                ],
                model: 'gpt-4'
            })
        });
        if (!response.ok) throw new Error('G4F API failed');
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async function sendMessage() {
        const text = userInput.val().trim();
        if (!text && !currentImageData && !currentFileContent) return;

        let userHtml = '';
        if (text) userHtml += text;
        if (currentImageData) userHtml += `<br><img src="${currentImageData}" class="msg-image">`;
        if (currentFileContent) userHtml += `<br><div style="font-size:12px; color:#94a3b8;">📄 تم إرفاق ملف: ${currentFileName}</div>`;
        
        appendMessage('user', userHtml);
        userInput.val('');
        
        const hasImage = currentImageData !== null;
        const hasFile = currentFileContent !== null;
        const savedImageData = currentImageData;
        const savedFileContent = currentFileContent;
        
        removeAttachmentBtn.click();

        const typingId = 'typing-' + Date.now();
        chatHistory.append(`
            <div class="solvica-message bot-msg" id="${typingId}">
                <div class="msg-bubble">
                    <div class="typing-indicator"><span></span><span></span><span></span></div>
                    <div style="font-size:10px; color:#64748b; margin-top:5px;" id="solvica-status-text">جاري التحليل الذكي...</div>
                </div>
            </div>
        `);
        scrollToBottom();

        try {
            let extractedImageText = "";
            if (hasImage) {
                if (extractedImageText.trim().length > 0) {
                    promptToSend += "\n[نص مستخرج من الصورة للمساعدة: " + extractedImageText.trim() + "].";
                }
            }
                } catch(e) { console.warn("Agent search failed", e); }
            }
            
            if (hasImage) {
                if (extractedImageText.trim().length > 0) {
                    promptToSend += "\n[نص مستخرج من الصورة للمساعدة: " + extractedImageText.trim() + "].";
                }
            }

            if (hasFile) {
                let fileSample = savedFileContent.substring(0, 3000);
                promptToSend += `[ملف نصي مرفق: \n"""\n${fileSample}\n"""\n أجب بناءً عليه بدقة.]`;
            }

            $('#solvica-status-text').text('جاري توليد الإجابة (الطبقة الأساسية)...');

            // Fallback Engine
            const aiLayers = [
                { name: "Gemini Vision (Main)", fn: callGemini },
                { name: "Gemini Vision (Backup)", fn: callGeminiBackup },
                { name: "ChatAnywhere", fn: callChatAnywhere },
                { name: "Pollinations", fn: callPollinations },
                { name: "G4F", fn: callG4F }
            ];

            let finalResponse = null;
            let errorLog = [];
            
            for (let i = 0; i < aiLayers.length; i++) {
                try {
                    $('#solvica-status-text').text(`محاولة عبر طبقة: ${aiLayers[i].name}...`);
                    let tempResponse = await aiLayers[i].fn(promptToSend, text, savedImageData);
                    if (tempResponse) {
                        tempResponse = tempResponse.replace(/.*IMPORTANT NOTICE.*[\s\S]*?continue to work normally\.?/gi, '');
                        tempResponse = tempResponse.trim();
                        if (tempResponse) {
                            finalResponse = tempResponse;
                            console.log(`Success with layer ${aiLayers[i].name}`);
                            break;
                        } else {
                            errorLog.push(`${aiLayers[i].name}: Failed (Returned noise)`);
                        }
                    } else {
                        errorLog.push(`${aiLayers[i].name}: Failed (Null response)`);
                    }
                } catch (err) {
                    errorLog.push(`${aiLayers[i].name} Error: ${err.message}`);
                }
            }

            if (!finalResponse) {
                throw new Error(errorLog.join(' | '));
            }

            $(`#${typingId}`).remove();
            appendMessage('bot', parseMarkdown(finalResponse));
            chatMemory.push({ role: 'user', content: text || "مرفق" });
            chatMemory.push({ role: 'assistant', content: finalResponse });
            if (chatMemory.length > 6) chatMemory.splice(0, 2);
            
        } catch (error) {
            $(`#${typingId}`).remove();
            console.error("Critical AI Error:", error);
            appendMessage('bot', `**تقرير الأخطاء الفني:**\n\n` + error.message + `\n\n(انسخ هذا التقرير للمبرمج مصطفى)`);
        }
    }

    sendBtn.on('click', sendMessage);
    userInput.on('keypress', function(e) {
        if (e.which == 13) sendMessage();
    });

    function appendMessage(sender, htmlContent) {
        const msgClass = sender === 'user' ? 'user-msg' : 'bot-msg';
        chatHistory.append(`<div class="solvica-message ${msgClass}"><div class="msg-bubble">${htmlContent}</div></div>`);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatHistory.animate({ scrollTop: chatHistory.prop("scrollHeight") }, 300);
    }
});
