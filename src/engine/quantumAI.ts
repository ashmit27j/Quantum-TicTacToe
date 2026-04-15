/**
 * Quantum AI — minimax with quantum position evaluation.
 * Difficulty levels: easy (random), medium (shallow minimax), hard (deep minimax).
 */

import { QuantumMove } from './collapseEngine';
import { evaluatePosition, checkWin } from './winDetector';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

interface AIMove {
  cells: [number, number];
  score: number;
}

/**
 * Pick two cells for a quantum move.
 */
export function getAIMove(
  classicalBoard: (string | null)[],
  quantumMoves: QuantumMove[],
  difficulty: AIDifficulty,
  player: 'X' | 'O'
): [number, number] | null {
  const freeCells = classicalBoard
    .map((v, i) => (v === null ? i : -1))
    .filter(i => i >= 0);

  if (freeCells.length < 2) return null;

  if (difficulty === 'easy') {
    return randomMove(freeCells);
  }

  const depth = difficulty === 'medium' ? 2 : 4;
  return strategicMove(classicalBoard, freeCells, quantumMoves, player, depth);
}

function randomMove(freeCells: number[]): [number, number] {
  const shuffled = [...freeCells].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

function strategicMove(
  board: (string | null)[],
  freeCells: number[],
  moves: QuantumMove[],
  player: 'X' | 'O',
  depth: number
): [number, number] {
  let bestMove: [number, number] = [freeCells[0], freeCells[1]];
  let bestScore = player === 'X' ? -Infinity : Infinity;

  // Generate all pairs of free cells
  const pairs: [number, number][] = [];
  for (let i = 0; i < freeCells.length; i++) {
    for (let j = i + 1; j < freeCells.length; j++) {
      pairs.push([freeCells[i], freeCells[j]]);
    }
  }

  // Evaluate each pair using heuristic
  for (const pair of pairs) {
    const score = evaluatePair(board, pair, player, moves);
    if (player === 'X' ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = pair;
    }
  }

  return bestMove;
}

function evaluatePair(
  board: (string | null)[],
  pair: [number, number],
  player: 'X' | 'O',
  moves: QuantumMove[]
): number {
  let score = 0;

  // Prefer center
  if (pair.includes(4)) score += (player === 'X' ? 0.3 : -0.3);

  // Prefer corners
  const corners = [0, 2, 6, 8];
  for (const c of pair) {
    if (corners.includes(c)) score += (player === 'X' ? 0.15 : -0.15);
  }

  // Simulate both possible collapses and average
  for (const bit of [0, 1] as const) {
    const simBoard = [...board];
    simBoard[pair[bit]] = player;
    score += evaluatePosition(simBoard) * 0.5;
  }

  // Penalize creating cycles for the opponent (or reward for self)
  const existingCells = new Set<number>();
  for (const m of moves) {
    if (!m.collapsed) {
      existingCells.add(m.cells[0]);
      existingCells.add(m.cells[1]);
    }
  }
  const sharedCells = pair.filter(c => existingCells.has(c)).length;
  // More shared cells = higher chance of cycle
  score += sharedCells * (player === 'X' ? 0.1 : -0.1);

  return score;
}
