import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Play, Square, Zap, Settings } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-50 w-full bg-[#18181b] border-b border-[#27272a] shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 lg:px-8 py-3 max-w-[1400px] mx-auto">
        {/* Title Section (Left) */}
        <div className="text-left flex flex-col items-start">
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

        {/* Controls Section (Right) */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Mode badge */}
          <div>
            <button
              onClick={toggleGameModeSelector}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display tracking-wider
            border border-violet-500/30 bg-violet-900/10 text-violet-300 hover:bg-violet-900/20 transition-all"
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
