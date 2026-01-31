
import React, { useState, useRef } from 'react';
import { Case, Evidence } from '../types';
import { askAssistant, generateAssistantVoice } from '../geminiService';
import { 
  UserRound, 
  Loader2, 
  X, 
  Lightbulb, 
  BrainCircuit,
  Volume2
} from 'lucide-react';

// Helpers for Audio Decoding
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface Props {
  caseData: Case;
  discoveredEvidence: Evidence[];
  notes: string;
}

const DetectiveAssistant: React.FC<Props> = ({ caseData, discoveredEvidence, notes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleConsultation = async () => {
    setIsLoading(true);
    try {
      const response = await askAssistant(caseData, discoveredEvidence, notes);
      setAdvice(response);
    } catch (error) {
      setAdvice("الظلال تتحرك.. لا أستطيع الرؤية بوضوح الآن.");
    } finally {
      setIsLoading(false);
    }
  };

  const playVoice = async () => {
    if (!advice || isSpeaking) return;
    setIsSpeaking(true);
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      
      const base64 = await generateAssistantVoice(advice);
      const rawBytes = decodeBase64(base64);
      const audioBuffer = await decodeAudioData(rawBytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      
      // --- ADVANCED "DISTANCE & NOIR ROOM" AUDIO GRAPH ---
      
      // 1. Dry Path (The main muffled voice)
      const dryGain = ctx.createGain();
      dryGain.gain.value = 0.55; // Lower direct volume for distance

      const dryFilter = ctx.createBiquadFilter();
      dryFilter.type = 'lowpass';
      dryFilter.frequency.value = 2200; // Muffle high frequencies more for "distance"
      dryFilter.Q.value = 1;

      // 2. Wet Path (The Reverb/Room Ambience)
      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.35; // Significant reverb presence

      // Create a feedback delay loop for "Room Reverb"
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.065; // Slightly longer delay for a larger room feel

      const feedback = ctx.createGain();
      feedback.gain.value = 0.4; // More echoes

      const reverbFilter = ctx.createBiquadFilter();
      reverbFilter.type = 'lowpass';
      reverbFilter.frequency.value = 1200; // Reflections lose high-end energy

      // 3. Compression (To glue the "distance" sound)
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-24, ctx.currentTime);
      compressor.knee.setValueAtTime(40, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);

      // --- Connect Graph ---
      
      // Direct Path
      source.connect(dryFilter);
      dryFilter.connect(dryGain);
      dryGain.connect(compressor);

      // Reverb Path (Connected from the filtered dry signal)
      dryFilter.connect(delay);
      delay.connect(reverbFilter);
      reverbFilter.connect(feedback);
      feedback.connect(delay); // Feedback loop
      feedback.connect(wetGain);
      wetGain.connect(compressor);

      // Final Output
      compressor.connect(ctx.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
      };
      
      source.start();
    } catch (e) {
      console.error("Audio playback error:", e);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed bottom-32 left-8 z-[80] flex flex-col items-start" dir="rtl">
      {isOpen && (
        <div className="mb-4 w-80 bg-[#fdfcf0] border-2 border-[#c4a484] shadow-2xl rounded-sm p-6 paper-texture animate-in slide-in-from-left-4 fade-in duration-500 transform -rotate-1 relative">
          <div className="absolute -top-3 left-4 bg-[#3e2723] p-1 rounded-sm shadow-md">
            <BrainCircuit size={16} className="text-white" />
          </div>
          
          <div className="flex justify-between items-start mb-4 border-b border-[#c4a484]/30 pb-2">
            <div>
              <h4 className="text-lg font-black font-typewriter text-[#3e2723]">د. أديب</h4>
              <p className="text-[8px] font-bold text-red-800 uppercase tracking-widest">خبير الأدلة الجنائية</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#c4a484] hover:text-[#3e2723]">
              <X size={20} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto custom-scrollbar-beige pr-2">
            {isLoading ? (
              <div className="py-10 flex flex-col items-center gap-4 opacity-40">
                <Loader2 className="animate-spin text-[#3e2723]" size={32} />
              </div>
            ) : advice ? (
              <div className="space-y-4 animate-in fade-in duration-700">
                <p className="text-sm font-serif-detective leading-relaxed text-[#2b1b17] italic">
                  "{advice}"
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={playVoice}
                    disabled={isSpeaking}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm border transition-all ${isSpeaking ? 'bg-zinc-200 text-zinc-400 border-zinc-200 shadow-none' : 'bg-[#3e2723] text-white border-[#3e2723] hover:scale-105 shadow-lg active:scale-95'}`}
                  >
                    <Volume2 size={14} className={isSpeaking ? 'animate-pulse' : ''} />
                    <span className="text-[10px] font-black uppercase tracking-tight">{isSpeaking ? 'جاري الاستماع...' : 'استمع للدكتور أديب'}</span>
                  </button>
                  <button 
                    onClick={handleConsultation}
                    className="p-2 bg-white border border-[#c4a484] text-[#3e2723] rounded-sm hover:bg-zinc-50 transition-colors"
                    title="استشارة جديدة"
                  >
                    <Lightbulb size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <Lightbulb size={32} className="mx-auto mb-3 text-[#c4a484] opacity-50" />
                <button 
                  onClick={handleConsultation}
                  className="mt-6 w-full py-4 bg-[#3e2723] text-[#f4ead2] text-xs font-black uppercase rounded-sm shadow-xl active:scale-95 transition-all"
                >
                  استشر الدكتور أديب
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl bg-[#e6d5b8] border-2 border-[#c4a484] hover:scale-110 active:scale-90 relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        {isOpen ? <X size={28} className="text-[#3e2723] relative z-10" /> : <UserRound size={28} className="text-[#3e2723] relative z-10" />}
      </button>
    </div>
  );
};

export default DetectiveAssistant;
