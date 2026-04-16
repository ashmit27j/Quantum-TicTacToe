import { motion, AnimatePresence } from 'framer-motion';
import { useCycleDetection } from '../hooks/useCycleDetection';
import { useGameStore } from '../store/gameStore';

export default function CycleDetectorIndicator() {
  const { cycleDetected, collapseCount, cycleLengths } = useCycleDetection();
  const entanglementGraph = useGameStore(s => s.entanglementGraph);
  const edges = entanglementGraph.getEdges();

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs text-white tracking-wide text-center mb-2">
        CYCLE DETECTOR
      </p>

      <AnimatePresence mode="wait">
        {cycleDetected ? (
          <motion.div
            key="detected"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center"
          >
            <div className="text-yellow-500 font-display text-sm font-bold animate-pulse-neon tracking-wide">
              CYCLE FOUND!
            </div>
            <div className="text-xs text-yellow-500 opacity-70 mt-1">
              Collapse imminent...
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-cycle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="text-emerald-500 font-display text-sm font-bold tracking-wide">
              NO CYCLE
            </div>
            <div className="text-xs opacity-40 mt-1">
              {edges.length} active entanglement{edges.length !== 1 ? 's' : ''}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div>
          <div className="font-mono text-lg text-purple-400 font-bold">{collapseCount}</div>
          <div className="text-xs opacity-40">Collapses</div>
        </div>
        <div>
          <div className="font-mono text-lg text-yellow-400 font-bold">{edges.length}</div>
          <div className="text-xs opacity-40">Edges</div>
        </div>
      </div>

      {/* Cycle length history */}
      {cycleLengths.length > 0 && (
        <div className="mt-2">
          <div className="text-xs opacity-30 text-center mb-1">Cycle sizes</div>
          <div className="flex gap-1 justify-center">
            {cycleLengths.map((len, i) => (
              <div
                key={i}
                className="w-6 text-center text-xs font-mono rounded"
                style={{
                  background: `rgba(139, 92, 246, ${0.2 + len * 0.1})`,
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  color: '#c4b5fd',
                }}
              >
                {len}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
