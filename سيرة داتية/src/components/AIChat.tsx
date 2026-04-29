
import { useState, useEffect, useRef } from 'react';
import { chatWithGemini } from '../lib/gemini';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
        { role: 'ai', text: 'مرحباً! أنا مساعد مصطفى الذكي 🤖\nاسألني عن المهارات، المشاريع، أو كيفية التواصل مع مصطفى!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await chatWithGemini(userMsg);
            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--accent)', /* Green */
                    boxShadow: '0 0 20px rgba(0, 242, 152, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10005,
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isOpen ? 'rotate(90deg) scale(0)' : 'scale(1)',
                    pointerEvents: 'all'
                }}
            >
                <MessageCircle color="black" size={32} />
            </div>

            <div
                style={{
                    position: 'fixed',
                    bottom: isOpen ? '30px' : '-20px',
                    right: '30px',
                    width: 'min(90vw, 380px)',
                    height: '550px',
                    maxHeight: '80vh',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'all' : 'none',
                    border: '1px solid var(--border-color)',
                    transformOrigin: 'bottom right',
                    transform: isOpen ? 'scale(1)' : 'scale(0.8)',
                    zIndex: 10005
                }}
            >
                {/* Header */}
                <div style={{
                    background: 'var(--bg-primary)',
                    padding: '20px',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'var(--accent)', padding: '8px', borderRadius: '12px' }}>
                            <Sparkles size={20} color="var(--accent-text)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Mustafa AI</h3>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--accent)' }}>Powered by Pollinations AI</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    background: 'var(--bg-card)'
                }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                            borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
                            backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                            color: msg.role === 'user' ? 'var(--accent-text)' : 'var(--text-primary)',
                            fontWeight: msg.role === 'user' ? '600' : '400',
                            lineHeight: '1.5',
                            fontSize: '0.95rem',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {msg.text.split(/(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g).map((part, i) => {
                                // Match Markdown Link: [Label](URL)
                                const markdownMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                                if (markdownMatch) {
                                    return (
                                        <a
                                            key={i}
                                            href={markdownMatch[2]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: msg.role === 'user' ? 'white' : 'var(--accent)', textDecoration: 'underline' }}
                                        >
                                            {markdownMatch[1]}
                                        </a>
                                    );
                                }

                                // Match Raw URL
                                if (part.match(/^https?:\/\//)) {
                                    return (
                                        <a
                                            key={i}
                                            href={part}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: msg.role === 'user' ? 'white' : 'var(--accent)', textDecoration: 'underline' }}
                                        >
                                            {part}
                                        </a>
                                    );
                                }

                                return part;
                            })}
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{
                            alignSelf: 'flex-start',
                            backgroundColor: 'var(--bg-secondary)',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            borderBottomLeftRadius: '4px',
                            display: 'flex',
                            gap: '4px'
                        }}>
                            <span style={{ animation: 'bounce 1s infinite', animationDelay: '0s', color: 'var(--accent)' }}>•</span>
                            <span style={{ animation: 'bounce 1s infinite', animationDelay: '0.2s', color: 'var(--accent)' }}>•</span>
                            <span style={{ animation: 'bounce 1s infinite', animationDelay: '0.4s', color: 'var(--accent)' }}>•</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                    padding: '15px',
                    background: 'var(--bg-primary)',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    gap: '10px'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about Mustafa..."
                        style={{
                            flex: 1,
                            padding: '12px 20px',
                            borderRadius: '25px',
                            border: '1px solid var(--border-color)',
                            outline: 'none',
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            border: 'none',
                            background: isLoading ? 'var(--bg-secondary)' : 'var(--accent)',
                            color: isLoading ? 'var(--text-secondary)' : 'var(--accent-text)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isLoading ? 'default' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </>
    );
};
