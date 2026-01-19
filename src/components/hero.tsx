'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-warrior-black pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-warrior-red/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-warrior-crimson/10 rounded-full blur-[100px] opacity-30" />
        {/* Mesh grid or texture could go here */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      <div className="container relative z-10 px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-warrior-red/30 bg-warrior-red/10 backdrop-blur-sm"
          >
            <span className="text-warrior-red font-bold tracking-wider text-xs uppercase">
              Révélez votre puissance
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-tight">
            Deviens <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-warrior-red to-warrior-crimson">
              L&apos;Amazone
            </span>
            <br />
            Que tu es
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Coaching sportif & Massages. Une approche brutale et bienveillante pour forger votre corps et apaiser votre esprit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button variant="warrior" size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href="#coaching">
                Commencer le combat
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href="#massage">
                Récupérer (Massage)
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-warrior-red to-transparent" />
      </motion.div>
    </section>
  );
}
