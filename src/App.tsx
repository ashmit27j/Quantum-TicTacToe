import { useState, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useKeyboard } from './hooks/useKeyboard';
import { useGameStore } from './store/gameStore';

// Components
import CRTOverlay from './components/CRTOverlay';
import LoadingScreen from './components/LoadingScreen';
import GameHeader from './components/GameHeader';
import NeonBoard from './components/NeonBoard';
import EntanglementBeams from './components/EntanglementBeams';
import CollapseAnimation from './components/CollapseAnimation';
import PlayerInfo from './components/PlayerInfo';
import MoveHistory from './components/MoveHistory';
import MetricsHUD from './components/MetricsHUD';
import EntanglementGraphVis from './components/EntanglementGraphVis';
import GameModeSelector from './components/GameModeSelector';
import HowToPlayModal from './components/HowToPlayModal';
import SoundManager from './components/SoundManager';
import QuantumCircuitViewer from './components/QuantumCircuitViewer';

// Lazy load Bloch Spheres (heavy Three.js)
const BlochSphereGrid = lazy(() => import('./components/BlochSphereGrid'));

export default function App() {
  const [loading, setLoading] = useState(true);
  const isTestcaseRunning = useGameStore(s => s.isTestcaseRunning);

  useKeyboard();

  if (loading) {
    return (
      <AnimatePresence>
        <LoadingScreen onComplete={() => setLoading(false)} />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen text-[#fafafa] relative overflow-hidden flex flex-col">
      {/* Sound */}
      <SoundManager />

      {/* Collapse flash */}
      <CollapseAnimation />

      {/* Testcase banner */}
      {isTestcaseRunning && (
        <div className="testcase-banner">
          TESTCASE RUNNING... SEED=42
        </div>
      )}

      {/* Sticky Full-width Header */}
      <GameHeader />

      {/* Main layout */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-3 py-4 flex-grow w-full"
        style={{ paddingTop: isTestcaseRunning ? '0px' : '0px' }}
      >
        {/* HUD Layout: Stacked for fully centered design */}
        <div className="mt-4 flex flex-col lg:flex-row justify-center items-stretch gap-6 w-full max-w-6xl mx-auto">
          {/* ── LEFT PANEL ── */}
          <div className="order-2 lg:order-1 space-y-3 flex-1 min-w-72 flex flex-col">
            <MoveHistory />
            <QuantumCircuitViewer />
          </div>

          {/* ── CENTER: BOARD ── */}
          <div className="order-1 lg:order-2 flex flex-col items-center">
            {/* Select instruction */}
            {/* <SelectInstruction /> */}

            <div className="relative w-full max-w-sm">
              <NeonBoard />
              <EntanglementBeams />
            </div>

            <CollapseReasonMessage />

            <div className="w-full max-w-sm mt-4">
              <PlayerInfo />
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="order-3 space-y-3 flex-1 min-w-72 flex flex-col">
            <EntanglementGraphVis />
            <Suspense fallback={
              <div className="glass-panel p-3 text-center">
                <p className="text-xs opacity-30">Loading Bloch...</p>
              </div>
            }>
              <BlochSphereGrid />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Full Width Footer */}
      <footer className="w-full bg-[#18181b]/90 border-t border-[#27272a] py-6 sm:py-8 mt-12 z-10 relative backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Credits */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
            <p className="font-display text-xs text-sky-500/70 tracking-wide uppercase">
              Created By
            </p>
            <p className="font-mono text-xs sm:text-sm text-gray-400 opacity-80 flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              <span className="hover:text-white transition-colors cursor-default">Ashmit Jain</span>
              <span className="text-gray-700 hidden sm:inline">•</span>
              <span className="hover:text-white transition-colors cursor-default">Rohan Bhoge</span>
              <span className="text-gray-700 hidden sm:inline">•</span>
              <span className="hover:text-white transition-colors cursor-default">Akshaj Ramakrishnan</span>
              <span className="text-gray-700 hidden sm:inline">•</span>
              <span className="hover:text-white transition-colors cursor-default">Tanay Shah</span>
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-col items-center md:items-end gap-1.5">
            <p className="font-display text-xs text-sky-500/70 tracking-wide uppercase">
              Source Code
            </p>
            <a
              href="https://github.com/ashmit27j/Quantum-TicTacToe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm transition-colors hover:bg-[#27272a] px-3 py-1.5 rounded-md -mr-3"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GameModeSelector />
      <HowToPlayModal />

      {/* Mobile responsive overlay for narrow screens */}
      <style>{`
        @media (max-width: 900px) {
          .grid[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// function SelectInstruction() {
//   const selectedCells = useGameStore(s => s.selectedCells);
//   const gameOver = useGameStore(s => s.gameOver);
//   const currentPlayer = useGameStore(s => s.currentPlayer);

//   if (gameOver) return null;

//   const colorClass = currentPlayer === 'X' ? 'text-sky-500' : 'text-yellow-500';

//   return (
//     <div className="mb-2 text-center">
//       {selectedCells.length === 0 ? (
//         <p className={\`font-display text-xs tracking-wide \${colorClass} opacity-70\`}>
//           SELECT FIRST CELL FOR {currentPlayer}
//         </p>
//       ) : (
//         <p className="font-display text-xs tracking-wide text-yellow-500 opacity-70">
//           CELL {selectedCells[0]} SELECTED — PICK SECOND CELL
//         </p>
//       )}
//     </div>
//   );
// }

function CollapseReasonMessage() {
  const reason = useGameStore(s => s.pendingCollapseReason);

  if (!reason) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90vw]">
      <div className="bg-[#18181b]/95 backdrop-blur-sm border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] px-6 py-4 rounded-xl text-center transform transition-all">
        <h3 className="font-display font-bold text-yellow-500 tracking-wide text-sm md:text-base animate-pulse">
          COLLAPSE OCCURRING
        </h3>
        <p className="font-mono text-xs md:text-sm text-gray-300 mt-2 opacity-80">
          {reason}
        </p>
      </div>
    </div>
  );
}
