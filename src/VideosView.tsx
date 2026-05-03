import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Layers, X, Home } from 'lucide-react';


import { VRVideoPlayer } from './VRVideoPlayer'; // Using VirtualTour engine as VR Video Player

export const VideosView = ({ onBack }: { onBack: () => void }) => {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isAROpen, setIsAROpen] = useState(false);
  const [vrVideoUrl, setVrVideoUrl] = useState<string | null>(null);

  // Strictly 5 Videos as Requested
  // Strictly 8 Youtube VR Videos As Requested
  const videoCatalog = [
    { id: 1, title: 'الرحلة الأولى (غابة)', url: 'https://bitmovin-a.akamaihd.net/content/playhouse-vr/progressive.mp4', icon: '🌲' },
    { id: 2, title: 'الرحلة الثانية (فضاء)', url: 'https://bitmovin-a.akamaihd.net/content/playhouse-vr/progressive.mp4', icon: '🌌' },
    { id: 3, title: 'الرحلة الثالثة (مغامرة)', url: 'https://bitmovin-a.akamaihd.net/content/playhouse-vr/progressive.mp4', icon: '🚀' },
    { id: 4, title: 'الرحلة الرابعة (أكشن)', url: 'https://bitmovin-a.akamaihd.net/content/playhouse-vr/progressive.mp4', icon: '🌍' },
    { id: 5, title: 'الرحلة الخامسة (طبيعة)', url: 'https://bitmovin-a.akamaihd.net/content/playhouse-vr/progressive.mp4', icon: '🦁' },
    { id: 6, title: 'الرحلة السادسة (بحار)', url: 'https://bitmovin-a.akamaihd.net/content/playhouse-vr/progressive.mp4', icon: '🌊' }
  ];

  return (
    <div className="h-full flex flex-col pt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-6 mb-6">
         <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-brand-deep text-white flex items-center justify-center shadow-lg">
                <Play size={24} fill="currentColor" />
             </div>
             <div>
                <h2 className="text-2xl font-serif font-bold text-brand-deep">أفلام وثائقية</h2>
                <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">VR Cinema & AR</p>
             </div>
         </div>
         <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-deep border border-brand-deep/10 hover:bg-brand-deep hover:text-white transition-all">
            <Home size={20} />
         </button>
      </div>

      {/* Videos Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar space-y-4">
         <h4 className="font-bold text-brand-deep/60 mb-2">مكتبة الفيديو المحلية 4K</h4>
         {videoCatalog.map((vid) => (
            <motion.div 
               key={vid.id}
               onClick={() => setVrVideoUrl(vid.url)}
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.99 }}
               className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-brand-deep/5 cursor-pointer"
            >
               <div className="w-16 h-16 rounded-2xl bg-brand-cream flex items-center justify-center text-3xl shrink-0">
                  {vid.icon}
               </div>
               <div className="flex-1">
                  <h4 className="font-bold text-brand-deep mb-1 text-lg">{vid.title}</h4>
                  <span className="text-[10px] font-bold text-brand-green px-2 py-0.5 bg-brand-green/10 rounded-full">جاهز أوفلاين</span>
               </div>
               <div className="w-10 h-10 rounded-full border border-brand-deep/10 flex items-center justify-center text-brand-deep shrink-0">
                  <Play size={16} fill="currentColor" />
               </div>
            </motion.div>
         ))}
      </div>

      

      


      <AnimatePresence>
        {vrVideoUrl && <VRVideoPlayer initialVideoUrl={vrVideoUrl} onClose={() => setVrVideoUrl(null)} />}
      </AnimatePresence>
    </div>
  );
};
