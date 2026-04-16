import { useGameStore } from '../store/gameStore';
import { useQuantumSimulation } from '../hooks/useQuantumSimulation';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

export default function MetricsHUD() {
  return (
    <div className="space-y-3">
      <PlayerRadar />
      <QuantumBitCount />
    </div>
  );
}

function PlayerRadar() {
  const classicalBoard = useGameStore(s => s.classicalBoard);
  const moves = useGameStore(s => s.moves);
  const entanglementGraph = useGameStore(s => s.entanglementGraph);

  const xMoves = moves.filter(m => m.player === 'X');
  const oMoves = moves.filter(m => m.player === 'O');
  const xClassical = classicalBoard.filter(c => c === 'X').length;
  const oClassical = classicalBoard.filter(c => c === 'O').length;

  const data = [
    {
      axis: 'Superposition',
      X: xMoves.filter(m => !m.collapsed).length * 20,
      O: oMoves.filter(m => !m.collapsed).length * 20,
    },
    {
      axis: 'Center',
      X: classicalBoard[4] === 'X' ? 100 : moves.some(m => m.player === 'X' && m.cells.includes(4) && !m.collapsed) ? 50 : 0,
      O: classicalBoard[4] === 'O' ? 100 : moves.some(m => m.player === 'O' && m.cells.includes(4) && !m.collapsed) ? 50 : 0,
    },
    {
      axis: 'Win Pot.',
      X: Math.min(xClassical * 35, 100),
      O: Math.min(oClassical * 35, 100),
    },
    {
      axis: 'Entangle',
      X: Math.min(xMoves.length * 20, 100),
      O: Math.min(oMoves.length * 20, 100),
    },
    {
      axis: 'Risk',
      X: Math.min(entanglementGraph.getEdges().filter(e => xMoves.some(m => m.id === e.moveId)).length * 25, 100),
      O: Math.min(entanglementGraph.getEdges().filter(e => oMoves.some(m => m.id === e.moveId)).length * 25, 100),
    },
  ];

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs tracking-wide text-center mb-1 text-white">
        PLAYER ADVANTAGE
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(100,100,200,0.15)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#8888aa', fontSize: 9 }}
          />
          <Radar name="X" dataKey="X" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} />
          <Radar name="O" dataKey="O" stroke="#eab308" fill="#eab308" fillOpacity={0.15} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function QuantumBitCount() {
  const { totalQubits, totalEntropy, superpositionCount } = useQuantumSimulation();

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs tracking-wide text-center mb-2 text-white">
        QUANTUM BITS
      </p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-mono text-xl font-bold text-sky-500">{totalQubits}</div>
          <div className="text-xs opacity-60">Active</div>
        </div>
        <div>
          <div className="font-mono text-xl font-bold text-yellow-500">{totalEntropy.toFixed(1)}</div>
          <div className="text-xs opacity-60">Entropy</div>
        </div>
        <div>
          <div className="font-mono text-xl font-bold text-gray-300">{superpositionCount}</div>
          <div className="text-xs opacity-60">Superpos.</div>
        </div>
      </div>
    </div>
  );
}
