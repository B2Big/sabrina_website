'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  offset?: number; // Distance de décalage (vitesse)
}

export function ParallaxImage({ src, alt, className, offset = 50 }: ParallaxImageProps) {
  const ref = useRef(null);
  
  // On track le scroll par rapport à ce conteneur spécifique
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // On transforme la progression du scroll (0 à 1) en valeur de pixel (y)
  const y = useTransform(scrollYProgress, [0, 1], [-offset * 1.5, offset * 1.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={ref} 
      className={cn("relative overflow-hidden rounded-[2.5rem] shadow-2xl aspect-[4/5] w-full", className)}
      style={{ perspective: "1000px" }}
    >
      <motion.div 
        style={{ y, scale, rotate, opacity }} 
        className="absolute inset-[-20%] w-[140%] h-[140%] will-change-transform"
      >
        <Image 
          src={src} 
          alt={alt} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </motion.div>
      
      {/* Overlay gradient subtil pour le texte éventuel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
