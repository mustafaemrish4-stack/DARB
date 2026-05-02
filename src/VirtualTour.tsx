import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Image as ImageIcon, Glasses } from 'lucide-react';
import { cn } from './lib/utils';

export const VirtualTour = ({ onClose, initialPlace }: { onClose: () => void, initialPlace?: any }) => {
  const [selectedMainPlace, setSelectedMainPlace] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(initialPlace || {
    name: 'القدس (صورة 1)',
    image: '/360/jerusalem.jpg',
    is360: true
  });

  const places = [
    {
      name: 'القدس',
      type: 'city',
      subPlaces: [
        { name: 'القدس - المسجد الأقصى', image: '/assets/jerusalem.jpg', is360: false }
      ]
    },
    {
      name: 'يافا',
      type: 'city',
      subPlaces: [
        { name: 'ميناء يافا', image: '/assets/jaffa.jpg', is360: false },
        { name: 'بحر يافا', image: '/assets/jaffa.jpg', is360: false }
      ]
    },
    {
      name: 'غزة',
      type: 'city',
      subPlaces: [
        { name: 'شاطئ غزة', image: '/assets/gaza.jpg', is360: false },
        { name: 'ميناء غزة', image: '/assets/gaza.jpg', is360: false }
      ]
    },
    {
      name: 'نابلس',
      type: 'city',
      subPlaces: [
        { name: 'جبال نابلس', image: '/assets/nablus.jpg', is360: false }
      ]
    },
    {
      name: 'جنين',
      type: 'city',
      subPlaces: [
        { name: 'سهل مرج بن عامر', image: '/assets/nablus.jpg', is360: false }
      ]
    }
  ];

  // Set initial main place based on initialPlace
  useEffect(() => {
    if (!selectedMainPlace) {
      setSelectedMainPlace(places[0]);
    }
  }, []);

  useEffect(() => {
    if (!document.getElementById('aframe-script')) {
      const script = document.createElement('script');
      script.id = 'aframe-script';
      script.src = '/aframe.min.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-brand-black flex flex-col text-white"
    >
      <header className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10 absolute top-0 left-0 right-0 z-20">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-md transition-all">
          <ChevronLeft size={20} className="rotate-180" />
        </button>
        <div className="text-center pointer-events-none">
          <h3 className="font-serif font-bold text-white shadow-black drop-shadow-md leading-none">{selectedImage.name}</h3>
          <span className="text-[10px] font-bold text-brand-gold uppercase mt-1.5 flex items-center justify-center gap-1 tracking-widest shadow-black drop-shadow-md">
            {selectedImage.is360 ? <Glasses size={12} /> : <ImageIcon size={12} />}
            {selectedImage.is360 ? "VR 360°" : "صورة عادية"}
          </span>
        </div>
        <div className="w-10 h-10" />
      </header>

      <div className="flex-1 relative bg-black overflow-hidden" 
        onClick={() => {
          window.dispatchEvent(new Event('resize'));
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedImage.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {selectedImage.is360 ? (
              <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: `
                <a-scene embedded vr-mode-ui="enabled: true" loading-screen="dotsColor: white; backgroundColor: black">
                  ${selectedImage.video 
                    ? `<a-videosphere src="${selectedImage.video}" rotation="0 -90 0" autoplay="true" loop="true"></a-videosphere>`
                    : `<a-sky src="${selectedImage.image}" rotation="0 -90 0"></a-sky>`
                  }
                  <a-entity camera="" look-controls="magicWindowTrackingEnabled: true; touchEnabled: true; mouseEnabled: true"></a-entity>
                </a-scene>
              `}} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-deep/20 p-4">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.name} 
                  className="max-w-full max-h-[80vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 object-contain"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20 flex flex-col pt-12 pb-6 px-4">
        
        {/* Sub-places (Dropdown/Secondary bar) */}
        {selectedMainPlace && selectedMainPlace.subPlaces && (
          <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-4 border-b border-white/10 px-4">
            {selectedMainPlace.subPlaces.map((sub: any, i: number) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(sub)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shadow-lg",
                  selectedImage.name === sub.name 
                    ? "bg-[#A61D33] text-white shadow-[#A61D33]/30 scale-105" 
                    : "bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20"
                )}
              >
                {sub.is360 ? <Glasses size={14} /> : <ImageIcon size={14} />}
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Main Categories */}
        <div className="flex justify-center gap-3 overflow-x-auto no-scrollbar px-2">
          {places.map((place) => (
            <button 
              key={place.name}
              onClick={() => {
                setSelectedMainPlace(place);
                if(place.subPlaces && place.subPlaces.length > 0) {
                  setSelectedImage(place.subPlaces[0]);
                }
              }}
              className={cn(
                "px-6 py-3 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                selectedMainPlace?.name === place.name 
                  ? "bg-brand-gold text-brand-deep border-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                  : "bg-black/50 text-white/70 border-white/10 backdrop-blur-md hover:bg-white/10"
              )}
            >
              {place.name}
            </button>
          ))}
        </div>
      </footer>
    </motion.div>
  );
};
