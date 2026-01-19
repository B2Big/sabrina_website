'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [variant, setVariant] = useState<'default' | 'training' | 'care'>('default');
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for clickable elements
      if (target.closest('a, button, input, textarea, .cursor-hover')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      // Check for section context
      if (target.closest('#coaching, .bg-training, .text-training')) {
        setVariant('training');
      } else if (target.closest('#massage, .bg-care, .text-care')) {
        setVariant('care');
      } else {
        setVariant('default');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference",
        "hidden lg:flex items-center justify-center backdrop-blur-[1px]",
        variant === 'training' && "bg-training/50 border border-training",
        variant === 'care' && "bg-care/50 border border-care",
        variant === 'default' && "bg-white border border-white"
      )}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
      }}
    >
      <motion.div 
        className="w-1 h-1 bg-white rounded-full"
        animate={{ scale: isHovering ? 0 : 1 }}
      />
    </motion.div>
  );
}
