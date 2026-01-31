
import React, { useState, useRef, useEffect } from 'react';
import { Case, Suspect, Evidence } from '../types';
import { 
  Trophy, 
  Scale, 
  X, 
  Gavel, 
  Brain,
  ShieldCheck,
  Fingerprint,
  Stamp,
  Lock,
  Loader2,
  AlertCircle,
  FileSignature,
  UserCircle2,
  ShieldAlert
} from 'lucide-react';

interface Props {
  caseData: Case;
  discoveredEvidence: Evidence[];
  playerName: string;
  onSolve: (success: boolean) => void;
  onClose: () => void;
  sfxVolume: number;
}

const DeductionBoard: React.FC<Props> = ({ caseData, playerName, onSolve, onClose, sfxVolume }) => {
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [motive, setMotive] = useState('');
  const [method, setMethod] = useState('');
  const [result, setResult] = useState<'success' | 'failure' | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  
  const strikeSfx = useRef<HTMLAudioElement | null>(null);
  const paperSfx = useRef<HTMLAudioElement | null>(null);
  const typeSfx = useRef<HTMLAudioElement | null>(null);
  const stampSfx = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    strikeSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2144/2144-preview.mp3');
    paperSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1125/1125-preview.mp3');
    typeSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    stampSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1043/1043-preview.mp3');
  }, []);

  useEffect(() => {
    if (strikeSfx.current) strikeSfx.current.volume = sfxVolume * 0.8;
    if (paperSfx.current) paperSfx.current.volume = sfxVolume * 0.5;
    if (typeSfx.current) typeSfx.current.volume = sfxVolume * 0.3;
    if (stampSfx.current) stampSfx.current.volume = sfxVolume * 0.6;
  }, [sfxVolume]);

  const playTypeSound = () => {
    if (typeSfx.current) {
      typeSfx.current.currentTime = 0;
      typeSfx.current.play().catch(() => {});
    }
  };

  const isReadyForArrest = !!selectedSuspect && motive.length >= 20 && method.length >= 20;

  const handleSubmit = () => {
    if (!isReadyForArrest) return;
    setIsArchiving(true);
    strikeSfx.current?.play().catch(() => {});
    
    setTimeout(() => {
      const isCorrect = selectedSuspect === caseData.solution.criminalId;
      onSolve(isCorrect);
      setResult(isCorrect ? 'success' : 'failure');
      setIsArchiving(false);
    }, 2500);
  };

  if (result === 'success') {
    return (
      <div className="fixed inset-0 z-[250] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-700" dir="rtl">
        <div className="relative mb-8 scale-150">
            <Trophy className="w-24 h-24 text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
            <Stamp className="absolute -bottom-4 -right-4 w-12 h-12 text-red-600 animate-in zoom-in spin-in-12 duration-1000 delay-500" />
        </div>
        <h1 className="text-5xl font-black text-white mb-4 font-typewriter tracking-tighter uppercase mt-8">الـقـضـيـة مـغـلـقـة</h1>
        <p className="text-zinc-400 mb-10 max-w-lg text-lg leading-relaxed">بناءً على تقريرك الجنائي المحكم، تم إيداع الجاني السجن. مدينة {playerName} ممتنة لك.</p>
        <button onClick={() => window.location.reload()} className="px-12 py-4 bg-white text-black font-black rounded-sm hover:bg-zinc-200 transition-all shadow-2xl uppercase tracking-[0.2em]">إنهاء الجلسة</button>
      </div>
    );
  }

  if (result === 'failure') {
    return (
      <div className="fixed inset-0 z-[250] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-700" dir="rtl">
        <AlertCircle className="w-24 h-24 text-red-600 mb-8 animate-pulse" />
        <h1 className="text-5xl font-black text-white mb-4 font-typewriter tracking-tighter uppercase">اتهام باطل</h1>
        <p className="text-zinc-400 mb-10 max-w-lg text-lg leading-relaxed">تقريرك لم يكن مقنعاً أو أنك استهدفت الشخص الخطأ. الجاني لا يزال يتجول في الظلال.</p>
        <button onClick={() => setResult(null)} className="px-12 py-4 bg-red-600 text-white font-black rounded-sm hover:bg-red-700 transition-all shadow-2xl uppercase tracking-[0.2em]">مراجعة التقرير</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-[#050505] flex flex-col overflow-hidden" dir="rtl">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.1),transparent)]" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <header className="z-10 px-10 py-6 border-b border-white/5 bg-black/80 backdrop-blur-2xl flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-sm">
            <Scale size={24} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-typewriter tracking-tighter uppercase">وحدة أرشفة الجرائم الكبرى</h2>
            <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              <span>المحقق: {playerName}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="text-red-600 animate-pulse">تقرير قيد التحرير</span>
            </div>
          </div>
        </div>
        <button onClick={() => { paperSfx.current?.play(); onClose(); }} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full">
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar-red z-10 p-8 space-y-12">
        
        <section className="max-w-6xl mx-auto space-y-6">
           <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <UserCircle2 size={20} className="text-red-600" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">تـحـديـد الـمـجـرم الـمـطـلـوب</h3>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {caseData.suspects.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => { stampSfx.current?.play(); setSelectedSuspect(s.id); }}
                  className={`relative p-3 border rounded-sm transition-all duration-500 cursor-pointer group flex flex-col gap-4 overflow-hidden ${selectedSuspect === s.id ? 'border-red-600 bg-red-600/10 shadow-[0_0_25px_rgba(220,38,38,0.2)] scale-[1.03]' : 'border-white/5 bg-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                >
                  <div className="relative aspect-square grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={s.portraitUrl} className="w-full h-full object-cover rounded-sm border border-white/10" />
                    {selectedSuspect === s.id && (
                      <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center animate-in zoom-in duration-300">
                         <div className="rotate-[-12deg] border-4 border-red-600 px-4 py-1 text-red-600 font-black text-xl uppercase tracking-tighter shadow-2xl">GUILTY</div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                      <p className="font-bold text-white text-xs uppercase font-typewriter truncate">{s.name}</p>
                      <p className="text-[8px] text-zinc-500 font-black uppercase mt-1 tracking-widest">{s.role}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

        <main className="max-w-4xl mx-auto pb-20">
           <div className="bg-[#e2d1b0] p-12 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,1)] border border-[#c4a484] relative forensic-folder-texture text-zinc-900 animate-in slide-in-from-bottom-12 duration-1000 overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-[#8b4513]/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08] rotate-[-35deg] border-[20px] border-red-800 p-10 flex flex-col items-center">
                  <h1 className="text-9xl font-black text-red-800 uppercase tracking-widest font-typewriter">TOP SECRET</h1>
                  <h1 className="text-8xl font-black text-red-800 uppercase tracking-widest font-typewriter mt-4">سري للغاية</h1>
              </div>

              <div className="border-b-4 border-zinc-900 pb-8 mb-12 flex justify-between items-end relative z-10">
                  <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <ShieldAlert size={24} className="text-red-800" />
                         <h2 className="text-4xl font-black font-typewriter uppercase tracking-tighter text-[#2b1b17]">مـحـضـر اتـهـام رسـمـي</h2>
                      </div>
                      <div className="flex gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5 font-mono"><ShieldCheck size={14} className="text-red-900" /> ملف جـنـائـي: #DF-{caseData.id.split('-').pop()}</span>
                          <span className="flex items-center gap-1.5">تحرير: {new Date().toLocaleDateString('ar-EG')}</span>
                      </div>
                  </div>
                  <div className="text-right border-4 border-red-800 p-2 rotate-2 opacity-80">
                      <p className="text-[10px] text-red-800 font-black uppercase">CONFIDENTIAL</p>
                      <p className="text-[8px] text-red-800 font-black uppercase tracking-widest">خاص ومقيد</p>
                  </div>
              </div>

              <div className="space-y-12 relative z-10">
                  <div className="flex gap-10 items-start p-8 bg-black/5 border-l-8 border-red-900 shadow-xl backdrop-blur-sm">
                     <div className="w-44 aspect-square bg-[#dcd0b0] border-2 border-zinc-400 relative overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg">
                        {selectedSuspect ? (
                          <div className="relative w-full h-full">
                            <img 
                              src={caseData.suspects.find(s => s.id === selectedSuspect)?.portraitUrl} 
                              className="w-full h-full object-cover animate-in fade-in duration-500 grayscale sepia-[0.3]" 
                            />
                            <div className="absolute inset-0 border-[10px] border-transparent shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 opacity-10">
                             <Fingerprint size={50} />
                             <span className="text-[8px] font-black uppercase">قيد التعرف</span>
                          </div>
                        )}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-zinc-400/50 rounded-full" />
                     </div>
                     <div className="flex-1 space-y-5">
                        <div className="relative">
                          <span className="text-[9px] font-black text-red-900 uppercase tracking-widest block mb-2">الاسم الكامل للمشتبه به الأول</span>
                          <h4 className="text-4xl font-black font-typewriter uppercase border-b-2 border-zinc-800/20 pb-2 text-[#3e2723]">
                            {selectedSuspect ? caseData.suspects.find(s => s.id === selectedSuspect)?.name : '................................'}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-700 leading-relaxed font-serif-detective italic font-bold">
                          بموجب الصلاحيات الممنوحة لي كمحقق جنائي، أؤكد تورط الشخص أعلاه في القضية رقم {caseData.id} بناءً على الاستنتاجات الفنية الواردة أدناه.
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <section className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-zinc-900/10 pb-2">
                             <Brain size={18} className="text-red-900" />
                             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">تحليل الدوافع (MOTIVE)</h4>
                          </div>
                          <div className="relative">
                            <textarea 
                                value={motive}
                                onKeyDown={playTypeSound}
                                onChange={(e) => setMotive(e.target.value)}
                                className="w-full h-56 bg-white/40 border-b-2 border-zinc-800/20 focus:border-red-900 focus:outline-none p-6 text-2xl font-serif-detective leading-relaxed text-[#2b1b17] resize-none transition-all placeholder:text-zinc-400"
                                placeholder="لماذا أقدم على ارتكاب الجريمة؟..."
                            />
                            <div className="absolute bottom-2 right-2 opacity-[0.05] pointer-events-none"><Stamp size={48} /></div>
                          </div>
                      </section>

                      <section className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-zinc-900/10 pb-2">
                             <Gavel size={18} className="text-red-900" />
                             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">آلية الجريمة (MODUS OPERANDI)</h4>
                          </div>
                          <div className="relative">
                            <textarea 
                                value={method}
                                onKeyDown={playTypeSound}
                                onChange={(e) => setMethod(e.target.value)}
                                className="w-full h-56 bg-white/40 border-b-2 border-zinc-800/20 focus:border-red-900 focus:outline-none p-6 text-2xl font-serif-detective leading-relaxed text-[#2b1b17] resize-none transition-all placeholder:text-zinc-400"
                                placeholder="كيف تم تنفيذ الجريمة وما هي الأدلة؟..."
                            />
                            <div className="absolute bottom-2 right-2 opacity-[0.05] pointer-events-none"><FileSignature size={48} /></div>
                          </div>
                      </section>
                  </div>

                  <div className="pt-20 mt-16 border-t-4 border-zinc-900 flex flex-col items-center gap-10 text-center relative z-20">
                      <div className="absolute -top-10 left-10 opacity-10 rotate-12"><Stamp size={100} className="text-red-900" /></div>
                      
                      <div className="relative w-full md:w-auto">
                          {isArchiving ? (
                              <div className="px-16 py-10 bg-zinc-950 text-white flex items-center gap-8 shadow-2xl animate-in zoom-in duration-300 border-2 border-red-800">
                                  <Loader2 className="animate-spin text-red-600" size={40} />
                                  <div className="flex flex-col text-right">
                                     <span className="text-sm font-black uppercase tracking-widest text-red-500">جـاري خـتـم الـمـلـف...</span>
                                     <span className="text-[10px] text-zinc-500 font-mono">ENCRYPTING EVIDENCE LOGS...</span>
                                  </div>
                              </div>
                          ) : (
                              <button 
                                  onClick={handleSubmit}
                                  onMouseEnter={() => paperSfx.current?.play()}
                                  disabled={!isReadyForArrest}
                                  className={`
                                      px-24 py-12 font-black text-lg uppercase tracking-[0.5em] transition-all duration-500 shadow-2xl relative overflow-hidden flex items-center justify-center gap-8
                                      ${isReadyForArrest 
                                          ? 'bg-red-800 text-white hover:bg-red-900 active:scale-95 animate-button-glow cursor-pointer border-4 border-red-600' 
                                          : 'bg-zinc-800/10 text-zinc-400 grayscale cursor-not-allowed border-2 border-zinc-400/20'
                                      }
                                  `}
                              >
                                  {isReadyForArrest ? <Gavel size={32} /> : <Lock size={24} className="opacity-30" />}
                                  <span>إصـدار أمـر الـتـوقـيـف</span>
                              </button>
                          )}
                          
                          {!isReadyForArrest && (selectedSuspect || motive.length > 5) && (
                            <div className="absolute -bottom-20 left-0 w-full flex flex-col items-center gap-3 opacity-80 animate-in fade-in">
                               <div className="flex justify-between w-full text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                  <span>جاهزية الملف الجنائي</span>
                                  <span>{Math.min(100, (selectedSuspect ? 33 : 0) + (Math.min(33, motive.length)) + (Math.min(34, method.length)))}%</span>
                               </div>
                               <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden border border-black/5">
                                  <div 
                                    className="h-full bg-red-800 transition-all duration-700 shadow-[0_0_15px_rgba(153,27,27,0.8)]" 
                                    style={{ width: `${Math.min(100, (selectedSuspect ? 33 : 0) + (Math.min(33, motive.length)) + (Math.min(34, method.length)))}%` }}
                                  />
                               </div>
                            </div>
                          )}
                      </div>
                  </div>
              </div>
           </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes button-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(153,27,27,0.4); }
          50% { box-shadow: 0 0 70px rgba(153,27,27,0.8); }
        }
        .animate-button-glow { animation: button-glow 2s ease-in-out infinite; }
        .forensic-folder-texture {
            background-color: #e2d1b0;
            background-image: 
                url('https://www.transparenttextures.com/patterns/old-paper.png'),
                radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
            box-shadow: inset 0 0 100px rgba(0,0,0,0.1), 0 20px 80px rgba(0,0,0,0.5);
        }
      `}} />
    </div>
  );
};

export default DeductionBoard;
