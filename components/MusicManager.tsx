
import React, { useEffect, useRef } from 'react';

export type TrackType = 'menu' | 'investigation' | 'interrogation' | 'notes';

// Updated to more stable direct links with fallback awareness
const TRACKS: Record<TrackType, string> = {
  menu: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', // Placeholder stable link
  investigation: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
  interrogation: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  notes: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

interface Props {
  activeTrack: TrackType;
  isMusicPlaying: boolean;
  volume: number;
}

const MusicManager: React.FC<Props> = ({ activeTrack, isMusicPlaying, volume }) => {
  const audioRefs = useRef<Record<TrackType, HTMLAudioElement | null>>({
    menu: null,
    investigation: null,
    interrogation: null,
    notes: null,
  });

  useEffect(() => {
    Object.entries(TRACKS).forEach(([key, url]) => {
      try {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = url;
        audio.loop = true;
        audio.volume = 0;
        
        // Handle errors gracefully to prevent "no supported sources" console spam
        audio.onerror = () => {
          console.warn(`Failed to load track: ${key}. Background music for this section will be disabled.`);
          audioRefs.current[key as TrackType] = null;
        };

        audioRefs.current[key as TrackType] = audio;
      } catch (e) {
        console.error(`Audio initialization failed for ${key}:`, e);
      }
    });

    return () => {
      // Fix: Explicitly cast to (HTMLAudioElement | null)[] to resolve "type 'unknown'" errors in older TS environments
      (Object.values(audioRefs.current) as (HTMLAudioElement | null)[]).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
          audio.load(); // Forces clearing of the source
        }
      });
    };
  }, []);

  useEffect(() => {
    const tracks = Object.entries(audioRefs.current) as [TrackType, HTMLAudioElement | null][];
    
    tracks.forEach(([key, audio]) => {
      if (!audio) return;

      if (key === activeTrack && isMusicPlaying) {
        audio.volume = volume;
        if (audio.paused) {
          audio.play().catch(() => {
            // Silently fail if browser blocks autoplay
          });
        }
      } else {
        // Fade out or pause
        audio.volume = 0;
        if (!audio.paused) {
          audio.pause();
        }
      }
    });
  }, [volume, activeTrack, isMusicPlaying]);

  return null;
};

export default MusicManager;
