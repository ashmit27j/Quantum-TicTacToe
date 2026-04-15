import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * Full-screen collapse flash + shockwave effect.
 * Triggers when a collapse event occurs.
 */
export default function CollapseAnimation() {
  const collapseEvents = useGameStore(s => s.collapseEvents);
  const [showFlash, setShowFlash] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    if (collapseEvents.length > prevCount) {
      setPrevCount(collapseEvents.length);
      triggerCollapse();
    }
  }, [collapseEvents.length]);

  const triggerCollapse = () => {
    setShowFlash(true);
    setTimeout(() => setShowShockwave(true), 100);
    setTimeout(() => setShowFlash(false), 400);
    setTimeout(() => setShowShockwave(false), 700);
  };

  return (
    <>
      {showFlash && <div className="collapse-flash" />}
      {showShockwave && <div className="collapse-shockwave" />}
    </>
  );
}
