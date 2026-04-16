import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Play, Square, Zap, Settings, Menu, X } from 'lucide-react';

const MODE_LABELS: Record<string, string> = {
  classic: '🔬 CLASSIC QUANTUM',
  fast: '⚡ FAST COLLAPSE',
  bomb: '🧨 ENTANGLEMENT BOMB',
  cyclic: '🌀 CYCLIC QUANTUM',
  blind: '🔮 BLIND QUANTUM',
  timed: '⏱️ TIMED BLITZ',
  ai: '🤖 VS AI',
  local: '👥 2P LOCAL',
  online: '🌐 2P ONLINE',
  tutorial: '📚 TUTORIAL',
  chaos: '🔥 CHAOS MODE',
};

export default function GameHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMuted = useGameStore(s => s.isMuted);
  const toggleMute = useGameStore(s => s.toggleMute);
  const toggleHowToPlay = useGameStore(s => s.toggleHowToPlay);
  const toggleGameModeSelector = useGameStore(s => s.toggleGameModeSelector);
  const resetGame = useGameStore(s => s.resetGame);
  const runTestcase = useGameStore(s => s.runTestcase);
  const stopTestcase = useGameStore(s => s.stopTestcase);
  const isTestcaseRunning = useGameStore(s => s.isTestcaseRunning);
  const startAutoplay = useGameStore(s => s.startAutoplay);
  const stopAutoplay = useGameStore(s => s.stopAutoplay);
  const isAutoPlaying = useGameStore(s => s.isAutoPlaying);
  const gameMode = useGameStore(s => s.gameMode);

  // Close drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#18181b] border-b border-[#27272a] shadow-lg min-h-[50px] flex items-center">
        <div className="flex flex-row items-center w-full justify-between px-4 lg:px-8 py-2 max-w-[1400px] mx-auto">
          
          {/* Mobile Hamburger Icon Container */}
          <div className="flex items-center justify-start md:hidden w-full">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="text-gray-400 hover:text-white p-1 -ml-1 flex items-center justify-center transition-colors hover:bg-[#27272a] rounded-md"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Title Section (Desktop Only) */}
          <div className="hidden md:flex flex-col items-start text-left shrink-0">
            <motion.h1
              className="font-display font-bold leading-none"
              style={{
                color: '#0ea5e9',
                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                letterSpacing: '0.15em',
              }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              QUANTUM TIC TAC TOE
            </motion.h1>
            <p className="font-display text-[0.65rem] tracking-[0.25em] opacity-40 mt-1.5">
              TIC TAC TOE IN THE QUANTUM REALM
            </p>
          </div>

          {/* Controls Section (Desktop Only) */}
          <div className="hidden md:flex items-center gap-2 flex-wrap justify-end">
            {/* Mode badge */}
            <div>
              <button
                onClick={toggleGameModeSelector}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display tracking-wider
              border border-violet-500/30 bg-violet-900/10 text-violet-300 hover:bg-violet-900/20 transition-all whitespace-nowrap"
              >
                <Settings size={12} />
                {MODE_LABELS[gameMode] || gameMode.toUpperCase()}
              </button>
            </div>
            <ControlBtn icon={<RotateCcw size={14} />} label="NEW" onClick={resetGame} />
            <ControlBtn
              icon={isTestcaseRunning ? <Square size={14} /> : <Zap size={14} />}
              label={isTestcaseRunning ? 'STOP' : 'DEMO'}
              onClick={isTestcaseRunning ? stopTestcase : runTestcase}
              active={isTestcaseRunning}
            />
            <ControlBtn
              icon={isAutoPlaying ? <Square size={14} /> : <Play size={14} />}
              label={isAutoPlaying ? 'STOP' : 'AUTO'}
              onClick={isAutoPlaying ? stopAutoplay : startAutoplay}
              active={isAutoPlaying}
            />
            <ControlBtn icon={<HelpCircle size={14} />} label="HELP" onClick={toggleHowToPlay} />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full max-h-screen w-64 bg-[#18181b] border-r border-[#27272a] shadow-2xl z-[70] flex flex-col p-5 md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-sky-500 font-display text-sm tracking-widest font-bold">MENU</span>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-400 hover:text-white p-1 hover:bg-[#27272a] rounded-md transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col gap-3">
                {/* Mode badge */}
                <button
                  onClick={() => { toggleGameModeSelector(); setIsDrawerOpen(false); }}
                  className="inline-flex items-center justify-center gap-2 px-3 py-3 rounded-md text-xs font-display tracking-wider border border-violet-500/30 bg-violet-900/10 text-violet-300 hover:bg-violet-900/20 transition-all w-full mb-2"
                >
                  <Settings size={14} />
                  {MODE_LABELS[gameMode] || gameMode.toUpperCase()}
                </button>
                
                <DrawerControlBtn 
                  icon={<RotateCcw size={16} />} 
                  label="NEW GAME" 
                  onClick={() => { resetGame(); setIsDrawerOpen(false); }} 
                />
                <DrawerControlBtn
                  icon={isTestcaseRunning ? <Square size={16} /> : <Zap size={16} />}
                  label={isTestcaseRunning ? 'STOP DEMO' : 'RUN DEMO'}
                  onClick={() => { isTestcaseRunning ? stopTestcase() : runTestcase(); setIsDrawerOpen(false); }}
                  active={isTestcaseRunning}
                />
                <DrawerControlBtn
                  icon={isAutoPlaying ? <Square size={16} /> : <Play size={16} />}
                  label={isAutoPlaying ? 'STOP AUTO' : 'START AUTO'}
                  onClick={() => { isAutoPlaying ? stopAutoplay() : startAutoplay(); setIsDrawerOpen(false); }}
                  active={isAutoPlaying}
                />
                <DrawerControlBtn 
                  icon={<HelpCircle size={16} />} 
                  label="HOW TO PLAY" 
                  onClick={() => { toggleHowToPlay(); setIsDrawerOpen(false); }} 
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ControlBtn({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-display tracking-wider
        transition-all ${active
          ? 'border border-yellow-500 text-yellow-300 bg-yellow-900/10'
          : 'border border-[#27272a] text-gray-400 hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-900/10'
        }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

function DrawerControlBtn({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-display tracking-wider
        transition-all text-left w-full ${active
          ? 'border border-yellow-500 text-yellow-300 bg-yellow-900/10'
          : 'border border-[#27272a] text-gray-300 hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-900/10'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

