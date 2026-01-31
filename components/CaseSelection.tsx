
import React from 'react';
import { Case, DifficultyLevel } from '../types';
import { 
  ShieldAlert, 
  ChevronLeft,
  Skull,
  Clock,
  TrendingUp,
  Star,
  Activity,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Language } from './SettingsModal';

interface Props {
  language: Language;
  cases: Case[];
  playerName: string;
  onSelectCase: (c: Case) => void;
  onBack: () => void;
  progressMap?: Record<string, number>;
}

const CaseSelection: React.FC<Props> = ({ language, cases, playerName, onSelectCase, onBack, progressMap = {} }) => {
  
  const getDifficultyColor = (level: DifficultyLevel) => {
    switch(level) {
      case DifficultyLevel.EASY: return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
      case DifficultyLevel.MEDIUM: return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      case DifficultyLevel.HARD: return 'text-orange-500 border-orange-500/20 bg-red-600/5';
      default: return 'text-zinc-500';
    }
  };

  const t = {
    ar: { center: 'مـركـز الـعـمـلـيـات', sub: 'تـسـلـسـل الـقـضـايـا', rank: 'الرتبة الحالية', role: 'مـحـقـق مـتـدرب', id: 'الـمـعـرف', easy: 'سـهـل', medium: 'مـتـوسـط', hard: 'صـعـب', progress: 'تـقـدم الـقـضـيـة', investigation: 'تـم الـتـحـقـيـق' },
    en: { center: 'OPERATIONS CENTER', sub: 'CASE SEQUENCE', rank: 'CURRENT RANK', role: 'TRAINEE DETECTIVE', id: 'IDENTIFIER', easy: 'EASY', medium: 'MEDIUM', hard: 'HARD', progress: 'CASE PROGRESS', investigation: 'SOLVED' },
    tr: { center: 'OPERASYON MERKEZİ', sub: 'DAVA SIRALAMASI', rank: 'MEVCUT RÜTBE', role: 'STAJYER DEDEKTİF', id: 'KİMLİK', easy: 'KOLAY', medium: 'ORTA', hard: 'ZOR', progress: 'DAVA İLERLEMESİ', investigation: 'ÇÖZÜLDÜ' }
  }[language];

  const isRTL = language === 'ar';

  return (
    <div className="h-screen w-screen bg-[#050505] flex flex-col overflow-hidden relative z-[60] selection-none" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <header className="px-12 py-8 flex justify-between items-center border-b border-white/5 bg-black/60 backdrop-blur-3xl z-20">
        <div className="flex items-center gap-8">
          <button 
            onClick={onBack}
            className={`w-12 h-12 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all rounded-full border border-white/5 ${!isRTL ? 'rotate-180' : ''}`}
          >
            <ChevronLeft size={28} />
          </button>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className={`flex items-center gap-3 mb-1 ${!isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp size={16} className="text-red-600" />
              <h2 className="text-3xl font-black text-white uppercase font-typewriter tracking-tighter">{t.center}</h2>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">{t.sub}</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className={isRTL ? 'text-right' : 'text-left'}>
             <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{t.rank}</p>
             </div>
             <p className="text-xl font-bold text-white font-mono uppercase tracking-tighter">{t.role}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className={isRTL ? 'text-right' : 'text-left'}>
             <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">{t.id}</p>
             <p className="text-xl font-bold text-red-600 font-mono tracking-tighter uppercase">{playerName}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar-red relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-16 relative">
            <div className={`absolute top-0 w-[2px] h-full bg-gradient-to-b from-red-900/40 via-zinc-800/20 to-transparent hidden lg:block ${isRTL ? 'right-1/2 -mr-[1px]' : 'left-1/2 -ml-[1px]'}`} />

            {cases.map((c, index) => {
              const isLocked = index > 0;
              const isOdd = index % 2 !== 0;
              const progress = progressMap[c.id] || 0;
              
              return (
                <div 
                  key={c.id}
                  onClick={() => !isLocked && onSelectCase(c)}
                  className={`flex items-center gap-12 w-full transition-all duration-700 ${isOdd ? 'lg:flex-row-reverse' : 'lg:flex-row'} ${isLocked ? 'opacity-40 grayscale pointer-events-none' : 'hover:scale-[1.01]'}`}
                >
                  <div className={`flex-1 bg-zinc-900/30 border p-8 rounded-sm relative group overflow-hidden shadow-2xl backdrop-blur-sm ${isLocked ? 'border-white/5' : 'border-white/10 hover:border-red-600/40 cursor-pointer'}`}>
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                      <img src={c.thumbnailUrl} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-gradient-to-l from-[#050505] to-transparent ${!isRTL ? 'rotate-180' : ''}`} />
                    </div>

                    <div className="relative z-10 flex gap-8">
                      {!isLocked && (
                        <div className="flex flex-col items-center gap-3">
                           <div className="relative w-20 h-24 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                             <ShieldAlert className="absolute w-full h-full text-zinc-800/50" strokeWidth={1} />
                             <div className="absolute bottom-0 w-full overflow-hidden transition-all duration-1000" style={{ height: `${progress}%` }}>
                               <div className="absolute bottom-0 w-20 h-24">
                                  <ShieldAlert className={`w-full h-full ${progress === 100 ? 'text-amber-500' : 'text-red-600'}`} strokeWidth={1} fill="currentColor" fillOpacity={0.3} />
                               </div>
                             </div>
                             <ShieldAlert className={`absolute w-full h-full transition-colors ${progress === 100 ? 'text-amber-500' : 'text-white/20'}`} strokeWidth={1.5} />
                             {progress === 100 ? <ShieldCheck className="relative z-20 text-amber-500" size={32} /> : <span className="relative z-20 font-mono text-xs font-black text-white/60">{progress}%</span>}
                           </div>
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`px-4 py-1.5 rounded-sm border text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(c.difficulty)}`}>
                            {c.difficulty}
                          </div>
                          {!isLocked && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t.progress}</span>
                              <Activity className={`transition-colors ${progress === 100 ? 'text-amber-500' : 'text-red-600 animate-pulse'}`} size={16} />
                            </div>
                          )}
                        </div>

                        <h3 className="text-4xl font-black text-white mb-3 font-typewriter tracking-tighter group-hover:text-red-500 transition-colors">
                          {c.title}
                        </h3>
                        
                        <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-lg font-serif-detective h-12 overflow-hidden line-clamp-2">
                          {c.brief}
                        </p>

                        <div className="flex items-center gap-8 pt-6 border-t border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                           <div className="flex items-center gap-2">
                              <Clock size={14} className="text-red-800" />
                              <span>{c.estimatedTime}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Zap size={14} className="text-amber-600" />
                              <span>{c.requiredRank}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:flex flex-none w-16 h-16 rounded-full border-4 border-zinc-900 bg-[#050505] items-center justify-center relative z-20">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLocked ? 'bg-zinc-800' : progress === 100 ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]'}`}>
                        {index === 0 ? <Star size={16} className="text-white fill-white" /> : <Skull size={16} className="text-white" />}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="px-12 py-6 bg-black/80 border-t border-white/5 flex justify-between items-center z-20">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest">STATUS: SECURE</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default CaseSelection;
