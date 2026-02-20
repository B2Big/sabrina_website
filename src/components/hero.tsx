'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, Activity, Instagram } from 'lucide-react';
import { ParallaxImage } from './ui/parallax-image';
import Image from 'next/image';

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-noise" itemScope itemType="https://schema.org/WPHeader">
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

            {/* Main Title - Visuel H1 mais sémantiquement H2 car H1 unique dans page.tsx */}
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-900 leading-[0.9]" itemProp="headline">
              <span className="block hover:text-training transition-colors duration-500 cursor-default">BOOST</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 italic font-serif">
                & Balance
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-2xl" itemProp="description">
              Coaching fitness personnalisé et massages bien-être dans le Var (83). 
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

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/sab.fit_coaching83" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-16 px-8 text-lg rounded-2xl w-full sm:w-auto hover:scale-105 transition-all shadow-xl text-white"
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
              >
                <Instagram className="w-6 h-6" />
                <span className="font-bold">@sab.fit_coaching83</span>
              </a>
            </div>
          </motion.div>

          {/* Image Content - Fusion avec dégradé */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:w-2/5 w-full max-w-md lg:max-w-none relative"
          >
            <div 
              className="relative aspect-[4/5] rounded-2xl"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 2%, black 98%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 2%, black 98%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              }}
            >
              <Image 
                src="/img/sabrina/sab.webp" 
                alt="Sabrina Coaching & Massage bien-être dans le Var" 
                fill
                className="object-cover rounded-2xl"
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
              />
            </div>
            
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
    </header>
  );
}

