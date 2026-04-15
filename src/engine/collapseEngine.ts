/**
 * Collapse Engine — resolves quantum superpositions to classical marks.
 *
 * When a cycle is detected in the entanglement graph:
 * 1. Identify all moves in the cycle
 * 2. For each move, use Born rule to decide which cell gets the mark
 * 3. Propagate: if a cell gets a mark, other moves in that cell lose it
 * 4. Repeat until stable
 */

import seedrandom from 'seedrandom';
import { sampleCollapse, newSuperposition } from './quantumState';
import { CycleResult, GraphEdge } from './entanglementGraph';

export interface QuantumMove {
  id: number;
  player: 'X' | 'O';
  cells: [number, number]; // the two cells this move is in superposition over
  collapsed: boolean;
  collapsedCell: number | null;
  turnNumber: number;
}

export interface CollapseAssignment {
  moveId: number;
  player: 'X' | 'O';
  cell: number;
  label: string;
}

export interface CollapseEvent {
  cycleEdges: GraphEdge[];
  cycleCells: number[];
  assignments: CollapseAssignment[];
  circuitGates: CircuitGate[];
  bitstring: string;
}

export interface CircuitGate {
  name: string;
  qubits: number[];
  params?: number[];
}

/**
 * Collapse a cycle of moves. Returns assignments and circuit info.
 */
export function collapseCycle(
  cycle: CycleResult,
  moves: QuantumMove[],
  classicalBoard: (string | null)[],
  seed?: number
): CollapseEvent {
  const rng = seed !== undefined ? seedrandom(String(seed)) : seedrandom(String(Date.now()));

  // Get moves involved in this cycle
  const cycleMovIds = new Set(cycle.edges.map(e => e.moveId));
  const cycleMoves = moves.filter(m => cycleMovIds.has(m.id) && !m.collapsed);

  const n = cycleMoves.length;

  // Build circuit gates for visualization
  const gates: CircuitGate[] = [];

  // H gates (superposition)
  for (let i = 0; i < n; i++) {
    gates.push({ name: 'H', qubits: [i] });
  }
  gates.push({ name: 'BARRIER', qubits: Array.from({ length: n }, (_, i) => i) });

  // CNOT gates (entanglement)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sharedCells = cycleMoves[i].cells.filter(c => cycleMoves[j].cells.includes(c));
      if (sharedCells.length > 0) {
        gates.push({ name: 'CX', qubits: [i, j] });
      }
    }
  }
  gates.push({ name: 'BARRIER', qubits: Array.from({ length: n }, (_, i) => i) });

  // Cycle detection indicator
  gates.push({ name: 'CYCLE', qubits: Array.from({ length: n }, (_, i) => i) });

  // Measure gates
  for (let i = 0; i < n; i++) {
    gates.push({ name: 'M', qubits: [i] });
  }

  // Simulate collapse using Born rule
  const bits: (0 | 1)[] = [];
  for (let i = 0; i < n; i++) {
    const q = newSuperposition();
    bits.push(sampleCollapse(q, rng));
  }

  const bitstring = bits.join('');

  // Resolve assignments with collision avoidance
  const assignments: CollapseAssignment[] = [];
  const occupied = new Set<number>();

  // First pass: add already-occupied cells
  for (let i = 0; i < 9; i++) {
    if (classicalBoard[i] !== null) {
      occupied.add(i);
    }
  }

  for (let i = 0; i < n; i++) {
    const move = cycleMoves[i];
    const bit = bits[i];
    const preferred = move.cells[bit];
    const fallback = move.cells[1 - bit];

    let cell: number;
    if (!occupied.has(preferred)) {
      cell = preferred;
    } else if (!occupied.has(fallback)) {
      cell = fallback;
    } else {
      // Both occupied — shouldn't happen in valid play, but handle gracefully
      cell = preferred;
    }

    assignments.push({
      moveId: move.id,
      player: move.player,
      cell,
      label: `${move.player}${move.turnNumber}`,
    });
    occupied.add(cell);
  }

  return {
    cycleEdges: cycle.edges,
    cycleCells: cycle.cells,
    assignments,
    circuitGates: gates,
    bitstring,
  };
}

/**
 * Propagation: after a collapse, moves with only one free cell must also collapse.
 */
export function propagateCollapses(
  moves: QuantumMove[],
  classicalBoard: (string | null)[]
): CollapseAssignment[] {
  const additional: CollapseAssignment[] = [];
  let changed = true;

  while (changed) {
    changed = false;
    for (const m of moves) {
      if (m.collapsed) continue;
      const freeCells = m.cells.filter(c => classicalBoard[c] === null);
      if (freeCells.length === 1) {
        const cell = freeCells[0];
        m.collapsed = true;
        m.collapsedCell = cell;
        classicalBoard[cell] = m.player;
        additional.push({
          moveId: m.id,
          player: m.player,
          cell,
          label: `${m.player}${m.turnNumber}`,
        });
        changed = true;
      } else if (freeCells.length === 0) {
        // Edge case: mark the move as collapsed even if no cell available
        m.collapsed = true;
        m.collapsedCell = m.cells[0];
        changed = true;
      }
    }
  }

  return additional;
}
