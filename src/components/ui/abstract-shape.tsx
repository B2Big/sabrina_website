'use client';

import { motion } from 'framer-motion';

export function AbstractShape({ type }: { type: 'training' | 'care' }) {
  // Formes abstraites 3D CSS
  if (type === 'training') {
    return (
      <div className="relative w-full aspect-square max-w-md mx-auto perspective-1000">
        <motion.div
          animate={{ rotateY: 360, rotateX: 15 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 md:w-64 md:h-64 mx-auto bg-gradient-to-tr from-training to-accent-mint rounded-[2rem] shadow-[0_0_60px_rgba(59,130,246,0.5)] opacity-90"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border border-slate-900/10 rounded-full animate-pulse" />
            <div className="absolute w-80 h-80 border border-slate-900/5 rounded-full animate-pulse delay-75" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
       <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-48 h-48 md:w-64 md:h-64 mx-auto bg-gradient-to-bl from-care to-accent-peach rounded-full shadow-[0_0_60px_rgba(244,114,182,0.5)] opacity-90 blur-sm"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-white/30 backdrop-blur-md rounded-full border border-white/50"
        />
    </div>
  );
}
