import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, AlertCircle, ChevronLeft, ShieldCheck, Users, Gamepad2 } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './lib/firebase';

interface AuthViewProps {
  onLoginSuccess: (role: 'parent' | 'child') => void;
}

export const AuthView = ({ onLoginSuccess }: AuthViewProps) => {
  const [step, setStep] = useState<'role_selection' | 'login' | 'signup'>('role_selection');
  const [selectedRole, setSelectedRole] = useState<'parent' | 'child' | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock login fallback if Firebase keys are missing
  const handleMockLogin = () => {
    onLoginSuccess(selectedRole || 'child');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      // Fallback for demo without keys
      handleMockLogin();
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      if (step === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess(selectedRole || 'child');
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء المصادقة");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      handleMockLogin();
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      onLoginSuccess(selectedRole || 'child');
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول بحساب جوجل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-cream z-[500] flex flex-col justify-center px-6 overflow-y-auto" dir="rtl">
      
      {/* Dynamic Header */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="text-center mb-10 mt-10"
        >
          {step !== 'role_selection' && (
            <button 
              onClick={() => setStep('role_selection')} 
              className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-deep"
            >
              <ChevronLeft size={24} className="rotate-180" />
            </button>
          )}

          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <img src="/icon_perfect.png" alt="Darb Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-deep mb-2">
            {step === 'role_selection' ? 'من يستخدم درب؟' : 
             step === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
          <p className="text-sm text-brand-black/50 font-bold">
            {step === 'role_selection' ? 'اختر هويتك لنخصص لك التجربة' : 'مرحباً بك في عالم درب الميتافيرسي'}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'role_selection' ? (
          <motion.div 
            key="roles"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4 max-w-sm mx-auto w-full"
          >
            <button 
              onClick={() => { setSelectedRole('parent'); setStep('login'); }}
              className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] border-2 border-brand-deep/10 hover:border-brand-deep shadow-soft transition-all text-center group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-gold/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative flex flex-col items-center">
                <div className="h-16 mb-5 group-hover:scale-110 transition-transform">
                  <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f468-200d-1f469-200d-1f467-200d-1f466.svg" alt="عائلة" className="h-full drop-shadow-md" />
                </div>
                <h2 className="text-3xl font-bold text-brand-deep mb-2">أنا ولي الأمر</h2>
                <span className="text-sm text-brand-black/50 font-bold bg-brand-deep/5 px-4 py-1.5 rounded-full">متابعة الأداء والتحكم</span>
              </div>
            </button>

            <button 
              onClick={() => { setSelectedRole('child'); setStep('login'); }}
              className="relative overflow-hidden bg-[#F2FAF5] p-8 rounded-[2.5rem] border-2 border-[#31885F]/20 hover:border-[#31885F] shadow-soft transition-all text-center group mt-2"
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#31885F]/20 to-transparent rounded-full translate-y-16 -translate-x-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative flex flex-col items-center">
                <div className="h-16 flex justify-center gap-1 mb-5 group-hover:scale-110 transition-transform">
                  <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f467.svg" alt="طفلة" className="h-full drop-shadow-md" />
                  <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f466.svg" alt="طفل" className="h-full drop-shadow-md" />
                </div>
                <h2 className="text-3xl font-bold text-brand-deep mb-2">أنا بطل اللعبة</h2>
                <span className="text-sm text-[#31885F] font-bold bg-[#31885F]/10 px-4 py-1.5 rounded-full">المغامرات واللعب (6-12 سنة)</span>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-sm mx-auto w-full bg-white p-8 rounded-[2rem] shadow-soft"
          >
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2 mb-6">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="relative">
                <Mail size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-deep/40" />
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-cream/50 py-4 pr-12 pl-4 rounded-xl text-sm font-bold text-brand-deep outline-none focus:ring-2 focus:ring-brand-deep/20 transition-all"
                />
              </div>

              <div className="relative">
                <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-deep/40" />
                <input 
                  type="password" 
                  placeholder="كلمة المرور" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-cream/50 py-4 pr-12 pl-4 rounded-xl text-sm font-bold text-brand-deep outline-none focus:ring-2 focus:ring-brand-deep/20 transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-deep text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-deep/30 hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {loading ? 'جاري التحميل...' : (step === 'login' ? 'دخول آمن' : 'إنشاء حساب')}
                <ShieldCheck size={18} />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-black/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-bold text-brand-black/40">أو</span>
              </div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-brand-black/5 text-brand-deep py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-brand-cream/50 transition-colors mb-6 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              المتابعة باستخدام Google
            </button>

            <div className="text-center text-xs font-bold">
              <span className="text-brand-black/50">
                {step === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
              </span>
              <button 
                onClick={() => setStep(step === 'login' ? 'signup' : 'login')}
                className="text-[#31885F] underline underline-offset-4"
              >
                {step === 'login' ? 'سجل الآن' : 'تسجيل الدخول'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
