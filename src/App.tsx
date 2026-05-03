import { motion, AnimatePresence } from "motion/react";
import { ARExperience } from './ARExperience';
import { 
  Home, BookOpen, Map as MapIcon, User, Sparkles, Send, X, Mic, 
  Navigation2, Compass, Play, Gamepad2, Landmark, Settings, 
  ChevronLeft, Heart, Share2, Info, Headphones, Trophy, Medal, TrendingUp,
  Eye, Volume2, Layers, Map as MapLucide, Star, Moon, Sun, Bell, HelpCircle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "./lib/utils";

import { AITutorContent } from './AITutorContent';
import { VideosView } from './VideosView';
import { AuthView } from './AuthView';
import { LullabiesView } from './LullabiesView';

import confetti from "canvas-confetti";
import { CartoonMap } from './CartoonMap';
import { QuizGame } from './QuizGame';
import L from 'leaflet';
import { audioData } from "./audioData";
import { englishAudioData } from "./englishAudioData";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Fix Leaflet icon issue
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export const DarbFlowerSVG = ({ className }: { className?: string }) => (
  <>
    <img 
      src="/icon_perfect.png" 
      alt="Darb" 
      className={`${className} object-contain mix-blend-multiply dark:hidden`} 
    />
    <img 
      src="/darb_icon_dark.webp" 
      alt="Darb" 
      className={`${className} object-contain mix-blend-screen hidden dark:block`} 
    />
  </>
);

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Types ---

type View = 'app' | 'splash' | 'auth' | 'story-reader' | 'video-player' | 'virtual-tour' | 'quiz' | 'memory-game';
type Tab = 'home' | 'experiences' | 'games' | 'videos' | 'achievements' | 'map' | 'profile' | 'parent' | 'ai';

interface Story {
  id: number;
  title: string;
  author: string;
  time: string;
  img: string;
  content: string[];
}

// --- Components ---

const DarbFlower = ({ className = "w-12 h-12", isLocked = false, progress = 1, style }: { className?: string, isLocked?: boolean, progress?: number, style?: any }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src="/icon_perfect.png" 
        alt="Darb Logo" 
        className={`w-full h-full object-cover shadow-sm dark:hidden ${isLocked ? 'opacity-40 grayscale' : ''}`}
        style={{ ...style, clipPath: 'inset(0 round 22%)' }}
      />
      <img 
        src="/darb_icon_dark.webp" 
        alt="Darb Logo" 
        className={`w-full h-full object-cover shadow-sm hidden dark:block ${isLocked ? 'opacity-40 grayscale' : ''}`}
        style={{ ...style, clipPath: 'inset(0 round 22%)' }}
      />
      {!isLocked && progress < 1 && (
         <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md">
           <circle cx="50" cy="50" r="46" fill="none" stroke="#A61D33" strokeWidth="3" strokeDasharray={`${progress * 289} 289`} transform="rotate(-90 50 50)" />
         </svg>
      )}
    </div>
  );
};

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        {/* The native App Icon graphic for Splash Screen without double boxes */}
        <DarbFlowerSVG className="w-48 h-48 relative z-10 mx-auto drop-shadow-2xl" />
        
        {/* Branding text below the icon */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="mt-10 text-center"
        >
          <h1 className="text-6xl font-bold text-[#A61D33] tracking-tight mb-0">درب</h1>
          <h2 className="text-3xl font-bold text-[#31885F] tracking-[0.2em] uppercase mb-3">DARB</h2>
          <p className="text-sm font-bold text-[#A61D33] tracking-[0.3em] uppercase opacity-80">لكل مكان قصة</p>
        </motion.div>

        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-[#A61D33] rounded-full -z-10 blur-3xl opacity-20"
        />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-20 text-center"
      >
        <div className="flex flex-col items-center opacity-20">
          <span className="text-[10px] font-bold text-[#A61D33] tracking-[0.5em] uppercase">جاري التحميل...</span>
        </div>
      </motion.div>

      <div className="absolute bottom-16 w-20 h-1 bg-[#A61D33]/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full bg-[#A61D33]"
        />
      </div>
    </motion.div>
  );
};



const VirtualTour = ({ onClose, initialPlace }: { onClose: () => void, initialPlace?: any }) => {
  const places = [
    {
      name: 'القدس',
      type: '360',
      image: '/360/aqsa/2.jpg',
      subPlaces: [
        { name: 'الأقصى (2)', image: '/360/aqsa/2.jpg' },
        { name: 'الأقصى (3)', image: '/360/aqsa/3.jpg' },
        { name: 'الأقصى (5)', image: '/360/aqsa/5.jpg' },
        { name: 'الأقصى (6)', image: '/360/aqsa/6.jpg' },
        { name: 'الأقصى (7)', image: '/360/aqsa/7.jpg' },
        { name: 'الأقصى (8)', image: '/360/aqsa/8.jpg' },
        { name: 'الأقصى (9)', image: '/360/aqsa/9.jpg' },
        { name: 'الأقصى (10)', image: '/360/aqsa/10.jpg' },
        { name: 'الأقصى (11)', image: '/360/aqsa/11.jpg' },
        { name: 'الأقصى (12)', image: '/360/aqsa/12.jpg' },
      ]
    },
    { name: 'يافا', type: 'image', image: '/assets/jaffa.jpg' },
    { name: 'نابلس', type: 'image', image: '/assets/nablus.jpg' },
    { name: 'جنين', type: 'image', image: '/assets/jenin.jpg' },
    { name: 'غزة', type: 'image', image: '/assets/gaza.jpg' },
  ];

  const [selectedMainPlace, setSelectedMainPlace] = useState<any>(
    initialPlace ? places.find(p => p.name === initialPlace.title) || places[0] : places[0]
  );
  
  const [selectedImage, setSelectedImage] = useState<{name: string, image: string, type: string}>({
    name: selectedMainPlace.name,
    image: selectedMainPlace.image,
    type: selectedMainPlace.type || '360'
  });

  const handleMainPlaceClick = (place: any) => {
    setSelectedMainPlace(place);
    setSelectedImage({ name: place.name, image: place.image, type: place.type || '360' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-brand-black flex flex-col"
    >
      <header className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10 absolute top-0 left-0 right-0 z-20">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-md transition-all">
          <ChevronLeft size={20} className="rotate-180" />
        </button>
        <div className="text-center pointer-events-none">
          <h3 className="font-serif font-bold text-white shadow-black drop-shadow-md leading-none">{selectedImage.name}</h3>
          <span className="text-[10px] font-bold text-brand-gold uppercase mt-1.5 block tracking-widest shadow-black drop-shadow-md">
            {selectedImage.type === '360' ? 'الواقع الافتراضي (VR)' : 'معرض الصور'}
          </span>
        </div>
        <div className="w-10 h-10" />
      </header>

      <div className="flex-1 relative bg-zinc-900 overflow-hidden">
        {selectedImage.type === '360' ? (
          <iframe 
            src={`/360-photo-viewer.html?image=${encodeURIComponent(selectedImage.image)}`}
            className="w-full h-full border-none"
            allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            title="360 Photo Viewer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
             <img src={selectedImage.image} alt={selectedImage.name} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
          </div>
        )}
      </div>

      <footer className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-20 flex flex-col">
        {/* Sub-places (Dropdown/Secondary bar) */}
        {selectedMainPlace.subPlaces && (
          <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar px-8 pb-4">
            <button 
              onClick={() => setSelectedImage({ name: selectedMainPlace.name, image: selectedMainPlace.image, type: selectedMainPlace.type || '360' })}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap",
                selectedImage.image === selectedMainPlace.image 
                  ? "bg-[#A61D33] text-white border-[#A61D33]" 
                  : "bg-black/50 backdrop-blur-md text-white/80 border-white/20"
              )}
            >
              الرئيسية
            </button>
            {selectedMainPlace.subPlaces.map((sub: any, i: number) => (
              <button 
                key={i}
                onClick={() => setSelectedImage({ name: sub.name, image: sub.image, type: '360' })}
                className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap",
                  selectedImage.image === sub.image 
                    ? "bg-[#A61D33] text-white border-[#A61D33]" 
                    : "bg-black/50 backdrop-blur-md text-white/80 border-white/20"
                )}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Main Places bar */}
        <div className="flex justify-center gap-4 overflow-x-auto no-scrollbar p-8 pt-4">
          {places.map((place) => (
            <button 
              key={place.name}
              onClick={() => handleMainPlaceClick(place)}
              className={cn(
                "px-6 py-3 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap",
                selectedMainPlace.name === place.name 
                  ? "bg-brand-gold text-brand-deep border-brand-gold shadow-lg shadow-brand-gold/20" 
                  : "bg-white/10 backdrop-blur-md text-white border-white/20"
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

const RatingModal = ({ onClose }: { onClose: () => void }) => {
  const [rating, setRating] = useState(0);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-8 w-full max-w-sm text-center space-y-6"
      >
        <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold mx-auto">
          <Star size={40} fill={rating > 0 ? "currentColor" : "none"} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-bold text-brand-deep">قيم تجربتك مع درب</h3>
          <p className="text-xs text-brand-black/40">رأيك يساعدنا على تحسين التطبيق ليكون أفضل لك ولأصدقائك!</p>
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setRating(i)} className="text-brand-gold">
              <Star size={32} fill={i <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-brand-deep text-white rounded-2xl font-bold shadow-xl shadow-brand-deep/20"
        >
          إرسال التقييم
        </button>
      </motion.div>
    </motion.div>
  );
};

const ArabicLettersGame = ({ onClose }: { onClose: () => void }) => {
  const [active, setActive] = useState<number | null>(null);
  
  const alphabet = [
    { letter: 'أ', word: 'أسد', icon: '🦁' }, { letter: 'ب', word: 'بطة', icon: '🦆' },
    { letter: 'ت', word: 'تفاح', icon: '🍎' }, { letter: 'ث', word: 'ثعلب', icon: '🦊' },
    { letter: 'ج', word: 'جمل', icon: '🐪' }, { letter: 'ح', word: 'حصان', icon: '🐎' },
    { letter: 'خ', word: 'خروف', icon: '🐑' }, { letter: 'د', word: 'ديك', icon: '🐓' },
    { letter: 'ذ', word: 'ذئب', icon: '🐺' }, { letter: 'ر', word: 'رمان', icon: '🌺' },
    { letter: 'ز', word: 'زرافة', icon: '🦒' }, { letter: 'س', word: 'سمكة', icon: '🐟' },
    { letter: 'ش', word: 'شمس', icon: '☀️' }, { letter: 'ص', word: 'صقر', icon: '🦅' },
    { letter: 'ض', word: 'ضفدع', icon: '🐸' }, { letter: 'ط', word: 'طائرة', icon: '✈️' },
    { letter: 'ظ', word: 'ظرف', icon: '✉️' }, { letter: 'ع', word: 'عصفور', icon: '🐦' },
    { letter: 'غ', word: 'غزال', icon: '🦌' }, { letter: 'ف', word: 'فيل', icon: '🐘' },
    { letter: 'ق', word: 'قرد', icon: '🐒' }, { letter: 'ك', word: 'كلب', icon: '🐕' },
    { letter: 'ل', word: 'ليمون', icon: '🍋' }, { letter: 'م', word: 'موز', icon: '🍌' },
    { letter: 'ن', word: 'نحلة', icon: '🐝' }, { letter: 'هـ', word: 'هدهد', icon: '🦚' },
    { letter: 'و', word: 'وردة', icon: '🌹' }, { letter: 'ي', word: 'يمامة', icon: '🕊️' }
  ];

  const playSound = (letter: string) => {
    try {
      if (audioData[letter]) {
        const audio = new Audio(audioData[letter]);
        audio.play();
      }
    } catch(e) { console.error('Audio play failed', e); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[160] bg-brand-cream flex flex-col p-4 md:p-8"
    >
      <header className="flex justify-between items-center mb-6 shrink-0 relative z-10 w-full bg-brand-cream/90 backdrop-blur-sm p-2 rounded-2xl shadow-sm">
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-deep hover:bg-brand-deep hover:text-white transition-all">
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-deep">رحلة الحروف </h2>
          <span className="text-xs font-bold text-brand-green tracking-widest uppercase mt-1 block">اضغط لتسمع النطق</span>
        </div>
        <div className="w-12 h-12" />
      </header>

      <div className="flex-1 overflow-y-auto touch-pan-y scroll-smooth w-full pt-2 pb-32 z-0 relative">
        <div className="text-center mb-4 text-[10px] font-bold text-brand-deep/50 animate-pulse">مرر للأسفل لرؤية باقي الحروف ▼</div>
        <div className="grid grid-cols-2 gap-4 pb-20 px-2">
          {alphabet.map((item, i) => (
            <motion.button
              key={item.letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActive(i);
                playSound(item.letter);
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#A61D33', '#31885F', '#D4AF37', '#FDF3E6'] });
              }}
              className="bg-white rounded-[2rem] p-6 shadow-soft border border-brand-deep/5 flex flex-col items-center justify-center gap-4 relative overflow-hidden group min-h-[140px]"
            >
              {active === i && (
                 <motion.div layoutId="highlight" className="absolute inset-0 bg-brand-deep/5 -z-10" />
              )}
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-center">
                <h3 className="text-5xl font-arabic font-bold text-brand-deep">{item.letter}</h3>
                <p className="text-sm font-bold text-brand-black mt-2 opacity-60 group-hover:opacity-100">{item.word}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const EnglishLettersGame = ({ onClose }: { onClose: () => void }) => {
  const [active, setActive] = useState<number | null>(null);
  
  const alphabet = [
    { letter: 'A', word: 'Apple', icon: '🍎' }, { letter: 'B', word: 'Bear', icon: '🐻' },
    { letter: 'C', word: 'Cat', icon: '🐱' }, { letter: 'D', word: 'Dog', icon: '🐶' },
    { letter: 'E', word: 'Elephant', icon: '🐘' }, { letter: 'F', word: 'Frog', icon: '🐸' },
    { letter: 'G', word: 'Giraffe', icon: '🦒' }, { letter: 'H', word: 'Horse', icon: '🐎' },
    { letter: 'I', word: 'Iguana', icon: '🦎' }, { letter: 'J', word: 'Jaguar', icon: '🐆' },
    { letter: 'K', word: 'Kangaroo', icon: '🦘' }, { letter: 'L', word: 'Lion', icon: '🦁' },
    { letter: 'M', word: 'Monkey', icon: '🐒' }, { letter: 'N', word: 'Newt', icon: '🦎' },
    { letter: 'O', word: 'Owl', icon: '🦉' }, { letter: 'P', word: 'Penguin', icon: '🐧' },
    { letter: 'Q', word: 'Quail', icon: '🐦' }, { letter: 'R', word: 'Rabbit', icon: '🐰' },
    { letter: 'S', word: 'Snake', icon: '🐍' }, { letter: 'T', word: 'Tiger', icon: '🐯' },
    { letter: 'U', word: 'Unicorn', icon: '🦄' }, { letter: 'V', word: 'Vulture', icon: '🦅' },
    { letter: 'W', word: 'Wolf', icon: '🐺' }, { letter: 'X', word: 'X-ray fish', icon: '🐟' },
    { letter: 'Y', word: 'Yak', icon: '🐂' }, { letter: 'Z', word: 'Zebra', icon: '🦓' }
  ];

  const playSound = (letter: string) => {
    try {
      if (englishAudioData[letter]) {
        const audio = new Audio(englishAudioData[letter]);
        audio.play();
      }
    } catch(e) { console.error('Audio play failed', e); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[160] bg-brand-cream flex flex-col p-4 md:p-8"
    >
      <header className="flex justify-between items-center mb-6">
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-deep hover:bg-brand-deep hover:text-white transition-all">
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-brand-deep">English Letters</h2>
          <span className="text-xs font-bold text-brand-green tracking-widest uppercase mt-1 block">اضغط لتسمع النطق</span>
        </div>
        <div className="w-12 h-12" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        <div className="grid grid-cols-2 gap-4">
          {alphabet.map((item, i) => (
            <motion.button
              key={item.letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActive(i);
                playSound(item.letter);
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#A61D33', '#31885F', '#D4AF37', '#FDF3E6'] });
              }}
              className="bg-white rounded-[2rem] p-6 shadow-soft border border-brand-deep/5 flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
            >
              {active === i && (
                 <motion.div layoutId="highlightEng" className="absolute inset-0 bg-brand-deep/5 -z-10" />
              )}
              <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-center">
                <h3 className="text-5xl font-sans font-bold text-brand-deep">{item.letter}</h3>
                <p className="text-sm font-bold text-brand-black mt-2 opacity-60 group-hover:opacity-100">{item.word}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const MemoryGame = ({ onClose }: { onClose: () => void }) => {
  const [cards, setCards] = useState<{id: number, label: string, icon: string, isFlipped: boolean, isMatched: boolean}[]>([]);
  const [flippedIndex, setFlippedIndex] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const items = [
      { label: 'المسجد الأقصى', icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f54c.svg' },
      { label: 'بطيخة', icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f349.svg' },
      { label: 'غصن زيتون', icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f33f.svg' },
      { label: 'فلافل فلسطيني', icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f9c6.svg' },
      { label: 'حمامة السلام', icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f54a.svg' },
      { label: 'مفتاح العودة', icon: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f5dd.svg' }
    ];
    const deck = [...items, ...items]
      .sort(() => Math.random() - 0.5)
      .map((item, id) => ({ id, ...item, isFlipped: false, isMatched: false }));
    setCards(deck);
    setFlippedIndex([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndex.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndex, index];
    setFlippedIndex(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const match = newCards[newFlipped[0]].icon === newCards[newFlipped[1]].icon;

      if (match) {
        newCards[newFlipped[0]].isMatched = true;
        newCards[newFlipped[1]].isMatched = true;
        setCards(newCards);
        setFlippedIndex([]);
        
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
          audio.play();
        } catch(e) {}

        if (newCards.every(c => c.isMatched)) {
          setGameWon(true);
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }
      } else {
        setTimeout(() => {
          newCards[newFlipped[0]].isFlipped = false;
          newCards[newFlipped[1]].isFlipped = false;
          setCards(newCards);
          setFlippedIndex([]);
        }, 1000);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[160] bg-brand-cream overflow-y-auto"
    >
      <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col pt-12 pb-24">
        <header className="flex justify-between items-center mb-10">
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-deep hover:bg-brand-deep hover:text-white transition-all">
            <X size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-brand-deep">ذاكرة درب</h2>
            <div className="flex gap-4 justify-center mt-2">
              <span className="text-xs font-bold text-brand-green px-3 py-1 bg-white rounded-full shadow-sm">حركات: {moves}</span>
            </div>
          </div>
          <button onClick={startNewGame} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-white transition-all">
            <Sparkles size={20} />
          </button>
        </header>

        {gameWon ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-6xl shadow-brand-gold/30">
              🏆
            </div>
            <div>
              <h3 className="text-3xl font-serif font-bold text-brand-deep">مبروك يا بطل!</h3>
              <p className="text-brand-black/60 font-bold mt-2">لقد حللت اللغز في {moves} حركة فقط</p>
            </div>
            <button onClick={startNewGame} className="px-8 py-4 bg-brand-deep text-white rounded-2xl font-bold shadow-xl shadow-brand-deep/20">
              العب مجدداً
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {cards.map((card, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: card.isFlipped ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(i)}
                className="relative w-full aspect-square perspective-1000"
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                  className="w-full h-full preserve-3d relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front (Hidden state) */}
                  <div 
                    className="absolute inset-0 bg-brand-deep rounded-2xl shadow-md border-[3px] border-white/20 backface-hidden flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <DarbFlower className="w-1/2 h-1/2 opacity-50 grayscale" />
                  </div>
                  
                  <div 
                    className={cn(
                      "absolute inset-0 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl backface-hidden",
                      card.isMatched && "bg-brand-green/10 border-2 border-brand-green"
                    )}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {card.icon.startsWith('http') ? <img src={card.icon} alt="" className="w-1/2 h-1/2 object-contain" /> : card.icon}
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MapComponent = ({ onStartTour }: { onStartTour: (place: any) => void }) => {
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'info' | 'photos'>('info');
  
  const cities = [
    { 
      name: 'القدس', 
      pos: [31.7683, 35.2137], 
      desc: 'عاصمة فلسطين الأبدية ومدينة السلام.',
      photos: [
        'https://picsum.photos/seed/jerusalem1/400/300',
        'https://picsum.photos/seed/jerusalem2/400/300',
        'https://picsum.photos/seed/jerusalem3/400/300'
      ],
      tour: { name: 'قبة الصخرة', lat: 31.7780, lng: 35.2354, heading: 0 }
    },
    { 
      name: 'يافا', 
      pos: [32.0517, 34.7500], 
      desc: 'عروس البحر ومدينة البرتقال.',
      photos: [
        '/assets/jaffa.jpg',
        '/assets/jaffa.jpg'
      ],
      tour: { name: 'ميناء يافا', lat: 32.0517, lng: 34.7500, heading: 180 }
    },
    { 
      name: 'حيفا', 
      pos: [32.7940, 34.9896], 
      desc: 'عروس الكرمل وجمال الطبيعة.',
      photos: [
        '/assets/jaffa.jpg'
      ],
      tour: { name: 'جبل الكرمل', lat: 32.7940, lng: 34.9896, heading: 0 }
    },
    { 
      name: 'نابلس', 
      pos: [32.2211, 35.2544], 
      desc: 'دمشق الصغرى ومدينة الكنافة.',
      photos: [
        '/assets/nablus.jpg'
      ],
      tour: { name: 'نابلس القديمة', lat: 32.2211, lng: 35.2544, heading: 0 }
    },
    { 
      name: 'غزة', 
      pos: [31.5017, 34.4667], 
      desc: 'مدينة العزة والصمود.',
      photos: [
        '/assets/gaza.jpg'
      ],
      tour: { name: 'غزة البحر', lat: 31.5017, lng: 34.4667, heading: 0 }
    },
  ];

  return (
    <div className="h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative">
      <MapContainer center={[31.9522, 35.2332]} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {cities.map((city) => (
          <Marker 
            key={city.name} 
            position={city.pos as [number, number]}
            eventHandlers={{
              click: () => {
                setSelectedCity(city);
                setViewMode('info');
              },
            }}
          >
            <Popup>
              <div className="p-2 text-right">
                <h4 className="font-bold text-brand-deep">{city.name}</h4>
                <p className="text-[10px] mt-1">{city.desc}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 right-6 z-[1000] bg-white/95 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl border border-brand-deep/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-right">
                <h3 className="text-xl font-serif font-bold text-brand-deep">{selectedCity.name}</h3>
                <div className="flex gap-4 mt-2">
                  <button 
                    onClick={() => setViewMode('info')}
                    className={cn("text-[10px] font-bold uppercase tracking-widest", viewMode === 'info' ? "text-brand-deep underline" : "text-brand-black/30")}
                  >
                    معلومات
                  </button>
                  <button 
                    onClick={() => setViewMode('photos')}
                    className={cn("text-[10px] font-bold uppercase tracking-widest", viewMode === 'photos' ? "text-brand-deep underline" : "text-brand-black/30")}
                  >
                    صور المدينة
                  </button>
                </div>
              </div>
              <button onClick={() => setSelectedCity(null)} className="text-brand-black/20"><X size={20} /></button>
            </div>

            {viewMode === 'info' ? (
              <div className="space-y-4">
                <p className="text-xs font-medium text-brand-black/60 leading-relaxed">{selectedCity.desc}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onStartTour(selectedCity.tour)}
                    className="flex-1 py-3 bg-brand-cream rounded-xl text-[10px] font-bold text-brand-deep flex items-center justify-center gap-2"
                  >
                    <Eye size={14} /> جولة 360°
                  </button>
                  <button 
                    onClick={() => onStartTour(selectedCity.tour)}
                    className="flex-1 py-3 bg-brand-deep text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} /> استكشاف VR
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {selectedCity.photos.map((p: string, i: number) => (
                  <img key={i} src={p} alt="" className="w-32 h-24 object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Components ---

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: Tab, setActiveTab: (tab: Tab) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'videos', icon: Play, label: 'فيديوهات' },
    { id: 'ai', icon: Sparkles, label: 'المرشد' },
    { id: 'games', icon: Gamepad2, label: 'ألعاب' },
    { id: 'map', icon: MapIcon, label: 'خريطة' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-brand-deep/5 px-2 py-3 pb-8 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative px-2",
              activeTab === tab.id ? "text-brand-deep scale-110" : "text-brand-black/30 hover:text-brand-deep/60"
            )}
          >
            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[8px] font-bold tracking-tight">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabDot"
                className="absolute -top-1 w-1 h-1 rounded-full bg-brand-deep"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

const BentoCard = ({ title, subtitle, icon: Icon, color, className, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "p-6 rounded-[2.5rem] flex flex-col justify-between text-right relative overflow-hidden shadow-soft border border-white/20",
      color,
      className
    )}
  >
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
      <p className="text-[10px] text-white/70 font-medium mt-1">{subtitle}</p>
    </div>
    <div className="absolute -bottom-4 -left-4 opacity-10">
      <Icon size={120} strokeWidth={1} />
    </div>
  </motion.button>
);

const SectionHeader = ({ title, actionLabel, onAction }: { title: string, actionLabel?: string, onAction?: () => void }) => (
  <div className="flex justify-between items-end mb-4">
    <h2 className="text-2xl font-serif font-bold text-brand-deep">{title}</h2>
    {actionLabel && (
      <button onClick={onAction} className="text-[10px] font-bold text-brand-green uppercase tracking-widest hover:underline">
        {actionLabel}
      </button>
    )}
  </div>
);

const CategoryCard = ({ title, icon: Icon, color, onClick, image }: any) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-white rounded-[2.5rem] p-5 shadow-xl shadow-brand-deep/5 border border-brand-deep/5 flex flex-col items-center gap-4 relative overflow-hidden group w-full"
  >
    <div className="w-24 h-24 rounded-3xl bg-brand-cream/50 flex items-center justify-center text-brand-deep group-hover:rotate-6 transition-transform relative overflow-hidden">
      {image ? (
        <img src={image} alt={title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <Icon size={48} strokeWidth={1.5} className="relative z-10" />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
    </div>
    <div className={cn("w-full py-2.5 rounded-2xl text-xs font-bold text-white text-center shadow-lg", color)}>
      {title}
    </div>
  </motion.button>
);

const ActionButton = ({ label, icon: Icon, color, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "p-5 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-white shadow-xl transition-all border border-white/20",
      color
    )}
  >
    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
      <Icon size={24} />
    </div>
    <span className="text-xs font-bold tracking-wide">{label}</span>
  </motion.button>
);

// --- Main App ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'parent'|'child'|null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isParentMode, setIsParentMode] = useState(false);
  const [currentView, setCurrentView] = useState<View>('splash');
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMemoryGameOpen, setIsMemoryGameOpen] = useState(false);
  const [isLullabiesOpen, setIsLullabiesOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tourPlace, setTourPlace] = useState<any | null>(null);

  // Editable Profile States
  const [childProfile, setChildProfile] = useState({ name: 'أحمد المستكشف', initial: 'أ' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [parentSettings, setParentSettings] = useState({ timeLimit: 120 });
  const [isEditingParent, setIsEditingParent] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const experiences = [
    { id: 1, title: 'جولة القدس 360', type: 'VR 360', image: '/assets/jerusalem.jpg', img: 'jerusalem', is360: true },
    { id: 2, title: 'نابلس 360', type: 'VR 360', image: '/assets/nablus.jpg', img: 'nablus', is360: true },
    { id: 3, title: 'يافا 360', type: 'VR 360', image: '/assets/jaffa.jpg', img: 'jaffa', is360: true },
    { id: 4, title: 'فيديو 360 طبيعة', type: 'VR Video', video: 'https://files.catbox.moe/um1562.mp4', img: 'nature', is360: true }
  ];

  if (currentView === 'auth') {
    return <AuthView onLoginSuccess={(role) => {
      setIsAuthenticated(true);
      setUserRole(role);
      setCurrentView('app');
    }} />;
  }

  if (currentView === 'splash') {
    return <SplashScreen onFinish={() => setCurrentView(isAuthenticated ? 'app' : 'auth')} />;
  }

  return (
    <div className="min-h-screen bg-brand-cream pb-32">
      <AnimatePresence>
        {currentView === 'virtual-tour' && (
          <VirtualTour initialPlace={tourPlace} onClose={() => {
            setCurrentView('app');
            setTourPlace(null);
          }} />
        )}
        {isQuizOpen && (
          <QuizGame onClose={() => setIsQuizOpen(false)} />
        )}
        {isMemoryGameOpen && (
          <MemoryGame onClose={() => setIsMemoryGameOpen(false)} />
        )}
        {isRatingOpen && (
          <RatingModal onClose={() => setIsRatingOpen(false)} />
        )}
        {selectedCategory === 'arabic' && (
          <ArabicLettersGame onClose={() => setSelectedCategory(null)} />
        )}
        {selectedCategory === 'english' && (
          <EnglishLettersGame onClose={() => setSelectedCategory(null)} />
        )}
        {isDailyChallengeOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] p-8 text-center max-w-sm w-full">
              <h3 className="text-2xl font-bold text-brand-deep mb-4">التحدي اليومي</h3>
              <p className="text-brand-black/60 font-medium mb-8">عذراً، تحدي اليوم لم يبدأ بعد. عد غداً!</p>
              <button onClick={() => setIsDailyChallengeOpen(false)} className="w-full py-4 rounded-xl bg-brand-gold text-brand-deep font-bold text-lg">العودة للرئيسية</button>
            </div>
          </div>
        )}
      </AnimatePresence>
      {/* Top Bar */}
      <header className="p-6 flex justify-between items-center max-w-md mx-auto sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex items-center justify-center relative">
            <DarbFlowerSVG className="w-[120%] h-[120%] drop-shadow-2xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-brand-deep leading-none">درب</h1>
            <span className="text-[16px] font-bold text-brand-green tracking-widest uppercase leading-none mt-1">DARB</span>
            <span className="text-[9px] font-bold text-brand-deep uppercase leading-none mt-1">لكل مكان قصة</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-2xl shadow-sm border border-brand-deep/5 bg-white text-brand-deep flex items-center justify-center transition-all hover:bg-brand-deep/5"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-2xl shadow-sm border border-brand-deep/5 bg-white text-brand-deep flex items-center justify-center transition-all relative hover:bg-brand-deep/5"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-bright rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* Child Settings Button */}
          <button 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border shadow-sm cursor-pointer bg-brand-bright/10 text-brand-deep border-brand-bright/20 hover:bg-brand-bright/20"
          >
            <User size={16} className="text-brand-bright" />
            <span className="leading-none pt-0.5">الطفل</span>
          </button>

          {/* Parent Control Button */}
          <button 
            onClick={() => setIsParentMode(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border shadow-sm cursor-pointer bg-brand-deep text-white border-brand-deep hover:shadow-md hover:scale-105"
          >
            <span className="leading-none pt-0.5">الأهل</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section - Polished Visual Identity */}
              <section className="relative bg-gradient-to-br from-brand-deep/5 to-brand-bright/5 rounded-[3rem] p-8 overflow-hidden flex items-center justify-between border border-brand-deep/5">
                <div className="max-w-[55%] space-y-3 relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-brand-gold animate-pulse" />
                    <span className="text-[10px] font-bold text-brand-deep/60 uppercase tracking-widest">مرحباً بك في درب</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-brand-deep leading-tight">متعة التعلم والاستكشاف</h2>
                  <p className="text-[11px] text-brand-black/60 font-medium leading-relaxed">
                    مع الحروف، الأرقام، والألوان.. العب وتعلم واكتشف جمال فلسطين مع درب!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('videos')}
                    className="mt-4 px-6 py-2.5 bg-brand-deep text-white rounded-2xl text-[10px] font-bold shadow-lg shadow-brand-deep/20"
                  >
                    ابدأ الرحلة
                  </motion.button>
                </div>
                <div className="relative">
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-40 h-40 relative z-10 flex flex-col items-center justify-center drop-shadow-2xl"
                  >
                    <DarbFlowerSVG className="w-full h-full object-contain drop-shadow-2xl" />
                  </motion.div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#A61D33]/15 rounded-full blur-3xl -z-10" />
                </div>
              </section>

              {/* Information Challenge Card */}
                <motion.section 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsQuizOpen(true)}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-[#A61D33]/20 relative overflow-hidden cursor-pointer group mb-8"
                >
                  {/* Decorative Heritage Elements */}
                  <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-brand-black via-[#A61D33] to-[#31885F]" />
                  <div className="absolute -left-6 -top-6 text-6xl opacity-10 group-hover:rotate-12 transition-transform">🌿</div>
                  <div className="absolute -right-6 -bottom-6 text-6xl opacity-10 group-hover:-rotate-12 transition-transform">🍉</div>
                  
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-2xl font-serif font-bold text-[#A61D33] drop-shadow-sm flex items-center gap-2">
                      <span>تحدي المعلومات السريع</span>
                      <span className="text-xl">🏆</span>
                    </h3>
                    <div className="flex gap-2">
                      <span className="px-4 py-1.5 bg-brand-cream rounded-full text-[10px] font-bold text-[#A61D33] shadow-sm">أسئلة تراثية</span>
                      <span className="px-4 py-1.5 bg-brand-cream rounded-full text-[10px] font-bold text-[#31885F] shadow-sm">تفاعلي</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 relative z-10">
                    {[1, 2, 3].map((i, idx) => (
                      <div key={i} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner border-2 border-dashed ${
                        idx === 0 ? "bg-brand-black/5 text-brand-black border-brand-black/20" :
                        idx === 1 ? "bg-[#A61D33]/5 text-[#A61D33] border-[#A61D33]/20 scale-110 shadow-lg" :
                        "bg-[#31885F]/5 text-[#31885F] border-[#31885F]/20"
                      }`}>
                        <HelpCircle size={32} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 mt-6 relative z-10">
                    <div className="w-2 h-2 rounded-full bg-[#A61D33]" />
                    <div className="w-2 h-2 rounded-full bg-[#A61D33]/30" />
                    <div className="w-2 h-2 rounded-full bg-[#A61D33]/30" />
                  </div>
                </motion.section>

                {/* Action Grid */}
                <div className="grid grid-cols-2 gap-4">
                <ActionButton 
                  label="لعبة الذاكرة" 
                  icon={Gamepad2} 
                  color="bg-brand-bright" 
                  onClick={() => setIsMemoryGameOpen(true)}
                />
                <ActionButton 
                  label="شارك التطبيق" 
                  icon={Share2} 
                  color="bg-gradient-to-br from-blue-500 to-blue-600" 
                />
                <ActionButton 
                  label="قيم التطبيق" 
                  icon={Heart} 
                  color="bg-gradient-to-br from-purple-500 to-purple-600" 
                  onClick={() => setIsRatingOpen(true)}
                />
                <ActionButton 
                  label="تهويدة درب" 
                  icon={Moon} 
                  color="bg-gradient-to-br from-indigo-500 to-purple-600" 
                  onClick={() => setIsLullabiesOpen(true)}
                />
              </div>

              {/* Virtual Tour Section */}
              <section className="bg-brand-deep rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-brand-deep/30">
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <MapIcon size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold">جولة افتراضية 360°</h3>
                    <p className="text-xs text-white/70 leading-relaxed max-w-[200px] mx-auto">
                      تجول في المعالم التاريخية من مكانك عبر الجولات الافتراضية الواقعية
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView('virtual-tour')}
                    className="px-8 py-3 bg-white text-brand-deep rounded-2xl text-sm font-bold shadow-xl"
                  >
                    ابدأ الجولة الآن
                  </motion.button>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Compass size={200} />
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'experiences' && (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 pb-20"
              >
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-deep">
                    <ChevronLeft size={20} className="rotate-180" />
                  </button>
                  <h2 className="text-2xl font-serif font-bold text-brand-deep">عالم الواقع الممتد</h2>
                </div>

                <div className="space-y-8">
                  {/* Section 1: AR Sandbox */}
                  <section>
                    <h3 className="text-xl font-bold text-brand-deep mb-4 border-r-4 border-brand-gold pr-3">مساحة الواقع المعزز (AR)</h3>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      onClick={() => window.location.href = '/ar-experience.html'}
                      className="bg-brand-deep rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden cursor-pointer"
                    >
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-4">
                          <Layers size={24} />
                        </div>
                        <h4 className="text-white text-2xl font-bold mb-2">الرسم في الهواء 3D</h4>
                        <p className="text-white/70 text-sm font-medium">حول غرفتك إلى لوحة فنية بتتبع المسار</p>
                      </div>
                      <div className="absolute right-0 bottom-0 top-0 w-32 bg-gradient-to-l from-brand-gold/30 to-transparent"></div>
                    </motion.div>
                  </section>

                  {/* Section 1.5: Lullabies */}
                  <section>
                    <h3 className="text-xl font-bold text-brand-deep mb-4 border-r-4 border-[#5C2A9D] pr-3">تهويدات درب</h3>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      onClick={() => setIsLullabiesOpen(true)}
                      className="bg-gradient-to-l from-[#2B0F4C] to-[#5C2A9D] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden cursor-pointer"
                    >
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-4">
                          <Moon size={24} />
                        </div>
                        <h4 className="text-white text-2xl font-bold mb-2">رحلة لعالم الأحلام</h4>
                        <p className="text-white/70 text-sm font-medium">موسيقى هادئة وتهويدات لجميع الأعمار</p>
                      </div>
                      <div className="absolute right-0 bottom-0 top-0 w-32 bg-gradient-to-l from-white/10 to-transparent"></div>
                      <div className="absolute top-4 left-6 text-2xl animate-pulse">⭐</div>
                      <div className="absolute bottom-6 left-12 text-xl animate-pulse delay-300">✨</div>
                    </motion.div>
                  </section>



                  {/* Section 2: Palestine 360 */}
                  <section>
                    <h3 className="text-xl font-bold text-brand-deep mb-4 border-r-4 border-brand-green pr-3">مدن فلسطين (VR 360)</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {experiences.filter(e => e.type === 'VR 360').map(exp => (
                        <motion.div 
                          key={exp.id} whileHover={{ y: -2 }} onClick={() => { setTourPlace(exp); setCurrentView('virtual-tour'); }}
                          className="bg-white rounded-3xl p-4 shadow-sm border border-brand-deep/5 flex items-center gap-4 cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-zinc-200 overflow-hidden relative">
                             <div className="absolute inset-0 bg-brand-green/20 flex items-center justify-center text-brand-deep text-xs font-bold font-serif">360°</div>
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-deep text-lg">{exp.title}</h4>
                            <span className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-1 rounded-full font-bold">بدون إنترنت</span>
                          </div>
                          <div className="mr-auto w-10 h-10 bg-brand-cream rounded-full flex items-center justify-center"><Play size={16} className="text-brand-deep ml-1" /></div>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Section 3: Videos */}
                  <section>
                    <h3 className="text-xl font-bold text-brand-deep mb-4 border-r-4 border-brand-bright pr-3">الفيديوهات التفاعلية</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {experiences.filter(e => e.type === 'VR Video').map(exp => (
                        <motion.div 
                          key={exp.id} whileHover={{ y: -2 }} onClick={() => { setTourPlace(exp); setCurrentView('virtual-tour'); }}
                          className="bg-white rounded-3xl p-4 shadow-sm border border-brand-deep/5 flex items-center gap-4 cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-zinc-200 overflow-hidden relative">
                            <div className="absolute inset-0 bg-brand-bright/20 flex items-center justify-center text-brand-deep text-xs font-bold font-serif">Video</div>
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-deep text-lg">{exp.title}</h4>
                            <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full font-bold">رسوم متحركة</span>
                          </div>
                          <div className="mr-auto w-10 h-10 bg-brand-cream rounded-full flex items-center justify-center"><Play size={16} className="text-brand-deep ml-1" /></div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 pb-10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-deep">
                    <ChevronLeft size={20} className="rotate-180" />
                  </button>
                  <h2 className="text-2xl font-serif font-bold text-brand-deep">الألعاب التعليمية</h2>
                </div>
              </div>

              {/* Only 3 Games Grid */}
              <div className="grid grid-cols-1 gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory('arabic')}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-brand-deep/5 flex items-center gap-6 text-right cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-3xl bg-brand-deep flex items-center justify-center text-white shadow-lg">
                    <BookOpen size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-deep">الحروف العربية</h3>
                    <p className="text-xs text-brand-black/40 font-bold mt-1">تعلم نطق وكتابة الحروف بطريقة ممتعة</p>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory('english')}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-brand-deep/5 flex items-center gap-6 text-right cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-3xl bg-brand-green flex items-center justify-center text-white shadow-lg">
                    <BookOpen size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-green">الحروف الإنجليزية</h3>
                    <p className="text-xs text-brand-black/40 font-bold mt-1">تفاعل والعب مع حروف الـ (ABC)</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsQuizOpen(true)}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-brand-deep/5 flex items-center gap-6 text-right"
                >
                  <div className="w-20 h-20 rounded-3xl bg-brand-bright flex items-center justify-center text-white shadow-lg">
                    <Trophy size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-deep">تحدي المعلومات</h3>
                    <p className="text-xs text-brand-black/40 font-bold mt-1">اختبر معلوماتك عن فلسطين واكسب النقاط</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsMemoryGameOpen(true)}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-brand-deep/5 flex items-center gap-6 text-right"
                >
                  <div className="w-20 h-20 rounded-3xl bg-brand-green flex items-center justify-center text-white shadow-lg">
                    <Gamepad2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-brand-deep">لعبة الذاكرة</h3>
                    <p className="text-xs text-brand-black/40 font-bold mt-1">نشط ذاكرتك مع أيقونات درب الجميلة</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/ar-experience.html'} 
                  className="bg-brand-deep rounded-[2.5rem] p-8 shadow-xl border border-brand-deep/5 flex items-center gap-6 text-right cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg z-10 border border-white/30">
                    <Layers size={40} />
                  </div>
                  <div className="z-10 relative">
                    <h3 className="text-xl font-bold text-white mb-1">الرسم واللعب بالهواء (AR)</h3>
                    <p className="text-xs text-white/70 font-bold">اسقط سيارة على الأرض وتحكم بها سحرياً!</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'videos' && (<VideosView onBack={() => setActiveTab('home')} />)}
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pb-10"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-brand-deep rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-brand-deep/20 mb-4">
                  <Trophy size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-brand-deep">إنجازات درب</h2>
                <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">فخورون بما حققناه معاً</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, value: '+150', label: 'قصة تفاعلية', icon: BookOpen, color: 'text-brand-deep' },
                  { id: 2, value: '+50', label: 'لعبة تعليمية', icon: Medal, color: 'text-brand-bright' },
                  { id: 3, value: '+1000', label: 'طفل سعيد', icon: TrendingUp, color: 'text-brand-green' },
                ].map((stat) => (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stat.id * 0.1 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-brand-deep/5 flex flex-col items-center text-center gap-2"
                  >
                    <div className={cn("mb-2", stat.color)}>
                      <stat.icon size={32} strokeWidth={2.5} />
                    </div>
                    <span className={cn("text-4xl font-serif font-bold", stat.color)}>{stat.value}</span>
                    <span className="text-sm font-bold text-brand-black/60">{stat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Personal Progress Section */}
              <section className="bg-brand-deep text-white p-8 rounded-[3rem] shadow-2xl shadow-brand-deep/30 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-serif font-bold mb-4">تقدمك الشخصي</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold opacity-80">القصص المكتملة</span>
                      <span className="text-lg font-serif font-bold">12/20</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        className="h-full bg-brand-gold"
                      />
                    </div>
                    <p className="text-[10px] opacity-70 leading-relaxed">أنت تبلي بلاءً حسناً! أكمل 8 قصص أخرى للحصول على وسام "الحكواتي المبدع".</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 opacity-10">
                  <Sparkles size={160} />
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-[calc(100vh-240px)]"
            >
              <AITutorContent isFullPage />
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[calc(100vh-240px)] flex flex-col space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-deep">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
                <h2 className="text-2xl font-serif font-bold text-brand-deep">خريطة الاستكشاف</h2>
              </div>
              <div className="flex-1 min-h-0">
                <CartoonMap onStartTour={(place) => {
                  setTourPlace(place);
                  setCurrentView('virtual-tour');
                }} />
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pb-10"
            >
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-brand-deep border-4 border-white shadow-2xl flex items-center justify-center text-white text-3xl font-bold cursor-pointer" onClick={() => setIsEditingProfile(true)}>
                    {childProfile.initial}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-gold rounded-2xl border-4 border-white flex items-center justify-center text-brand-deep shadow-lg">
                    <Medal size={20} />
                  </div>
                </div>
                <div>
                  {isEditingProfile ? (
                    <div className="flex flex-col items-center gap-2">
                      <input 
                        type="text" 
                        value={childProfile.name}
                        onChange={(e) => setChildProfile({ ...childProfile, name: e.target.value, initial: e.target.value.charAt(0) || 'أ' })}
                        className="bg-white border-2 border-brand-deep/20 rounded-xl px-4 py-2 text-center font-bold text-brand-deep w-48"
                        autoFocus
                      />
                      <button onClick={() => setIsEditingProfile(false)} className="bg-brand-green text-white px-4 py-1 rounded-full text-xs font-bold">حفظ</button>
                    </div>
                  ) : (
                    <h2 
                      className="text-2xl font-serif font-bold text-brand-deep cursor-pointer flex items-center justify-center gap-2"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      {childProfile.name}
                      <span className="text-[10px] text-brand-black/40 bg-brand-black/5 px-2 py-1 rounded-full">تعديل</span>
                    </h2>
                  )}
                  <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mt-2">عضو منذ مارس 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'نقاط', val: '1,250', color: 'text-brand-gold' },
                  { label: 'أوسمة', val: '8', color: 'text-brand-bright' },
                  { label: 'مستوى', val: '12', color: 'text-brand-green' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-4 rounded-3xl shadow-soft border border-brand-deep/5 text-center">
                    <span className={cn("text-lg font-serif font-bold block", stat.color)}>{stat.val}</span>
                    <span className="text-[8px] font-bold text-brand-black/40 uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>

              <section className="space-y-4">
                <SectionHeader title="أوسمتي" actionLabel="عرض الكل" />
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="min-w-[80px] h-20 bg-white rounded-3xl shadow-soft border border-brand-deep/5 flex items-center justify-center text-brand-gold"
                    >
                      <Trophy size={32} />
                    </motion.div>
                  ))}
                </div>
              </section>

              <div className="space-y-3">
                {[
                  { label: 'إعدادات الحساب', icon: User },
                  { label: 'تنبيهات الاستكشاف', icon: Sparkles },
                  { label: 'اللغة (العربية)', icon: BookOpen },
                  { label: 'المساعدة والدعم', icon: Info },
                ].map((item, i) => (
                  <button key={i} className="w-full p-5 bg-white rounded-[2rem] shadow-soft border border-brand-deep/5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-brand-cream text-brand-deep flex items-center justify-center group-hover:bg-brand-deep group-hover:text-white transition-colors">
                        <item.icon size={20} />
                      </div>
                      <span className="text-sm font-bold text-brand-deep">{item.label}</span>
                    </div>
                    <ChevronLeft size={16} className="text-brand-black/20" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Lullabies Overlay */}
      <AnimatePresence>
        {isLullabiesOpen && <LullabiesView onClose={() => setIsLullabiesOpen(false)} />}
      </AnimatePresence>

      {/* Parent Mode Overlay */}
      <AnimatePresence>
        {isParentMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-brand-cream/95 backdrop-blur-xl p-8 overflow-y-auto"
          >
            <div className="max-w-md mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif font-bold text-brand-deep">لوحة تحكم الأهل</h2>
                <button onClick={() => setIsParentMode(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-deep shadow-sm">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-brand-deep/5">
                  <span className="text-3xl font-serif font-bold text-brand-deep">120</span>
                  <p className="text-[10px] font-bold text-brand-black/40 uppercase mt-1">دقيقة قراءة</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-brand-deep/5">
                  <span className="text-3xl font-serif font-bold text-brand-green">15</span>
                  <p className="text-[10px] font-bold text-brand-black/40 uppercase mt-1">تحدي مكتمل</p>
                </div>
              </div>

              <section className="space-y-4">
                <h3 className="text-lg font-bold text-brand-deep">تحليل الاهتمامات</h3>
                <div className="space-y-3">
                  {[
                    { label: 'التاريخ والجغرافيا', val: '85%', color: 'bg-brand-deep' },
                    { label: 'الألعاب اللغوية', val: '60%', color: 'bg-brand-green' },
                    { label: 'الفنون والتراث', val: '45%', color: 'bg-brand-bright' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-brand-black/60">
                        <span>{item.label}</span>
                        <span>{item.val}</span>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-brand-deep/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: item.val }}
                          className={cn("h-full rounded-full", item.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-brand-deep text-white p-6 rounded-[2.5rem] shadow-xl shadow-brand-deep/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Settings size={24} />
                  </div>
                  <h4 className="font-bold">إعدادات الرقابة</h4>
                </div>
                <p className="text-xs text-white/70 leading-relaxed mb-6">يمكنك هنا تحديد وقت الاستخدام اليومي واختيار المحتوى المناسب لعمر طفلك.</p>
                
                {isEditingParent ? (
                  <div className="space-y-4 bg-white/10 p-4 rounded-2xl mb-4">
                    <div>
                      <label className="text-xs font-bold block mb-2 text-white">وقت الاستخدام المسموح (بالدقائق):</label>
                      <input 
                        type="number" 
                        value={parentSettings.timeLimit}
                        onChange={(e) => setParentSettings({ ...parentSettings, timeLimit: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white text-brand-deep font-bold p-2 rounded-xl text-center"
                      />
                    </div>
                    <button onClick={() => setIsEditingParent(false)} className="w-full py-2 bg-brand-green text-white rounded-xl text-xs font-bold">حفظ التعديلات</button>
                  </div>
                ) : (
                  <div className="mb-4">
                     <p className="text-sm font-bold text-brand-gold mb-4">الوقت المسموح حالياً: {parentSettings.timeLimit} دقيقة</p>
                     <button onClick={() => setIsEditingParent(true)} className="w-full py-3 bg-white text-brand-deep rounded-2xl text-xs font-bold">تعديل الإعدادات</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lullabies Overlay */}
      <AnimatePresence>
        {isLullabiesOpen && <LullabiesView onClose={() => setIsLullabiesOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
