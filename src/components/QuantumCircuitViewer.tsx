import { useGameStore } from '../store/gameStore';

import { CollapseEvent } from '../engine/collapseEngine';

const GATE_W = 48;
const GATE_H = 36;
const ROW_H = 50;
const COL_W = 65;
const PAD = 28;

export default function QuantumCircuitViewer() {
  const collapseEvents = useGameStore(s => s.collapseEvents);
  const moves = useGameStore(s => s.moves);

  const lastEvent = collapseEvents.length > 0
    ? collapseEvents[collapseEvents.length - 1]
    : null;

  if (!lastEvent) {
    return null;
  }

  return (
    <div className="glass-panel p-3 flex flex-col items-center justify-center">
      <p className="font-display text-xs tracking-widest text-center mb-2 text-white">
        QUANTUM CIRCUIT
      </p>
      <CircuitDiagram event={lastEvent} />
    </div>
  );
}

function CircuitDiagram({ event }: { event: CollapseEvent }) {
  const gates = event.circuitGates;
  const numQubits = Math.max(...gates.flatMap(g => g.qubits)) + 1;

  // Organize gates into columns
  const columns: typeof gates[] = [];
  let currentCol: typeof gates = [];
  for (const gate of gates) {
    if (gate.name === 'BARRIER') {
      if (currentCol.length > 0) columns.push(currentCol);
      currentCol = [];
    } else {
      currentCol.push(gate);
    }
  }
  if (currentCol.length > 0) columns.push(currentCol);

  const totalW = PAD * 2 + (columns.length + 1) * COL_W + 60;
  const totalH = PAD * 2 + numQubits * ROW_H;

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 280 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${totalW} ${totalH}`} preserveAspectRatio="xMidYMid meet" style={{ maxHeight: 320 }}>
        {/* Qubit wires */}
        {Array.from({ length: numQubits }, (_, q) => {
          const y = PAD + q * ROW_H + ROW_H / 2;
          return (
            <g key={`wire-${q}`}>
              <line
                x1={PAD + 30}
                y1={y}
                x2={totalW - PAD}
                y2={y}
                className="circuit-wire"
              />
              <text
                x={PAD}
                y={y + 4}
                fill="#0ea5e9"
                fontSize="13"
                fontFamily="'JetBrains Mono', monospace"
                opacity="0.7"
              >
                q{q}
              </text>
            </g>
          );
        })}

        {/* Gates */}
        {columns.map((col, ci) =>
          col.map((gate, gi) => {
            const x = PAD + 40 + ci * COL_W;
            return (
              <GateElement
                key={`${ci}-${gi}`}
                gate={gate}
                x={x}
                padY={PAD}
                rowH={ROW_H}
                delay={ci * 0.15 + gi * 0.05}
              />
            );
          })
        )}

        {/* Bitstring result */}
        <text
          x={totalW - PAD - 10}
          y={PAD + ROW_H / 2}
          fill="#ffd700"
          fontSize="9"
          fontFamily="'JetBrains Mono', monospace"
          textAnchor="end"
          opacity="0.7"
        >
          {event.bitstring}
        </text>
      </svg>
    </div>
  );
}

function GateElement({
  gate,
  x,
  padY,
  rowH,
  delay,
}: {
  gate: { name: string; qubits: number[] };
  x: number;
  padY: number;
  rowH: number;
  delay: number;
}) {
  const q = gate.qubits[0];
  const y = padY + q * rowH + rowH / 2;

  const gateClass =
    gate.name === 'H' ? 'circuit-gate-h' :
    gate.name === 'CX' ? 'circuit-gate-cx' :
    gate.name === 'M' ? 'circuit-gate-m' :
    gate.name === 'CYCLE' ? 'circuit-gate-cycle' :
    'circuit-gate-h';

  const label =
    gate.name === 'CYCLE' ? '!' :
    gate.name === 'M' ? 'M' :
    gate.name;

  if (gate.name === 'CX' && gate.qubits.length === 2) {
    const y1 = padY + gate.qubits[0] * rowH + rowH / 2;
    const y2 = padY + gate.qubits[1] * rowH + rowH / 2;

    return (
      <g>
        {/* Vertical beam */}
        <line x1={x + GATE_W / 2} y1={y1} x2={x + GATE_W / 2} y2={y2}
          stroke="#eab308" strokeWidth="1.5" opacity="0.6"
          filter="url(#gate-glow)" />
        {/* Control dot */}
        <circle cx={x + GATE_W / 2} cy={y1} r="4" fill="#eab308" />
        {/* Target cross */}
        <circle cx={x + GATE_W / 2} cy={y2} r="8" fill="none" stroke="#eab308" strokeWidth="1.5" />
        <line x1={x + GATE_W / 2 - 5} y1={y2} x2={x + GATE_W / 2 + 5} y2={y2} stroke="#eab308" strokeWidth="1.5" />
        <line x1={x + GATE_W / 2} y1={y2 - 5} x2={x + GATE_W / 2} y2={y2 + 5} stroke="#eab308" strokeWidth="1.5" />
      </g>
    );
  }

  return (
    <g>
      <rect
        x={x}
        y={y - GATE_H / 2}
        width={GATE_W}
        height={GATE_H}
        className={`circuit-gate ${gateClass}`}
      />
      <text
        x={x + GATE_W / 2}
        y={y + 4}
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontFamily="'Orbitron', sans-serif"
        fontWeight="600"
      >
        {label}
      </text>
    </g>
  );
}
