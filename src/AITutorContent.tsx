import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Brain, Loader, ChevronLeft, Mic, MicOff } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { aiClient } from './lib/ai/aiClient';
import { AIMascot } from './AIMascot';
import { cn } from './lib/utils';

// Add the System Prompt specific to Darb
const DARB_AI_SYSTEM_PROMPT = `
أنت "المرشد الذكي" لتطبيق "درب - لكل مكان قصة". 
أنت صديق للأطفال في فلسطين وتعلمهم عن مدنهم (القدس، حيفا، يافا، عكا، نابلس، غزة) وعن الفيديوهات الموجودة في التطبيق (الديناصورات، الطبيعة، عالم الحيوان، الحديقة، الكرتون).
مهمتك:
1. التحدث بلطف وحماس مع الأطفال باللغة العربية.
2. استخدام الإيموجي المناسبة.
3. إذا سألك الطفل عن مكان في فلسطين، أعطه معلومة صغيرة وممتعة جداً.
4. إذا تم سؤالك عن الذكاء الاصطناعي، اذكر أنك تعمل بـ "Solvica AI Engine ضمن تطبيق درب".
5. 🖼️ **هام جداً لطلب الصور:** إذا طلب منك الطفل "صورة" لأي شيء (مثل مدينة، حيوان، أو أي معلم)، **يجب** أن تعطيه صورة مولدة فوراً باستخدام صيغة Markdown كالتالي:
  ![وصف الصورة](https://image.pollinations.ai/prompt/English-Description-Here?width=600&height=400&nologo=true)
  مثال إذا طلب صورة المسجد الأقصى:
  ![المسجد الأقصى](https://image.pollinations.ai/prompt/Al%20Aqsa%20Mosque%20Jerusalem%20beautiful%20sunny%20day%20realistic?width=600&height=400&nologo=true)
  (يجب أن تكتب الوصف في الرابط باللغة الإنجليزية دائماً).
`;

export const AITutorContent = ({ isFullPage = false, onClose }: { isFullPage?: boolean, onClose?: () => void }) => {
    const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([
        { role: 'model', content: 'أهلاً بك يا بطل الأبطال في تطبيق درب! 🌟 أنا المرشد الذكي الخاص بك (Solvica AI)، ومتحمس جداً لرحلتنا اليوم! كيف يمكنني مساعدتك في استكشاف فلسطين الرائعة؟ 🚀✨' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'ar-SA';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                // Optionally auto-send: handleSendText(transcript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInput('');
            recognitionRef.current?.start();
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsThinking(true);

        try {
            // Call Solvica AI engine seamlessly!
            const reply = await aiClient.chat(
                [...messages, { role: 'user', content: userText }],
                { model: 'gemini-1.5-flash' }, // Fast model for kids
                DARB_AI_SYSTEM_PROMPT
            );
            
            setMessages(prev => [...prev, { role: 'model', content: reply }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'model', content: 'عذراً يا صديقي، يبدو أن المرشد يحتاج لقسط من الراحة. هل يمكنك المحاولة مرة أخرى؟ 🤖💤' }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className={`flex flex-col bg-brand-cream ${isFullPage ? 'h-full w-full' : 'h-[500px] rounded-[2.5rem]'} shadow-xl relative overflow-hidden`}>
            {/* Header */}
            <header className="p-4 bg-brand-deep text-white flex items-center justify-between shadow-md relative z-10">
                {onClose && (
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                )}
                <div className="flex items-center gap-2">
                    <Brain className="text-brand-gold" size={24} />
                    <h3 className="font-serif font-bold text-lg leading-none">المرشد الذكي</h3>
                </div>
                <div className="text-[10px] bg-white/20 px-2 py-1 rounded-full border border-white/20">
                    Solvica Powered
                </div>
            </header>

            <AIMascot 
                lastMessage={messages.filter(m => m.role === 'model').slice(-1)[0]?.content || null} 
                isThinking={isThinking} 
            />

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar relative z-10 bg-white/50" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-4 shadow-sm ${
                            msg.role === 'user' ? 
                            'bg-brand-deep text-white rounded-2xl rounded-tr-sm' : 
                            'bg-white text-brand-black border border-brand-deep/10 rounded-2xl rounded-tl-sm'
                        }`}>
                            {msg.role === 'model' ? (
                                <div className="prose prose-sm prose-invert max-w-none text-right">
                                    <ReactMarkdown
                                        remarkPlugins={[[remarkGfm], [remarkMath]]}
                                        rehypePlugins={[[rehypeKatex]]}
                                        components={{
                                            p: ({node, className, ...props}: any) => <p className={cn("mb-2 rtl", className)} {...props} />,
                                            strong: ({node, className, ...props}: any) => <strong className={cn("font-bold text-brand-deep", className)} {...props} />
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-sm font-medium leading-relaxed" dir="auto">{msg.content}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
                
                {isThinking && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white border border-brand-deep/10 rounded-2xl rounded-tl-sm p-4 text-brand-green flex items-center gap-2">
                            <Loader className="animate-spin" size={16} />
                            <span className="text-xs font-bold">المرشد يفكر...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-brand-deep/5 relative z-10">
                <div className="flex items-center gap-3 bg-brand-deep/5 p-2 rounded-2xl border border-brand-deep/10 focus-within:border-brand-deep/30 transition-all">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="اسأل المرشد الذكي..."
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-brand-deep text-right placeholder:text-brand-deep/40 font-medium px-2"
                        dir="rtl"
                    />
                    <div className="flex items-center gap-2 shrink-0 pr-2 border-r border-brand-deep/10">
                        <button 
                            onClick={toggleListening}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-brand-deep border border-brand-deep/10 hover:bg-brand-deep/10'}`}
                            disabled={isThinking}
                            title={isListening ? 'إيقاف الاستماع' : 'تحدث الآن'}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isThinking}
                            className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center hover:bg-brand-green/90 transition-all shadow-sm disabled:opacity-50"
                        >
                            <Send size={18} className="rotate-180" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
