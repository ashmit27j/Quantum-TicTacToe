# NEON QUANTUM — Tic Tac Toe in the Quantum Realm

A cyberpunk neon-themed quantum tic-tac-toe game built for quantum computing conference demos. Quantum mechanics — superposition, entanglement, and measurement collapse — replace classical certainty on a 3x3 board.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r160-000000?logo=three.js&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## How It Works

1. **Superposition** — Each move places a quantum mark in **two cells** simultaneously. The mark exists in both until measured.
2. **Entanglement** — When two moves share a cell, they become entangled. Purple beams visualize the connection.
3. **Cycle Detection** — The entanglement graph is monitored for cycles (closed loops) using DFS after every move.
4. **Collapse** — When a cycle is detected, all marks in the cycle collapse to definite positions using the Born rule (equal probability sampling). Lightning, screen flash, and shockwave animations play.
5. **Win** — After collapse, standard tic-tac-toe rules apply. Three classical marks in a row wins.

---

## Features

- **Neon Cyberpunk UI** — Deep void black background, animated particles, CRT scanlines, glassmorphism panels, neon glows on everything
- **Interactive Bloch Spheres** — 3D Three.js spheres showing quantum state vectors for each active superposition, labeled with move and cell info
- **Quantum Circuit Viewer** — IBM Qiskit-style circuit diagram with H gates, CNOT entanglement, cycle detection markers, and measurement gates
- **Real-time Metrics HUD** — Entropy heatmap, collapse probability matrix, player advantage radar chart, move time chart, quantum bit counter
- **Entanglement Graph** — Force-directed visualization of the entanglement structure
- **Cycle Detector Indicator** — Live status badge showing "NO CYCLE" (green) or "CYCLE FOUND!" (red pulse)
- **11 Game Modes** — Classic Quantum, Fast Collapse, Entanglement Bomb, Cyclic (toroidal), Blind Quantum, Timed Blitz, vs AI (easy/medium/hard), 2P Local, 2P Online Mock, Tutorial, Chaos Mode
- **Deterministic Demo** — Seed=42 testcase auto-plays a scripted sequence showing two cycle collapses
- **Autoplay** — Watch the game play itself with random moves
- **Sound** — Synthesized audio (Web Audio API) for moves, collapses, and wins with mute toggle
- **Keyboard Shortcuts** — N (new game), R (run demo), H (help), M (mute), ESC (game modes)
- **Collapse Animations** — Full-screen white flash, lightning bolts, shockwave ripple
- **Mobile Responsive** — Layout adapts to narrow screens

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS + custom neon CSS |
| Animation | Framer Motion |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Charts | Recharts |
| State | Zustand (with devtools) |
| Sound | Web Audio API (synthesized, no audio files) |
| Particles | Custom canvas renderer |
| RNG | seedrandom (deterministic demo) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher

### Run locally

```bash
git clone https://github.com/RohanBhoge15/QTicTacToe.git
cd QTicTacToe
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production build

```bash
npm run build
npm run preview
```

The `dist/` folder contains static files deployable to any hosting (GitHub Pages, Netlify, Vercel, etc).

---

## Project Structure

```
src/
├── components/           UI components
│   ├── NeonBoard.tsx           3x3 quantum board with neon effects
│   ├── EntanglementBeams.tsx   Animated SVG beams between entangled cells
│   ├── CollapseAnimation.tsx   Screen flash + lightning + shockwave
│   ├── BlochSphereGrid.tsx     3D Bloch spheres (Three.js)
│   ├── QuantumCircuitViewer.tsx Circuit diagram with gates
│   ├── MetricsHUD.tsx          Charts and metrics panels
│   ├── CycleDetectorIndicator.tsx  Live cycle status
│   ├── EntanglementGraphVis.tsx    Force-directed graph
│   ├── GameModeSelector.tsx    Mode selection modal
│   ├── HowToPlayModal.tsx      Tutorial with 7 sections
│   ├── PlayerInfo.tsx          Turn indicator + scores
│   ├── MoveHistory.tsx         Move log
│   ├── GameHeader.tsx          Title + controls
│   ├── LoadingScreen.tsx       Neon loading animation
│   ├── SoundManager.tsx        Web Audio synthesis
│   ├── NeonParticlesBg.tsx     Background particles
│   └── CRTOverlay.tsx          Scanline effect
├── engine/               Game logic
│   ├── quantumState.ts         Qubit math, Born rule, Bloch coords
│   ├── entanglementGraph.ts    Graph + DFS cycle detection
│   ├── collapseEngine.ts       Cycle collapse + propagation
│   ├── winDetector.ts          Standard + toroidal win check
│   ├── quantumAI.ts            Minimax AI (easy/medium/hard)
│   └── testcaseRunner.ts       Seed=42 demo sequence
├── store/
│   └── gameStore.ts            Zustand state management
├── hooks/                Custom React hooks
├── styles/
│   └── neon-theme.css          Neon glow classes + animations
├── App.tsx               Main layout
└── main.tsx              Entry point
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New game |
| `R` | Run demo (seed=42) |
| `H` | How to play |
| `M` | Mute / unmute |
| `ESC` | Game mode selector |

---

## License

MIT
