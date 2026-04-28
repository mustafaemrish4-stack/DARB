import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mic } from 'lucide-react';
import { aiClient } from './lib/ai/aiClient';
import { cn } from './lib/utils';

export const ARExperience = ({ onClose }: { onClose: () => void }) => {
  const [hasWebXR, setHasWebXR] = useState(true);
  const [isSecure, setIsSecure] = useState(window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // AI Voice State
  const [isListening, setIsListening] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [robotActive, setRobotActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  const AI_ROBOT_SYSTEM_PROMPT = `
    أنت المرشد الذكي داخل تقنية الواقع المعزز لتطبيق درب.
    صوتك مسموع الآن للطفل، لذلك اجعل ردودك قصيرة جداً (سطر أو سطرين كحد أقصى) وممتعة وتفاعلية!
    لا تستخدم تنسيق Markdown مثل النجمة أو المربعات لأنك تتحدث صوتياً.
    تحدث كأنك روبوت لطيف يقف أمام الطفل في غرفته.
  `;

  useEffect(() => {
    const checkXR = async () => {
      const navAny = navigator as any;
      if (navAny.xr) {
        try {
          const supported = await navAny.xr.isSessionSupported('immersive-ar');
          setHasWebXR(supported);
        } catch (e) {
          setHasWebXR(false);
        }
      } else {
        setHasWebXR(false);
      }
    };
    checkXR();

    // Setup Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-SA';

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      
      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("User said:", transcript);
        setAiThinking(true);
        
        // Update Robot bubble in AR to show thinking
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'AI_THINKING' }, '*');
        }

        try {
            const reply = await aiClient.chat(
                [{ role: 'user', content: transcript }],
                { model: 'gemini-1.5-flash' },
                AI_ROBOT_SYSTEM_PROMPT
            );
            
            // Speak the reply
            const utterance = new SpeechSynthesisUtterance(reply);
            utterance.lang = 'ar-SA';
            utterance.rate = 1.1; 
            window.speechSynthesis.speak(utterance);
            
            // Update Robot bubble in AR
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ type: 'AI_REPLY', text: reply }, '*');
            }
        } catch(e) {
            console.error("AI Error:", e);
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({ type: 'AI_REPLY', text: 'أواجه مشكلة في الاتصال، حاول مجدداً!' }, '*');
            }
        } finally {
            setAiThinking(false);
        }
      };
    }
    
    // Listen for messages from iframe
    const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'ROBOT_SELECTED') {
            setRobotActive(true);
        } else if (e.data.type === 'ROBOT_DESELECTED') {
            setRobotActive(false);
        } else if (e.data.type === 'START_VOICE_RECOGNITION') {
            window.speechSynthesis.cancel(); // Stop current speech
            try { recognitionRef.current?.start(); } catch(e){}
        }
    };
    window.addEventListener('message', handleMessage);
    return () => {
        window.removeEventListener('message', handleMessage);
        window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col"
    >
      <header className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10 absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <button onClick={onClose} className="pointer-events-auto w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-md transition-all shadow-md">
          <ChevronLeft size={20} className="rotate-180" />
        </button>
        <div className="text-center pointer-events-none">
          <h3 className="font-serif font-bold text-white shadow-black drop-shadow-md leading-none">ارسم وابتكر (AR 3D)</h3>
          <span className="text-[10px] font-bold text-brand-gold uppercase mt-1.5 block tracking-widest shadow-black drop-shadow-md">اسقاط مجسمات والرسم بالهواء</span>
        </div>
        <div className="w-10 h-10" />
      </header>

      {/* Voice Assistant UI Overlay */}
      <AnimatePresence>
        {robotActive && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute bottom-24 left-0 right-0 flex justify-center z-30 pointer-events-none"
            >
                <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 flex flex-col items-center gap-3 shadow-2xl">
                    <p className="text-white text-xs font-bold">
                        {aiThinking ? "يفكر..." : isListening ? "يتحدث معك الآن، قل شيئاً!" : "اضغط على المايك للتحدث مع المرشد الذكي"}
                    </p>
                    <button 
                        onClick={() => {
                            window.speechSynthesis.cancel();
                            try { recognitionRef.current?.start(); } catch(e){}
                        }}
                        className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg pointer-events-auto transition-all",
                            isListening ? "bg-red-500 animate-pulse scale-110" : "bg-brand-deep hover:bg-brand-deep/80"
                        )}
                    >
                        <Mic size={28} className={isListening ? "animate-bounce" : ""} />
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {!isSecure && (
         <div className="absolute inset-0 flex items-center justify-center bg-brand-deep z-50 p-8 text-center flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">الكاميرا تتطلب اتصالاً آمناً 🔒</h2>
            <p className="text-white/80 font-bold mb-6 text-sm leading-relaxed text-right dir-rtl">
              حماية المتصفح (Chrome) تمنع تشغيل كاميرا الواقع المعزز عند تجربة التطبيق محلياً عبر الشبكة (IP) لأنه ليس اتصالاً موثقاً.<br/><br/>
              <strong className="text-brand-gold">لحل المشكلة للتطوير:</strong><br/>
              1. انسخ هذا الرابط: <code>chrome://flags/#unsafely-treat-insecure-origin-as-secure</code> وافتحه في متصفح جوالك.<br/>
              2. أضف رابط الجوال الحالي <code>{window.location.origin}</code> في الصندوق وفعّله (Enable).<br/>
              3. أعد تشغيل المتصفح، وسيعمل الـ AR!
            </p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                alert("تم نسخ الرابط! اذهب إلى chrome://flags");
              }} 
              className="bg-brand-gold text-brand-deep px-8 py-4 rounded-full font-bold shadow-lg text-lg mb-4 hover:scale-105 transition-transform"
            >
              نسخ رابط التطبيق الحالي
            </button>
            <button onClick={onClose} className="mt-4 text-white/50 underline px-8 py-2 rounded-full font-bold">العودة للتطبيق</button>
         </div>
      )}

      {isSecure && !hasWebXR && (
         <div className="absolute inset-0 flex items-center justify-center bg-brand-deep z-50 p-8 text-center flex-col">
            <h2 className="text-2xl text-white mb-4">هاتفك لا يدعم تقنية WebXR 😢</h2>
            <p className="text-white/70">لكي ترسم سيارة على الكنبة وتحركها، تحتاج إلى متصفح Chrome على هاتف أندرويد حديث يدعم ARCore بالكامل.</p>
            <button onClick={onClose} className="mt-8 bg-brand-green text-white px-8 py-3 rounded-full font-bold">العودة للتطبيق</button>
         </div>
      )}

      {isSecure && hasWebXR && (
        <div className="flex-1 relative bg-transparent overflow-hidden">
          <iframe 
            ref={iframeRef}
            src="/ar-experience.html" 
            className="w-full h-full border-none outline-none pointer-events-auto"
            allow="camera; gyroscope; accelerometer; magnetometer; vr; xr-spatial-tracking"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
      )}
    </motion.div>
  );
};
