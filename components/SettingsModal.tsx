
import React from 'react';
import { X, Volume2, Music, Bell, ShieldCheck, Cpu, Globe } from 'lucide-react';

export type Language = 'ar' | 'en' | 'tr';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMusicEnabled: boolean;
  onToggleMusic: () => void;
  isSFXEnabled: boolean;
  onToggleSFX: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const SettingsModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  volume, 
  onVolumeChange,
  isMusicEnabled,
  onToggleMusic,
  isSFXEnabled,
  onToggleSFX,
  language,
  onLanguageChange
}) => {
  if (!isOpen) return null;

  const t = {
    ar: { title: 'إعدادات المحطة', volume: 'مستوى الصوت', music: 'الموسيقى', sfx: 'المؤثرات', lang: 'اللغة', save: 'حفظ وتطبيق', enc: 'تشفير الإعدادات: نشط' },
    en: { title: 'STATION SETTINGS', volume: 'MASTER VOLUME', music: 'AMBIENT MUSIC', sfx: 'SOUND EFFECTS', lang: 'LANGUAGE', save: 'SAVE & APPLY', enc: 'ENCRYPTION: ACTIVE' },
    tr: { title: 'İSTASYON AYARLARI', volume: 'ANA SES', music: 'ORTAM MÜZİĞİ', sfx: 'SES EFEKTLERİ', lang: 'DİL', save: 'KAYDET VE UYGULA', enc: 'ŞİFRELEME: AKTİF' }
  }[language];

  const isRTL = language === 'ar';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
        <div className="bg-red-600 h-1 w-full" />
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <Cpu size={18} className="text-red-600" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-typewriter">{t.title}</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Language Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-red-500" />
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{t.lang}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ar', label: 'العربية' },
                { id: 'en', label: 'English' },
                { id: 'tr', label: 'Türkçe' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onLanguageChange(lang.id as Language)}
                  className={`py-3 px-2 text-[10px] font-bold rounded-sm border transition-all ${language === lang.id ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-red-500" />
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{t.volume}</span>
              </div>
              <span className="text-[10px] font-mono text-red-500 font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
               <input 
                  type="range" min="0" max="1" step="0.01" value={volume} 
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div className="h-full bg-red-600 transition-all duration-150" style={{ width: `${volume * 100}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={onToggleMusic}
                className={`p-4 border rounded-sm flex flex-col items-center gap-3 transition-all ${isMusicEnabled ? 'bg-black/40 border-emerald-500/30' : 'bg-black/20 border-white/5 opacity-60'}`}
             >
                <Music size={20} className={isMusicEnabled ? 'text-emerald-500' : 'text-zinc-700'} />
                <span className="text-[8px] font-black text-zinc-400 uppercase">{t.music}</span>
                <div className={`w-10 h-4 rounded-full p-1 transition-colors ${isMusicEnabled ? 'bg-emerald-600' : 'bg-zinc-800'}`}>
                   <div className={`w-2 h-2 bg-white rounded-full transition-transform ${isMusicEnabled ? (isRTL ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'}`} />
                </div>
             </button>

             <button 
                onClick={onToggleSFX}
                className={`p-4 border rounded-sm flex flex-col items-center gap-3 transition-all ${isSFXEnabled ? 'bg-black/40 border-amber-500/30' : 'bg-black/20 border-white/5 opacity-60'}`}
             >
                <Bell size={20} className={isSFXEnabled ? 'text-amber-500' : 'text-zinc-700'} />
                <span className="text-[8px] font-black text-zinc-400 uppercase">{t.sfx}</span>
                <div className={`w-10 h-4 rounded-full p-1 transition-colors ${isSFXEnabled ? 'bg-amber-600' : 'bg-zinc-800'}`}>
                   <div className={`w-2 h-2 bg-white rounded-full transition-transform ${isSFXEnabled ? (isRTL ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'}`} />
                </div>
             </button>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-3">
             <ShieldCheck size={14} className="text-red-900" />
             <span className="text-[7px] text-zinc-600 font-black uppercase tracking-widest">{t.enc}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-zinc-100 text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-colors"
        >
          {t.save}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
