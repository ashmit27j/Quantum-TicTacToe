/**
 * Zustand game store — single source of truth for the entire game.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EntanglementGraph, CycleResult } from '../engine/entanglementGraph';
import { QuantumMove, CollapseEvent, collapseCycle, propagateCollapses } from '../engine/collapseEngine';
import { checkWin, WinResult } from '../engine/winDetector';
import { newSuperposition, QubitState, collapsedState, measurementEntropy } from '../engine/quantumState';
import { getAIMove, AIDifficulty } from '../engine/quantumAI';
import { DEMO_SEQUENCE, DEMO_SEED, DEMO_STEP_DELAY, TestStep } from '../engine/testcaseRunner';

// ── Types ────────────────────────────────────────────────────────────────────

export type GameMode =
  | 'classic'        // Cycle detection + >=3 marks
  | 'fast'           // Collapse every 2 moves
  | 'bomb'           // Triplet entanglement
  | 'cyclic'         // Toroidal board
  | 'blind'          // Hidden opponent superpositions
  | 'timed'          // 15s per move
  | 'ai'             // vs AI
  | 'local'          // 2P local
  | 'online'         // 2P mock online
  | 'tutorial'       // Tutorial mode
  | 'chaos';         // Random chaos

export type Player = 'X' | 'O';

export interface HistoryEntry {
  type: 'move' | 'collapse' | 'win' | 'draw';
  player?: Player;
  cells?: [number, number];
  moveId?: number;
  label?: string;
  collapseEvent?: CollapseEvent;
  description: string;
  timestamp: number;
}

export interface GameState {
  // Board
  classicalBoard: (string | null)[];
  quantumMarks: string[][]; // per cell: array of labels like "X1", "O2"
  moves: QuantumMove[];
  qubitStates: Map<number, QubitState>; // moveId -> qubit state

  // Graph
  entanglementGraph: EntanglementGraph;

  // Game flow
  currentPlayer: Player;
  moveCount: number;
  gameOver: boolean;
  winner: string | null;
  winLine: number[] | null;
  isDraw: boolean;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;

  lastCycle: CycleResult | null;
  cycleDetected: boolean;
  pendingCollapseReason?: string | null;
  collapseEvents: CollapseEvent[];

  // UI
  selectedCells: number[];
  history: HistoryEntry[];
  showHowToPlay: boolean;
  showGameModeSelector: boolean;
  isMuted: boolean;
  isTestcaseRunning: boolean;
  testcaseStep: number;
  isAutoPlaying: boolean;
  moveTimestamps: { player: Player; time: number }[];
  lastMoveTime: number;
  collapseSeed: number;

  // Replay
  replayIndex: number;
  isReplaying: boolean;

  // Timer (timed mode)
  timeRemaining: number;

  // Actions
  selectCell: (cell: number) => void;
  makeMove: (cells: [number, number]) => void;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
  setAIDifficulty: (d: AIDifficulty) => void;
  toggleMute: () => void;
  toggleHowToPlay: () => void;
  toggleGameModeSelector: () => void;
  runTestcase: () => void;
  stopTestcase: () => void;
  autoplayStep: () => void;
  startAutoplay: () => void;
  stopAutoplay: () => void;
  triggerAIMove: () => void;
  setReplayIndex: (i: number) => void;

  // Internal
  _performCollapse: (cycle: CycleResult | null) => void;

  // Computed getters
  getEntropy: () => number[];
  getCellProbabilities: () => { X: number; O: number }[];
}

const INITIAL_STATE = {
  classicalBoard: Array(9).fill(null) as (string | null)[],
  quantumMarks: Array.from({ length: 9 }, () => [] as string[]),
  moves: [] as QuantumMove[],
  qubitStates: new Map<number, QubitState>(),
  entanglementGraph: new EntanglementGraph(),
  currentPlayer: 'X' as Player,
  moveCount: 0,
  gameOver: false,
  winner: null as string | null,
  winLine: null as number[] | null,
  isDraw: false,
  gameMode: 'classic' as GameMode,
  aiDifficulty: 'medium' as AIDifficulty,
  lastCycle: null as CycleResult | null,
  cycleDetected: false,
  collapseEvents: [] as CollapseEvent[],
  selectedCells: [] as number[],
  history: [] as HistoryEntry[],
  showHowToPlay: false,
  showGameModeSelector: false,
  isMuted: false,
  isTestcaseRunning: false,
  testcaseStep: 0,
  isAutoPlaying: false,
  moveTimestamps: [] as { player: Player; time: number }[],
  lastMoveTime: Date.now(),
  collapseSeed: 0,
  pendingCollapseReason: null as string | null,
  replayIndex: -1,
  isReplaying: false,
  timeRemaining: 15,
};

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      ...INITIAL_STATE,

      selectCell: (cell: number) => {
        const state = get();
        if (state.gameOver) return;
        if (state.classicalBoard[cell] !== null) return;

        const selected = [...state.selectedCells];
        if (selected.includes(cell)) {
          // Deselect
          set({ selectedCells: selected.filter(c => c !== cell) });
          return;
        }

        selected.push(cell);
        if (selected.length === 2) {
          // Make the move
          get().makeMove(selected as [number, number]);
          set({ selectedCells: [] });
        } else {
          set({ selectedCells: selected });
        }
      },

      makeMove: (cells: [number, number]) => {
        const state = get();
        if (state.gameOver) return;
        if (cells[0] === cells[1]) return;
        if (state.classicalBoard[cells[0]] !== null || state.classicalBoard[cells[1]] !== null) return;

        const now = Date.now();
        const moveTime = now - state.lastMoveTime;
        const newMoveCount = state.moveCount + 1;

        // Create quantum move
        const move: QuantumMove = {
          id: newMoveCount,
          player: state.currentPlayer,
          cells: [...cells] as [number, number],
          collapsed: false,
          collapsedCell: null,
          turnNumber: newMoveCount,
        };

        const newMoves = [...state.moves, move];
        const newMarks = state.quantumMarks.map(arr => [...arr]);
        const label = `${move.player}${move.turnNumber}`;
        newMarks[cells[0]].push(label);
        newMarks[cells[1]].push(label);

        // Update qubit state
        const newQubitStates = new Map(state.qubitStates);
        newQubitStates.set(move.id, newSuperposition());

        // Add to entanglement graph
        const graph = state.entanglementGraph;
        graph.addEdge(move.id, cells[0], cells[1]);

        // History entry
        const historyEntry: HistoryEntry = {
          type: 'move',
          player: state.currentPlayer,
          cells,
          moveId: move.id,
          label,
          description: `${label}: superposition in cells ${cells[0]} & ${cells[1]}`,
          timestamp: now,
        };

        const newHistory = [...state.history, historyEntry];
        const newTimestamps = [...state.moveTimestamps, { player: state.currentPlayer, time: moveTime }];

        set({
          moves: newMoves,
          quantumMarks: newMarks,
          qubitStates: newQubitStates,
          moveCount: newMoveCount,
          history: newHistory,
          moveTimestamps: newTimestamps,
          lastMoveTime: now,
          cycleDetected: false,
          lastCycle: null,
        });

        // ── Check for collapse triggers ─────────────────────────────────────
        const mode = state.gameMode;
        let shouldCollapse = false;
        let cycle: CycleResult | null = null;
        let reason = '';

        if (mode === 'fast') {
          // Collapse every 2 moves
          if (newMoveCount % 2 === 0 && newMoveCount > 0) {
            shouldCollapse = true;
            reason = 'Fast Mode Limit Reached.';
          }
        }

        if (mode === 'classic' || mode === 'local' || mode === 'ai' || mode === 'tutorial'
          || mode === 'online' || mode === 'timed' || mode === 'bomb' || mode === 'cyclic'
          || mode === 'blind' || mode === 'chaos') {
          // Cycle detection
          cycle = graph.findCycle();
          if (cycle) {
            shouldCollapse = true;
            reason = 'Quantum cycle formulation detected.';
            set({ cycleDetected: true, lastCycle: cycle });
          }
        }

        // Backup rule: cell with >= 3 marks
        if (!shouldCollapse && (mode === 'classic' || mode === 'local')) {
          const overloaded = graph.overloadedCells(3);
          if (overloaded.length > 0) {
            cycle = graph.findCycle();
            if (cycle) {
              shouldCollapse = true;
              reason = 'Cell Density Critical Mass Reached.';
            }
          }
        }

        if (shouldCollapse) {
          set({ pendingCollapseReason: reason });
          setTimeout(() => get()._performCollapse(cycle), 2000);
        } else {
          // Switch player
          const nextPlayer: Player = state.currentPlayer === 'X' ? 'O' : 'X';
          set({ currentPlayer: nextPlayer });

          // AI move
          if (mode === 'ai' && nextPlayer === 'O' && !state.gameOver) {
            setTimeout(() => get().triggerAIMove(), 600);
          }
        }
      },

      _performCollapse: (cycle: CycleResult | null) => {
        const state = get();
        const graph = state.entanglementGraph;
        const board = [...state.classicalBoard];
        const moves = state.moves.map(m => ({ ...m, cells: [...m.cells] as [number, number] }));
        const newQubitStates = new Map(state.qubitStates);

        let allAssignments: CollapseEvent[] = [];

        if (cycle) {
          // Collapse the detected cycle
          const seed = state.isTestcaseRunning ? DEMO_SEED + state.collapseSeed : undefined;
          const event = collapseCycle(cycle, moves, board, seed);

          // Apply assignments to board
          for (const a of event.assignments) {
            const move = moves.find(m => m.id === a.moveId);
            if (move && !move.collapsed && board[a.cell] === null) {
              move.collapsed = true;
              move.collapsedCell = a.cell;
              board[a.cell] = a.player;
              newQubitStates.set(a.moveId, collapsedState(a.cell === move.cells[0] ? 0 : 1));
            }
          }

          // Remove collapsed edges from graph
          for (const e of cycle.edges) {
            graph.removeEdge(e.moveId);
          }

          allAssignments.push(event);
        } else {
          // Fast mode: collapse all active moves
          for (const m of moves) {
            if (!m.collapsed && board[m.cells[0]] === null) {
              m.collapsed = true;
              m.collapsedCell = m.cells[0];
              board[m.cells[0]] = m.player;
              newQubitStates.set(m.id, collapsedState(0));
              graph.removeEdge(m.id);
            }
          }
        }

        // Propagate
        const additional = propagateCollapses(moves, board);
        for (const a of additional) {
          const move = moves.find(m => m.id === a.moveId);
          if (move) {
            newQubitStates.set(a.moveId, collapsedState(a.cell === move.cells[0] ? 0 : 1));
            graph.removeEdge(a.moveId);
          }
        }

        // Update quantum marks
        const newMarks = Array.from({ length: 9 }, () => [] as string[]);
        for (const m of moves) {
          if (!m.collapsed) {
            const label = `${m.player}${m.turnNumber}`;
            for (const c of m.cells) {
              newMarks[c].push(label);
            }
          }
        }

        // Check win
        const toroidal = state.gameMode === 'cyclic';
        const winResult = checkWin(board, toroidal);

        const collapseHistory: HistoryEntry = {
          type: 'collapse',
          collapseEvent: allAssignments[0],
          description: cycle
            ? `CYCLE COLLAPSE! Moves ${cycle.edges.map(e => e.moveId).join(',')} resolved`
            : 'Fast collapse triggered',
          timestamp: Date.now(),
        };

        const newHistory = [...state.history, collapseHistory];

        if (winResult.winner) {
          newHistory.push({
            type: 'win',
            description: `${winResult.winner} WINS!`,
            timestamp: Date.now(),
          });
        } else if (winResult.isDraw) {
          newHistory.push({
            type: 'draw',
            description: 'DRAW — board full',
            timestamp: Date.now(),
          });
        }

        const nextPlayer: Player = state.currentPlayer === 'X' ? 'O' : 'X';

        set({
          classicalBoard: board,
          quantumMarks: newMarks,
          moves,
          qubitStates: newQubitStates,
          collapseEvents: [...state.collapseEvents, ...allAssignments],
          history: newHistory,
          gameOver: winResult.winner !== null || winResult.isDraw,
          winner: winResult.winner,
          winLine: winResult.winLine,
          isDraw: winResult.isDraw,
          currentPlayer: winResult.winner || winResult.isDraw ? state.currentPlayer : nextPlayer,
          cycleDetected: false,
          lastCycle: null,
          pendingCollapseReason: null,
          collapseSeed: state.collapseSeed + 1,
        });

        // AI move after collapse
        if (state.gameMode === 'ai' && nextPlayer === 'O' && !winResult.winner && !winResult.isDraw) {
          setTimeout(() => get().triggerAIMove(), 600);
        }
      },

      resetGame: () => {
        const mode = get().gameMode;
        const muted = get().isMuted;
        const diff = get().aiDifficulty;
        set({
          ...INITIAL_STATE,
          entanglementGraph: new EntanglementGraph(),
          qubitStates: new Map(),
          gameMode: mode,
          isMuted: muted,
          aiDifficulty: diff,
        });
      },

      setGameMode: (mode: GameMode) => {
        set({ gameMode: mode, showGameModeSelector: false });
        get().resetGame();
      },

      setAIDifficulty: (d: AIDifficulty) => set({ aiDifficulty: d }),

      toggleMute: () => set(s => ({ isMuted: !s.isMuted })),

      toggleHowToPlay: () => set(s => ({ showHowToPlay: !s.showHowToPlay })),

      toggleGameModeSelector: () => set(s => ({ showGameModeSelector: !s.showGameModeSelector })),

      runTestcase: () => {
        const state = get();
        state.resetGame();

        set({
          isTestcaseRunning: true,
          testcaseStep: 0,
          collapseSeed: 0,
        });

        const runStep = (index: number) => {
          const current = get();
          if (!current.isTestcaseRunning || index >= DEMO_SEQUENCE.length || current.gameOver) {
            set({ isTestcaseRunning: false });
            return;
          }

          const step = DEMO_SEQUENCE[index];
          // Ensure correct player
          if (current.currentPlayer !== step.player) {
            set({ currentPlayer: step.player });
          }
          get().makeMove(step.cells);
          set({ testcaseStep: index + 1 });

          setTimeout(() => runStep(index + 1), DEMO_STEP_DELAY);
        };

        setTimeout(() => runStep(0), 500);
      },

      stopTestcase: () => set({ isTestcaseRunning: false }),

      autoplayStep: () => {
        const state = get();
        if (state.gameOver) {
          set({ isAutoPlaying: false });
          return;
        }
        const freeCells = state.classicalBoard
          .map((v, i) => (v === null ? i : -1))
          .filter(i => i >= 0);
        if (freeCells.length < 2) {
          set({ isAutoPlaying: false });
          return;
        }
        const shuffled = [...freeCells].sort(() => Math.random() - 0.5);
        get().makeMove([shuffled[0], shuffled[1]]);
      },

      startAutoplay: () => {
        set({ isAutoPlaying: true });
        const loop = () => {
          const s = get();
          if (!s.isAutoPlaying || s.gameOver) return;
          s.autoplayStep();
          setTimeout(loop, 1200);
        };
        setTimeout(loop, 300);
      },

      stopAutoplay: () => set({ isAutoPlaying: false }),

      triggerAIMove: () => {
        const state = get();
        if (state.gameOver || state.currentPlayer !== 'O') return;

        const move = getAIMove(
          state.classicalBoard,
          state.moves,
          state.aiDifficulty,
          'O'
        );
        if (move) {
          get().makeMove(move);
        }
      },

      setReplayIndex: (i: number) => set({ replayIndex: i, isReplaying: i >= 0 }),

      getEntropy: () => {
        const state = get();
        return Array.from({ length: 9 }, (_, i) => {
          if (state.classicalBoard[i] !== null) return 0;
          const marks = state.quantumMarks[i].length;
          if (marks === 0) return 0;
          // Uniform distribution entropy over marks
          const p = 1 / Math.max(marks, 1);
          return -marks * p * Math.log2(p);
        });
      },

      getCellProbabilities: () => {
        const state = get();
        return Array.from({ length: 9 }, (_, i) => {
          if (state.classicalBoard[i] === 'X') return { X: 1, O: 0 };
          if (state.classicalBoard[i] === 'O') return { X: 0, O: 1 };
          const marks = state.quantumMarks[i];
          const xCount = marks.filter(m => m.startsWith('X')).length;
          const oCount = marks.filter(m => m.startsWith('O')).length;
          const total = xCount + oCount;
          if (total === 0) return { X: 0, O: 0 };
          return { X: xCount / total, O: oCount / total };
        });
      },
    }),
    { name: 'quantum-ttt' }
  )
);

