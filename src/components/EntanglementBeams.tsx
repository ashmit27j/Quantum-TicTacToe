import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

/**
 * SVG overlay that draws animated beams between entangled cells.
 * Positioned over the board grid.
 */
export default function EntanglementBeams() {
  const entanglementGraph = useGameStore(s => s.entanglementGraph);
  const edges = entanglementGraph.getEdges();

  if (edges.length === 0) return null;

  // Calculate cell centers based on 3x3 grid
  // Board is ~380px, each cell ~123px, gap 4px
  const cellSize = 123;
  const gap = 4;

  const getCellCenter = (cell: number) => {
    const col = cell % 3;
    const row = Math.floor(cell / 3);
    return {
      x: col * (cellSize + gap) + cellSize / 2,
      y: row * (cellSize + gap) + cellSize / 2,
    };
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', zIndex: 5 }}
      viewBox={`0 0 ${3 * cellSize + 2 * gap} ${3 * cellSize + 2 * gap}`}
    >
      <defs>
        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#bb00ff" stopOpacity="0.8">
            <animate attributeName="stopColor" values="#bb00ff;#00f0ff;#bb00ff" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="1">
            <animate attributeName="stopColor" values="#00f0ff;#bb00ff;#00f0ff" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#bb00ff" stopOpacity="0.8">
            <animate attributeName="stopColor" values="#bb00ff;#00f0ff;#bb00ff" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <filter id="beam-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edges.map((edge, i) => {
        const from = getCellCenter(edge.cellA);
        const to = getCellCenter(edge.cellB);
        return (
          <g key={`${edge.moveId}-${i}`}>
            {/* Glow line */}
            <motion.line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="url(#beam-gradient)"
              strokeWidth="2"
              filter="url(#beam-glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            {/* Flowing particles along line */}
            <circle r="3" fill="#bb00ff" opacity="0.8" filter="url(#beam-glow)">
              <animateMotion
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
                path={`M${from.x},${from.y} L${to.x},${to.y}`}
              />
            </circle>
            <circle r="2" fill="#00f0ff" opacity="0.6">
              <animateMotion
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${0.75 + i * 0.1}s`}
                path={`M${from.x},${from.y} L${to.x},${to.y}`}
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
