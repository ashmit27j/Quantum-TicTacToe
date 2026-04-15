import { useGameStore } from '../store/gameStore';
import { useEffect, useRef } from 'react';

export default function EntanglementGraphVis() {
  const entanglementGraph = useGameStore(s => s.entanglementGraph);
  const quantumMarks = useGameStore(s => s.quantumMarks);
  const classicalBoard = useGameStore(s => s.classicalBoard);
  const edges = entanglementGraph.getEdges();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const nodes = new Set<number>();
    for (const e of edges) {
      nodes.add(e.cellA);
      nodes.add(e.cellB);
    }
    
    // Also add nodes that are not entangled but have marks? Just stick to entangled nodes or collapsed ones that left edges recently? Wait, graph only has edges.
    
    const nodeArr = [...nodes];
    const positions: Record<number, { x: number; y: number }> = {};
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.35;

    nodeArr.forEach((n, i) => {
      const angle = (i / Math.max(nodeArr.length, 1)) * Math.PI * 2 - Math.PI / 2;
      positions[n] = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      };
    });

    ctx.clearRect(0, 0, w, h);

    // Draw edges
    for (const e of edges) {
      const from = positions[e.cellA];
      const to = positions[e.cellB];
      if (!from || !to) continue;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = '#6366f1'; // Indigo instead of neon violet
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw nodes
    for (const n of nodeArr) {
      const pos = positions[n];
      ctx.beginPath();
      
      const isCollapsed = classicalBoard[n] !== null;
      const radius = isCollapsed ? 14 : 18;
      
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isCollapsed ? 'rgba(30, 41, 59, 0.9)' : 'rgba(51, 65, 85, 0.9)';
      ctx.fill();
      ctx.strokeStyle = isCollapsed ? (classicalBoard[n] === 'X' ? '#0ea5e9' : '#eab308') : '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (isCollapsed) {
        ctx.fillStyle = classicalBoard[n] === 'X' ? '#0ea5e9' : '#eab308';
        ctx.font = '14px "Inter", sans-serif';
        ctx.fillText(String(classicalBoard[n]), pos.x, pos.y);
      } else {
        // Show quantum marks (the input moves)
        const marks = quantumMarks[n] || [];
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '8px "Inter", sans-serif';
        if (marks.length > 0) {
          // If many marks, just show top 2 or summarize
          const displayMarks = marks.slice(0, 3);
          const text = displayMarks.join(',');
          ctx.fillText(text, pos.x, pos.y);
        } else {
          ctx.fillText(String(n), pos.x, pos.y);
        }
      }
    }
  }, [edges, quantumMarks, classicalBoard]);

  return (
    <div className="glass-panel p-3 flex flex-col justify-center items-center h-[220px]">
      <p className="font-display text-xs tracking-widest text-center mb-1 text-white shrink-0">
        ENTANGLEMENT GRAPH
      </p>
      <canvas
        ref={canvasRef}
        width={200}
        height={160}
        style={{ width: '100%', height: 'auto', maxHeight: 160 }}
      />
      {edges.length === 0 && (
        <p className="text-xs opacity-40 text-center mt-1 text-gray-400">No entanglements</p>
      )}
    </div>
  );
}
