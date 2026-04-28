import sys

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add imports at the very top
imports_to_add = """
import { AITutorContent as GenericAITutor } from './AITutorContent';
import { VideosView } from './VideosView';
"""
if "import { VideosView }" not in text:
    text = text.replace('import { cn } from "./lib/utils";', 'import { cn } from "./lib/utils";\n' + imports_to_add)

# 2. Fix the Map Component
# Find the cities array exactly
old_cities = """const cities = [
      { 
        name: 'القدس', 
        pos: [31.7683, 35.2137], 
        desc: 'زهرة المدائن وعاصمة فلسطين التاريخية والدينية.',
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
        desc: 'عروس البحر ومدينة برتقال التاريخية.',
        photos: [
          'https://picsum.photos/seed/jaffa1/400/300',
          'https://picsum.photos/seed/jaffa2/400/300'
        ],
        tour: { name: 'ميناء يافا العتيق', lat: 32.0517, lng: 34.7500, heading: 180 }
      },
      { 
        name: 'حيفا', 
        pos: [32.7940, 34.9896], 
        desc: 'عروس الكرمل وملكة الشمال الفلسطيني.',
        photos: [
          'https://picsum.photos/seed/haifa1/400/300',
          'https://picsum.photos/seed/haifa2/400/300'
        ],
        tour: { name: 'جبل الكرمل', lat: 32.7940, lng: 34.9896, heading: 0 }
      },
      { 
        name: 'نابلس', 
        pos: [32.2211, 35.2544], 
        desc: 'جبل النار العظيم ومدينة الكنافة.',
        photos: [
          'https://picsum.photos/seed/nablus1/400/300'
        ],
        tour: { name: 'نابلس القديمة', lat: 32.2211, lng: 35.2544, heading: 0 }
      },
      { 
        name: 'غزة', 
        pos: [31.5017, 34.4667], 
        desc: 'مدينة هاشم والصمود.',
        photos: [
          'https://picsum.photos/seed/gaza1/400/300'
        ],
        tour: { name: 'شاطئ غزة', lat: 31.5017, lng: 34.4667, heading: 0 }
      }
    ];"""

new_cities = """const cities = [
      { 
        name: 'القدس', 
        pos: [31.7683, 35.2137], 
        desc: 'زهرة المدائن وعاصمة فلسطين',
        photos: [],
        tour: { name: 'القدس 360', image: '/360/jerusalem.jpg' }
      },
      { 
        name: 'يافا', 
        pos: [32.0517, 34.7500], 
        desc: 'عروس البحر المتوسط',
        photos: [],
        tour: { name: 'يافا 360', image: '/360/jaffa.jpg' }
      },
      { 
        name: 'غزة', 
        pos: [31.5017, 34.4667], 
        desc: 'مدينة هاشم والصمود',
        photos: [],
        tour: { name: 'غزة 360', image: '/360/gaza.jpg' }
      },
      { 
        name: 'نابلس', 
        pos: [32.2211, 35.2544], 
        desc: 'جبل النار العظيم',
        photos: [],
        tour: { name: 'نابلس 360', image: '/360/nablus.jpg' }
      },
      { 
        name: 'المسجد الأقصى (360)', 
        pos: [31.7761, 35.2358], 
        desc: 'أولى القبلتين (تجربة 360)',
        photos: [],
        tour: { name: 'المسجد الأقصى (صورة)', image: '/360/alaqsa.jpg' }
      },
      { 
        name: 'المسجد الأقصى (فيديو)', 
        pos: [31.7761, 35.2340], 
        desc: 'أولى القبلتين (فيديو حي)',
        photos: [],
        tour: { name: 'المسجد الأقصى (فيديو)', video: '/videos/alaqsa.mp4' }
      }
    ];"""

text = text.replace(old_cities, new_cities)


# 3. Instead of trying to regex-replace nested jsx, we will replace the RENDERING of the tabs
# Find the switch-like statements for tabs!
exp_old = """{activeTab === 'experiences' && (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center bg-white p-4 rounded-[2rem] shadow-sm">
                  <h3 className="font-bold text-brand-deep">أين تريد أن تذهب؟</h3>
                  <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-deep">
                    <Compass size={20} />
                  </div>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => exp.action ? exp.action() : null}
                      className={cn(
                        "p-6 rounded-[2.5rem] flex items-center justify-between text-white shadow-lg cursor-pointer",
                        exp.color
                      )}
                    >"""
                    
exp_new = """{activeTab === 'experiences' && (
              <motion.div
                key="experiences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-[calc(100vh-200px)]"
              >
                  <VideosView onBack={() => setActiveTab('home')} />
{/*"""
text = text.replace(exp_old, exp_new)

# Close the comment block for experiences!
exp_end_old = """</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}"""
exp_end_new = """*/}
              </motion.div>
            )}"""
text = text.replace(exp_end_old, exp_end_new)


# Same for AI!
ai_old = """{activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 h-[calc(100vh-200px)] pt-6 pb-24"
              >
                <AITutorContent isFullPage />
              </motion.div>
            )}"""
            
ai_new = """{activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 h-[calc(100vh-200px)] pt-6 pb-24"
              >
                <GenericAITutor isFullPage onClose={() => setActiveTab('home')} />
              </motion.div>
            )}"""
text = text.replace(ai_old, ai_new)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patch applied carefully!")
