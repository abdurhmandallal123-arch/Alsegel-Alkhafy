
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Evidence, AnalysisTool, HiddenClue } from '../types';
import { forensicSearch } from '../geminiService';
import { 
  X, 
  Search, 
  Activity, 
  Terminal,
  Crosshair,
  Zap,
  Database,
  SearchCode,
  Fingerprint,
  Loader2,
  ChevronRight,
  Microscope,
  ClipboardList,
  Scan,
  Radio,
  FileSearch,
  CheckCircle2,
  Target,
  FileCheck,
  Radar,
  FileText,
  ShieldCheck
} from 'lucide-react';

interface Props {
  evidence: Evidence;
  onClueFound: (evidenceId: string, clueId: string) => void;
  onClose: () => void;
  sfxVolume: number;
}

const EvidenceAnalyzer: React.FC<Props> = ({ evidence, onClueFound, onClose, sfxVolume }) => {
  const [mode, setMode] = useState<'report' | 'lab'>('report');
  const [showDetailedLog, setShowDetailedLog] = useState(false);
  const [activeTool, setActiveTool] = useState<AnalysisTool>(AnalysisTool.MAGNIFIER);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [foundThisSession, setFoundThisSession] = useState<string[]>([]);
  const [latestClueId, setLatestClueId] = useState<string | null>(null);
  const [proximity, setProximity] = useState(0); 
  const [isJittering, setIsJittering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>(["SYSTEM_READY", "DOSSIER_LOADED"]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scanSfx = useRef<HTMLAudioElement | null>(null);
  const proximitySfx = useRef<HTMLAudioElement | null>(null);
  const toolSwitchSfx = useRef<HTMLAudioElement | null>(null);
  const successSfx = useRef<HTMLAudioElement | null>(null);
  const navSfx = useRef<HTMLAudioElement | null>(null);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [msg, ...prev].slice(0, 5));
  };

  useEffect(() => {
    scanSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2560/2560-preview.mp3');
    proximitySfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); 
    toolSwitchSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    successSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2520/2520-preview.mp3');
    navSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
  }, []);

  useEffect(() => {
    const vol = sfxVolume;
    if (scanSfx.current) scanSfx.current.volume = vol * 0.4;
    if (proximitySfx.current) proximitySfx.current.volume = vol * 0.2;
    if (toolSwitchSfx.current) toolSwitchSfx.current.volume = vol * 0.3;
    if (successSfx.current) successSfx.current.volume = vol * 0.8;
    if (navSfx.current) navSfx.current.volume = vol * 0.5;
  }, [sfxVolume]);

  const toggleMode = () => {
    if (navSfx.current) navSfx.current.play().catch(() => {});
    const newMode = mode === 'report' ? 'lab' : 'report';
    setMode(newMode);
    addLog(newMode === 'lab' ? "INIT_MICROSCOPIC_LINK" : "RETURNING_TO_DOSSIER");
  };

  const handleForensicSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    addLog(`AI_SCANNING:_${searchQuery.toUpperCase().replace(/\s/g, '_')}`);
    try {
      const result = await forensicSearch(evidence, searchQuery, "تحليل تقني شامل");
      setSearchResult(result);
      addLog("AI_ANALYSIS_COMPLETED");
    } catch (e) {
      setSearchResult("خطأ في الاتصال بقاعدة البيانات.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleToolChange = (tool: AnalysisTool) => {
    if (toolSwitchSfx.current) {
      toolSwitchSfx.current.currentTime = 0;
      toolSwitchSfx.current.play().catch(() => {});
    }
    setActiveTool(tool);
    setProximity(0);
    addLog(`MODULE_SWITCHED:_${tool}`);
  };

  useEffect(() => {
    if (mode === 'lab' && proximity > 0.1 && !latestClueId) {
      const intervalTime = Math.max(50, 700 - (proximity * 650));
      const interval = setInterval(() => {
        if (proximitySfx.current) {
            proximitySfx.current.playbackRate = 0.8 + (proximity * 1.6);
            proximitySfx.current.volume = (sfxVolume * 0.1) + (proximity * sfxVolume * 0.5);
            proximitySfx.current.currentTime = 0;
            proximitySfx.current.play().catch(() => {});
        }
        if (proximity > 0.9) {
          setIsJittering(true);
          setTimeout(() => setIsJittering(false), 30);
        }
      }, intervalTime);
      return () => clearInterval(interval);
    }
  }, [proximity, latestClueId, sfxVolume, mode]);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'lab' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    setMousePos({ x, y });
    calculateProximity(x, y);
    checkForClues(x, y);
  };

  const calculateProximity = useCallback((x: number, y: number) => {
    if (!evidence.hiddenClues) return;
    let maxProx = 0;
    evidence.hiddenClues.forEach(clue => {
      if (clue.tool === activeTool && !evidence.discoveredClueIds.includes(clue.id)) {
        const dist = Math.sqrt(Math.pow(x - clue.x, 2) + Math.pow(y - clue.y, 2));
        const p = Math.max(0, 1 - (dist / 28)); 
        const exponentialProx = Math.pow(p, 1.4);
        if (exponentialProx > maxProx) maxProx = exponentialProx;
      }
    });
    setProximity(maxProx);
  }, [activeTool, evidence]);

  const checkForClues = useCallback((x: number, y: number) => {
    if (!evidence.hiddenClues) return;
    evidence.hiddenClues.forEach(clue => {
      if (
        clue.tool === activeTool &&
        !evidence.discoveredClueIds.includes(clue.id) &&
        !foundThisSession.includes(clue.id)
      ) {
        const dist = Math.sqrt(Math.pow(x - clue.x, 2) + Math.pow(y - clue.y, 2));
        if (dist < (clue.radius * 0.85)) {
          setFoundThisSession(prev => [...prev, clue.id]);
          setLatestClueId(clue.id);
          onClueFound(evidence.id, clue.id);
          addLog(`DATA_UPLOADED:_${clue.id.toUpperCase()}`);
          
          if (successSfx.current) {
            successSfx.current.currentTime = 0;
            successSfx.current.play().catch(() => {});
          }

          setTimeout(() => setLatestClueId(null), 2500);
          setProximity(0);
        }
      }
    });
  }, [activeTool, evidence, foundThisSession, onClueFound]);

  const discoveredClues = useMemo(() => {
    return (evidence.hiddenClues || []).filter(c => 
      evidence.discoveredClueIds.includes(c.id) || foundThisSession.includes(c.id)
    );
  }, [evidence.hiddenClues, evidence.discoveredClueIds, foundThisSession]);

  const latestClueCoords = useMemo(() => {
    if (!latestClueId) return null;
    return evidence.hiddenClues?.find(c => c.id === latestClueId);
  }, [latestClueId, evidence.hiddenClues]);

  const imageFilters = useMemo(() => {
    if (mode === 'report') return 'brightness-[0.75] contrast-[1.1] grayscale-[0.2]';
    
    let base = 'grayscale contrast-125 brightness-[0.22]';
    if (activeTool === AnalysisTool.UV_LIGHT) base = 'grayscale invert contrast-[2.2] brightness-[0.35] sepia-[0.4] hue-rotate-[250deg]';
    if (activeTool === AnalysisTool.SCANNER) base = 'grayscale brightness-[0.18] contrast-[1.6] saturate-0';
    
    const boost = proximity > 0.35 ? `brightness(${0.25 + (proximity * 0.75)}) contrast(${1.3 + (proximity * 0.9)})` : '';
    return `${base} ${boost}`.trim();
  }, [activeTool, proximity, mode]);

  const getToolColor = () => {
    if (proximity > 0.82) return 'border-red-600 shadow-red-600/60';
    switch (activeTool) {
      case AnalysisTool.MAGNIFIER: return 'border-white/80';
      case AnalysisTool.UV_LIGHT: return 'border-purple-600';
      case AnalysisTool.SCANNER: return 'border-cyan-500';
      default: return 'border-red-600';
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-zinc-950 flex flex-col font-sans overflow-hidden select-none" dir="rtl">
      
      {/* 1. HUD Header */}
      <header className="h-20 bg-black/90 backdrop-blur-2xl border-b border-white/5 px-10 flex items-center justify-between z-[200] shadow-2xl">
        <div className="flex items-center gap-6">
           <div className="p-3 bg-red-600/10 border border-red-600/30 rounded-sm">
              <FileCheck className="text-red-600" size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter font-typewriter">
                {mode === 'report' ? 'مـلـف الـتـقـريـر الـفـنـي' : 'نـطـاق الـتـحـلـيـل الـمـجـهـري'}
              </h2>
              <div className="flex items-center gap-3">
                 <p className="text-[10px] text-zinc-500 font-mono tracking-widest">{evidence.title}</p>
                 <span className="w-1 h-1 rounded-full bg-zinc-700" />
                 <span className="text-[9px] text-zinc-600 font-mono uppercase">
                   Status: {discoveredClues.length === (evidence.hiddenClues?.length || 0) ? 'COMPLETE' : 'PENDING_LAB'}
                 </span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           {mode === 'lab' && (
             <button 
               onClick={toggleMode}
               className="px-6 py-2.5 bg-zinc-900 border border-white/10 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 group active:scale-95"
             >
                <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                الـعـودة لـلـتـقـريـر
             </button>
           )}
           <button 
             onClick={onClose}
             className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-sm hover:bg-red-700 transition-all shadow-lg active:scale-90"
           >
             <X size={26} />
           </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* VIEW: DOSSIER REPORT */}
        {mode === 'report' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
             {/* Visual Preview */}
             <div className="flex-1 bg-black relative flex items-center justify-center p-16 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <img 
                  src={evidence.imageUrl} 
                  className="max-w-full max-h-[75vh] object-contain shadow-[0_0_120px_rgba(220,38,38,0.25)] border-2 border-white/5 rounded-sm transition-all duration-700 group-hover:border-red-600/30"
                  alt="Dossier Preview"
                />
                
                {/* LAB SHORTCUT BUTTON */}
                <button 
                  onClick={toggleMode}
                  className="absolute bottom-16 left-16 group/btn bg-red-600 p-8 rounded-full shadow-[0_0_80px_rgba(220,38,38,0.5)] hover:scale-110 transition-all active:scale-95 animate-pulse-gentle"
                >
                   <div className="flex items-center gap-6">
                      <div className="text-right hidden group-hover/btn:block animate-in slide-in-from-left-6">
                         <p className="text-[13px] font-black text-white uppercase tracking-widest">فـحـص مـجـهـري مـتـقدم</p>
                         <p className="text-[9px] text-white/70 font-mono">MICRO_SCANNER_v2.1</p>
                      </div>
                      <Microscope size={44} className="text-white" />
                   </div>
                </button>
             </div>

             {/* DOSSIER SIDEBAR */}
             <div className="w-full md:w-[480px] bg-[#070707] border-r border-white/5 flex flex-col overflow-y-auto custom-scrollbar-red p-12 space-y-12 shadow-[20px_0_60px_rgba(0,0,0,0.8)]">
                <section className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <Database size={16} className="text-red-600" />
                      <h4 className="text-[12px] font-black text-zinc-400 uppercase tracking-widest">بـيـانـات الـدليل الـرسمية</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: 'الـنـوع الفني', value: evidence.type, icon: <Fingerprint size={12} /> },
                        { label: 'حـالـة الـفـحص', value: discoveredClues.length === (evidence.hiddenClues?.length || 0) ? 'مـكتمل' : 'بانتظار المخبر', icon: <Activity size={12} /> },
                      ].map((spec, i) => (
                        <div key={i} className="bg-white/[0.02] p-5 border border-white/[0.04] rounded-sm group hover:bg-white/[0.04] transition-colors">
                           <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-black mb-1.5 uppercase">
                              {spec.icon} {spec.label}
                           </div>
                           <div className="text-[12px] text-white font-mono font-bold">{spec.value}</div>
                        </div>
                      ))}
                   </div>
                </section>

                <section className="space-y-6">
                   <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <SearchCode size={16} className="text-red-600" />
                      <h4 className="text-[12px] font-black text-zinc-400 uppercase tracking-widest">تـقـريـر الـذكـاء الاصـطـنـاعي</h4>
                   </div>
                   <div className="relative group">
                      <input 
                         type="text"
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleForensicSearch()}
                         placeholder="اسأل النظام الجنائي..."
                         className="w-full bg-black border border-white/10 rounded-sm py-5 px-6 text-xs text-white focus:outline-none focus:border-red-600 transition-all pr-14"
                      />
                      <button 
                         onClick={handleForensicSearch}
                         disabled={isSearching}
                         className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-500"
                      >
                         {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Scan size={20} />}
                      </button>
                   </div>
                   {searchResult && (
                     <div className="bg-red-600/[0.02] border border-red-600/10 p-7 rounded-sm animate-in slide-in-from-top-4">
                        <p className="text-[13px] leading-relaxed text-zinc-300 font-serif-detective tracking-wide">{searchResult}</p>
                     </div>
                   )}
                </section>

                {/* LAB RESULTS SECTION WITH ICON BUTTON */}
                <section className="space-y-8">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                         <Radar size={16} className="text-red-600" />
                         <h4 className="text-[12px] font-black text-zinc-400 uppercase tracking-widest">نـتـائج الـمـخـتـبر الـجـنـائي ({discoveredClues.length})</h4>
                      </div>
                      {/* NEW: DETAILED REPORT ICON BUTTON */}
                      <button 
                         onClick={() => setShowDetailedLog(true)}
                         className="p-2 bg-red-600/10 border border-red-600/30 text-red-600 rounded-sm hover:bg-red-600 hover:text-white transition-all group/report"
                         title="عرض التقرير المفصل"
                      >
                         <FileSearch size={20} className="group-hover/report:scale-110 transition-transform" />
                      </button>
                   </div>
                   
                   <div className="space-y-6">
                      {discoveredClues.length > 0 ? discoveredClues.slice(0, 3).map(clue => (
                        <div key={clue.id} className="flex gap-6 group animate-in slide-in-from-right-6 duration-500">
                           <div className="w-2 h-auto bg-red-600 rounded-full group-hover:h-full transition-all duration-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                           <div className="space-y-3">
                              <p className="text-[11px] font-black text-white uppercase tracking-widest">{clue.description}</p>
                              <p className="text-[13px] text-zinc-400 italic leading-relaxed font-serif-detective">{clue.revealedText}</p>
                           </div>
                        </div>
                      )) : (
                        <div className="py-16 text-center opacity-10 flex flex-col items-center gap-6">
                           <Microscope size={50} className="animate-pulse" />
                           <p className="text-[11px] font-black uppercase tracking-[0.5em]">بـانـتـظار بـيـانـات الـمـخـتـبر</p>
                        </div>
                      )}
                      {discoveredClues.length > 3 && (
                        <p className="text-[10px] text-zinc-600 font-bold uppercase text-center mt-4">... {discoveredClues.length - 3} نتائج إضافية في التقرير المفصل</p>
                      )}
                   </div>
                </section>
             </div>
          </div>
        )}

        {/* MODE: LAB ANALYSIS VIEWPORT */}
        {mode === 'lab' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-1000">
             <div className="w-full md:w-32 bg-[#050505] border-l border-white/5 flex md:flex-col items-center py-12 px-4 gap-8 z-50 shadow-2xl">
               {[AnalysisTool.MAGNIFIER, AnalysisTool.UV_LIGHT, AnalysisTool.SCANNER].map((tool) => (
                 <button 
                   key={tool}
                   onClick={() => handleToolChange(tool)}
                   className={`w-18 h-18 md:w-22 md:h-22 rounded-sm flex flex-col items-center justify-center gap-3 transition-all border-2 ${activeTool === tool ? getToolColor() + ' bg-red-600/5 scale-110 shadow-[0_0_40px_rgba(220,38,38,0.2)]' : 'border-white/5 opacity-25 hover:opacity-100 hover:border-white/20'}`}
                 >
                   {tool === AnalysisTool.MAGNIFIER && <Search size={32} />}
                   {tool === AnalysisTool.UV_LIGHT && <Zap size={32} />}
                   {tool === AnalysisTool.SCANNER && <Target size={32} />}
                   <span className="text-[8px] font-black uppercase hidden md:block tracking-widest">{tool}</span>
                 </button>
               ))}
               <div className="mt-auto hidden md:block text-zinc-900 animate-pulse">
                  <Terminal size={32} />
               </div>
             </div>

             <div 
               ref={containerRef}
               className={`flex-1 relative bg-black overflow-hidden cursor-none ${isJittering ? 'animate-jitter' : ''}`}
               onMouseMove={handleMouseMove}
               onTouchMove={handleMouseMove}
             >
                <img 
                  src={evidence.imageUrl} 
                  className={`w-full h-full object-contain transition-all duration-700 ${imageFilters}`}
                  alt="Laboratory Viewport"
                />

                {/* PROXIMITY HUD CURSOR */}
                <div 
                  className={`absolute pointer-events-none border-2 rounded-full transition-all duration-75 flex items-center justify-center z-40 ${getToolColor()} ${proximity > 0.82 ? 'scale-125' : 'scale-100'}`}
                  style={{ 
                    left: `${mousePos.x}%`, 
                    top: `${mousePos.y}%`, 
                    width: '130px', 
                    height: '130px',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: proximity > 0 ? `0 0 ${50 + proximity * 100}px ${proximity > 0.8 ? 'rgba(220,38,38,0.7)' : 'rgba(255,255,255,0.05)'}` : 'none'
                  }}
                >
                  <Crosshair size={36} className={proximity > 0.85 ? "text-red-500" : "text-white/10"} />
                  {proximity > 0 && (
                    <div className="absolute -bottom-16 flex flex-col items-center gap-3 animate-in fade-in">
                       <div className="text-[10px] font-mono font-black ${proximity > 0.8 ? 'text-red-500' : 'text-white/50'} uppercase tracking-[0.2em]">
                         SIGNAL: {Math.round(proximity * 100)}%
                       </div>
                    </div>
                  )}
                </div>
                
                {/* DISCOVERED CLUE OVERLAYS */}
                {discoveredClues.map(clue => (
                  <div 
                    key={clue.id}
                    className="absolute border-[6px] border-red-600 rounded-full flex items-center justify-center animate-pulse"
                    style={{ 
                      left: `${clue.x}%`, 
                      top: `${clue.y}%`, 
                      width: `${clue.radius * 2.4}%`, 
                      height: `${clue.radius * 2.4}%`,
                      transform: 'translate(-50%, -50%)' 
                    }}
                  >
                     <div className="absolute top-full mt-4 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 whitespace-nowrap shadow-2xl z-50 rounded-sm font-typewriter uppercase">
                        [ {clue.description} // Verified ]
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* 2. DETAILED REPORT OVERLAY (MODAL) */}
      {showDetailedLog && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
           <div className="w-full max-w-4xl max-h-[90vh] bg-[#f8f5f0] shadow-[0_0_100px_rgba(0,0,0,0.8)] border-2 border-zinc-300 rounded-sm flex flex-col overflow-hidden forensic-paper">
              {/* Report Header */}
              <div className="p-10 border-b-4 border-zinc-900 bg-zinc-900 text-white flex justify-between items-end">
                 <div className="space-y-2">
                    <div className="flex items-center gap-4">
                       <ShieldCheck className="text-red-600" size={32} />
                       <h3 className="text-3xl font-black font-typewriter uppercase tracking-tighter">بـروتوكـول الـفـحص الـمـخـبـري</h3>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-500 tracking-[0.3em]">REF_ID: LAB_LOG_{evidence.id.split('-').pop()?.toUpperCase()}</p>
                 </div>
                 <button 
                   onClick={() => setShowDetailedLog(false)}
                   className="p-3 bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                 >
                    <X size={24} />
                 </button>
              </div>

              {/* Report Content */}
              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar-beige space-y-12">
                 <div className="grid grid-cols-2 gap-10 border-b-2 border-zinc-200 pb-10">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-zinc-400 uppercase">الـمـحقق الـمـسـؤول</span>
                       <p className="text-lg font-bold text-zinc-900 font-mono">AGENT_AUTHORIZED</p>
                    </div>
                    <div className="space-y-1 text-left">
                       <span className="text-[9px] font-black text-zinc-400 uppercase">تاريخ التوثيق</span>
                       <p className="text-lg font-bold text-zinc-900 font-mono">{new Date().toLocaleDateString('ar-EG')}</p>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h4 className="text-xs font-black text-red-700 uppercase tracking-widest flex items-center gap-3">
                       <Scan size={16} /> الـقـرائـن الـمـسـتـخـرجـة الـنـهـائيـة
                    </h4>
                    
                    <div className="space-y-8">
                       {discoveredClues.length > 0 ? discoveredClues.map((clue, idx) => (
                         <div key={clue.id} className="relative p-8 bg-zinc-100/50 border-l-8 border-zinc-900 rounded-sm group animate-in slide-in-from-right-4" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="absolute top-4 left-4 opacity-5 pointer-events-none rotate-12">
                               <Stamp size={80} />
                            </div>
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center rounded-full text-xs font-black">0{idx + 1}</span>
                                  <h5 className="text-lg font-black text-zinc-900 uppercase tracking-wide">{clue.description}</h5>
                               </div>
                               <div className="px-3 py-1 bg-emerald-100 border border-emerald-200 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-sm">
                                  Verified_Result
                               </div>
                            </div>
                            <p className="text-xl leading-relaxed text-zinc-700 font-serif-detective italic pr-11">
                               "{clue.revealedText}"
                            </p>
                            <div className="mt-6 flex items-center gap-6 text-[8px] font-mono text-zinc-400 font-bold uppercase border-t border-zinc-200 pt-4">
                               <span className="flex items-center gap-2"><Target size={10} /> Tool: {clue.tool}</span>
                               <span className="flex items-center gap-2"><Activity size={10} /> Accuracy: 99.8%</span>
                            </div>
                         </div>
                       )) : (
                         <div className="py-20 text-center text-zinc-300 border-2 border-dashed border-zinc-200 rounded-sm">
                            <Microscope size={60} className="mx-auto mb-6 opacity-20" />
                            <p className="text-lg font-black uppercase tracking-widest">لـم يـتـم فـحـص أي قـرائـن بـعـد</p>
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Official Stamp Decoration */}
                 {discoveredClues.length > 0 && (
                   <div className="pt-20 flex justify-end">
                      <div className="rotate-[-15deg] border-4 border-red-700/50 p-6 flex flex-col items-center gap-1 opacity-60">
                         <span className="text-red-700 text-2xl font-black uppercase font-typewriter">DOCUMENTED</span>
                         <span className="text-red-700 text-[10px] font-mono font-black uppercase tracking-widest">FORENSIC LAB UNIT</span>
                      </div>
                   </div>
                 )}
              </div>

              {/* Report Footer */}
              <div className="p-8 bg-zinc-100 border-t-2 border-zinc-200 flex justify-between items-center">
                 <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">هذا التقرير مخصص للاستخدام الجنائي فقط</p>
                 <button 
                   onClick={() => setShowDetailedLog(false)}
                   className="px-8 py-3 bg-zinc-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
                 >
                    إغـلاق الـسـجـل
                 </button>
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes jitter {
          0% { transform: translate(0,0); }
          25% { transform: translate(2.5px, -2px); }
          50% { transform: translate(-2px, 2.5px); }
          75% { transform: translate(2px, 2px); }
          100% { transform: translate(0,0); }
        }
        .animate-jitter { animation: jitter 0.1s linear infinite; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1) translateY(0); box-shadow: 0 0 70px rgba(220,38,38,0.4); }
          50% { transform: scale(1.08) translateY(-10px); box-shadow: 0 0 120px rgba(220,38,38,0.7); }
        }
        .animate-pulse-gentle { animation: pulse-gentle 3s ease-in-out infinite; }

        @keyframes sonar {
          0% { transform: scale(0.7); opacity: 1; }
          100% { transform: scale(5.5); opacity: 0; }
        }
        .animate-sonar { animation: sonar 0.9s ease-out infinite; }
        
        .forensic-paper {
            background-color: #f8f5f0;
            background-image: url('https://www.transparenttextures.com/patterns/old-paper.png');
        }
      `}} />
    </div>
  );
};

// Internal Stamp Icon Helper
const Stamp = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M30 50 L70 50 M50 30 L50 70" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default EvidenceAnalyzer;
