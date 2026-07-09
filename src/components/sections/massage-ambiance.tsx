'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

const TECHNIQUES = [
  'Massage Signature',
  'Madérothérapie',
  'Drainage lymphatique',
  'Glow Recovery',
];

export function MassageAmbiance() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container relative mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Image */}
          <motion.div
            className="lg:w-1/2 w-full relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/img/sabrina/hero/webp/7.webp"
                alt="Ambiance massage bien-être"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={80}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 p-6 md:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-care" />
                  <span className="text-white/80 text-sm font-bold uppercase tracking-widest">
                    Bien-être
                  </span>
                </div>
                <p className="text-white text-lg md:text-2xl font-bold max-w-xs leading-snug">
                  À domicile ou en cabinet, dans une atmosphère apaisante
                </p>
              </div>
            </div>

            {/* Decorative blob */}
            <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-care/20 rounded-full blur-3xl" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="lg:w-1/2 w-full"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-care text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-care/30">
              Détente
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mt-6 leading-[0.9]">
              Un moment rien que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-care to-accent-peach">
                pour vous
              </span>
            </h2>

            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mt-6 max-w-lg">
              Chaque soin est une parenthèse de détente. Techniques personnalisées selon vos besoins : récupération sportive, drainage, ou pure relaxation.
            </p>

            {/* Technique pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              {TECHNIQUES.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-care/10 text-care border border-care/20 text-sm font-semibold hover:bg-care/20 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Badge CTA non cliquable */}
            <div className="mt-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 h-12 md:h-14 px-4 md:px-8 text-base md:text-lg rounded-2xl shadow-xl shadow-care/20 bg-care text-white font-black tracking-wide">
                Réserver mon moment de détente
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
