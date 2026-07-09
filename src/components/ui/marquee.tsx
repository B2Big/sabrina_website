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
  const animName = `marquee-${id}`;
  
  // Mobile Logic for 3D Flip
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
    }, 5000); // Change word every 5 seconds
    return () => clearInterval(timer);
  }, [isMobile, items?.length]);

  // --- MOBILE VIEW: Smooth crossfade (ONLY IF ITEMS PROVIDED) ---
  if (isMobile && items && !children) {
    return (
      <div 
        className={cn("relative flex items-center justify-center overflow-hidden bg-slate-900 py-6 h-[80px]", className)}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-xl font-black uppercase text-white tracking-[0.2em] text-center w-full">
              {items[currentIndex]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // --- DESKTOP / CHILDREN VIEW: Infinite Scroll ---
  
  // Content generator
  const renderContent = () => children || (items ? items.map((item, i) => (
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
      
      {/* Wrapper that moves */}
      <div 
        className="flex whitespace-nowrap w-max shrink-0"
        style={{ 
            animation: `${animName} ${speed}s linear infinite`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
      >
         {renderContent()}
         {renderContent()}
         {renderContent()}
         {renderContent()}
      </div>

      {/* Duplicate Wrapper for seamless loop */}
      <div 
        className="flex whitespace-nowrap w-max shrink-0"
        style={{ 
            animation: `${animName} ${speed}s linear infinite`,
            animationDirection: direction === 'right' ? 'reverse' : 'normal'
        }}
      >
         {renderContent()}
         {renderContent()}
         {renderContent()}
         {renderContent()}
      </div>

      {/* VIGNETTES */}
      {!children && (
        <>
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 hidden md:block" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 hidden md:block" />
        </>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ${animName} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); } 
        }
      `}} />
    </div>
  );
}