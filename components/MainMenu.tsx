
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  ShieldAlert, 
  FileText, 
  FolderOpen, 
  Check, 
  Settings 
} from 'lucide-react';
import { Language } from './SettingsModal';

interface Props {
  language: Language;
  playerName: string;
  onUpdatePlayerName: (name: string) => void;
  onStartGame: () => void;
  onOpenLibrary: () => void;
  onOpenCaseSelection: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  onOpenSettings: () => void;
}

const MainMenu: React.FC<Props> = ({ 
  language,
  playerName, 
  onUpdatePlayerName, 
  onStartGame, 
  onOpenLibrary, 
  onOpenCaseSelection,
  volume,
  onOpenSettings
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  const hoverSfx = useRef<HTMLAudioElement | null>(null);
  const clickSfx = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    hoverSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    clickSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    
    if (hoverSfx.current) hoverSfx.current.volume = volume * 0.2;
    if (clickSfx.current) clickSfx.current.volume = volume * 0.4;
  }, [volume]);

  const playHover = () => { if (volume > 0) { hoverSfx.current!.currentTime = 0; hoverSfx.current?.play().catch(() => {}); } };
  const playClick = () => { if (volume > 0) { clickSfx.current!.currentTime = 0; clickSfx.current?.play().catch(() => {}); } };

  const handleNameSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tempName.trim()) return;
    playClick();
    onUpdatePlayerName(tempName.toUpperCase());
    setIsEditingName(false);
  };

  const t = {
    ar: { title: 'الـسـجـل', sub: 'الـخـفـي', diaries: 'مـذكـرات الـمـحـقـق', continue: 'بـدء الـتـحـقـيـق', files: 'مـلـفـات الـقـضـايـا', active: 'المحقق النشط', archive: 'أرشيف المستويات والتقارير', identity: 'الهوية الجنائية' },
    en: { title: 'THE HIDDEN', sub: 'RECORDS', diaries: 'DETECTIVE DIARIES', continue: 'START INVESTIGATION', files: 'CASE FILES', active: 'ACTIVE AGENT', archive: 'CASE ARCHIVE & REPORTS', identity: 'CRIMINAL IDENTITY' },
    tr: { title: 'GİZLİ', sub: 'KAYITLAR', diaries: 'DEDEKTİF GÜNLÜKLERİ', continue: 'İNCELEMEYE BAŞLA', files: 'DAVA DOSYALARI', active: 'AKTİF AJAN', archive: 'DAVA ARŞİVİ VE RAPORLAR', identity: 'SUÇLU KİMLİĞİ' }
  }[language];

  const isRTL = language === 'ar';

  return (
    <div className="relative z-50 h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Cinematic Background Layer with Improved Contrast */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1920" 
          alt="Forensic Lab Background"
          className="w-full h-full object-cover grayscale brightness-[0.4] contrast-[1.8] saturate-[0.5] scale-110 animate-ken-burns"
        />
        {/* Deep Enhanced Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_80%)]" />
        
        {/* Atmospheric Effects */}
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.08),rgba(0,255,0,0.03),rgba(0,0,255,0.08))] bg-[length:100%_2px,3px_100%]" />
      </div>

      <div className={`absolute top-12 z-30 ${isRTL ? 'right-12' : 'left-12'}`}>
        <button 
          onClick={() => { playClick(); onOpenSettings(); }}
          className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-4 rounded-full backdrop-blur-3xl shadow-2xl transition-all active:scale-90"
        >
          <Settings size={24} className="text-zinc-400 group-hover:text-red-500 group-hover:rotate-90 transition-all duration-500" />
        </button>
      </div>

      <div className="relative z-20 flex flex-col items-center w-full max-w-xl px-6 animate-in fade-in zoom-in-95 duration-1000">
        <div className="mb-16 text-center group cursor-default">
          <div className="relative inline-block mb-8 transition-transform duration-700 hover:scale-105">
            <div className="absolute inset-0 bg-red-600/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-28 h-28 bg-zinc-950 border-2 border-red-600/60 flex items-center justify-center rounded-sm rotate-3 shadow-[0_0_60px_rgba(220,38,38,0.4)]">
              <ShieldAlert className="text-red-600" size={64} />
            </div>
            {/* HUD Decoration around logo */}
            <div className="absolute -inset-6 border border-white/10 rounded-full animate-spin-slow opacity-30 pointer-events-none" />
            <div className="absolute -inset-2 border border-red-600/20 rounded-sm rotate-6 pointer-events-none" />
          </div>
          <h1 className="text-6xl font-black font-typewriter tracking-tighter text-white uppercase mb-4 text-shimmer drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {t.title} <span className="text-red-600">{t.sub}</span>
          </h1>
          <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.8em]">{t.diaries}</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button 
            onMouseEnter={playHover}
            onClick={() => { playClick(); onStartGame(); }}
            className="group relative flex items-center h-24 bg-white text-black hover:bg-zinc-100 transition-all rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-[0.98] overflow-hidden"
          >
            <div className={`w-24 h-full flex items-center justify-center bg-black/5 border-black/10 ${isRTL ? 'border-l' : 'border-r'}`}>
              <Play size={28} />
            </div>
            <div className="flex-1 flex flex-col items-start px-8">
              <span className="text-2xl font-black uppercase tracking-tight font-typewriter">{t.continue}</span>
              <span className="text-[9px] font-bold opacity-60 uppercase">{t.active}: {playerName}</span>
            </div>
            {/* Hover Glitch Effect Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </button>

          <button 
            onMouseEnter={playHover}
            onClick={() => { playClick(); onOpenCaseSelection(); }}
            className="group relative flex items-center h-24 bg-zinc-900/90 backdrop-blur-md border border-white/10 text-white hover:bg-zinc-800 transition-all rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-[0.98] overflow-hidden"
          >
            <div className={`w-24 h-full flex items-center justify-center bg-white/5 border-white/5 ${isRTL ? 'border-l' : 'border-r'}`}>
              <FolderOpen size={28} className="text-red-500" />
            </div>
            <div className="flex-1 flex flex-col items-start px-8">
              <span className="text-2xl font-black uppercase tracking-tight font-typewriter">{t.files}</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase">{t.archive}</span>
            </div>
          </button>
        </div>
      </div>

      <div className={`absolute bottom-10 inset-x-0 px-12 flex justify-between items-end z-20 ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`border-zinc-800 group cursor-pointer ${isRTL ? 'border-r pr-6' : 'border-l pl-6'}`} onClick={() => { playClick(); setIsEditingName(true); }}>
          <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2 group-hover:text-red-500 transition-colors">
             {t.identity}
          </p>
          {isEditingName ? (
            <form onSubmit={handleNameSubmit} className="flex items-center">
              <input 
                autoFocus type="text" maxLength={15} value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-zinc-900/80 border-b border-red-600 text-white font-typewriter text-sm px-2 py-1 focus:outline-none w-32 uppercase"
                onBlur={handleNameSubmit}
              />
              <button type="submit" className="mx-2 text-red-500"><Check size={16} /></button>
            </form>
          ) : (
            <p className="text-sm text-zinc-300 font-typewriter group-hover:text-white transition-colors">{playerName}</p>
          )}
        </div>
        <div className="text-[9px] text-zinc-600 font-black tracking-widest uppercase opacity-60">SYSTEM_AUTH_READY</div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ken-burns {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.18); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns { animation: ken-burns 45s ease-in-out infinite; }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }

        .text-shimmer {
          background: linear-gradient(90deg, #fff 0%, #dc2626 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
      `}} />
    </div>
  );
};

export default MainMenu;
