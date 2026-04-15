import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function PlayerInfo() {
  const currentPlayer = useGameStore(s => s.currentPlayer);
  const gameOver = useGameStore(s => s.gameOver);
  const winner = useGameStore(s => s.winner);
  const isDraw = useGameStore(s => s.isDraw);
  const moveCount = useGameStore(s => s.moveCount);
  const classicalBoard = useGameStore(s => s.classicalBoard);

  const xCount = classicalBoard.filter(c => c === 'X').length;
  const oCount = classicalBoard.filter(c => c === 'O').length;

  return (
    <div className="glass-panel p-3 space-y-3">
      {/* Status */}
      <div className="text-center">
        {gameOver ? (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {isDraw ? (
              <div className="font-display text-lg neon-text-gold tracking-wider">
                DRAW
              </div>
            ) : (
              <div className={`font-display text-lg tracking-wider ${
                winner === 'X' ? 'text-sky-500' : 'text-yellow-500'
              }`}>
                {winner} WINS!
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="font-display text-xs opacity-40 tracking-wider">TURN</span>
            <motion.span
              key={currentPlayer}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`font-display text-2xl font-bold ${
                currentPlayer === 'X' ? 'text-sky-500' : 'text-yellow-500'
              }`}
            >
              {currentPlayer}
            </motion.span>
          </div>
        )}
      </div>

      {/* Player cards */}
      <div className="grid grid-cols-2 gap-2">
        <PlayerCard
          player="X"
          label="PLAYER X"
          color="cyan"
          marks={xCount}
          active={!gameOver && currentPlayer === 'X'}
          isWinner={winner === 'X'}
        />
        <PlayerCard
          player="O"
          label="PLAYER O"
          color="magenta"
          marks={oCount}
          active={!gameOver && currentPlayer === 'O'}
          isWinner={winner === 'O'}
        />
      </div>

      {/* Move counter */}
      <div className="text-center">
        <span className="font-mono text-xs opacity-30">MOVE {moveCount}</span>
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  label,
  color,
  marks,
  active,
  isWinner,
}: {
  player: string;
  label: string;
  color: 'cyan' | 'magenta';
  marks: number;
  active: boolean;
  isWinner: boolean;
}) {
  const borderClass = color === 'cyan' ? 'border-sky-500' : 'border-yellow-500';
  const textClass = color === 'cyan' ? 'text-sky-500' : 'text-yellow-500';
  const bgClass = color === 'cyan' ? 'bg-sky-500/10' : 'bg-yellow-500/10';

  return (
    <motion.div
      className={`p-2 rounded-lg text-center border transition-colors ${
        active ? `${borderClass} ${bgClass}` : 'border-[#27272a] bg-[#18181b]'
      } ${isWinner ? 'animate-pulse-neon' : ''}`}
      animate={active ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className={`font-display text-xs tracking-wider ${active ? textClass : 'opacity-40'}`}>
        {label}
      </div>
      <div className={`font-mono text-lg font-bold ${textClass}`}>
        {marks}
      </div>
      <div className="text-xs opacity-30">classical</div>
    </motion.div>
  );
}
