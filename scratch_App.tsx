import { motion, AnimatePresence } from "motion/react";
import { 
  Home, BookOpen, Map as MapIcon, User, Sparkles, Send, X, Mic, 
  Navigation2, Compass, Play, Gamepad2, Landmark, Settings, 
  ChevronLeft, Heart, Share2, Info, Headphones, Trophy, Medal, TrendingUp,
  Eye, Volume2, Layers, Map as MapLucide, Star, Moon, Sun, Bell, HelpCircle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "./lib/utils";
import confetti from "canvas-confetti";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { audioData } from "./audioData";
import { englishAudioData } from "./englishAudioData";

// Fix Leaflet icon issue
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export const DarbFlowerSVG = ({ className }: { className?: string }) => (
  <img 
    src="/icon_perfect.png" 
    alt="Darb" 
    className={`${className} object-contain mix-blend-multiply`} 
  />
);

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Types ---

type View = 'app' | 'splash' | 'story-reader' | 'video-player' | 'virtual-tour' | 'quiz' | 'memory-game';
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
        className={`w-full h-full object-cover shadow-sm ${isLocked ? 'opacity-40 grayscale' : ''}`}
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
  const [selectedPlace, setSelectedPlace] = useState(initialPlace || {
    name: 'جولة القدس',
    image: 'https://images.unsplash.com/photo-1548232938-1a5266cb2273?q=80&w=2048&auto=format&fit=crop',
  });

  const places = [
    { name: 'جولة القدس', image: 'https://images.unsplash.com/photo-1548232938-1a5266cb2273?q=80&w=2048&auto=format&fit=crop' },
    { name: 'غزة', image: 'https://images.unsplash.com/photo-1574100004472-e536d3b6bacc?q=80&w=2048&auto=format&fit=crop' },
    { name: 'الليل', image: 'https://images.unsplash.com/photo-1594993433602-d9ee3b290fb4?q=80&w=2048&auto=format&fit=crop' },
    { name: 'نابلس', image: 'https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?q=80&w=2048&auto=format&fit=crop' },
    { name: 'ميناء يافا', image: 'https://images.unsplash.com/photo-1589830571068-1542f561ee6a?q=80&w=2048&auto=format&fit=crop' },
    { name: 'غابة طبيعية', image: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg' },
    { name: 'الفضاء السحيق', image: 'https://ucarecdn.com/bcece0a8-86ce-460e-856b-40dac4875f15/' },
    { name: 'عالم السفاري', image: 'https://images.unsplash.com/photo-1516426122078-a6279f04ca38?q=80&w=2048&auto=format&fit=crop' },
  ];

  useEffect(() => {
    if (!document.getElementById('aframe-script')) {
      const script = document.createElement('script');
      script.id = 'aframe-script';
      script.src = 'https://aframe.io/releases/1.5.0/aframe.min.js';
      document.head.appendChild(script);
    }
  }, []);

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
          <h3 className="font-serif font-bold text-white shadow-black drop-shadow-md leading-none">{selectedPlace.name}</h3>
          <span className="text-[10px] font-bold text-brand-gold uppercase mt-1.5 block tracking-widest shadow-black drop-shadow-md">الواقع الافتراضي (VR)</span>
        </div>
        <div className="w-10 h-10" />
      </header>

      <div className="flex-1 relative bg-zinc-900 overflow-hidden" 
        onClick={() => {
          // Fallback to wake up A-Frame if it stucks
          window.dispatchEvent(new Event('resize'));
        }}
      >
        <div className="w-full h-full">
          {/* @ts-ignore */}
          <a-scene embedded vr-mode-ui="enabled: true" loading-screen="dotsColor: white; backgroundColor: black" inspector="" keyboard-shortcuts="" screenshot="" device-orientation-permission-ui="">
            {/* @ts-ignore */}
            <a-sky src={selectedPlace.image} rotation="0 -90 0"></a-sky>
            {/* @ts-ignore */}
            <a-entity camera="" look-controls="magicWindowTrackingEnabled: true; touchEnabled: true;  mouseEnabled: true"></a-entity>
          {/* @ts-ignore */}
          </a-scene>
        </div>
      </div>

      <footer className="p-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent overflow-x-auto no-scrollbar z-20">
        <div className="flex justify-center gap-4 min-w-max">
          {places.map((place) => (
            <button 
              key={place.name}
              onClick={() => setSelectedPlace(place)}
              className={cn(
                "px-6 py-3 rounded-full text-[10px] font-bold transition-all border",
                selectedPlace.name === place.name 
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

const ARExperience = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const loadAR = async () => {
      if (!document.getElementById('aframe-script')) {
        const afScript = document.createElement('script');
        afScript.id = 'aframe-script';
        afScript.src = 'https://aframe.io/releases/1.5.0/aframe.min.js';
        document.head.appendChild(afScript);
      }
    };
    loadAR();
  }, []);

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
          <h3 className="font-serif font-bold text-white shadow-black drop-shadow-md leading-none">AR Draw (الرسم الفني ثلاثي الأبعاد)</h3>
          <span className="text-[10px] font-bold text-brand-gold uppercase mt-1.5 block tracking-widest shadow-black drop-shadow-md">مجاني ومحلي 100%</span>
        </div>
        <div className="w-10 h-10" />
      </header>

      <div className="flex-1 relative bg-zinc-900 overflow-hidden">
        {/* AR Draw Clone (Just a Line style) */}
        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: `
          <a-scene webxr="requiredFeatures: local-floor;" renderer="alpha: true;">
            <script>
              if (!window.arPaintLoaded) {
                 window.arPaintLoaded = true;
                 AFRAME.registerComponent('ar-paint', {
                   init: function () {
                     this.isDrawing = false;
                     this.lastPos = new THREE.Vector3();
                     this.camera = document.querySelector('a-entity[camera]');
                     
                     this.el.sceneEl.addEventListener('enter-vr', () => {
                        const hint = document.getElementById('ar-hint');
                        if(hint) hint.setAttribute('visible', 'false');
                     });
                     
                     window.addEventListener('touchstart', () => { this.isDrawing = true; });
                     window.addEventListener('touchend', () => { this.isDrawing = false; });
                     window.addEventListener('mousedown', () => { this.isDrawing = true; });
                     window.addEventListener('mouseup', () => { this.isDrawing = false; });
                   },
                   tick: function () {
                     if (this.isDrawing && this.camera) {
                       const pos = new THREE.Vector3(0, 0, -0.4); // 40cm in front of camera
                       pos.applyMatrix4(this.camera.object3D.matrixWorld);
                       
                       // Only drop paint if moved more than 2cm
                       if (pos.distanceTo(this.lastPos) > 0.02) {
                         const dot = document.createElement('a-sphere');
                         dot.setAttribute('position', pos);
                         dot.setAttribute('radius', '0.015');
                         
                         const colors = ['#FFDE59', '#E63946', '#2A9D8F', '#4CC9F0', '#F72585'];
                         dot.setAttribute('color', colors[Math.floor(Math.random() * colors.length)]);
                         dot.setAttribute('material', 'shader: flat'); // unlit glowing look
                         
                         this.el.sceneEl.appendChild(dot);
                         this.lastPos.copy(pos);
                       }
                     }
                   }
                 });
              }
            </script>
            <a-entity ar-paint></a-entity>
            <a-entity camera look-controls></a-entity>
            <a-text id="ar-hint" value="Tab and Hold to Draw in Air!" position="0 1.5 -2" align="center" color="white" font="https://cdn.aframe.io/fonts/mozillavr.fnt"></a-text>
          </a-scene>
        `}} />
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20 pointer-events-none">
         <span className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md font-bold text-xs" dir="rtl">المس الشاشة واستمر بالضغط، ثم حرك الجوال لتبدأ بالرسم الفني في الهواء (بدون ماركر)!</span>
      </div>
    </motion.div>
  );
};

const QuizGame = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { q: "ما هي عاصمة فلسطين الأبدية؟", options: ["يافا", "القدس", "حيفا", "نابلس"], a: 1 },
    { q: "ما هو الطائر الوطني لفلسطين؟", options: ["عصفور الشمس الفلسطيني", "الصقر", "النسر", "الحمام"], a: 0 },
    { q: "ما هي الشجرة التي ترمز للصمود في فلسطين؟", options: ["النخيل", "التين", "الزيتون", "البلوط"], a: 2 },
    { q: "أين يقع المسجد الأقصى المبارك؟", options: ["غزة", "الخليل", "القدس", "رام الله"], a: 2 },
    { q: "ما هو البحر الذي تطل عليه مدينة يافا؟", options: ["البحر الميت", "البحر الأحمر", "البحر الأبيض المتوسط", "بحر العرب"], a: 2 },
    { q: "ما هي المدينة المشهورة بصناعة الكنافة؟", options: ["جنين", "نابلس", "طولكرم", "أريحا"], a: 1 },
    { q: "ما هي أقدم مدينة في العالم وتقع في فلسطين؟", options: ["القدس", "أريحا", "بيت لحم", "الناصرة"], a: 1 },
    { q: "ما هو التطريز التقليدي الذي تشتهر به المرأة الفلسطينية؟", options: ["الخياطة", "التطريز الفلاحي", "الحياكة", "النسيج"], a: 1 },
    { q: "ما هو الجبل المشهور في مدينة حيفا؟", options: ["جبل جرزيم", "جبل الكرمل", "جبل عيبال", "جبل الطور"], a: 1 },
    { q: "ما هو النهر الذي يفصل بين فلسطين والأردن؟", options: ["نهر النيل", "نهر الفرات", "نهر الأردن", "نهر اليرموك"], a: 2 }
  ];

  const handleAnswer = (idx: number) => {
    if (idx === questions[step].a) setScore(score + 1);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#A61D33', '#31885F', '#D4AF37', '#FDF3E6'] });
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'); // Cheerful Success Sound
        audio.play();
      } catch (e) { console.error('Audio play failed', e); }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[160] bg-brand-cream flex flex-col p-8"
    >
      <header className="flex justify-between items-center mb-12">
        <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-deep">
          <X size={24} />
        </button>
        <div className="px-6 py-2 bg-brand-deep text-white rounded-full text-xs font-bold">
          سؤال {step + 1} / {questions.length}
        </div>
      </header>

      {!showResult ? (
        <div className="flex-1 flex flex-col justify-center space-y-12">
          <h2 className="text-3xl font-serif font-bold text-brand-deep text-center leading-relaxed">
            {questions[step].q}
          </h2>
          <div className="grid gap-4">
            {questions[step].options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(i)}
                className="p-6 bg-white rounded-[2rem] text-right font-bold text-brand-deep shadow-soft border border-brand-deep/5 hover:border-brand-deep/20 transition-all"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <div className="w-32 h-32 bg-brand-gold rounded-full flex items-center justify-center text-brand-deep shadow-2xl">
            <Trophy size={64} />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-serif font-bold text-brand-deep">أحسنت يا بطل!</h2>
            <p className="text-lg font-medium text-brand-black/60">لقد أجبت على {score} من {questions.length} أسئلة بشكل صحيح</p>
          </div>
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-brand-deep text-white rounded-[2rem] font-bold shadow-xl"
          >
            العودة للرئيسية
          </button>
        </div>
      )}
    </motion.div>
  );
};

const MemoryGame = ({ onClose }: { onClose: () => void }) => {
  const [cards, setCards] = useState<{id: number, icon: string, isFlipped: boolean, isMatched: boolean}[]>([]);
  const [flippedIndex, setFlippedIndex] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const icons = ['🦁', '🦆', '🍎', '🦊', '🐪', '🐎', '🐑', '🐓'];
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon, isFlipped: false, isMatched: false }));
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
          <div className="grid grid-cols-4 gap-3">
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
                  
                  {/* Back (Revealed state) */}
                  <div 
                    className={cn(
                      "absolute inset-0 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl backface-hidden",
                      card.isMatched && "bg-brand-green/10 border-2 border-brand-green"
                    )}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {card.icon}
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
        'https://picsum.photos/seed/jaffa1/400/300',
        'https://picsum.photos/seed/jaffa2/400/300'
      ],
      tour: { name: 'ميناء يافا', lat: 32.0517, lng: 34.7500, heading: 180 }
    },
    { 
      name: 'حيفا', 
      pos: [32.7940, 34.9896], 
      desc: 'عروس الكرمل وجمال الطبيعة.',
      photos: [
        'https://picsum.photos/seed/haifa1/400/300',
        'https://picsum.photos/seed/haifa2/400/300'
      ],
      tour: { name: 'جبل الكرمل', lat: 32.7940, lng: 34.9896, heading: 0 }
    },
    { 
      name: 'نابلس', 
      pos: [32.2211, 35.2544], 
      desc: 'دمشق الصغرى ومدينة الكنافة.',
      photos: [
        'https://picsum.photos/seed/nablus1/400/300'
      ],
      tour: { name: 'نابلس القديمة', lat: 32.2211, lng: 35.2544, heading: 0 }
    },
    { 
      name: 'غزة', 
      pos: [31.5017, 34.4667], 
      desc: 'مدينة العزة والصمود.',
      photos: [
        'https://picsum.photos/seed/gaza1/400/300'
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
    { id: 'experiences', icon: Layers, label: 'فيديوهات' },
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

const AITutorContent = ({ isFullPage = false, onClose }: { isFullPage?: boolean, onClose?: () => void }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'أهلاً بك يا صديقي المبدع! أنا مرشدك في "درب". هل تريد أن أحكي لك قصة عن أسوار القدس، أم نلعب لعبة الكلمات المفقودة؟' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("متصفحك لا يدعم التعرف على الصوت");
      return;
    }
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, { role: 'ai', text: 'يا له من سؤال ذكي! دعني أخبرك سراً عن هذا المكان التاريخي...' }]);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8, x: 0.5 },
        colors: ['#8A1734', '#31885F', '#D4AF37']
      });
    }, 2000);
  };

  return (
    <div className={cn(
      "flex flex-col overflow-hidden transition-all duration-500 relative",
      isFullPage ? "h-full bg-brand-cream/30" : "fixed inset-4 z-[100] bg-brand-cream rounded-[3rem] shadow-2xl border border-white/50"
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238A1734' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      {/* Header */}
      <div className={cn(
        "px-6 py-4 flex justify-between items-center z-20 shrink-0",
        isFullPage 
          ? "border-b border-brand-black/5 bg-brand-cream/95 backdrop-blur-xl absolute top-0 left-0 right-0" 
          : "rounded-t-[2.5rem] border-b border-brand-black/5 bg-white/80 backdrop-blur-xl relative"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center relative hover:scale-105 transition-transform cursor-pointer">
            <DarbFlowerSVG className="w-[120%] h-[120%] object-contain drop-shadow-xl" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-brand-deep text-lg leading-tight">مرشد درب</h3>
            <span className="text-[10px] text-brand-green font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              مستعد للمساعدة
            </span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-brand-black/5 flex items-center justify-center text-brand-black/40 hover:text-brand-deep transition-all">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className={cn(
        "flex-1 overflow-y-auto px-4 pb-4 space-y-6 no-scrollbar relative z-10 w-full flex flex-col",
        isFullPage ? "pt-28" : "py-8"
      )}>
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={i}
            className={cn(
              "max-w-[85%] p-6 rounded-[2.5rem] text-sm font-medium leading-relaxed shadow-xl relative",
              msg.role === 'ai' 
                ? "bg-white text-brand-black rounded-tr-none border border-brand-deep/5 self-start" 
                : "bg-gradient-to-br from-brand-deep to-brand-bright text-white mr-auto rounded-tl-none self-end"
            )}
          >
            {msg.text}
            {msg.role === 'ai' && (
              <div className="absolute -right-2 -top-2 w-6 h-6 bg-brand-deep rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">
                ✨
              </div>
            )}
          </motion.div>
        ))}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2.5rem] rounded-tr-none border border-brand-deep/5 w-24 flex justify-center gap-1.5 shadow-lg"
          >
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                className="w-2 h-2 rounded-full bg-brand-deep/40"
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className={cn(
        "p-6 relative z-10",
        isFullPage ? "pb-2" : "pb-12 rounded-b-[3rem]"
      )}>
        <div className="flex items-center gap-3 bg-white p-3 rounded-full shadow-2xl border border-brand-deep/10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startListening}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg",
              isListening ? "bg-brand-bright text-white animate-pulse" : "bg-brand-cream text-brand-deep"
            )}
          >
            <Mic size={22} />
          </motion.button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="تحدث معي، أنا أسمعك..."
            className="flex-1 bg-transparent px-4 outline-none text-sm font-bold text-brand-black placeholder:text-brand-black/30 text-right"
          />
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className={cn(
              "w-12 h-12 rounded-full text-white flex items-center justify-center shadow-xl shadow-brand-deep/20 transition-all",
              input.trim() ? "bg-gradient-to-br from-brand-deep to-brand-bright opacity-100" : "bg-gray-300 opacity-50"
            )}
          >
            <Send size={22} className="mr-0.5" />
          </motion.button>
        </div>
      </div>
    </div>
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isParentMode, setIsParentMode] = useState(false);
  const [currentView, setCurrentView] = useState<View>('splash');
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMemoryGameOpen, setIsMemoryGameOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tourPlace, setTourPlace] = useState<any | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const experiences = [
    { id: 1, title: 'جولة القدس 360', type: 'VR 360', image: '/360/jerusalem.jpg', img: 'jerusalem' },
    { id: 2, title: 'نابلس 360', type: 'VR 360', image: '/360/nablus.jpg', img: 'nablus' },
    { id: 3, title: 'يافا 360', type: 'VR 360', image: '/360/jaffa.jpg', img: 'jaffa' },
    { id: 4, title: 'فيديو 360 طبيعة (بدون نت)', type: 'VR Video', video: '/videos/nature.mp4', img: 'nature' }
  ];

  if (currentView === 'splash') {
    return <SplashScreen onFinish={() => setCurrentView('app')} />;
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
          <ARExperience onClose={() => setIsDailyChallengeOpen(false)} />
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

          {/* Profile Switcher */}
          <button 
            onClick={() => setIsParentMode(!isParentMode)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold transition-all border shadow-sm cursor-pointer hover:shadow-md",
              isParentMode ? "bg-brand-deep text-white border-brand-deep" : "bg-white text-brand-deep border-brand-deep/10"
            )}
          >
            <User size={16} />
            <span className="leading-none pt-0.5">{isParentMode ? 'طفل' : 'أهل'}</span>
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
                    onClick={() => setActiveTab('experiences')}
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
                className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-brand-deep/5 relative overflow-hidden cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-serif font-bold text-brand-deep group-hover:text-brand-bright transition-colors">تحدي المعلومات السريع</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-brand-cream rounded-full text-[8px] font-bold text-brand-deep">أسئلة</span>
                    <span className="px-3 py-1 bg-brand-cream rounded-full text-[8px] font-bold text-brand-deep">تفاعلي</span>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center text-brand-deep opacity-80 shadow-inner">
                      <HelpCircle size={24} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-1 mt-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-deep" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-deep/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-deep/20" />
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-brand-gold/10 rounded-full blur-xl group-hover:bg-brand-gold/20 transition-all" />
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
                  label="تطبيقات أخرى" 
                  icon={Settings} 
                  color="bg-gradient-to-br from-orange-400 to-orange-500" 
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
                      onClick={() => setIsDailyChallengeOpen(true)}
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
              </div>
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-deep">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
                <h2 className="text-2xl font-serif font-bold text-brand-deep">رحلات مرئية</h2>
              </div>
              <div className="space-y-6">
                {[
                  { title: 'جولة في المسجد الأقصى', time: '15:20', views: '1.2k' },
                  { title: 'تاريخ مدينة عكا', time: '10:45', views: '850' },
                  { title: 'جمال الطبيعة في الجليل', time: '08:30', views: '2.1k' },
                ].map((vid, i) => (
                  <div key={i} onClick={() => setSelectedVideo(vid)} className="bg-white rounded-[2.5rem] overflow-hidden shadow-soft border border-brand-deep/5 cursor-pointer">
                    <div className="aspect-video bg-brand-deep/10 relative flex items-center justify-center group">
                      <img src={`https://picsum.photos/seed/vid${i}/600/400`} alt={vid.title} className="absolute inset-0 w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                      <div className="w-16 h-16 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-brand-deep group-hover:scale-110 transition-transform relative z-10">
                        <Play size={24} fill="currentColor" />
                      </div>
                      <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 text-white text-[8px] font-bold rounded-md">
                        {vid.time}
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-brand-deep">{vid.title}</h3>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-brand-black/40">
                        <Info size={10} />
                        <span>{vid.views} مشاهدة</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
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
                <MapComponent onStartTour={(place) => {
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
                  <div className="w-24 h-24 rounded-[2.5rem] bg-brand-deep border-4 border-white shadow-2xl flex items-center justify-center text-white text-3xl font-bold">
                    أ
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-gold rounded-2xl border-4 border-white flex items-center justify-center text-brand-deep shadow-lg">
                    <Medal size={20} />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-deep">أحمد المستكشف</h2>
                  <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">عضو منذ مارس 2024</p>
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
                <button className="w-full py-3 bg-white text-brand-deep rounded-2xl text-xs font-bold">تعديل الإعدادات</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
