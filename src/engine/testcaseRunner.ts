/**
 * Deterministic testcase runner (seed=42).
 * Preloads the exact sequence from the spec to demonstrate cycle detection.
 */

export interface TestStep {
  player: 'X' | 'O';
  cells: [number, number];
  expectCycle: boolean;
  description: string;
}

export const DEMO_SEQUENCE: TestStep[] = [
  {
    player: 'X',
    cells: [0, 1],
    expectCycle: false,
    description: 'X places superposition in cells 0 & 1',
  },
  {
    player: 'O',
    cells: [1, 2],
    expectCycle: false,
    description: 'O places superposition in cells 1 & 2 — entangled with X1 at cell 1',
  },
  {
    player: 'X',
    cells: [2, 0],
    expectCycle: true,
    description: 'X places superposition in cells 2 & 0 — CYCLE DETECTED! Triangle 0→1→2→0',
  },
  {
    player: 'O',
    cells: [3, 4],
    expectCycle: false,
    description: 'O places superposition in cells 3 & 4',
  },
  {
    player: 'X',
    cells: [4, 5],
    expectCycle: false,
    description: 'X places superposition in cells 4 & 5 — entangled with O4 at cell 4',
  },
  {
    player: 'O',
    cells: [5, 3],
    expectCycle: true,
    description: 'O places superposition in cells 5 & 3 — CYCLE DETECTED! Triangle 3→4→5→3',
  },
  {
    player: 'X',
    cells: [6, 8],
    expectCycle: false,
    description: 'X places in cells 6 & 8, looking for the win',
  },
  {
    player: 'O',
    cells: [7, 6],
    expectCycle: false,
    description: 'O tries to block',
  },
];

export const DEMO_SEED = 42;
export const DEMO_STEP_DELAY = 1500; // ms between steps
