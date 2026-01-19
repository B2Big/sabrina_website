'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: string[];
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export function Marquee({ items, direction = 'left', speed = 20, className }: MarqueeProps) {
  return (
    <div className={cn("relative flex overflow-hidden user-select-none bg-slate-900 py-3", className)}>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: direction === 'left' ? '-50%' : '50%' }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        className="flex whitespace-nowrap min-w-full"
      >
        {[...items, ...items, ...items, ...items].map((item, i) => ( // Repeat items to ensure smooth loop
          <span
            key={i}
            className="mx-8 text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white/90 flex items-center gap-8"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          </span>
        ))}
      </motion.div>
      
      {/* Vignette effect for fading edges */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10" />
    </div>
  );
}
