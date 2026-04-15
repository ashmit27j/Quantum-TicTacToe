/**
 * Win detection for classical and toroidal boards.
 */

const STANDARD_LINES: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
];

// Toroidal: wrap-around win lines (3x3 torus)
const TOROIDAL_LINES: [number, number, number][] = [
  ...STANDARD_LINES,
  // Wrap rows
  [1, 2, 0], [4, 5, 3], [7, 8, 6],
  // Wrap cols
  [3, 6, 0], [4, 7, 1], [5, 8, 2],
  // Wrap diagonals
  [1, 5, 6], [2, 3, 7],
  [1, 3, 8], [0, 5, 7],
];

export interface WinResult {
  winner: 'X' | 'O' | null;
  winLine: number[] | null;
  isDraw: boolean;
}

export function checkWin(board: (string | null)[], toroidal = false): WinResult {
  const lines = toroidal ? TOROIDAL_LINES : STANDARD_LINES;

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return {
        winner: board[a] as 'X' | 'O',
        winLine: [a, b, c],
        isDraw: false,
      };
    }
  }

  const isDraw = board.every(cell => cell !== null);
  return { winner: null, winLine: null, isDraw };
}

/**
 * Count classical marks per player
 */
export function countMarks(board: (string | null)[]): { X: number; O: number } {
  let X = 0, O = 0;
  for (const cell of board) {
    if (cell === 'X') X++;
    if (cell === 'O') O++;
  }
  return { X, O };
}

/**
 * Evaluate board position for AI (-1 to 1, positive = X advantage)
 */
export function evaluatePosition(board: (string | null)[]): number {
  const result = checkWin(board);
  if (result.winner === 'X') return 1;
  if (result.winner === 'O') return -1;

  let score = 0;
  for (const [a, b, c] of STANDARD_LINES) {
    const cells = [board[a], board[b], board[c]];
    const xCount = cells.filter(c => c === 'X').length;
    const oCount = cells.filter(c => c === 'O').length;

    if (oCount === 0 && xCount > 0) score += xCount * 0.1;
    if (xCount === 0 && oCount > 0) score -= oCount * 0.1;
  }

  // Center bonus
  if (board[4] === 'X') score += 0.15;
  if (board[4] === 'O') score -= 0.15;

  return Math.max(-1, Math.min(1, score));
}
