/**
 * Sound Manager — uses Web Audio API for synthesized sounds.
 * No external audio files needed.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

// Create audio context lazily
let audioCtx: AudioContext | null = null;
const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function playClick() {
  playTone(800, 0.05, 'square', 0.05);
  setTimeout(() => playTone(1200, 0.03, 'square', 0.03), 20);
}

function playCollapse() {
  playTone(100, 0.3, 'sawtooth', 0.15);
  setTimeout(() => playTone(80, 0.4, 'sawtooth', 0.1), 50);
  setTimeout(() => playTone(200, 0.2, 'square', 0.08), 100);
  setTimeout(() => playTone(60, 0.5, 'sawtooth', 0.12), 150);
}

function playWin() {
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.3, 'sine', 0.1), i * 150);
  });
}

function playDraw() {
  playTone(300, 0.3, 'triangle', 0.08);
  setTimeout(() => playTone(250, 0.4, 'triangle', 0.06), 200);
}

// Ambient synth pad (looping)
let ambientOsc: OscillatorNode[] = [];
let ambientGains: GainNode[] = [];
let ambientRunning = false;

function startAmbient() {
  if (ambientRunning) return;
  try {
    const ctx = getCtx();
    const freqs = [65, 98, 131]; // C2, G2, C3 — quiet drone

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      ambientOsc.push(osc);
      ambientGains.push(gain);
    });
    ambientRunning = true;
  } catch {}
}

function stopAmbient() {
  ambientOsc.forEach(osc => { try { osc.stop(); } catch {} });
  ambientOsc = [];
  ambientGains = [];
  ambientRunning = false;
}

export default function SoundManager() {
  const isMuted = useGameStore(s => s.isMuted);
  const moveCount = useGameStore(s => s.moveCount);
  const collapseCount = useGameStore(s => s.collapseEvents.length);
  const gameOver = useGameStore(s => s.gameOver);
  const winner = useGameStore(s => s.winner);

  const prevMoves = useRef(0);
  const prevCollapses = useRef(0);
  const prevGameOver = useRef(false);

  useEffect(() => {
    if (isMuted) {
      stopAmbient();
      return;
    }

    // Start ambient on first interaction
    const start = () => {
      startAmbient();
      window.removeEventListener('click', start);
    };
    window.addEventListener('click', start);
    return () => window.removeEventListener('click', start);
  }, [isMuted]);

  useEffect(() => {
    if (isMuted) return;

    if (moveCount > prevMoves.current) {
      playClick();
    }
    prevMoves.current = moveCount;
  }, [moveCount, isMuted]);

  useEffect(() => {
    if (isMuted) return;

    if (collapseCount > prevCollapses.current) {
      playCollapse();
    }
    prevCollapses.current = collapseCount;
  }, [collapseCount, isMuted]);

  useEffect(() => {
    if (isMuted) return;

    if (gameOver && !prevGameOver.current) {
      if (winner && winner !== 'Draw') {
        playWin();
      } else {
        playDraw();
      }
    }
    prevGameOver.current = gameOver;
  }, [gameOver, winner, isMuted]);

  return null;
}
