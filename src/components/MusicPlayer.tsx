import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const onEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="crt-border bg-black/40 backdrop-blur-sm w-full max-w-md mx-auto relative overflow-hidden group">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
      />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Track Info */}
        <div className="flex items-start gap-4 p-2 border-b-2 border-glitch-cyan/30">
          <motion.div 
            key={currentTrack.id}
            initial={{ filter: 'grayscale(1) contrast(3)' }}
            animate={{ filter: 'grayscale(0) contrast(1)' }}
            className="w-24 h-24 rounded-none border-2 border-glitch-magenta shrink-0"
          >
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale-[0.8] hover:grayscale-0 transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex flex-col min-w-0 font-retro">
            <h3 className="text-lg glitch-text text-glitch-yellow leading-tight mb-2 underline decoration-glitch-magenta">{currentTrack.title}</h3>
            <p className="text-glitch-magenta text-[10px] leading-tight break-all opacity-80">{currentTrack.artist}_ID:0X{currentTrack.id}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 px-2">
           <div className="flex justify-between text-[10px] font-mono text-glitch-cyan/60 tracking-tighter mb-1">
            <span>BITSTREAM_POSITION: {formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>TOTAL_BUFF: {formatTime(audioRef.current?.duration || 0)}</span>
          </div>
          <div className="h-4 w-full bg-glitch-cyan/10 border border-glitch-cyan/30 overflow-hidden relative">
            <motion.div 
              className="h-full bg-glitch-cyan absolute left-0 top-0"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.2 }}
            >
               <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.5)_2px,rgba(0,0,0,0.5)_4px)]" />
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 p-2 bg-glitch-cyan/5 border-t border-glitch-cyan/20">
          <button 
            onClick={handlePrev}
            className="p-3 border-2 border-transparent hover:border-glitch-magenta hover:text-glitch-magenta transition-all font-retro text-[8px]"
          >
            [PREV]
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-6 py-3 border-4 border-glitch-cyan bg-glitch-cyan text-black font-retro text-xs hover:bg-black hover:text-glitch-cyan transition-all glitch-text"
          >
            {isPlaying ? "|| PAUSE" : "> ACCESS"}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 border-2 border-transparent hover:border-glitch-magenta hover:text-glitch-magenta transition-all font-retro text-[8px]"
          >
            [NEXT]
          </button>
        </div>

        {/* Binary Static Visualization */}
        <div className="p-2 font-mono text-[8px] opacity-30 flex flex-wrap gap-1 leading-none h-12 overflow-hidden pointer-events-none">
          {Array.from({ length: 150 }).map((_, i) => (
            <span key={i}>{Math.random() > 0.5 ? '1' : '0'}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
