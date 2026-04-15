/**
 * Quantum state math: amplitudes, Born rule, Bloch sphere coordinates.
 * Each superposition mark is modeled as a single qubit: alpha|0> + beta|1>
 * where |0> = first cell chosen, |1> = second cell chosen.
 */

export interface QubitState {
  alpha: { re: number; im: number }; // amplitude for |0>
  beta: { re: number; im: number };  // amplitude for |1>
}

export interface BlochCoords {
  theta: number; // polar angle [0, PI]
  phi: number;   // azimuthal angle [0, 2*PI]
  x: number;
  y: number;
  z: number;
}

export function newSuperposition(): QubitState {
  // Hadamard: |0> -> |+> = (|0> + |1>) / sqrt(2)
  const s = 1 / Math.sqrt(2);
  return { alpha: { re: s, im: 0 }, beta: { re: s, im: 0 } };
}

export function collapsedState(bit: 0 | 1): QubitState {
  return bit === 0
    ? { alpha: { re: 1, im: 0 }, beta: { re: 0, im: 0 } }
    : { alpha: { re: 0, im: 0 }, beta: { re: 1, im: 0 } };
}

export function magnitude2(c: { re: number; im: number }): number {
  return c.re * c.re + c.im * c.im;
}

/** Born rule: probability of measuring |0> */
export function prob0(q: QubitState): number {
  return magnitude2(q.alpha);
}

/** Born rule: probability of measuring |1> */
export function prob1(q: QubitState): number {
  return magnitude2(q.beta);
}

/** Sample collapse using Born rule. Returns 0 or 1. */
export function sampleCollapse(q: QubitState, rand: () => number = Math.random): 0 | 1 {
  return rand() < prob0(q) ? 0 : 1;
}

/** Convert qubit to Bloch sphere coordinates */
export function toBlochCoords(q: QubitState): BlochCoords {
  const a = q.alpha;
  const b = q.beta;

  const magA = Math.sqrt(magnitude2(a));
  const magB = Math.sqrt(magnitude2(b));

  // theta = 2 * arccos(|alpha|)
  const theta = 2 * Math.acos(Math.min(1, magA));

  // phi = arg(beta) - arg(alpha)
  const argA = Math.atan2(a.im, a.re);
  const argB = Math.atan2(b.im, b.re);
  const phi = argB - argA;

  return {
    theta,
    phi,
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  };
}

/** Shannon entropy of measurement probabilities */
export function measurementEntropy(q: QubitState): number {
  const p0 = prob0(q);
  const p1 = prob1(q);
  if (p0 < 1e-10 || p1 < 1e-10) return 0;
  return -(p0 * Math.log2(p0) + p1 * Math.log2(p1));
}
