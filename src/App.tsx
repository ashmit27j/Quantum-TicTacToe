import { useState, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useKeyboard } from './hooks/useKeyboard';
import { useGameStore } from './store/gameStore';

// Components
import NeonParticlesBg from './components/NeonParticlesBg';
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
    <div className="min-h-screen  text-[#fafafa] relative overflow-hidden">
      {/* Background layers */}
      <NeonParticlesBg />

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
        className="relative z-10 max-w-7xl mx-auto px-3 py-4"
        style={{ paddingTop: isTestcaseRunning ? '0px' : '0px' }}
      >
        {/* HUD Layout: Stacked for fully centered design */}
        <div className="mt-4 flex flex-col lg:flex-row justify-center items-stretch gap-6 w-full max-w-6xl mx-auto">
          {/* ── LEFT PANEL ── */}
          <div className="space-y-3 flex-1 min-w-[280px] flex flex-col">
            <MoveHistory />
            <QuantumCircuitViewer />
          </div>

          {/* ── CENTER: BOARD ── */}
          <div className="flex flex-col items-center">
            {/* Select instruction */}
            {/* <SelectInstruction /> */}

            <div className="relative w-full" style={{ maxWidth: 380 }}>
              <NeonBoard />
              <EntanglementBeams />
            </div>

            <CollapseReasonMessage />

            <div className="w-full max-w-[380px] mt-4">
              <PlayerInfo />
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="space-y-3 flex-1 min-w-[280px] flex flex-col">
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


        {/* Footer */}
        <footer className="mt-6 text-center">
          <p className="font-mono text-xs opacity-15 tracking-wider">

          </p>
        </footer>
      </div>

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
//         <p className={`font-display text-xs tracking-wider ${colorClass} opacity-70`}>
//           SELECT FIRST CELL FOR {currentPlayer}
//         </p>
//       ) : (
//         <p className="font-display text-xs tracking-wider text-yellow-500 opacity-70">
//           CELL {selectedCells[0]} SELECTED — PICK SECOND CELL
//         </p>
//       )}
//     </div>
//   );
// }

function CollapseReasonMessage() {
  return null;
}
