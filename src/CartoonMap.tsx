import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Compass, MapPin, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';

interface CartoonMapProps {
  onStartTour: (place: any) => void;
}

export const CartoonMap = ({ onStartTour }: CartoonMapProps) => {
  const [activePopup, setActivePopup] = useState<any>(null);

  const landmarks = [
    {
      id: 'jerusalem',
      title: 'القدس',
      description: 'مغامرة في أزقة البلدة القديمة',
      icon: '🕌',
      type: 'VR 360',
      image: '/360/aqsa/1.jpg',
      position: { top: '45%', left: '35%' },
      color: 'bg-brand-gold/20 border-brand-gold',
      textColor: 'text-brand-gold'
    },
    {
      id: 'jenin',
      title: 'جامع جنين الكبير',
      description: 'اكتشف عبق التاريخ',
      icon: '🏰',
      type: 'image',
      image: '/360/jenin.jpg',
      position: { top: '35%', left: '70%' },
      color: 'bg-brand-green/20 border-brand-green',
      textColor: 'text-brand-green'
    },
    {
      id: 'nablus',
      title: 'خان التجار',
      description: 'جولة في سوق نابلس القديم',
      icon: '🏘️',
      type: 'image',
      image: '/360/nablus.jpg',
      position: { top: '65%', left: '20%' },
      color: 'bg-brand-bright/20 border-brand-bright',
      textColor: 'text-brand-bright'
    },
    {
      id: 'jaffa',
      title: 'ميناء يافا',
      description: 'حيث يعانق البحر التاريخ',
      icon: '⛵',
      type: 'image',
      image: '/360/jaffa.jpg',
      position: { top: '85%', left: '60%' },
      color: 'bg-blue-500/20 border-blue-500',
      textColor: 'text-blue-500'
    }
  ];

  return (
    <div className="relative w-full h-full bg-[#E5F2E5] rounded-[3rem] overflow-hidden shadow-inner border-[6px] border-[#FADCD9]">
      {/* Top Banner exactly like the picture */}
      <div className="absolute -top-2 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <div className="bg-[#FADCD9] text-brand-deep font-serif font-bold text-2xl px-10 py-2 rounded-full border-4 border-white shadow-md relative mt-4">
          <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-[#A8D8EA] text-4xl">✨</span>
          <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-[#F3B0C3] text-4xl">⭐</span>
          حكايات فلسطين
        </div>
      </div>

      {/* Cartoon Background Elements (Clouds, Stars, Birds) */}
      <div className="absolute top-4 right-8 text-4xl opacity-50 animate-bounce" style={{ animationDuration: '4s' }}>☁️</div>
      <div className="absolute top-20 left-10 text-3xl opacity-40 animate-bounce" style={{ animationDuration: '5s' }}>☁️</div>
      <div className="absolute bottom-10 right-20 text-5xl opacity-40 animate-bounce" style={{ animationDuration: '6s' }}>☁️</div>
      
      <div className="absolute top-10 right-1/2 text-brand-gold text-2xl animate-pulse">✨</div>
      <div className="absolute top-1/2 left-4 text-brand-gold text-xl animate-pulse delay-100">⭐</div>
      <div className="absolute bottom-32 right-8 text-brand-bright text-xl animate-pulse delay-300">💖</div>
      
      <div className="absolute top-1/3 right-1/4 text-2xl animate-pulse duration-700">🐦</div>

      {/* The Winding Path (SVG) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d="M 80 0 Q 70 30 50 40 T 30 70 Q 40 90 50 100" 
          fill="none" 
          stroke="#F2DFB8" 
          strokeWidth="12" 
          strokeLinecap="round"
        />
        <path 
          d="M 80 0 Q 70 30 50 40 T 30 70 Q 40 90 50 100" 
          fill="none" 
          stroke="#8A1734" 
          strokeWidth="0.5" 
          strokeDasharray="2, 2" 
          className="opacity-40"
        />
      </svg>

      {/* Landmarks / Markers */}
      {landmarks.map((landmark) => (
        <React.Fragment key={landmark.id}>
          {/* The Marker */}
          <motion.button
            style={landmark.position}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group"
            onClick={() => setActivePopup(landmark)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div className={cn("w-20 h-20 bg-[#FADCD9] rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-white relative")}>
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                 {landmark.icon}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-deep rounded-full flex items-center justify-center border-2 border-white text-white shadow-md">
                <Play size={12} fill="currentColor" />
              </div>
            </div>
            <div className="mt-3 bg-white px-4 py-1.5 rounded-full shadow-md text-xs font-bold text-brand-deep whitespace-nowrap">
              {landmark.title}
            </div>
          </motion.button>
        </React.Fragment>
      ))}

      {/* Animated Popup Overlay */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-cream/80 backdrop-blur-sm z-20 flex items-center justify-center p-6"
            onClick={() => setActivePopup(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-brand-deep/5 w-full max-w-sm relative"
            >
              <button 
                onClick={() => setActivePopup(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center text-brand-deep/50 hover:text-brand-deep transition-colors"
              >
                <X size={16} />
              </button>

              <div className={cn("w-20 h-20 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 border-4", activePopup.color)}>
                {activePopup.icon}
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-brand-deep mb-2">{activePopup.title}</h3>
                <p className="text-sm font-bold text-brand-black/50">{activePopup.description}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onStartTour(activePopup);
                  setActivePopup(null);
                }}
                className={cn(
                  "w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white shadow-xl shadow-brand-deep/20",
                  "bg-brand-deep hover:bg-brand-deep/90 transition-colors"
                )}
              >
                <Play fill="currentColor" size={20} />
                ابدأ المغامرة الآن
              </motion.button>
              
              <div className="absolute -bottom-4 -left-4 text-4xl opacity-50"><Sparkles className={activePopup.textColor} size={48} /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Badge */}
      <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-brand-deep/5 flex items-center gap-2 z-10">
        <Compass className="text-brand-bright" size={18} />
        <span className="text-[10px] font-bold text-brand-deep uppercase tracking-widest">خريطة الحكايات</span>
      </div>
    </div>
  );
};
