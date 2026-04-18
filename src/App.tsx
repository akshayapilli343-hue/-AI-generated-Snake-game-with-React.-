import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { motion } from 'motion/react';
import { Music, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-corrupted-bg text-glitch-cyan selection:bg-glitch-magenta selection:text-black flex flex-col items-center p-4">
      {/* Visual Artifacts */}
      <div className="scanline" />
      <div className="static-noise" />
      
      {/* Header Overlay */}
      <div className="fixed top-0 left-0 w-full h-1 bg-glitch-magenta/30 z-[101]" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-glitch-cyan/30 z-[101]" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12 py-12">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-double border-glitch-cyan pb-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-1"
          >
            <h1 className="text-4xl font-retro glitch-text tracking-tighter leading-none mb-2">
              NEURAL_PULSE.EXE
            </h1>
            <div className="flex gap-4 font-mono text-[10px] text-glitch-magenta font-bold">
              <span>STATUS: [OVERLOAD]</span>
              <span>USER: akshayapilli343</span>
              <span>LOC: ASIA_EAST_1</span>
            </div>
          </motion.div>

          <div className="font-mono text-[10px] text-right opacity-60">
            <p>KERNEL_VERSION: 18.04.2026</p>
            <p>SYS_TIME: 04:57:57_UTC</p>
            <p className="text-glitch-magenta">_ENCRYPTION_ACTIVE</p>
          </div>
        </header>

        {/* Binary Feed */}
        <div className="w-full overflow-hidden whitespace-nowrap opacity-10 font-mono text-[8px] select-none pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-marquee inline-block whitespace-nowrap">
              01011100 11101010 00010101 11110000 10101010 01010101 11000011 10101010 01110001 00001111 10110011 11001100 
            </div>
          ))}
        </div>

        {/* Content Matrix */}
        <main className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* Logic Field */}
          <section className="flex flex-col gap-4">
             <div className="flex items-center gap-4 mb-4">
                <span className="font-retro text-[10px] bg-glitch-cyan text-black px-2 py-1">MATRIX_01</span>
                <div className="h-px grow bg-glitch-cyan/20" />
                <span className="text-[10px] opacity-40">_CORE_INTERACTION</span>
             </div>
             <SnakeGame />
          </section>

          {/* Audio Matrix */}
          <aside className="flex flex-col gap-8">
             <div className="flex items-center gap-4 mb-4">
                <span className="font-retro text-[10px] bg-glitch-magenta text-black px-2 py-1">FREQ_02</span>
                <div className="h-px grow bg-glitch-magenta/20" />
                <span className="text-[10px] opacity-40">_SYNTH_BUFFER</span>
             </div>
             <MusicPlayer />

             <div className="crt-border p-6 font-mono text-xs space-y-4 opacity-70">
                <h3 className="font-retro text-[8px] mb-4 text-glitch-yellow">LOG_STREAM:</h3>
                <div className="space-y-1">
                  <p className="text-glitch-magenta">&gt; initializing sound_helix_protocol...</p>
                  <p>&gt; loading track_manifest.json [DONE]</p>
                  <p>&gt; verifying integrity... 100%</p>
                  <p className="animate-pulse">&gt; cursor_pos: {Math.floor(Math.random() * 99999)}</p>
                </div>
             </div>
          </aside>
        </main>

        <footer className="mt-12 pt-8 border-t-2 border-glitch-cyan/30 flex justify-between items-center font-retro text-[8px] opacity-40">
           <span>(C) 2026_VOID_TECH</span>
           <div className="flex gap-8">
             <span className="hover:text-glitch-yellow hover:opacity-100 cursor-none transition-all">TERMINATE</span>
             <span className="hover:text-glitch-magenta hover:opacity-100 cursor-none transition-all">REBROADCAST</span>
           </div>
        </footer>
      </div>
    </div>
  );
}
