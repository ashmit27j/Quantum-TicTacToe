import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function NeonBoard() {
  const classicalBoard = useGameStore(s => s.classicalBoard);
  const quantumMarks = useGameStore(s => s.quantumMarks);
  const selectedCells = useGameStore(s => s.selectedCells);
  const selectCell = useGameStore(s => s.selectCell);
  const gameOver = useGameStore(s => s.gameOver);
  const winLine = useGameStore(s => s.winLine);
  const currentPlayer = useGameStore(s => s.currentPlayer);
  const gameMode = useGameStore(s => s.gameMode);
  const moves = useGameStore(s => s.moves);

  const isBlindMode = gameMode === 'blind';

  return (
    <div className="relative">
      {/* Scan line */}
      <div className="grid-scan-line" />

      <div className="quantum-grid">
        {Array.from({ length: 9 }, (_, i) => {
          const classical = classicalBoard[i];
          const quantum = quantumMarks[i];
          const isSelected = selectedCells.includes(i);
          const isWinCell = winLine?.includes(i);
          const isCollapsed = classical !== null;
          const isFree = classical === null;

          // In blind mode, hide opponent's superposition marks
          const visibleMarks = isBlindMode
            ? quantum.filter(m => m.startsWith(currentPlayer))
            : quantum;

          return (
            <div
              key={i}
              className={[
                'quantum-cell',
                isSelected && 'selected',
                isCollapsed && classical === 'X' && 'collapsed-x',
                isCollapsed && classical === 'O' && 'collapsed-o',
                isWinCell && 'win-cell',
                (gameOver || isCollapsed) && 'disabled',
              ].filter(Boolean).join(' ')}
              onClick={() => !gameOver && isFree && selectCell(i)}
            >
              {/* Cell index label */}
              <span
                className="absolute top-1 left-1.5 text-xs font-mono opacity-20"
                style={{ fontSize: '0.6rem' }}
              >
                {i}
              </span>

              <AnimatePresence mode="wait">
                {classical ? (
                  <div
                    key={`classical-${i}`}
                    className={`classical-mark ${classical === 'X' ? 'classical-mark-x' : 'classical-mark-o'}`}
                  >
                    {classical}
                  </div>
                ) : visibleMarks.length > 0 ? (
                  <div
                    key={`quantum-${i}`}
                    className="flex flex-wrap gap-0.5 items-center justify-center p-1"
                  >
                    {visibleMarks.map((label, j) => {
                      const isX = label.startsWith('X');
                      return (
                        <span
                          key={`${label}-${j}`}
                          className={`superposition-mark ${isX ? 'text-sky-500' : 'text-yellow-500'}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </AnimatePresence>

              {/* Inner glow for selected */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
