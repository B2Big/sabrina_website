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
  priority?: boolean;
  sizes?: string;
}

export function ParallaxImage({ 
  src, 
  alt, 
  className, 
  offset = 40, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: ParallaxImageProps) {
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
        COOL EFFECT: Optimized for Mobile
        - Mobile: Simple clean parallax (No floating loop, no 3D) -> Zero Lag
        - Desktop: Adds the "Levitation" loop
      */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Removed rotateX (heavy 3D)
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        viewport={{ once: true }}
        style={{ y }} // Keep smooth parallax
        className="w-full h-full relative"
      >
        <div className="w-full h-full relative overflow-hidden rounded-[2.5rem] shadow-2xl md:animate-float"> 
          <Image 
            src={src} 
            alt={alt} 
            fill
            sizes={sizes}
            className="object-cover scale-105" 
            priority={priority} 
          />
          
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}
