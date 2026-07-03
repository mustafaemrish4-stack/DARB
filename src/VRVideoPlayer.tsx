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

  React.useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'close-vr') {
        onClose();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  const videoCatalog = [
    { id: 1, title: 'فيديو 1 (عالي الجودة)', url: 'https://files.catbox.moe/smdqsi.mp4', isStereo: false },
    { id: 2, title: 'فيديو 2 (عالي الجودة)', url: 'https://files.catbox.moe/g6l3da.mp4', isStereo: false },
    { id: 3, title: 'فيديو 3 (عالي الجودة)', url: 'https://files.catbox.moe/ccur6d.mp4', isStereo: false },
    { id: 4, title: 'فيديو 4 (عالي الجودة)', url: 'https://files.catbox.moe/lr2or2.mp4', isStereo: false },
    { id: 5, title: 'فيديو 5 (عالي الجودة)', url: 'https://files.catbox.moe/8h3h4o.mp4', isStereo: false },
    { id: 6, title: 'فيديو 360: جنين (1)', url: '/360/videos/jenin1.mp4', isStereo: true },
    { id: 7, title: 'فيديو 360: جنين (2)', url: '/360/videos/jenin2.mp4', isStereo: false },
    { id: 8, title: 'فيديو 360: جنين (3)', url: 'https://files.catbox.moe/clfxwt.mp4', isStereo: true },
    { id: 9, title: 'فيديو 360: جنين (4)', url: '/360/videos/jenin4.mp4', isStereo: false },
    { id: 10, title: 'فيديو 360: جنين (5)', url: 'https://files.catbox.moe/3bstuf.mp4', isStereo: true }
  ];

  const currentVideo = videoCatalog.find(v => v.url === currentVideoUrl) || videoCatalog[0];

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

      {/* iFrame to prevent any React / Vite / WebGL conflicts */}
      <div className="flex-1 relative bg-black w-full h-full">
        <iframe 
          src={`/360-player.html?v=${Date.now()}&video=${encodeURIComponent(currentVideoUrl)}&stereo=${currentVideo.isStereo ? 'true' : 'false'}`} 
          className="w-full h-full border-none"
          allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking; display-capture; autoplay; encrypted-media"
          allowFullScreen
          title="360 Video Player"
        />
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
