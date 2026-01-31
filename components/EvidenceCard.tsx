
import React, { memo } from 'react';
import { Evidence, EvidenceType, Reliability } from '../types';
import { 
  FileSearch, 
  Camera, 
  Activity, 
  FileText,
  Dna,
  Microscope,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface Props {
  evidence: Evidence;
  onClick: () => void;
  onUpdateReliability: (id: string, r: Reliability) => void;
}

const EvidenceCard: React.FC<Props> = memo(({ evidence, onClick }) => {
  const totalClues = evidence.hiddenClues?.length || 0;
  const discoveredCount = evidence.discoveredClueIds.length;
  const isFullyAnalyzed = totalClues > 0 && discoveredCount === totalClues;

  const getForensicIcon = () => {
    switch (evidence.type) {
      case EvidenceType.DOCUMENT: return <FileText className="w-8 h-8" />;
      case EvidenceType.PHOTO: return <Camera className="w-8 h-8" />;
      case EvidenceType.AUDIO: return <Activity className="w-8 h-8" />;
      case EvidenceType.OBJECT: return <Dna className="w-8 h-8" />;
      default: return <FileSearch className="w-8 h-8" />;
    }
  };

  const getReliabilityStatus = () => {
    switch (evidence.reliability) {
      case Reliability.TRUSTED: return 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case Reliability.SUSPICIOUS: return 'border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]';
      default: return 'border-white/10';
    }
  };

  return (
    <div 
      className="group relative w-full aspect-[3/4] cursor-pointer transition-all duration-500 hover:-translate-y-2 active:scale-95 animate-in fade-in slide-in-from-bottom-4"
      onClick={onClick}
    >
      {/* Outer Glow for discovered items */}
      {discoveredCount > 0 && (
        <div className={`absolute -inset-1.5 blur-xl rounded-sm opacity-40 group-hover:opacity-100 transition-opacity duration-700 ${isFullyAnalyzed ? 'bg-emerald-500' : 'bg-red-600'}`} />
      )}

      <div className={`relative h-full w-full bg-zinc-900 border-2 rounded-sm overflow-hidden flex flex-col transition-all duration-300 ${getReliabilityStatus()} ${isFullyAnalyzed ? 'border-emerald-500' : ''}`}>
        
        {/* Top HUD Overlay */}
        <div className="absolute top-0 inset-x-0 z-20 h-8 bg-gradient-to-b from-black/80 to-transparent px-3 flex items-center justify-between pointer-events-none">
          <span className="text-[7px] font-black text-white/40 uppercase tracking-widest font-mono">
            {evidence.id.split('-').pop()}
          </span>
          {isFullyAnalyzed && <CheckCircle2 size={12} className="text-emerald-500 drop-shadow-sm" />}
        </div>

        {/* Main Image Viewport - FULL HEIGHT */}
        <div className="relative flex-1 bg-black overflow-hidden">
          {evidence.imageUrl ? (
            <img 
              src={evidence.imageUrl} 
              className={`w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110 ${discoveredCount > 0 ? 'contrast-125 saturate-50' : 'opacity-60'}`} 
              alt={evidence.title}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-20 gap-3">
              {getForensicIcon()}
              <span className="text-[8px] font-black uppercase">No_Visual_Data</span>
            </div>
          )}
          
          {/* Scanning Overlay (Active when clues found) */}
          {discoveredCount > 0 && !isFullyAnalyzed && (
            <div className="absolute inset-0 pointer-events-none">
               <div className="w-full h-1/2 bg-red-600/5 animate-pulse" />
               <div className="absolute top-0 left-0 w-full h-0.5 bg-red-600/40 shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-scan-y" />
            </div>
          )}

          {/* Title & Info Overlay (Bottom) */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-3 bg-gradient-to-t from-black via-black/80 to-transparent transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
             <h3 className="text-[10px] font-black text-white uppercase tracking-tighter mb-1 truncate">{evidence.title}</h3>
             <div className="flex items-center justify-between">
                <div className="flex gap-1">
                   {Array.from({ length: totalClues }).map((_, i) => (
                     <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < discoveredCount ? 'bg-red-600' : 'bg-white/10'}`} />
                   ))}
                </div>
                <span className="text-[7px] font-black text-zinc-500 uppercase">{discoveredCount}/{totalClues} مـكتشف</span>
             </div>
          </div>

          {/* Lab Interaction Icon */}
          <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 delay-75">
                   <Microscope size={24} />
                </div>
                <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">فحص مخبري</span>
             </div>
          </div>
        </div>

        {/* Ultra-slim Progress Bar at bottom */}
        {totalClues > 0 && (
          <div className="h-1 w-full bg-white/5 relative z-30">
            <div 
              className={`h-full transition-all duration-1000 ${isFullyAnalyzed ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]'}`} 
              style={{ width: `${(discoveredCount / totalClues) * 100}%` }} 
            />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-y {
          0% { transform: translateY(0); }
          100% { transform: translateY(300%); }
        }
        .animate-scan-y {
          animation: scan-y 2s linear infinite;
        }
      `}} />
    </div>
  );
});

export default EvidenceCard;
