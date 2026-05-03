import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Moon, Star, PlayCircle, PauseCircle, Music, CloudRain, Wind } from 'lucide-react';
import { cn } from './lib/utils';

export const LullabiesView = ({ onClose }: { onClose: () => void }) => {
  const [activeCategory, setActiveCategory] = useState<'3-6' | '7-10' | '11-13'>('3-6');
  const [playingId, setPlayingId] = useState<number | null>(null);
  
  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const lullabies = {
    '3-6': [
      { id: 1, title: 'هدهدة نام يا صغيري', subtitle: 'تهويدة فلسطينية تراثية', duration: '3:45', audio: 'https://files.catbox.moe/sqhi44.mp3' },
      { id: 2, title: 'يا طير الطاير', subtitle: 'ألحان هادئة للأطفال', duration: '4:20', audio: 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3' },
    ],
    '7-10': [
      { id: 3, title: 'حكاية قبل النوم', subtitle: 'موسيقى استرخاء', duration: '5:10', audio: 'https://assets.mixkit.co/music/preview/mixkit-relaxing-nature-492.mp3' },
      { id: 4, title: 'أغنية النجوم', subtitle: 'تأمل هادئ', duration: '4:55', audio: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3' },
    ],
    '11-13': [
      { id: 5, title: 'موسيقى الطبيعة', subtitle: 'صوت المطر والرياح', duration: '10:00', audio: 'https://assets.mixkit.co/music/preview/mixkit-forest-treasure-138.mp3' },
      { id: 6, title: 'رحلة إلى الفضاء', subtitle: 'موسيقى عميقة للاسترخاء', duration: '8:30', audio: 'https://assets.mixkit.co/music/preview/mixkit-sleep-131.mp3' },
    ]
  };

  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = (song: any) => {
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = song.audio;
        audioRef.current.play();
      }
      setPlayingId(song.id);
    }
  };

  const handleSelectSong = (song: any) => {
    setSelectedSong(song);
    if (playingId !== song.id) {
      handlePlayPause(song);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[1000] bg-[#0A0F2C] flex flex-col text-white overflow-hidden"
      dir="rtl"
    >
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      {/* Magical Starry Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F2C] via-[#1A1B4B] to-[#2D1B4E] opacity-90" />
        
        {/* Animated Stars */}
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              boxShadow: '0 0 10px 2px rgba(255,255,255,0.4)'
            }}
            animate={{
              opacity: [Math.random() * 0.3, 1, Math.random() * 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Shooting Star */}
        <motion.div
          initial={{ x: '100vw', y: '-10vh', opacity: 1 }}
          animate={{ x: '-100vw', y: '100vh', opacity: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent rotate-45"
        />

        {/* Glowing Moon */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-[#FFD700]/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-12 left-12 w-28 h-28 bg-[#FFF4D2] rounded-full shadow-[0_0_80px_rgba(255,244,210,0.6)] flex items-center justify-center overflow-hidden"
        >
          {/* Moon craters */}
          <div className="w-6 h-6 bg-black/10 rounded-full absolute top-4 right-6 blur-[1px]"></div>
          <div className="w-8 h-8 bg-black/10 rounded-full absolute bottom-6 left-4 blur-[1px]"></div>
          <div className="w-4 h-4 bg-black/10 rounded-full absolute top-10 left-8 blur-[1px]"></div>
        </motion.div>

        {/* Clouds at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0F2C] to-transparent z-0"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 p-6 flex justify-between items-center bg-transparent pt-12">
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/20">
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-white tracking-wide drop-shadow-lg">تهويدات درب</h2>
          <span className="text-[11px] font-bold text-[#FFD700] tracking-widest uppercase mt-2 block drop-shadow-md">ألحان تراثية هادئة</span>
        </div>
        <div className="w-12 h-12" />
      </header>

      {/* Main Content */}
      <div className="relative z-20 flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
        
        {/* Welcome Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mb-8 text-center relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 text-6xl opacity-20">🌙</div>
          <h3 className="text-xl font-bold text-white mb-2 leading-tight">رحلة هادئة لعالم الأحلام</h3>
          <p className="text-sm text-white/70 font-medium">اختر الفئة العمرية المناسبة واستمع لأجمل الألحان التراثية التي تساعد على الاسترخاء والنوم.</p>
        </motion.div>

        {/* Age Categories */}
        <div className="flex gap-3 mb-8 bg-white/5 p-1.5 rounded-full backdrop-blur-md border border-white/10">
          {[
            { id: '3-6', label: '3-6 سنوات', icon: Star },
            { id: '7-10', label: '7-10 سنوات', icon: Moon },
            { id: '11-13', label: '11-13 سنة', icon: CloudRain }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={cn(
                "flex-1 py-3 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2",
                activeCategory === cat.id 
                  ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A0F2C] shadow-[0_0_20px_rgba(255,215,0,0.4)]" 
                  : "text-white/60 hover:bg-white/10"
              )}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lullabies List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {lullabies[activeCategory].map((song, i) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "bg-white/10 backdrop-blur-xl rounded-[2rem] p-4 border transition-all flex items-center gap-4",
                  playingId === song.id ? "border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.2)] bg-white/15" : "border-white/10 hover:bg-white/15"
                )}
              >
                {/* Play Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePlayPause(song); }}
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform hover:scale-105 shadow-lg relative z-10",
                    playingId === song.id ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-[#0A0F2C]" : "bg-white/10 text-white"
                  )}
                >
                  {playingId === song.id ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
                </button>

                {/* Info (Clicking opens Full Player) */}
                <div className="flex-1 cursor-pointer" onClick={() => handleSelectSong(song)}>
                  <h4 className="font-bold text-lg text-white mb-1">{song.title}</h4>
                  <p className="text-xs text-white/60 font-medium mb-2">{song.subtitle}</p>
                  
                  {/* Waveform Visualization (Fake/Animated) */}
                  <div className="flex items-center gap-1 h-4">
                    {[...Array(12)].map((_, waveIdx) => (
                      <motion.div
                        key={waveIdx}
                        className={cn("w-1 rounded-full", playingId === song.id ? "bg-[#FFD700]" : "bg-white/20")}
                        animate={playingId === song.id ? {
                          height: [4, Math.random() * 12 + 4, 4],
                        } : { height: 4 }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: waveIdx * 0.1
                        }}
                      />
                    ))}
                    <span className="text-[10px] text-white/40 ml-2 font-mono">{song.duration}</span>
                  </div>
                </div>

                {/* Decorative Icon */}
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 shrink-0">
                  <Music size={16} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Full Screen Spotify-like Player */}
      <AnimatePresence>
        {selectedSong && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[1001] bg-[#0A0F2C] flex flex-col px-8 pb-12 pt-8"
          >
            {/* Player Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B4E] to-[#0A0F2C] opacity-90 pointer-events-none" />
            
            <header className="relative z-10 flex justify-between items-center mb-12">
              <button onClick={() => setSelectedSong(null)} className="p-3 bg-white/10 rounded-full text-white">
                <ChevronLeft size={24} className="rotate-[-90deg]" />
              </button>
              <span className="text-xs font-bold text-white/50 tracking-widest uppercase">يتم التشغيل الآن</span>
              <div className="w-12" />
            </header>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
              {/* Giant Album Art (Moon/Stars) */}
              <motion.div 
                animate={playingId === selectedSong.id ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[#1A1B4B] to-[#2D1B4E] shadow-[0_0_80px_rgba(45,27,78,0.8)] border-4 border-white/10 flex items-center justify-center mb-12 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
                <Moon size={80} className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]" />
              </motion.div>

              <div className="w-full text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-white mb-2">{selectedSong.title}</h2>
                <p className="text-white/60 font-medium">{selectedSong.subtitle}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full mb-12">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                  if(audioRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    audioRef.current.currentTime = percent * (audioRef.current.duration || 0);
                  }
                }}>
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-white/50 font-mono">0:00</span>
                  <span className="text-xs text-white/50 font-mono">{selectedSong.duration}</span>
                </div>
              </div>

              {/* Huge Play Controls */}
              <div className="flex items-center justify-center gap-8 w-full">
                <button className="text-white/50 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                </button>
                
                <button 
                  onClick={() => handlePlayPause(selectedSong)}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.4)] hover:scale-105 transition-transform text-[#0A0F2C]"
                >
                  {playingId === selectedSong.id ? <PauseCircle size={48} /> : <PlayCircle size={48} />}
                </button>

                <button className="text-white/50 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
