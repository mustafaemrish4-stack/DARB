import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix VirtualTour places array
correct_places = """const places = [
      { name: 'جولة القدس 360', image: '/360/jerusalem.jpg' },
      { name: 'نابلس 360', image: '/360/nablus.jpg' },
      { name: 'يافا 360', image: '/360/jaffa.jpg' },
      { name: 'فيديو الطبيعة', video: '/videos/nature.mp4' },
    ];"""

# Find the places array inside VirtualTour
text = re.sub(r'const places = \[.*?\];', correct_places, text, flags=re.DOTALL)

# 2. Fix aframe script imports in VirtualTour to be local
local_script_vt = """useEffect(() => {
      if (!document.getElementById('aframe-script')) {
        const script = document.createElement('script');
        script.id = 'aframe-script';
        script.src = '/aframe.min.js';
        document.head.appendChild(script);
      }
    }, []);"""

text = re.sub(r'useEffect\(\(\) => \{\n\s*if \(\!document\.getElementById\(\'aframe-script\'\)\).*?\n\s*\}, \[\]\);', local_script_vt, text, flags=re.DOTALL)


# 3. Rewrite ARExperience completely to use AR.js for Universal Camera Support
# We find everything from "const ARExperience = ({ onClose" to "const QuizGame = ({ onClose"
start_match = "const ARExperience = ({ onClose"
end_match = "const QuizGame = ({ onClose"

start_idx = text.find(start_match)
end_idx = text.find(end_match)

new_ar_experience = """const ARExperience = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const loadAR = async () => {
      if (!document.getElementById('aframe-script')) {
        const afScript = document.createElement('script');
        afScript.id = 'aframe-script';
        afScript.src = '/aframe.min.js';
        document.head.appendChild(afScript);
      }
      setTimeout(() => {
        if (!document.getElementById('arjs-script')) {
             const arScript = document.createElement('script');
             arScript.id = 'arjs-script';
             arScript.src = '/aframe-ar.js';
             document.head.appendChild(arScript);
        }
      }, 500);
    };
    loadAR();
    
    // Stop AR stream when closing
    return () => {
       window.location.reload(); // Quick fix to stop AR.js camera stream tracking exactly
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col"
    >
      <header className="p-6 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10 absolute top-0 left-0 right-0 z-20">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-md transition-all">
          <ChevronLeft size={20} className="rotate-180" />
        </button>
        <div className="text-center pointer-events-none">
          <h3 className="font-serif font-bold text-white shadow-black drop-shadow-md leading-none">كاميرا الواقع المعزز (AR)</h3>
          <span className="text-[10px] font-bold text-brand-gold uppercase mt-1.5 block tracking-widest shadow-black drop-shadow-md">تعمل بدون إنترنت (محلي)</span>
        </div>
        <div className="w-10 h-10" />
      </header>

      <div className="flex-1 relative bg-transparent overflow-hidden">
        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: `
          <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;" vr-mode-ui="enabled: false">
            <a-entity position="0 0 -3">
               <a-box position="-1 0.5 0" rotation="0 45 0" color="#4CC9F0" animation="property: rotation; to: 0 405 0; loop: true; dur: 3000"></a-box>
               <a-sphere position="0 1.25 -2" radius="1.25" color="#F72585" animation="property: position; dir: alternate; to: 0 1.5 -2; loop: true; dur: 2000"></a-sphere>
               <a-cylinder position="1 0.75 -1" radius="0.5" height="1.5" color="#FFDE59" animation="property: scale; dir: alternate; to: 1.2 1.2 1.2; loop: true; dur: 1000"></a-cylinder>
               <a-text value="VR WORLD" position="-1.5 2.5 0" color="white" scale="1.5 1.5 1.5"></a-text>
            </a-entity>
            <a-camera position="0 1.6 0"></a-camera>
          </a-scene>
        `}} />
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20 pointer-events-none">
         <span className="bg-black/80 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur-md font-bold text-sm text-center shadow-2xl" dir="rtl">قم بتوجيه الكاميرا للأرجاء لترى الأشكال التفاعلية أمامك.</span>
      </div>
    </motion.div>
  );
};

"""

if start_idx != -1 and end_idx != -1:
    text = text[:start_idx] + new_ar_experience + text[end_idx:]

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patch applied to App.tsx")

