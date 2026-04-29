import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from './lib/utils';

export const ARExperience = ({ onClose }: { onClose: () => void }) => {
  const [hasWebXR, setHasWebXR] = useState(true);
  const [isSecure, setIsSecure] = useState(window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
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
          <h3 className="font-serif font-bold text-white shadow-black drop-shadow-md leading-none">ألعاب الواقع المعزز</h3>
          <span className="text-[10px] font-bold text-brand-gold uppercase mt-1.5 block tracking-widest shadow-black drop-shadow-md">ألعاب تفاعلية وممتعة</span>
        </div>
        <div className="w-10 h-10" />
      </header>

      <div className="flex-1 relative">
        {!isSecure ? (
          <div className="absolute inset-0 flex items-center justify-center text-center p-8 z-10 bg-black/80">
            <div className="bg-white p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-red-500 mb-2">تنبيه أمان (HTTPS مطلوب)</h3>
              <p className="text-sm text-gray-600 mb-4">
                تقنية الواقع المعزز (AR) تحتاج إلى اتصال آمن. 
                يرجى تجربة التطبيق على Netlify أو تمكين HTTPS.
              </p>
              <button onClick={onClose} className="px-6 py-2 bg-brand-deep text-white rounded-lg">عودة</button>
            </div>
          </div>
        ) : !hasWebXR ? (
          <div className="absolute inset-0 flex items-center justify-center text-center p-8 z-10 bg-black/80">
            <div className="bg-white p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-red-500 mb-2">الواقع المعزز غير مدعوم</h3>
              <p className="text-sm text-gray-600 mb-4">
                جهازك أو متصفحك لا يدعم تقنية WebXR المطلوبة لتشغيل هذه الميزة. جرب استخدام متصفح Chrome على هاتف أندرويد.
              </p>
              <button onClick={onClose} className="px-6 py-2 bg-brand-deep text-white rounded-lg">عودة</button>
            </div>
          </div>
        ) : null}

        <iframe 
          ref={iframeRef}
          src="/ar-experience.html" 
          className="w-full h-full border-0"
          allow="camera; gyroscope; accelerometer; magnetometer; xr-spatial-tracking; microphone"
        />
      </div>
    </motion.div>
  );
};
