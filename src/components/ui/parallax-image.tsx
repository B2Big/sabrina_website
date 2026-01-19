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
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={ref} 
      className={cn("relative overflow-hidden rounded-[2.5rem] shadow-2xl aspect-[4/5] w-full", className)}
    >
      <motion.div 
        style={{ y, scale, opacity }} 
        className="absolute inset-[-10%] w-[120%] h-[120%]"
      >
        {/* On utilise un simple img tag ici pour la démo rapide sans config Next/Image domain, 
            mais en prod on utiliserait <Image /> avec fill */}
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Overlay gradient subtil pour le texte éventuel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
