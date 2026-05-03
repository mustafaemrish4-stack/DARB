import React, { useState } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from './lib/utils';

interface VRVideoPlayerProps {
  initialVideoUrl: string;
  onClose: () => void;
}

export const VRVideoPlayer = ({ initialVideoUrl, onClose }: VRVideoPlayerProps) => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState(initialVideoUrl);

  const videoCatalog = [
    { id: 1, title: 'فيديو 360 طبيعة (حديقة)', url: 'https://files.catbox.moe/um1562.mp4' },
    { id: 2, title: 'فيديو 360 طبيعة (منظر)', url: 'https://files.catbox.moe/878rh8.mp4' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col"
    >
      <div className="absolute top-4 left-4 z-[1010]">
        <button
          onClick={onClose}
          className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg flex items-center justify-center"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Sandboxed iFrame to prevent any React / Vite / WebGL conflicts */}
      <div className="flex-1 relative bg-black w-full h-full">
        <iframe 
          src={`/360-player.html?video=${encodeURIComponent(currentVideoUrl)}`} 
          className="w-full h-full border-none outline-none"
          allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
      </div>

      <footer className="p-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent overflow-x-auto no-scrollbar z-[1010]">
        <div className="flex justify-center gap-4 min-w-max pb-4">
          {videoCatalog.map((vid) => (
            <button 
              key={vid.id}
              onClick={() => setCurrentVideoUrl(vid.url)}
              className={cn(
                "px-6 py-3 rounded-full text-xs font-bold transition-all border flex items-center gap-2",
                currentVideoUrl === vid.url 
                  ? "bg-brand-deep text-white border-brand-deep shadow-lg shadow-brand-deep/20" 
                  : "bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
              )}
            >
              <Play size={14} fill={currentVideoUrl === vid.url ? "currentColor" : "none"} />
              {vid.title}
            </button>
          ))}
        </div>
      </footer>
    </motion.div>
  );
};
