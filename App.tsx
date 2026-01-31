
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CASES } from './constants';
import { Evidence, Reliability, Suspect, Message, Case } from './types';
import EvidenceCard from './components/EvidenceCard';
import InterrogationRoom from './components/InterrogationRoom';
import DeductionBoard from './components/DeductionBoard';
import MainMenu from './components/MainMenu';
import CaseSelection from './components/CaseSelection';
import DetectiveAssistant from './components/DetectiveAssistant';
import EvidenceAnalyzer from './components/EvidenceAnalyzer';
import ForensicSearchPage from './components/ForensicSearchPage';
import MusicManager, { TrackType } from './components/MusicManager';
import SettingsModal, { Language } from './components/SettingsModal';
import WelcomeSplash from './components/WelcomeSplash';
import { 
  BookOpen, 
  Search, 
  ShieldAlert, 
  Settings,
  X,
  Clock,
  Pin,
  Camera,
  FileText,
  Database,
  SearchCode,
  Users,
  ScanEye
} from 'lucide-react';

const App: React.FC = () => {
  const [activeCase, setActiveCase] = useState<Case>(CASES[0]);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('game_lang') as Language) || 'ar');
  const [showSplash, setShowSplash] = useState(true);
  const [evidence, setEvidence] = useState<Evidence[]>(() => {
    const saved = localStorage.getItem(`evidence_${CASES[0].id}`);
    return saved ? JSON.parse(saved) : CASES[0].evidence;
  });
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('detective_name') || 'AGENT_X');
  const [playerNotes, setPlayerNotes] = useState(() => localStorage.getItem(`notes_${CASES[0].id}`) || '');
  const [interrogationHistory, setInterrogationHistory] = useState<Record<string, Message[]>>({});
  const [activeInterrogation, setActiveInterrogation] = useState<Suspect | null>(null);
  const [showDeduction, setShowDeduction] = useState(false);
  const [analyzingEvidence, setAnalyzingEvidence] = useState<Evidence | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'desk' | 'interrogation' | 'notes' | 'timeline' | 'library' | 'case-selection' | 'forensic-search'>('menu');
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('game_volume');
    return saved !== null ? Number(saved) : 0.5;
  });
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('music_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isSFXEnabled, setIsSFXEnabled] = useState(() => {
    const saved = localStorage.getItem('sfx_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  const clickSfx = useRef<HTMLAudioElement | null>(null);
  const paperSfx = useRef<HTMLAudioElement | null>(null);
  const blipSfx = useRef<HTMLAudioElement | null>(null);
  const navSfx = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const createAudio = (url: string) => {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = url;
      return audio;
    };
    clickSfx.current = createAudio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    paperSfx.current = createAudio('https://assets.mixkit.co/active_storage/sfx/1125/1125-preview.mp3');
    blipSfx.current = createAudio('https://assets.mixkit.co/active_storage/sfx/2520/2520-preview.mp3');
    navSfx.current = createAudio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
  }, []);

  useEffect(() => {
    const effectiveSFXVol = isSFXEnabled ? volume * 0.6 : 0;
    if (clickSfx.current) clickSfx.current.volume = effectiveSFXVol;
    if (paperSfx.current) paperSfx.current.volume = Math.min(effectiveSFXVol * 1.2, 1.0);
    if (blipSfx.current) blipSfx.current.volume = effectiveSFXVol;
    if (navSfx.current) navSfx.current.volume = effectiveSFXVol;
    
    localStorage.setItem('game_volume', volume.toString());
    localStorage.setItem('music_enabled', isMusicEnabled.toString());
    localStorage.setItem('sfx_enabled', isSFXEnabled.toString());
    localStorage.setItem('game_lang', language);
  }, [volume, isMusicEnabled, isSFXEnabled, language]);

  const playSFX = (audio: HTMLAudioElement | null) => {
    if (audio && isSFXEnabled && volume > 0 && audio.src) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const handleNav = (newView: typeof view) => {
    playSFX(navSfx.current);
    setView(newView);
  };

  const currentMusicTrack: TrackType = useMemo(() => {
    if (view === 'menu' || view === 'case-selection') return 'menu';
    if (activeInterrogation) return 'interrogation';
    if (analyzingEvidence || view === 'forensic-search') return 'investigation';
    if (view === 'notes') return 'notes';
    return 'investigation';
  }, [view, activeInterrogation, analyzingEvidence]);

  const discoveredEvidence = useMemo(() => {
    return evidence.filter(e => e.discoveredClueIds.length > 0);
  }, [evidence]);

  const uiStrings = {
    ar: { 
      desk: 'مسرح الجريمة', 
      notes: 'المفكرة', 
      forensic: 'البحث الجنائي', 
      closeCase: 'إغلاق القضية', 
      findings: 'الأدلة المكتشفة آلياً',
      crimeSceneHeader: 'مـسـرح الـجـريـمـة',
      crimeSceneSub: 'تحليل الأدلة البصرية والمادية المكتشفة',
      suspectsHeader: 'الـمـشـتـبـه بـهـم',
      suspectsSub: 'ملفات تعريف الأشخاص ذوي العلاقة المباشرة بالحادث'
    },
    en: { 
      desk: 'CRIME SCENE', 
      notes: 'NOTEBOOK', 
      forensic: 'FORENSIC AI', 
      closeCase: 'CLOSE CASE', 
      findings: 'AUTO-LOGGED FINDINGS',
      crimeSceneHeader: 'CRIME SCENE',
      crimeSceneSub: 'Analysis of Visual & Physical Evidence',
      suspectsHeader: 'SUSPECT LIST',
      suspectsSub: 'Profiles of Persons of Interest'
    },
    tr: { 
      desk: 'SUÇ MAHALLİ', 
      notes: 'NOT DEFTERİ', 
      forensic: 'ADLİ ARAMA', 
      closeCase: 'DAVAYI KAPAT', 
      findings: 'BULGULAR',
      crimeSceneHeader: 'SUÇ MAHALLİ',
      crimeSceneSub: 'Görsel ve Maddi Kanıt Analizi',
      suspectsHeader: 'ŞÜPHELİ LİSTESİ',
      suspectsSub: 'Olayla İlgili Kişilerin Profilleri'
    }
  }[language];

  if (showSplash) {
    return (
      <WelcomeSplash 
        language={language} 
        sfxVolume={isSFXEnabled ? volume : 0} 
        onComplete={() => {
          setIsAudioUnlocked(true);
          setShowSplash(false);
        }} 
      />
    );
  }

  return (
    <div className={`h-screen w-screen overflow-hidden bg-black text-white selection:bg-red-600/30 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <MusicManager 
        activeTrack={currentMusicTrack} 
        isMusicPlaying={isMusicEnabled && volume > 0 && isAudioUnlocked} 
        volume={volume * 0.4} 
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => { playSFX(clickSfx.current); setIsSettingsOpen(false); }} 
        volume={volume} 
        onVolumeChange={setVolume}
        isMusicEnabled={isMusicEnabled}
        onToggleMusic={() => { playSFX(clickSfx.current); setIsMusicEnabled(!isMusicEnabled); }}
        isSFXEnabled={isSFXEnabled}
        onToggleSFX={() => { playSFX(clickSfx.current); setIsSFXEnabled(!isSFXEnabled); }}
        language={language}
        onLanguageChange={(l) => { playSFX(clickSfx.current); setLanguage(l); }}
      />

      {view === 'menu' ? (
        <MainMenu 
          language={language}
          playerName={playerName}
          onUpdatePlayerName={setPlayerName}
          onStartGame={() => {
            playSFX(paperSfx.current);
            setIsAudioUnlocked(true);
            handleNav('desk');
          }} 
          onOpenLibrary={() => handleNav('library')}
          onOpenCaseSelection={() => handleNav('case-selection')}
          volume={volume}
          onVolumeChange={setVolume}
          onOpenSettings={() => { playSFX(clickSfx.current); setIsSettingsOpen(true); }}
        />
      ) : view === 'case-selection' ? (
        <CaseSelection 
          language={language}
          cases={CASES}
          playerName={playerName}
          onSelectCase={(c) => {
            playSFX(paperSfx.current);
            setActiveCase(c);
            const savedEvidence = localStorage.getItem(`evidence_${c.id}`);
            setEvidence(savedEvidence ? JSON.parse(savedEvidence) : c.evidence);
            setPlayerNotes(localStorage.getItem(`notes_${c.id}`) || '');
            handleNav('desk');
          }}
          onBack={() => handleNav('menu')}
        />
      ) : (
        <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden select-none relative z-10 animate-in fade-in duration-1000" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1920" 
              className="w-full h-full object-cover grayscale opacity-20 contrast-150"
              alt="Desk Surface"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-radial-vignette opacity-80" />
          </div>

          <header className="z-20 px-8 py-4 flex justify-between items-center border-b border-white/5 bg-black/60 backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center gap-6">
              <div 
                onClick={() => handleNav('menu')} 
                className="w-10 h-10 bg-red-600/90 flex items-center justify-center rounded-sm cursor-pointer hover:rotate-6 transition-transform shadow-lg active:scale-90"
              >
                <ShieldAlert className="text-white" size={20} />
              </div>
              <h1 className="text-lg font-black font-typewriter text-white uppercase tracking-tighter">{activeCase.title}</h1>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => { playSFX(clickSfx.current); setIsSettingsOpen(true); }}
                className="p-3 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors"
              >
                <Settings size={18} className="text-zinc-400" />
              </button>
              
              <button 
                onClick={() => { playSFX(paperSfx.current); setShowDeduction(true); }} 
                className="px-6 py-2.5 bg-zinc-950 border border-red-600/30 rounded-sm active:scale-95 transition-all hover:bg-red-900/10 hover:border-red-600 group"
              >
                <span className="text-[11px] font-black text-white uppercase group-hover:text-red-500 transition-colors">{uiStrings.closeCase}</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-10 relative custom-scrollbar-red z-10">
            {view === 'desk' ? (
              <div className="max-w-7xl mx-auto">
                {/* SECTION HEADER: CRIME SCENE */}
                <div className="mb-8 flex items-center gap-4 border-b border-red-600/20 pb-4 animate-in slide-in-from-right-4 duration-700">
                  <div className="p-2.5 bg-red-600/10 border border-red-600/30 rounded-sm">
                    <Camera size={22} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter font-typewriter">{uiStrings.crimeSceneHeader}</h2>
                    <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">{uiStrings.crimeSceneSub}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 opacity-40">
                     <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Scanning_Visuals</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 mb-16 md:mb-20">
                  {evidence.map((e) => (
                    <EvidenceCard 
                      key={e.id}
                      evidence={e} 
                      onClick={() => { playSFX(blipSfx.current); setAnalyzingEvidence(e); }}
                      onUpdateReliability={(id, r) => {
                        setEvidence(prev => prev.map(ev => ev.id === id ? { ...ev, reliability: r } : ev));
                      }}
                    />
                  ))}
                </div>

                {/* SECTION HEADER: SUSPECTS */}
                <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-4 animate-in slide-in-from-right-4 duration-1000">
                  <div className="p-2.5 bg-zinc-800 border border-white/10 rounded-sm">
                    <Users size={22} className="text-zinc-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter font-typewriter">{uiStrings.suspectsHeader}</h2>
                    <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">{uiStrings.suspectsSub}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 opacity-20">
                     <ScanEye size={16} className="text-zinc-400" />
                     <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Facial_Recognition_ON</span>
                  </div>
                </div>

                <div className="animate-in slide-in-from-bottom-8 duration-1000">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                    {activeCase.suspects.map((s) => (
                      <div 
                        key={s.id}
                        onClick={() => { playSFX(paperSfx.current); setActiveInterrogation(s); }}
                        className="group relative bg-zinc-900/40 border border-white/5 p-4 md:p-5 cursor-pointer hover:border-red-600/30 transition-all hover:scale-[1.05] shadow-2xl backdrop-blur-sm"
                      >
                        <div className="relative h-48 md:h-60 mb-5 overflow-hidden border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-1000">
                          <img src={s.portraitUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-white font-typewriter group-hover:text-red-500 transition-colors">{s.name}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : view === 'notes' ? (
              <div className="max-w-3xl mx-auto mt-4 mb-20">
                <div className="relative bg-[#f4ead2] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-[#dcd0b0] rounded-sm paper-texture min-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in duration-500">
                  <div className="absolute top-0 left-0 w-full h-8 flex justify-around px-8 z-30 pointer-events-none">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="spiral-hole">
                        <div className="spiral-wire" />
                      </div>
                    ))}
                  </div>
                  <div className="coffee-stain top-20 right-10 rotate-12" />
                  <div className="notebook-margin" />
                  <div className="pt-16 px-12 pb-12 flex-1 relative z-10 notebook-lines">
                    {discoveredEvidence.length > 0 && (
                      <div className="mb-10 space-y-4">
                        <div className="flex items-center gap-2 mb-4 border-b-2 border-red-600/10 pb-2">
                           <Clock size={16} className="text-red-800" />
                           <h4 className="text-xs font-black text-red-900 uppercase tracking-widest">{uiStrings.findings}</h4>
                        </div>
                        {discoveredEvidence.map(e => (
                          <div key={e.id} className="flex gap-4 group">
                             <div className="mt-2 text-red-800"><Pin size={12} className="rotate-[-25deg]" /></div>
                             <div className="flex-1 border-r border-red-800/10 pr-3">
                               <p className="text-[13px] font-black text-zinc-600 uppercase mb-1 leading-none">{e.title}:</p>
                               {e.hiddenClues?.filter(c => e.discoveredClueIds.includes(c.id)).map(clue => (
                                 <p key={clue.id} className="text-2xl ink-text mb-4 italic leading-tight">
                                   - {clue.revealedText}
                                 </p>
                               ))}
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4 border-b-2 border-zinc-400/20 pb-2">
                         <FileText size={16} className="text-zinc-600" />
                         <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">تـحـلـيـل المحقق الـخـاص:</h4>
                      </div>
                      <textarea 
                        value={playerNotes}
                        onKeyDown={() => playSFX(clickSfx.current)}
                        onChange={(e) => {
                          setPlayerNotes(e.target.value);
                          localStorage.setItem(`notes_${activeCase.id}`, e.target.value);
                        }}
                        className="w-full min-h-[400px] bg-transparent border-none focus:outline-none text-2xl ink-text italic leading-[2.5rem] resize-none overflow-hidden"
                        placeholder="ابدأ بتدوين شكوكك وملاحظاتك هنا..."
                        style={{ height: `${Math.max(400, playerNotes.split('\n').length * 40)}px` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : view === 'forensic-search' ? (
              <ForensicSearchPage 
                activeCase={activeCase}
                discoveredEvidence={discoveredEvidence}
                sfxVolume={volume}
                onBack={() => handleNav('desk')}
              />
            ) : null}
          </main>

          <nav className="z-30 bg-black/80 backdrop-blur-3xl border-t border-white/5 px-12 py-6 flex justify-around shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
            <button onClick={() => handleNav('desk')} className={`flex flex-col items-center gap-2 transition-all duration-500 ${view === 'desk' ? 'text-red-500 scale-125' : 'text-zinc-600 hover:text-zinc-300'}`}>
              <Search size={24} />
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">{uiStrings.desk}</span>
            </button>
            <button onClick={() => handleNav('forensic-search')} className={`flex flex-col items-center gap-2 transition-all duration-500 ${view === 'forensic-search' ? 'text-red-500 scale-125' : 'text-zinc-600 hover:text-zinc-300'}`}>
              <SearchCode size={24} />
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">{uiStrings.forensic}</span>
            </button>
            <button onClick={() => handleNav('notes')} className={`flex flex-col items-center gap-2 transition-all duration-500 ${view === 'notes' ? 'text-red-500 scale-125' : 'text-zinc-600 hover:text-zinc-300'}`}>
              <BookOpen size={24} />
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">{uiStrings.notes}</span>
            </button>
          </nav>

          {view === 'desk' && (
            <DetectiveAssistant 
              caseData={activeCase} 
              discoveredEvidence={discoveredEvidence} 
              notes={playerNotes} 
            />
          )}
        </div>
      )}

      {analyzingEvidence && (
        <EvidenceAnalyzer 
          evidence={analyzingEvidence}
          onClueFound={(eid, cid) => {
            setEvidence(prev => prev.map(e => e.id === eid ? { ...e, discoveredClueIds: Array.from(new Set([...e.discoveredClueIds, cid])) } : e));
            playSFX(blipSfx.current);
          }}
          onClose={() => { playSFX(navSfx.current); setAnalyzingEvidence(null); }}
          sfxVolume={isSFXEnabled ? volume : 0}
        />
      )}

      {activeInterrogation && (
        <InterrogationRoom 
          suspect={activeInterrogation}
          caseData={activeCase}
          discoveredEvidence={discoveredEvidence}
          history={interrogationHistory[activeInterrogation.id] || []}
          onAddMessage={(id, msg) => setInterrogationHistory(prev => ({...prev, [id]: [...(prev[id] || []), msg]}))}
          onBack={() => { playSFX(paperSfx.current); setActiveInterrogation(null); }}
          sfxVolume={isSFXEnabled ? volume : 0}
        />
      )}

      {showDeduction && (
        <DeductionBoard 
          caseData={activeCase}
          discoveredEvidence={evidence}
          playerName={playerName}
          onSolve={() => {}}
          onClose={() => { playSFX(navSfx.current); setShowDeduction(false); }}
          sfxVolume={isSFXEnabled ? volume : 0}
        />
      )}
    </div>
  );
};

export default App;
