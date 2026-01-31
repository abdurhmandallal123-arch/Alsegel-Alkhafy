
import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Terminal, Fingerprint, ChevronRight } from 'lucide-react';

interface Props {
  onComplete: () => void;
  language: 'ar' | 'en' | 'tr';
  sfxVolume: number;
}

const WelcomeSplash: React.FC<Props> = ({ onComplete, language, sfxVolume }) => {
  const [displayText, setDisplayText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const typeAudio = useRef<HTMLAudioElement | null>(null);
  const glitchAudio = useRef<HTMLAudioElement | null>(null);

  const createAudio = (url: string) => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = url;
    audio.onerror = () => { audio.src = ''; };
    return audio;
  };

  // نصوص عربية قوية ومختصرة لسرعة التحميل
  const strings = [
    "جاري تشغيل النظام الجنائي...",
    "العدالة لا تنام، والظلال تخفي الحقيقة.",
    "مرحباً بك في وحدة السجل الخفي.",
    "بانتظار أوامرك، أيها المحقق."
  ];

  const fullText = strings.join('\n');

  useEffect(() => {
    typeAudio.current = createAudio('https://assets.mixkit.co/active_storage/sfx/2560/2560-preview.mp3');
    glitchAudio.current = createAudio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    
    if (typeAudio.current) typeAudio.current.volume = sfxVolume * 0.3;
    if (glitchAudio.current) glitchAudio.current.volume = sfxVolume * 0.2;

    let currentIdx = 0;
    // تسريع الكتابة بشكل كبير (20ms بدلاً من 50ms)
    const typingInterval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDisplayText(prev => prev + fullText[currentIdx]);
        if (fullText[currentIdx] !== ' ' && fullText[currentIdx] !== '\n') {
          if (typeAudio.current && typeAudio.current.src) {
            typeAudio.current.currentTime = 0;
            typeAudio.current.play().catch(() => {});
          }
        }
        currentIdx++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowButton(true), 200); // ظهور الزر فور انتهاء الكتابة
      }
    }, 20);

    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      if (glitchAudio.current && glitchAudio.current.src) {
        glitchAudio.current.currentTime = 0;
        glitchAudio.current.play().catch(() => {});
      }
      setTimeout(() => setIsGlitching(false), 100);
    }, 3000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(glitchInterval);
    };
  }, [fullText, sfxVolume]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-8 overflow-hidden font-sans" dir="rtl">
      {/* خلفية تقنية متطورة */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-red-950/20 pointer-events-none" />
      
      <div className={`relative max-w-2xl w-full transition-all duration-300 ${isGlitching ? 'translate-x-1 skew-x-2 opacity-80' : ''}`}>
        <div className="flex items-center gap-6 mb-12 border-b border-red-600/30 pb-8">
          <div className="w-16 h-16 bg-red-600 flex items-center justify-center rounded-sm animate-pulse shadow-[0_0_40px_rgba(220,38,38,0.6)]">
            <ShieldAlert size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-typewriter">
              نظام الاستخبارات <span className="text-red-600">الجنائي</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] text-emerald-500 font-black tracking-widest">تم إنشاء اتصال آمن ومحمي</span>
            </div>
          </div>
        </div>

        {/* مساحة النص بتأثير الكتابة */}
        <div className="min-h-[160px] text-zinc-300 whitespace-pre-wrap leading-relaxed text-xl font-typewriter">
          {displayText}
          <span className="inline-block w-2 h-6 bg-red-600 mr-2 animate-pulse" />
        </div>

        {showButton && (
          <div className="mt-12 animate-in fade-in zoom-in duration-500">
            <button 
              onClick={() => {
                if (glitchAudio.current && glitchAudio.current.src) {
                  glitchAudio.current.play().catch(() => {});
                }
                onComplete();
              }}
              className="group flex items-center gap-6 bg-white text-black px-10 py-5 rounded-sm hover:bg-red-600 hover:text-white transition-all duration-500 shadow-[0_0_60px_rgba(255,255,255,0.1)] active:scale-95"
            >
              <Fingerprint size={32} className="group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-2xl font-black uppercase tracking-[0.1em]">بـدء الـتـحـقـيـق</span>
              <ChevronRight size={24} className="rotate-180 group-hover:-translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* معلومات تقنية معربة في الأسفل */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-1 opacity-30 text-right">
        <div className="flex items-center gap-2 justify-end">
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">رقم الوحدة: 8821-X</span>
          <Terminal size={12} className="text-zinc-500" />
        </div>
        <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">حالة النواة: نشطة</div>
      </div>
    </div>
  );
};

export default WelcomeSplash;
