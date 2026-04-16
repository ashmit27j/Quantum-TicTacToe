import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Keep the loading screen visible for 2.2 seconds before transitioning
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#18181b]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center relative z-10 mt-[-5%]">
        {/* Dynamic Abstract Quantum Loader */}
        <div className="relative w-20 h-20 mb-10 flex items-center justify-center">
          {/* Orbiting rings */}
          <motion.div
            className="absolute w-full h-full rounded-full border border-sky-500/20 border-t-sky-500"
            style={{ boxShadow: '0 0 15px rgba(14,165,233,0.1)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          />
          <motion.div
            className="absolute w-12 h-12 rounded-full border border-yellow-500/20 border-b-yellow-500"
            style={{ boxShadow: '0 0 15px rgba(234,179,8,0.1)' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
          
          {/* Core superposition dot */}
          <motion.div
            className="absolute w-2 h-2 bg-gray-200 rounded-full"
            style={{ boxShadow: '0 0 10px rgba(255,255,255,0.3)' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-center flex flex-col items-center"
        >
          <h1 
            className="font-display font-bold leading-none tracking-[0.2em] text-white uppercase mb-5"
            style={{ fontSize: 'clamp(1rem, 3.5vw, 1.5rem)' }}
          >
            QUANTUM TIC TAC TOE
          </h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "anticipate" }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-5"
          >
            <p className="font-mono text-[0.7rem] tracking-[0.4em] text-gray-400 uppercase flex items-center justify-center w-full">
              Initializing
              <motion.span
                className="inline-block w-4 text-left ml-1 text-sky-500"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ...
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-96 lg:h-96 w-64 h-64 bg-sky-500/5 blur-[100px] pointer-events-none" />
    </motion.div>
  );
}
