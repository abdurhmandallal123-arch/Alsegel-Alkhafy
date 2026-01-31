
import React, { useState, useRef, useEffect } from 'react';
import { Evidence, Case } from '../types';
import { forensicSearch } from '../geminiService';
import { 
  SearchCode, 
  Database, 
  Terminal, 
  Loader2, 
  ShieldCheck, 
  Fingerprint, 
  History,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface Props {
  activeCase: Case;
  discoveredEvidence: Evidence[];
  sfxVolume: number;
  onBack: () => void;
}

const ForensicSearchPage: React.FC<Props> = ({ activeCase, discoveredEvidence, sfxVolume, onBack }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ query: string; answer: string; timestamp: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [logs, setLogs] = useState<string[]>(["DB_LINK_ESTABLISHED", "READY_FOR_ENHANCED_QUERY"]);
  
  const clickSfx = useRef<HTMLAudioElement | null>(null);
  const searchSfx = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    searchSfx.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2560/2560-preview.mp3');
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 4));
  };

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return;
    setIsSearching(true);
    if (searchSfx.current) {
        searchSfx.current.volume = sfxVolume * 0.4;
        searchSfx.current.play().catch(() => {});
    }
    addLog(`SCANNING_ARCHIVES:_${query.toUpperCase().replace(/\s/g, '_')}`);
    
    try {
      const context = `القضية: ${activeCase.title}. الأدلة المتوفرة: ${discoveredEvidence.map(e => e.title).join(', ')}`;
      const answer = await forensicSearch(discoveredEvidence[0] || { title: activeCase.title } as Evidence, query, context);
      
      setResults(prev => [{
        query,
        answer,
        timestamp: new Date().toLocaleTimeString('ar-EG')
      }, ...prev]);
      
      setQuery('');
      addLog("DECRYPTION_SUCCESSFUL");
    } catch (error) {
      addLog("DB_CONNECTION_FAILURE");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HUD HEADER */}
      <div className="flex items-center justify-between mb-8 border-b border-red-600/20 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/10 rounded-sm border border-red-600/30">
            <Database className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black font-typewriter uppercase tracking-tighter">قاعدة البيانات الجنائية الرقمية</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">تشفير نهاية لنهاية: نـشـط</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
           <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                 <Terminal size={14} className="text-zinc-600" />
                 <span className="text-[7px] text-zinc-500 font-mono">SYSTEM_LOGS</span>
              </div>
              <div className="flex flex-col items-end">
                 {logs.map((log, i) => (
                   <span key={i} className={`text-[7px] font-mono ${i === 0 ? 'text-red-500' : 'text-zinc-700'}`}>{log}</span>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* SEARCH INTERFACE */}
      <div className="relative mb-12 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent blur opacity-25 group-hover:opacity-100 transition duration-1000" />
        <div className="relative bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-sm p-2 flex gap-2">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ادخل استعلامك الجنائي هنا (مثلاً: ابحث عن علاقة سارة بموقع الجريمة)..."
            className="flex-1 bg-transparent border-none text-xl py-4 px-6 text-white placeholder:text-zinc-700 focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className={`px-10 rounded-sm font-black text-sm uppercase transition-all flex items-center gap-3 ${isSearching || !query.trim() ? 'bg-zinc-800 text-zinc-600' : 'bg-red-600 text-white hover:bg-red-700 shadow-xl'}`}
          >
            {isSearching ? <Loader2 className="animate-spin" size={20} /> : <SearchCode size={20} />}
            <span>تحليل</span>
          </button>
        </div>
      </div>

      {/* RESULTS STREAM */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-red space-y-6 pr-4">
        {results.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-6">
             <div className="p-8 border-2 border-dashed border-white/10 rounded-full">
                <Sparkles size={64} />
             </div>
             <div className="space-y-2">
                <p className="text-xl font-black uppercase tracking-widest">بانتظار الاستعلامات</p>
                <p className="text-[10px] max-w-xs leading-relaxed uppercase tracking-widest">قم بكتابة سؤال حول أي دليل أو مشتبه به للحصول على تحليل تقني من قاعدة بياناتنا المركزية.</p>
             </div>
          </div>
        ) : (
          results.map((res, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-sm animate-in slide-in-from-top-4 duration-500 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full pointer-events-none" />
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                     <History size={16} className="text-zinc-600" />
                     <span className="text-[10px] font-mono text-zinc-600 uppercase">{res.timestamp}</span>
                  </div>
                  <div className="px-3 py-1 bg-red-600/10 border border-red-600/20 text-[8px] font-black text-red-600 uppercase tracking-widest">
                     ANALYSIS_REPORT
                  </div>
               </div>
               
               <div className="flex gap-6">
                  <div className="mt-1 text-red-600"><Zap size={20} /></div>
                  <div className="space-y-4 flex-1">
                     <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-2">الاستعلام: {res.query}</h4>
                     <p className="text-lg leading-relaxed text-zinc-200 font-serif-detective">
                        {res.answer}
                     </p>
                  </div>
               </div>
               
               <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-4">
                     <div className="flex items-center gap-1.5 opacity-40">
                        <Fingerprint size={12} className="text-zinc-500" />
                        <span className="text-[7px] text-zinc-500 font-mono">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-40">
                     <Activity size={12} className="text-emerald-500" />
                     <span className="text-[7px] text-zinc-500 font-mono">INTEGRITY_VERIFIED</span>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* QUICK INFO BAR */}
      <div className="mt-8 flex items-center gap-6 p-4 bg-red-600/5 border border-red-600/10 rounded-sm">
         <Info size={16} className="text-red-600 shrink-0" />
         <p className="text-[9px] text-zinc-500 uppercase font-black leading-relaxed tracking-widest">
            قاعدة البيانات هذه مدعومة بالذكاء الاصطناعي الجنائي. دقة النتائج تعتمد على جودة وكمية الأدلة التي تم فحصها مخبرياً مسبقاً.
         </p>
      </div>
    </div>
  );
};

export default ForensicSearchPage;
