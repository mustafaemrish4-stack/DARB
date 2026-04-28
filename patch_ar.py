import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Define boundaries
start_marker = "const ARExperience = ({ onClose }: { onClose: () => void }) => {"
end_marker = "const QuizGame = ({ onClose }: { onClose: () => void }) => {"

# AR Experience new block
new_ar = """const ARExperience = ({ onClose }: { onClose: () => void }) => {
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

"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_ar + content[end_idx:]
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Patched successfully!")
else:
    print("Could not find boundaries")
