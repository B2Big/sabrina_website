'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    initials: 'ML',
    name: 'Marie L.',
    text: 'Sabrina a complètement transformé ma relation avec le sport. En 3 mois, j\'ai perdu 8kg et je me sens plus énergique que jamais.',
    rating: 5,
    color: 'bg-training',
  },
  {
    initials: 'TD',
    name: 'Thomas D.',
    text: 'Le massage post-course est magique. Je récupère deux fois plus vite et mes douleurs ont disparu. Un vrai game-changer.',
    rating: 5,
    color: 'bg-care',
  },
  {
    initials: 'SM',
    name: 'Sophie M.',
    text: 'Je pensais que le coaching à domicile serait compliqué, mais c\'est l\'inverse. Sabrina s\'adapte à mon emploi du temps et à mon salon.',
    rating: 5,
    color: 'bg-accent-mint',
  },
];

export function TestimonialsV2() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-slate-50">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
            Témoignages
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mt-6 leading-[0.9]">
            Ils m'ont fait{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300">
              confiance
            </span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg rounded-3xl p-8 md:p-10 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-slate-200 mb-4" />

                {/* Text */}
                <p className="text-slate-700 text-base md:text-lg leading-relaxed flex-grow italic">
                  "{t.text}"
                </p>

                {/* Footer */}
                <div className="mt-8 flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {t.initials}
                  </div>

                  <div className="flex-grow">
                    <p className="font-bold text-slate-900">{t.name}</p>
                    {/* Stars */}
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: t.rating }).map((_, si) => (
                        <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
