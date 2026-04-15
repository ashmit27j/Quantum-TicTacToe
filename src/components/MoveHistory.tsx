import { useGameStore } from '../store/gameStore';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MoveHistory() {
  const history = useGameStore(s => s.history);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history.length]);

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs text-white tracking-widest text-center mb-2">
        MOVE LOG
      </p>
      <div
        ref={scrollRef}
        className="space-y-1 max-h-48 overflow-y-auto pr-1"
        style={{ scrollbarWidth: 'thin' }}
      >
        {history.length === 0 && (
          <p className="text-xs opacity-20 text-center">No moves yet</p>
        )}
        {history.map((entry, i) => {
          let icon = '';
          let colorClass = 'opacity-50';
          if (entry.type === 'move') {
            icon = entry.player === 'X' ? '◆' : '◇';
            colorClass = entry.player === 'X' ? 'text-sky-500' : 'text-yellow-500';
          } else if (entry.type === 'collapse') {
            icon = '⚡';
            colorClass = 'text-white';
          } else if (entry.type === 'win') {
            icon = '🏆';
            colorClass = 'text-yellow-400';
          } else if (entry.type === 'draw') {
            icon = '🤝';
            colorClass = 'text-yellow-400';
          }

          return (
            <motion.div
              key={i}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`text-xs font-mono flex items-start gap-1.5 ${colorClass}`}
            >
              <span className="flex-shrink-0 w-4 text-center">{icon}</span>
              <span className="leading-relaxed">{entry.description}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
