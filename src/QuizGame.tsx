import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, AlertCircle, ArrowRight, Star, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';

export const QuizGame = ({ onClose }: { onClose: () => void }) => {
    const questions = [
      {
        q: 'أين يقع المسجد الأقصى؟',
        options: ['القدس', 'عكا', 'حيفا', 'نابلس'],
        correct: 0,
        hint: 'مدينة السلام الأبدية'
      },
      {
        q: 'ما هي عاصمة فلسطين؟',
        options: ['يافا', 'القدس', 'غزة', 'جنين'],
        correct: 1,
        hint: 'زهرة المدائن'
      },
      {
        q: 'بماذا تشتهر مدينة الخليل؟',
        options: ['البحر', 'صناعة الزجاج والجلود', 'التفاح', 'الموز'],
        correct: 1,
        hint: 'صناعة يدوية قديمة وملونة'
      }
    ];

    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const handleAnswer = (index: number) => {
      setSelectedAnswer(index);
      const isCorrect = index === questions[currentQ].correct;
      
      if (isCorrect) {
        setScore(score + 10);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#31885F', '#DCA86A', '#ffffff']
        });
      }

      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ(currentQ + 1);
          setSelectedAnswer(null);
        } else {
          setShowResult(true);
          if (score >= 20) {
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#DCA86A', '#31885F', '#A61D33']
            });
          }
        }
      }, 1500);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#E5F1E3]/90 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative overflow-hidden border-4 border-white"
        >
          {/* Decorative Stars */}
          <div className="absolute top-4 left-4 text-brand-gold animate-spin-slow"><Star fill="currentColor" size={24} /></div>
          <div className="absolute top-10 right-4 text-brand-bright animate-bounce"><Heart fill="currentColor" size={20} /></div>

          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-3xl font-serif font-bold text-brand-deep">تحدي درب!</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center text-brand-deep/50 hover:bg-brand-deep hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQ}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="space-y-6 relative z-10"
              >
                {/* Progress Bar */}
                <div className="flex justify-between items-center text-sm font-bold text-brand-deep mb-2">
                  <span>السؤال {currentQ + 1} من {questions.length}</span>
                  <span className="flex items-center gap-1 text-brand-gold"><Trophy size={16} /> {score} نقطة</span>
                </div>
                <div className="w-full h-3 bg-brand-cream rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    className="h-full bg-brand-green rounded-full"
                  />
                </div>

                <div className="bg-[#E6F4EA] p-6 rounded-3xl border-2 border-brand-green border-dashed relative">
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white text-xl shadow-lg animate-bounce">🤔</div>
                  <h3 className="text-xl font-bold text-brand-deep text-center leading-relaxed">
                    {questions[currentQ].q}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 justify-center text-[10px] text-brand-green font-bold bg-white/50 py-1 px-3 rounded-full w-max mx-auto">
                    <AlertCircle size={12} /> تلميح: {questions[currentQ].hint}
                  </div>
                </div>

                <div className="space-y-3">
                  {questions[currentQ].options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={cn(
                        "w-full p-4 rounded-2xl text-right font-bold transition-all border-2 shadow-sm text-lg",
                        selectedAnswer === null ? "bg-white border-brand-deep/10 text-brand-deep hover:border-brand-deep/30" :
                        i === questions[currentQ].correct ? "bg-brand-green text-white border-brand-green shadow-brand-green/30 shadow-lg scale-105" :
                        selectedAnswer === i ? "bg-brand-bright text-white border-brand-bright" : "bg-brand-cream/50 border-transparent text-brand-black/30 opacity-50"
                      )}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8 relative z-10"
              >
                <motion.div 
                  animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-32 h-32 mx-auto bg-brand-gold/20 rounded-full flex items-center justify-center text-6xl mb-6 shadow-xl border-4 border-white"
                >
                  {score === questions.length * 10 ? '🏆' : '🌟'}
                </motion.div>
                <h3 className="text-3xl font-serif font-bold text-brand-deep mb-2">أحسنت يا بطل!</h3>
                <p className="text-brand-black/50 font-bold mb-6">لقد جمعت {score} نقطة في هذا التحدي!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full bg-brand-deep text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand-deep/30"
                >
                  العودة للرئيسية <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  };
