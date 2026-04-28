import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_card = """{/* Information Challenge Card */}
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
                <div className="grid grid-cols-2"""

# Replacing
content = re.sub(r'\{\/\* Information Challenge Card \*\/\}.*?(?=\{\/\* Action Grid \*\/\}|<div className="grid grid-cols-2)', new_card, content, flags=re.DOTALL)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated App.tsx successfully")
