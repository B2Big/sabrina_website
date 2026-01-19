'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  offset?: number;
}

export function ParallaxImage({ src, alt, className, offset = 40 }: ParallaxImageProps) {
  const ref = useRef(null);
  
  // 1. Scroll Tracker
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // 2. Parallax (Y-axis only) - Optimized with Spring for smoothness
  // The spring smooths out the scroll values, hiding micro-jitters
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const y = useTransform(smoothProgress, [0, 1], [-offset, offset]);

  return (
    <div 
      ref={ref} 
      className={cn("relative perspective-1000", className)}
    >
      {/* 
        COOL EFFECT: "Levitation"
        - Entry: Slides up with a slight 3D rotation (premium feel)
        - Loop: Gently floats up and down using CSS (zero JS cost)
      */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }} // Bezier for "luxurious" feel
        viewport={{ once: true }}
        style={{ y }} // Attach the smooth parallax here
        className="w-full h-full relative"
      >
        <div className="w-full h-full relative overflow-hidden rounded-[2.5rem] shadow-2xl animate-float">
          <Image 
            src={src} 
            alt={alt} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover scale-105" // Slight zoom to avoid edge gaps during float
            priority // Load fast
          />
          
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}
