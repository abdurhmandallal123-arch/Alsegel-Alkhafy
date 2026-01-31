
import React, { useState, useRef, useEffect } from 'react';
import { Suspect, Case, Message, Evidence, Emotion } from '../types';
import { interrogateSuspect } from '../geminiService';
import { 
  ArrowLeft, 
  AlertCircle,
  Loader2,
  Send,
  Lock,
  Database,
  X,
  Paperclip,
  Stamp,
  History,
  FileText,
  Bookmark,
  Activity
} from 'lucide-react';

interface Props {
  suspect: Suspect;
  caseData: Case;
  discoveredEvidence: Evidence[];
  history: Message[];
  onAddMessage: (suspectId: string, message: Message) => void;
  onBack: () => void;
  sfxVolume: number;
}

const InterrogationRoom: React.FC<Props> = ({ 
  suspect, 
  caseData, 
  discoveredEvidence, 
  history, 
  onAddMessage, 
  onBack,
  sfxVolume
}) => {
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('calm');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const tickSfx = useRef<HTMLAudioElement | null>(null);
  const folderSfx = useRef<HTMLAudioElement | null>(null);
  const typeSfx = useRef<HTMLAudioElement | null>(null);

  const createAudio = (url: string) => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = url;
    audio.onerror = () => { audio.src = ''; };
    return audio;
  };

  useEffect(() => {
    tickSfx.current = createAudio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    folderSfx.current = createAudio('https://assets.mixkit.co/active_storage/sfx/1125/1125-preview.mp3');
    typeSfx.current = createAudio('https://assets.mixkit.co/active_storage/sfx/2560/2560-preview.mp3');
  }, []);

  useEffect(() => {
    if (tickSfx.current) tickSfx.current.volume = sfxVolume * 0.2;
    if (folderSfx.current) folderSfx.current.volume = sfxVolume * 0.6;
    if (typeSfx.current) typeSfx.current.volume = sfxVolume * 0.4;
  }, [sfxVolume]);

  const playTypeSound = () => {
    if (typeSfx.current && typeSfx.current.src) {
      typeSfx.current.currentTime = 0;
      typeSfx.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isLoading]);

  const handleSendText = async () => {
    if (!textInput.trim() || isLoading) return;
    
    const userMsg: Message = { role: 'user', content: textInput };
    onAddMessage(suspect.id, userMsg);
    setTextInput('');
    setIsLoading(true);
    setErrorMessage(null);

    if (tickSfx.current && tickSfx.current.src) {
      tickSfx.current.play().catch(() => {});
    }

    try {
      const res = await interrogateSuspect(
        caseData, 
        suspect, 
        [...history, userMsg], 
        discoveredEvidence
      );
      
      const emotion = res.emotion as Emotion;
      setCurrentEmotion(emotion);
      onAddMessage(suspect.id, { 
        role: 'assistant', 
        content: res.text, 
        emotion 
      });
      
      if (tickSfx.current && tickSfx.current.src) {
        tickSfx.current.play().catch(() => {});
      }
    } catch (err) {
      setErrorMessage("فشل في أرشفة البيانات.. تأكد من اتصال الشبكة.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPolygraphSpeed = () => {
    switch (currentEmotion) {
      case 'nervous': return '0.8s';
      case 'defensive': return '0.5s';
      case 'pressured': return '0.25s';
      case 'broken': return '2.5s';
      default: return '1.2s';
    }
  };

  const getPolygraphColor = () => {
    switch (currentEmotion) {
      case 'calm': return 'text-emerald-500';
      case 'nervous': return 'text-amber-500';
      case 'defensive': return 'text-orange-500';
      case 'pressured': return 'text-red-600';
      case 'broken': return 'text-blue-400';
      default: return 'text-emerald-500';
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-[#1a1510] flex flex-col items-center text-[#2d2417] overflow-hidden font-sans select-none animate-in fade-in duration-700`} dir="rtl">
      
      <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]" />
      <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(255,248,220,0.05)_0%,rgba(0,0,0,0.8)_100%)]" />

      <header className="w-full max-w-6xl mt-4 px-10 py-4 flex justify-between items-end bg-[#e6d5b8] border-b-4 border-[#c4a484] rounded-t-3xl z-30 shadow-2xl relative overflow-hidden paper-texture animate-in slide-in-from-top-4 duration-1000">
        <div className="flex gap-6 items-center">
          <div className="p-3 bg-[#c4a484]/20 border-2 border-[#c4a484]/40 rounded-full hover:rotate-12 transition-transform cursor-pointer">
            <FileText size={24} className="text-[#5d4037]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-[#5d4037] uppercase tracking-widest">محضر التحقيق الرسمي #SC-99</span>
              <span className="px-2 py-0.5 bg-red-800 text-white text-[9px] font-black rounded-sm animate-pulse">سري للغاية</span>
            </div>
            <h1 className="text-2xl font-black font-typewriter tracking-tighter text-[#3e2723]">قضية: {caseData.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-black/80 px-4 py-2 rounded-sm border border-white/5 shadow-inner transition-all hover:border-red-600/20">
           <Activity size={20} className={`${getPolygraphColor()} transition-colors duration-500`} style={{ animation: `pulse ${getPolygraphSpeed()} infinite` }} />
           <div className="flex flex-col items-start leading-none">
              <span className="text-[7px] text-zinc-500 font-black uppercase">Polygraph Monitor</span>
              <span className={`text-[10px] font-mono font-bold ${getPolygraphColor()}`}>BPM: {
                currentEmotion === 'calm' ? '72' : 
                currentEmotion === 'nervous' ? '102' :
                currentEmotion === 'defensive' ? '131' :
                currentEmotion === 'pressured' ? '164' : '48'
              }</span>
           </div>
        </div>

        <button onClick={() => { if (folderSfx.current && folderSfx.current.src) folderSfx.current.play().catch(() => {}); onBack(); }} className="p-3 hover:bg-black/10 rounded-full transition-all text-[#5d4037] active:scale-75">
          <ArrowLeft size={32} />
        </button>
      </header>

      <div className="flex-1 w-full max-w-6xl flex gap-4 p-4 z-10 overflow-hidden mb-4">
        <aside className="hidden lg:flex flex-col w-72 gap-4">
          <div className={`bg-[#f4ead2] border-2 border-[#dcd0b0] p-5 rounded-sm shadow-xl paper-texture relative transform -rotate-1 transition-all duration-700 animate-in slide-in-from-right-8`}>
            <div className="absolute top-2 left-2 text-[#c4a484]"><Paperclip size={24} /></div>
            <div className={`relative aspect-square mb-4 border-4 border-white shadow-md overflow-hidden transition-all duration-700`}>
               <img src={suspect.portraitUrl} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0" />
               <div className="absolute inset-0 bg-black/10 opacity-40" />
            </div>
            <div className="space-y-1 text-center border-b-2 border-[#dcd0b0] pb-4 mb-4">
              <h3 className="text-xl font-black font-typewriter text-[#3e2723]">{suspect.name}</h3>
              <p className="text-[10px] text-red-800 font-bold uppercase tracking-widest">{suspect.role}</p>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col bg-[#f4ead2] border-2 border-[#dcd0b0] rounded-sm relative shadow-2xl overflow-hidden paper-texture animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar-beige relative z-10">
            {history.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`
                  max-w-[85%] p-6 shadow-md relative transition-all duration-500 hover:shadow-lg
                  ${msg.role === 'user' 
                    ? 'bg-white border-2 border-[#dcd0b0] text-[#3e2723] hover:translate-x-1' 
                    : 'bg-[#fdfcf0] border-2 border-[#c4a484] text-[#2b1b17] font-serif-detective text-2xl leading-relaxed transform rotate-1 hover:rotate-0'
                  }
                `}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col items-end">
                <div className="bg-[#fdfcf0] border-2 border-[#c4a484] p-4 flex items-center gap-3 animate-pulse rotate-1">
                  <Loader2 className="animate-spin text-[#c4a484]" size={20} />
                  <span className="text-[10px] font-black text-[#c4a484] uppercase tracking-widest">تلقي استجابة...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-8 bg-[#e6d5b8] border-t-4 border-[#c4a484] relative z-20">
             <div className="max-w-4xl mx-auto flex gap-4">
                <input 
                  type="text" 
                  value={textInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendText();
                    else playTypeSound();
                  }}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="وجه اتهامك أو سؤالك هنا..."
                  className="flex-1 bg-white border-2 border-[#c4a484] rounded-sm py-4 px-6 text-xl placeholder:text-[#c4a484] focus:outline-none transition-all focus:border-[#3e2723] focus:shadow-inner"
                />
                <button 
                  onClick={handleSendText} 
                  disabled={isLoading || !textInput.trim()} 
                  className="px-10 bg-[#3e2723] text-[#f4ead2] hover:bg-[#5d4037] transition-all rounded-sm shadow-xl active:scale-90 disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={28} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterrogationRoom;
