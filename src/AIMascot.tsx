import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from './lib/utils';

interface AIMascotProps {
  lastMessage: string | null;
  isThinking: boolean;
}

type InteractionState = 'idle' | 'happy' | 'thinking' | 'speaking' | 'dizzy';

export const AIMascot = ({ lastMessage, isThinking }: AIMascotProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [interaction, setInteraction] = useState<InteractionState>('idle');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  // Random Blink Effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Blink duration
    }, Math.random() * 3000 + 2000); // Random interval between 2s and 5s

    return () => clearInterval(blinkInterval);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize TTS
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Update State Based on Props
  useEffect(() => {
    if (isThinking) {
      setInteraction('thinking');
    } else if (isSpeaking) {
      setInteraction('speaking');
    } else if (interaction !== 'happy' && interaction !== 'dizzy') {
      setInteraction('idle');
    }
  }, [isThinking, isSpeaking]);

  // Handle Speech
  useEffect(() => {
    if (!lastMessage || !voiceEnabled || !synthRef.current) return;

    const speak = () => {
      synthRef.current?.cancel();
      const cleanText = lastMessage
        .replace(/[#*`_]/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.pitch = 1.1; // Slightly higher for a friendly robot
      utterance.rate = 1.0;

      // Try to find a premium Arabic voice
      const voices = synthRef.current?.getVoices() || [];
      const arabicVoice = voices.find(v => v.lang.includes('ar') && (v.name.includes('Premium') || v.name.includes('Online')));
      if (arabicVoice) utterance.voice = arabicVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current?.speak(utterance);
    };

    // Delay slighty to ensure voices are loaded on some browsers
    setTimeout(speak, 100);

    return () => {
      synthRef.current?.cancel();
    };
  }, [lastMessage, voiceEnabled]);

  // Eye Tracking Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      let clientX, clientY;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      // Calculate distance and angle
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      
      // Limit eye movement max offset
      const maxOffset = 8; 
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY) / 20, maxOffset);

      setMousePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
    };
  }, []);

  // Click Interaction
  const handleInteract = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 3) {
      setInteraction('dizzy');
      setClickCount(0);
      setTimeout(() => setInteraction('idle'), 3000);
    } else {
      setInteraction('happy');
      setTimeout(() => {
        if (interaction !== 'dizzy') setInteraction('idle');
      }, 1500);
    }
  };

  return (
    <div className="relative w-full p-4 flex flex-col items-center z-20" ref={containerRef}>
      {/* Settings/Voice Toggle */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            if (voiceEnabled) synthRef.current?.cancel();
          }}
          className="w-8 h-8 bg-brand-cream border border-brand-deep/10 rounded-full flex items-center justify-center text-brand-deep shadow-sm transition-all hover:scale-110"
        >
          {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
      </div>

      {/* The Robot Mascot */}
      <motion.div 
        onClick={handleInteract}
        className="relative cursor-pointer group select-none"
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        animate={{
          y: interaction === 'happy' ? [-20, 20, -20] : (isSpeaking || isThinking) ? [-8, 8, -8] : [0, -8, 0],
          rotate: interaction === 'dizzy' ? 720 : interaction === 'thinking' ? [0, -15, 15, 0] : 0,
          scale: interaction === 'happy' ? [1, 1.2, 1] : 1
        }}
        transition={{
          repeat: interaction === 'dizzy' ? 1 : Infinity,
          duration: interaction === 'happy' ? 0.4 : interaction === 'dizzy' ? 0.8 : (isSpeaking ? 1 : 2.5),
          ease: "easeInOut"
        }}
      >
        {/* Robot Head (Visor container) */}
        <div className="w-28 h-20 bg-[#1A1A1A] rounded-[2rem] shadow-2xl relative border-4 border-[#2A2A2A] overflow-hidden flex items-center justify-center">
          
          {/* Screen Glare */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[2rem]"></div>

          {/* Eyes Container */}
          <motion.div 
            className="flex gap-4 relative z-10"
            animate={{
              x: mousePos.x,
              y: mousePos.y
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Left Eye */}
            <motion.div 
              className={cn(
                "w-6 bg-[#00E5FF] rounded-full shadow-[0_0_15px_#00E5FF] transition-all duration-300",
                isBlinking ? "h-1 opacity-50" :
                interaction === 'dizzy' ? "h-2 rotate-45" :
                interaction === 'happy' ? "h-3 -mt-2 rounded-t-full rounded-b-sm" :
                interaction === 'thinking' ? "h-5 mt-1" :
                isSpeaking ? "h-6 animate-pulse" : "h-8"
              )}
            />
            {/* Right Eye */}
            <motion.div 
              className={cn(
                "w-6 bg-[#00E5FF] rounded-full shadow-[0_0_15px_#00E5FF] transition-all duration-300",
                isBlinking ? "h-1 opacity-50" :
                interaction === 'dizzy' ? "h-2 -rotate-45" :
                interaction === 'happy' ? "h-3 -mt-2 rounded-t-full rounded-b-sm" :
                interaction === 'thinking' ? "h-8" : // Asymmetric thinking eyes
                isSpeaking ? "h-6 animate-pulse delay-75" : "h-8"
              )}
            />
          </motion.div>

          {/* Thinking / Speaking indicator inside visor */}
          <AnimatePresence>
            {isThinking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
              >
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full shadow-[0_0_5px_#00E5FF]"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            )}
            
            {isSpeaking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 items-end h-3"
              >
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div 
                    key={i}
                    className="w-1 bg-[#00E5FF] rounded-full shadow-[0_0_5px_#00E5FF]"
                    animate={{ height: [2, Math.random() * 8 + 4, 2] }}
                    transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Robot Ears/Antennas */}
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-3 h-8 bg-[#2A2A2A] rounded-l-md border-y border-l border-white/10" />
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-3 h-8 bg-[#2A2A2A] rounded-r-md border-y border-r border-white/10" />
        
        {/* Dizzy Stars */}
        <AnimatePresence>
          {interaction === 'dizzy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute -top-6 -inset-x-4 h-full pointer-events-none"
            >
              <span className="absolute top-0 left-0 text-xl">⭐</span>
              <span className="absolute top-4 right-0 text-xl">⭐</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
