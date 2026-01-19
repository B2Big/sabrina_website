'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ParallaxBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  // Différentes vitesses pour l'effet de profondeur
  const yFast = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const ySlow = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yReverse = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div ref={ref} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Couche 1 : Fond Base */}
      <div className="absolute inset-0 bg-slate-50" />

      {/* Couche 2 : Grille Perspective qui bouge lentement */}
      <motion.div 
        style={{ y: ySlow, opacity: 0.4 }}
        className="absolute inset-[-50%] w-[200%] h-[200%] bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [transform:perspective(1000px)_rotateX(60deg)]"
      />

      {/* Couche 3 : Orbes Flous (Pop Colors) */}
      
      {/* Orbe Bleu (Training) - Bouge vite */}
      <motion.div 
        style={{ y: yFast, x: ySlow }}
        className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-training/10 rounded-full blur-[100px]"
      />
      
      {/* Orbe Rose (Care) - Bouge en inverse */}
      <motion.div 
        style={{ y: yReverse, right: 0 }}
        className="absolute top-[40%] right-[10%] w-[50vw] h-[50vw] bg-care/10 rounded-full blur-[120px]"
      />

      {/* Orbe Menthe (Accent) - Rotation */}
      <motion.div 
        style={{ rotate, y: ySlow }}
        className="absolute bottom-[-10%] left-[20%] w-[30vw] h-[30vw] bg-accent-mint/10 rounded-full blur-[80px]"
      />

      {/* Couche 4 : Noise Texture (Grain) pour lier le tout */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
