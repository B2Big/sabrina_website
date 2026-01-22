'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, Activity } from 'lucide-react';
import { ParallaxImage } from './ui/parallax-image';

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-noise">
      {/* Animated Floating Orbs - HIDDEN ON MOBILE */}
      <div className="hidden md:block absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-gradient-to-br from-training/40 to-accent-mint/30 rounded-full blur-[80px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-tl from-care/40 to-accent-peach/30 rounded-full blur-[80px]" 
        />
      </div>

      <div className="container relative z-10 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 lg:w-3/5 text-center lg:text-left"
          >
            {/* Giant Outline Text Background - HIDDEN ON MOBILE */}
            <div className="hidden md:block absolute top-1/2 left-1/2 lg:left-1/4 -translate-x-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-[-1]">
              <span className="text-[10rem] md:text-[18rem] font-black leading-none text-outline opacity-30 blur-sm block">
                ENERGY
              </span>
            </div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/80 border border-slate-200 shadow-lg backdrop-blur-md"
            >
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-training border-2 border-white" />
                <div className="w-6 h-6 rounded-full bg-care border-2 border-white" />
              </div>
              <span className="text-slate-800 font-bold text-sm tracking-wide uppercase">
                Sabrina • Coach & Praticienne
              </span>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-900 leading-[0.9]">
              <span className="block hover:text-training transition-colors duration-500 cursor-default">BOOST</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 italic font-serif">
                & Balance
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-2xl">
              L&apos;alliance parfaite entre l&apos;intensité du <span className="text-training font-bold">sport</span> et la douceur du <span className="text-care font-bold">soin</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-8">
              <Button variant="training" size="lg" className="h-16 px-10 text-xl rounded-2xl w-full sm:w-auto hover:scale-105 transition-transform shadow-xl shadow-training/20" asChild>
                <Link href="#coaching">
                  <Activity className="mr-2 w-6 h-6" />
                  Training
                </Link>
              </Button>

              <Button variant="care" size="lg" className="h-16 px-10 text-xl rounded-2xl w-full sm:w-auto hover:scale-105 transition-transform shadow-xl shadow-care/20" asChild>
                <Link href="#massage">
                  <Sparkles className="mr-2 w-6 h-6" />
                  Self Care
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:w-2/5 w-full max-w-md lg:max-w-none relative"
          >
            <ParallaxImage 
              src="/img/sabrina/sabrina-1.jpg" 
              alt="Sabrina Coaching & Wellness" 
              className="aspect-[4/5] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border-[12px] border-white"
              priority={true}
            />
            {/* Floating decoration */}
            <div className="absolute -bottom-6 -right-6 bg-training text-white p-6 rounded-3xl shadow-2xl z-20 hidden md:block animate-bounce">
              <span className="text-3xl font-black italic">Var (83)</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Hint */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400"
      >
        <ArrowRight className="rotate-90 w-6 h-6" />
      </motion.div>
    </section>
  );
}

