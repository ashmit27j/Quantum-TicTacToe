import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { measurementEntropy, newSuperposition } from '../engine/quantumState';

export function useQuantumSimulation() {
  const moves = useGameStore(s => s.moves);
  const qubitStates = useGameStore(s => s.qubitStates);
  const classicalBoard = useGameStore(s => s.classicalBoard);

  const totalQubits = useMemo(
    () => moves.filter(m => !m.collapsed).length,
    [moves]
  );

  const totalEntropy = useMemo(() => {
    let sum = 0;
    for (const m of moves) {
      if (!m.collapsed) {
        const state = qubitStates.get(m.id) || newSuperposition();
        sum += measurementEntropy(state);
      }
    }
    return sum;
  }, [moves, qubitStates]);

  const classicalCount = useMemo(
    () => classicalBoard.filter(c => c !== null).length,
    [classicalBoard]
  );

  return {
    totalQubits,
    totalEntropy,
    classicalCount,
    superpositionCount: moves.filter(m => !m.collapsed).length,
  };
}
