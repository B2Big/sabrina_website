'use client';

import { motion } from 'framer-motion';

function RunnerSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Speed lines */}
      <g className="runner-speed" opacity="0.6">
        <line x1="10" y1="32" x2="-2" y2="32" strokeWidth="2.5" />
        <line x1="6" y1="52" x2="-6" y2="52" strokeWidth="2.5" />
        <line x1="12" y1="72" x2="0" y2="72" strokeWidth="2.5" />
      </g>

      {/* Runner body group with bounce */}
      <g className="runner-body">
        {/* Head */}
        <circle cx="68" cy="22" r="9" />

        {/* Back arm (upper + forearm) */}
        <g className="runner-arm-back">
          <line x1="60" y1="36" x2="42" y2="48" />
          <g className="runner-arm-back" style={{ transformOrigin: '42px 48px' }}>
            <line x1="42" y1="48" x2="50" y2="64" />
          </g>
        </g>

        {/* Back leg (thigh + shin + foot) */}
        <g className="runner-thigh-back">
          <line x1="52" y1="56" x2="72" y2="75" />
          <g className="runner-shin-back" style={{ transformOrigin: '72px 75px' }}>
            <line x1="72" y1="75" x2="60" y2="92" />
            <line x1="60" y1="92" x2="70" y2="94" strokeWidth="3" />
          </g>
        </g>

        {/* Body / torso */}
        <line x1="52" y1="56" x2="60" y2="36" />

        {/* Front leg (thigh + shin + foot) */}
        <g className="runner-thigh-front">
          <line x1="52" y1="56" x2="70" y2="70" />
          <g className="runner-shin-front" style={{ transformOrigin: '70px 70px' }}>
            <line x1="70" y1="70" x2="85" y2="60" />
            <line x1="85" y1="60" x2="94" y2="64" strokeWidth="3" />
          </g>
        </g>

        {/* Front arm (upper + forearm) */}
        <g className="runner-arm-front">
          <line x1="60" y1="36" x2="76" y2="46" />
          <g className="runner-arm-front" style={{ transformOrigin: '76px 46px' }}>
            <line x1="76" y1="46" x2="66" y2="58" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export function AbstractShape({ type }: { type: 'training' | 'care' }) {
  const isTraining = type === 'training';

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto perspective-1000">
      {/* Background gradient blob */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, isTraining ? 5 : -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-0 m-auto w-48 h-48 md:w-64 md:h-64 rounded-[2rem] opacity-80 blur-xl ${
          isTraining
            ? 'bg-gradient-to-tr from-indigo-200 via-cyan-200 to-mint-200'
            : 'bg-gradient-to-bl from-fuchsia-200 via-rose-200 to-amber-100'
        }`}
      />

      {/* Runner container */}
      <motion.div
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-0 m-auto w-40 h-40 md:w-56 md:h-56 rounded-3xl flex items-center justify-center shadow-xl ${
          isTraining
            ? 'bg-gradient-to-br from-indigo-300 via-cyan-300 to-mint-300 text-white'
            : 'bg-gradient-to-br from-fuchsia-300 via-rose-300 to-amber-200 text-white'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <RunnerSVG className="w-28 h-28 md:w-40 md:h-40" />
      </motion.div>

      {/* Decorative circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-2 border-slate-900/10 rounded-full animate-pulse" />
        <div className="absolute w-80 h-80 border border-slate-900/5 rounded-full animate-pulse delay-75" />
      </div>
    </div>
  );
}
