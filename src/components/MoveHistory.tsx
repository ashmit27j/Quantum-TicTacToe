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
    <div className="glass-panel p-3 flex flex-col h-[220px]">
      <p className="font-display text-xs text-white tracking-widest text-center mb-2 shrink-0">
        CONSOLE
      </p>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 space-y-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {history.length === 0 && (
          <p className="text-xs opacity-20 text-center">No moves yet</p>
        )}
        {history.map((entry, i) => {
          let colorClass = 'opacity-50';
          if (entry.type === 'move') {
            colorClass = entry.player === 'X' ? 'text-sky-500' : 'text-yellow-500';
          } else if (entry.type === 'collapse') {
            colorClass = 'text-white';
          } else if (entry.type === 'win') {
            colorClass = 'text-yellow-400';
          } else if (entry.type === 'draw') {
            colorClass = 'text-yellow-400';
          }

          return (
            <motion.div
              key={i}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`text-xs font-mono flex items-start gap-1.5 ${colorClass}`}
            >
              <span className="leading-relaxed">{entry.description}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
