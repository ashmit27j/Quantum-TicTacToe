import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GameMode } from '../store/gameStore';

const MODES: { id: GameMode; icon: string; name: string; desc: string }[] = [
  { id: 'classic', icon: '🔬', name: 'Classic Quantum', desc: 'Cycle detection + collapse' },
  { id: 'fast', icon: '⚡', name: 'Fast Collapse', desc: 'Collapse every 2 moves' },
  { id: 'bomb', icon: '🧨', name: 'Entanglement Bomb', desc: 'Triplet entanglement (3 cells)' },
  { id: 'cyclic', icon: '🌀', name: 'Cyclic Quantum', desc: 'Toroidal wrap-around board' },
  { id: 'blind', icon: '🔮', name: 'Blind Quantum', desc: 'Hidden opponent superpositions' },
  { id: 'timed', icon: '⏱️', name: 'Timed Blitz', desc: '15s per move, auto-AI fill' },
  { id: 'ai', icon: '🤖', name: 'vs AI Quantum', desc: 'Play against quantum AI' },
  { id: 'local', icon: '👥', name: '2 Player Local', desc: 'Same device, take turns' },
  { id: 'online', icon: '🌐', name: '2P Online Mock', desc: 'Simulated delay opponent' },
  { id: 'tutorial', icon: '📚', name: 'Tutorial Mode', desc: 'Guided walkthrough' },
  { id: 'chaos', icon: '🔥', name: 'CHAOS MODE', desc: 'Random collapse + rewiring' },
];

export default function GameModeSelector() {
  const show = useGameStore(s => s.showGameModeSelector);
  const setGameMode = useGameStore(s => s.setGameMode);
  const currentMode = useGameStore(s => s.gameMode);
  const toggleGameModeSelector = useGameStore(s => s.toggleGameModeSelector);
  const aiDifficulty = useGameStore(s => s.aiDifficulty);
  const setAIDifficulty = useGameStore(s => s.setAIDifficulty);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleGameModeSelector}
        >
          <motion.div
            className="glass-panel-strong p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-display text-xl neon-text-cyan text-center mb-4 tracking-wide">
              SELECT GAME MODE
            </h2>

            <div className="space-y-2">
              {MODES.map(mode => (
                <motion.button
                  key={mode.id}
                  onClick={() => setGameMode(mode.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentMode === mode.id
                      ? 'neon-border-cyan bg-cyan-900/20'
                      : 'border border-transparent hover:border-cyan-800/50 hover:bg-white/5'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{mode.icon}</span>
                    <div>
                      <div className="font-display text-sm tracking-wide">
                        {mode.name}
                        {currentMode === mode.id && (
                          <span className="ml-2 text-xs neon-text-green">ACTIVE</span>
                        )}
                      </div>
                      <div className="text-xs opacity-50">{mode.desc}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* AI Difficulty */}
            {currentMode === 'ai' && (
              <div className="mt-4 glass-panel p-3">
                <p className="font-display text-xs neon-text-gold tracking-wide mb-2">
                  AI DIFFICULTY
                </p>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setAIDifficulty(d)}
                      className={`flex-1 py-1.5 rounded text-xs font-display tracking-wide ${
                        aiDifficulty === d
                          ? 'neon-border-gold bg-yellow-900/20 text-yellow-300'
                          : 'border border-gray-700 opacity-50 hover:opacity-80'
                      }`}
                    >
                      {d.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-center">
              <span className="text-xs opacity-30">Press ESC to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
