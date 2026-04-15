import { useGameStore } from '../store/gameStore';

export function useCycleDetection() {
  const cycleDetected = useGameStore(s => s.cycleDetected);
  const lastCycle = useGameStore(s => s.lastCycle);
  const collapseEvents = useGameStore(s => s.collapseEvents);

  return {
    cycleDetected,
    lastCycle,
    collapseCount: collapseEvents.length,
    lastCollapse: collapseEvents.length > 0 ? collapseEvents[collapseEvents.length - 1] : null,
    cycleLengths: collapseEvents.map(e => e.cycleEdges.length),
  };
}
