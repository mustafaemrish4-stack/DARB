import re
import os

with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Experiences Array
exp_pattern = r"(const experiences = \[.*?(?=];)\];)"
new_exp = """const experiences = [
    { id: 1, title: 'جولة القدس 360', type: 'VR 360', image: '/360/jerusalem.jpg', img: 'jerusalem' },
    { id: 2, title: 'نابلس 360', type: 'VR 360', image: '/360/nablus.jpg', img: 'nablus' },
    { id: 3, title: 'يافا 360', type: 'VR 360', image: '/360/jaffa.jpg', img: 'jaffa' },
    { id: 4, title: 'فيديو الطبيعة والديناصورات', type: 'VR Video', video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', img: 'nature' }
  ];"""
content = re.sub(r"const experiences = \[.*?(?=];)\];", new_exp, content, flags=re.DOTALL)

# 2. Update VirtualTour rendering to support video
tour_render_pattern = r"<a-sky src=\{selectedPlace\.image\} rotation=\"0 -90 0\"></a-sky>"
new_tour_render = """{selectedPlace.video ? (
              // @ts-ignore
              <a-videosphere src={selectedPlace.video} rotation="0 -90 0" autoPlay loop></a-videosphere>
            ) : (
              // @ts-ignore
              <a-sky src={selectedPlace.image} rotation="0 -90 0"></a-sky>
            )}"""
content = content.replace(tour_render_pattern, new_tour_render)

# 3. Restructure the 'experiences' Tab UI completely!
exp_tab_start = content.find("{activeTab === 'experiences' && (")
exp_tab_end_search = "{activeTab === 'games' && ("
exp_tab_end = content.find(exp_tab_end_search)

new_exp_tab = """{activeTab === 'experiences' && (
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

            """

if exp_tab_start != -1 and exp_tab_end != -1:
    content = content[:exp_tab_start] + new_exp_tab + content[exp_tab_end:]

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("UI Fixed Successfully!")
