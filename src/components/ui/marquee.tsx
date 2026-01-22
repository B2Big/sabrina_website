'use client';

import { cn } from '@/lib/utils';
import { useId, useEffect, useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarqueeProps {
  items?: string[];
  children?: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

export function Marquee({ items, children, direction = 'left', speed = 30, className }: MarqueeProps) {
  const id = useId().replace(/:/g, '');
  const animLeft = `marquee-l-${id}`;
  const animRight = `marquee-r-${id}`;
  
  // Mobile Logic
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !items) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 2000); // Change word every 2 seconds
    return () => clearInterval(timer);
  }, [isMobile, items?.length]);

  // --- MOBILE VIEW: 3D Flip (ONLY IF ITEMS PROVIDED) ---
  if (isMobile && items) {
    return (
      <div 
        className={cn("relative flex items-center justify-center overflow-hidden bg-slate-900 py-6 border-y-4 border-white shadow-2xl h-[80px]", className)}
        style={{ perspective: "1000px" }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ rotateX: -90, opacity: 0, letterSpacing: "-0.2em", filter: "blur(10px)" }}
            animate={{ rotateX: 0, opacity: 1, letterSpacing: "0.25em", filter: "blur(0px)" }}
            exit={{ rotateX: 90, opacity: 0, letterSpacing: "0.5em", filter: "blur(10px)" }}
            transition={{ 
              duration: 0.7, 
              ease: [0.23, 1, 0.32, 1], // Custom cubic-bezier for a "premium" feel
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-2xl md:text-3xl font-black uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] text-center w-full">
              {items[currentIndex]}
            </span>
          </motion.div>
        </AnimatePresence>
        
        {/* Subtle scanning light effect */}
        <motion.div 
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
        />
      </div>
    );
  }

  // --- DESKTOP/CHILDREN VIEW: Infinite Scrolling Marquee (CSS) ---
  // If children provided, we repeat them 2 times to ensure seamless loop
  const content = children || (items ? [...items, ...items, ...items, ...items].map((item, i) => (
    <span
      key={i}
      className="mx-8 text-base font-bold uppercase tracking-[0.2em] text-white/90 flex items-center gap-8 shrink-0"
    >
      {item}
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
    </span>
  )) : null);

  return (
    <div className={cn("relative flex overflow-hidden user-select-none", !children && "bg-slate-900 py-4 border-y-4 border-white shadow-2xl", className)}>
      
      {/* Container */}
      <div 
        className={cn(
            "flex whitespace-nowrap min-w-full will-change-transform", 
            items && "hidden md:flex", // Only hide on mobile if using items mode
            direction === 'left' ? `animate-${animLeft}` : `animate-${animRight}`
        )}
      >
        {/* Render content multiple times for infinite loop */}
        {content}
        {content}
        {content}
        {content}
      </div>
      
      {/* VIGNETTES (Only if items) */}
      {!children && (
        <>
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 hidden md:block" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 hidden md:block" />
        </>
      )}

      {/* STYLES INJECTED */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-${animLeft} {
          animation: ${animLeft} ${speed}s linear infinite;
        }
        .animate-${animRight} {
          animation: ${animRight} ${speed}s linear infinite;
        }

        @keyframes ${animLeft} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); } 
        }
        @keyframes ${animRight} {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
