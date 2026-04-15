import { motion } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2500);
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,240,255,0.05) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center"
      >
        <div
          className="loading-title neon-text-cyan mb-2"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}
        >
          QUANTUM TIC TAC TOE
        </div>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-px mx-auto max-w-xs"
          style={{
            background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
          className="font-display text-sm tracking-[0.3em] mt-3"
          style={{ color: '#bb00ff' }}
        >
          TIC TAC TOE IN THE QUANTUM REALM
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="mt-8 w-48 h-0.5 rounded overflow-hidden"
        style={{ background: 'rgba(0,240,255,0.1)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="h-full rounded"
          style={{ background: 'linear-gradient(90deg, #00f0ff, #bb00ff)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 1.5, duration: 1, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.8 }}
        className="mt-3 font-mono text-xs tracking-wider"
      >
        INITIALIZING QUANTUM STATE...
      </motion.p>
    </motion.div>
  );
}
