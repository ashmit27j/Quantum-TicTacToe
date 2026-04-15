import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { toBlochCoords, BlochCoords, newSuperposition } from '../engine/quantumState';

export interface BlochSphereData {
  moveId: number;
  player: 'X' | 'O';
  label: string;
  cells: [number, number];
  collapsed: boolean;
  coords: BlochCoords;
}

export function useBlochSpheres(): BlochSphereData[] {
  const moves = useGameStore(s => s.moves);
  const qubitStates = useGameStore(s => s.qubitStates);

  return useMemo(() => {
    return moves.map(m => {
      const state = qubitStates.get(m.id) || newSuperposition();
      return {
        moveId: m.id,
        player: m.player,
        label: `${m.player}${m.turnNumber}`,
        cells: m.cells,
        collapsed: m.collapsed,
        coords: toBlochCoords(state),
      };
    });
  }, [moves, qubitStates]);
}
