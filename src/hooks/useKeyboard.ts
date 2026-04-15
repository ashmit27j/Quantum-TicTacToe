import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useKeyboard() {
  const resetGame = useGameStore(s => s.resetGame);
  const toggleMute = useGameStore(s => s.toggleMute);
  const toggleHowToPlay = useGameStore(s => s.toggleHowToPlay);
  const runTestcase = useGameStore(s => s.runTestcase);
  const toggleGameModeSelector = useGameStore(s => s.toggleGameModeSelector);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          resetGame();
          break;
        case 'r':
          e.preventDefault();
          runTestcase();
          break;
        case 'h':
          e.preventDefault();
          toggleHowToPlay();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'escape':
          e.preventDefault();
          toggleGameModeSelector();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [resetGame, toggleMute, toggleHowToPlay, runTestcase, toggleGameModeSelector]);
}
