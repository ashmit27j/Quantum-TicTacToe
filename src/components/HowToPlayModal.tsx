import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const sections = [
  {
    num: '01',
    title: 'YOUR MARK EXISTS IN TWO PLACES!',
    color: '#00f0ff',
    text: 'Click any TWO empty squares. Your mark lives in both simultaneously — until reality decides! This is quantum superposition.',
    icon: '⚛️',
  },
  {
    num: '02',
    title: 'ENTANGLEMENT = QUANTUM TWINS',
    color: '#bb00ff',
    text: 'When two moves share a square, they become entangled. The purple beams show which squares are linked. What happens to one... affects the other!',
    icon: '🔗',
  },
  {
    num: '03',
    title: 'CYCLE = COLLAPSE!',
    color: '#ff2222',
    text: 'When entanglements form a LOOP (cycle), reality SNAPS! All marks in the loop collapse instantly to definite positions. Watch the lightning! Example: moves in squares (0,1), (1,2), (2,0) form a triangle — COLLAPSE!',
    icon: '⚡',
  },
  {
    num: '04',
    title: 'WINNING',
    color: '#ffd700',
    text: 'After collapse, normal rules apply. Get 3 classical marks in a row (horizontal, vertical, or diagonal) to WIN! Collapsed marks are permanent.',
    icon: '🏆',
  },
  {
    num: '05',
    title: 'GAME MODES',
    color: '#00ff44',
    text: 'Press ESC to open the mode selector. Try Classic Quantum, Fast Collapse, Chaos Mode, vs AI, and more! Each mode has unique collapse rules.',
    icon: '🎮',
  },
  {
    num: '06',
    title: 'PRO TIPS',
    color: '#ff00aa',
    text: '• Create cycles in YOUR favor to control collapse outcomes\n• Avoid giving opponent cycle opportunities\n• Center square (4) appears in most possible cycles — control it!\n• Watch the Cycle Detection indicator on the right',
    icon: '💡',
  },
  {
    num: '07',
    title: 'BLOCH SPHERE & CIRCUIT',
    color: '#00f0ff',
    text: 'The bottom shows quantum state visualizations. Bloch Spheres show where each superposition "points" in quantum space. The Circuit shows the quantum gates applied. Both animate during collapse!',
    icon: '🔮',
  },
];

export default function HowToPlayModal() {
  const show = useGameStore(s => s.showHowToPlay);
  const toggle = useGameStore(s => s.toggleHowToPlay);
  const runTestcase = useGameStore(s => s.runTestcase);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggle}
        >
          <motion.div
            className="glass-panel-strong p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Title */}
            <motion.h1
              className="font-display text-2xl md:text-3xl text-center mb-6 neon-sign"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 10px #00f0ff, 0 0 30px rgba(0,240,255,0.5), 0 0 60px rgba(0,240,255,0.2)',
              }}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              WELCOME TO THE QUANTUM REALM
            </motion.h1>

            {/* Sections */}
            <div className="space-y-4">
              {sections.map((sec, i) => (
                <motion.div
                  key={sec.num}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-panel p-4"
                  style={{ borderColor: sec.color + '40' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{sec.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="font-mono text-xs px-1.5 py-0.5 rounded"
                          style={{
                            color: sec.color,
                            background: sec.color + '15',
                            border: `1px solid ${sec.color}40`,
                          }}
                        >
                          {sec.num}
                        </span>
                        <h3
                          className="font-display text-sm tracking-wide font-bold"
                          style={{ color: sec.color }}
                        >
                          {sec.title}
                        </h3>
                      </div>
                      <p className="text-sm opacity-70 leading-relaxed whitespace-pre-line">
                        {sec.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-4 glass-panel p-3">
              <p className="font-display text-xs neon-text-gold tracking-wide mb-2">
                KEYBOARD SHORTCUTS
              </p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {[
                  ['N', 'New Game'],
                  ['R', 'Run Demo'],
                  ['H', 'Help (this)'],
                  ['M', 'Mute/Unmute'],
                  ['ESC', 'Game Modes'],
                ].map(([key, desc]) => (
                  <div key={key} className="flex items-center gap-2 opacity-60">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-xs">
                      {key}
                    </kbd>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start button */}
            <div className="mt-6 text-center space-y-3">
              <motion.button
                onClick={() => { toggle(); runTestcase(); }}
                className="neon-btn text-lg px-8 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontSize: '1rem' }}
              >
                🚀 START TUTORIAL DEMO
              </motion.button>
              <br />
              <button
                onClick={toggle}
                className="text-xs opacity-40 hover:opacity-70 transition-opacity"
              >
                Close (H)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
