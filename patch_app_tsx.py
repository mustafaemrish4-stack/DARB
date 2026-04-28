import re
import os

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add imports at the very top (after React imports)
imports_to_add = """
import { AITutorContent } from './AITutorContent';
import { VideosView } from './VideosView';
// Extracted modules imported successfully
"""
text = text.replace('import { cn } from "./lib/utils";', 'import { cn } from "./lib/utils";\n' + imports_to_add)

# 2. Fix the Map Component to point to Local 360s instead of Picsum
map_fix = """
    const cities = [
      { 
        name: 'القدس', 
        pos: [31.7683, 35.2137], 
        desc: 'زهرة المدائن وعاصمة فلسطين',
        tour: { name: 'القدس 360', image: '/360/jerusalem.jpg' }
      },
      { 
        name: 'يافا', 
        pos: [32.0517, 34.7500], 
        desc: 'عروس البحر المتوسط',
        tour: { name: 'يافا 360', image: '/360/jaffa.jpg' }
      },
      { 
        name: 'غزة', 
        pos: [31.5017, 34.4667], 
        desc: 'مدينة هاشم والصمود',
        tour: { name: 'غزة 360', image: '/360/gaza.jpg' }
      },
      { 
        name: 'نابلس', 
        pos: [32.2211, 35.2544], 
        desc: 'جبل النار العظيم',
        tour: { name: 'نابلس 360', image: '/360/nablus.jpg' }
      },
      { 
        name: 'المسجد الأقصى (360)', 
        pos: [31.7761, 35.2358], 
        desc: 'أولى القبلتين (تجربة 360)',
        tour: { name: 'المسجد الأقصى (صورة)', image: '/360/alaqsa.jpg' }
      },
      { 
        name: 'المسجد الأقصى (فيديو)', 
        pos: [31.7761, 35.2340], 
        desc: 'أولى القبلتين (فيديو حي)',
        tour: { name: 'المسجد الأقصى (فيديو)', video: '/videos/alaqsa.mp4' }
      }
    ];"""

# Replace cities array in MapComponent
text = re.sub(r'const cities = \[.*?\];', map_fix, text, flags=re.DOTALL)

# 3. Completely replace the `activeTab === 'experiences'` block to use VideosView
# Wait, experiences was previously using massive inline HTML
experiences_rx = r'\{activeTab === \'experiences\' && \(\s*<motion\.div\s*key="experiences".*?</motion\.div>\s*\)\}'
experiences_replacement = """{activeTab === 'experiences' && (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-[calc(100vh-200px)]"
              >
                <VideosView onBack={() => setActiveTab('home')} />
              </motion.div>
            )}"""
text = re.sub(experiences_rx, experiences_replacement, text, flags=re.DOTALL)

# 4. Replace `activeTab === 'ai'` to use our new Component
ai_rx = r'\{activeTab === \'ai\' && \(\s*<motion\.div\s*key="ai".*?</motion\.div>\s*\)\}'
ai_replacement = """{activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[calc(100vh-200px)] pt-6 pb-24"
              >
                 <AITutorContent isFullPage={true} onClose={() => setActiveTab('home')} />
              </motion.div>
            )}"""
text = re.sub(ai_rx, ai_replacement, text, flags=re.DOTALL)

# 5. Remove the inline ARExperience, VirtualTour, and AITutorContent from App.tsx since we extracted them!
text = re.sub(r'const AITutorContent = \(\{.*?\}\);', '', text, flags=re.DOTALL)
text = re.sub(r'const ARExperience = \(\{.*?\}\);', '', text, flags=re.DOTALL)
text = re.sub(r'const VirtualTour = \(\{.*?\}\);', '', text, flags=re.DOTALL)

# Write modified text back
with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("App.tsx dynamically patched successfully.")

