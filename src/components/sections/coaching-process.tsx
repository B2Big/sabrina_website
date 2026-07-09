'use client';

import { motion } from 'framer-motion';
import { Target, ClipboardList, TrendingUp, Trophy } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Target,
    title: 'Bilan Initial',
    desc: '30 minutes offertes pour évaluer ton niveau, tes objectifs et tes contraintes. On définit ensemble ta feuille de route.',
    color: 'from-indigo-300 to-purple-300',
  },
  {
    num: '02',
    icon: ClipboardList,
    title: 'Programme Sur-mesure',
    desc: 'Séances adaptées à TON corps et TON emploi du temps. Pas de programme copié-collé, tout est personnalisé.',
    color: 'from-purple-300 to-cyan-300',
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Suivi & Ajustements',
    desc: 'Plans évolutifs, motivation continue, challenges personnalisés. Je m\'adapte à ton évolution en temps réel.',
    color: 'from-cyan-300 to-mint-300',
  },
  {
    num: '04',
    icon: Trophy,
    title: 'Résultats Durables',
    desc: 'L\'objectif : graver de nouvelles habitudes pour ne plus jamais rechuter. Ton corps change, ta mentalité aussi.',
    color: 'from-mint-300 to-indigo-300',
  },
];

export function CoachingProcess() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-training text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-training/30">
            Parcours
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mt-6 leading-[0.9]">
            Votre parcours{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300">
              coaching
            </span>
          </h2>
          <p className="text-slate-600 text-lg font-medium mt-4 max-w-2xl mx-auto">
            De la première rencontre à la transformation durable, chaque étape est pensée pour vous.
          </p>
        </motion.div>

        {/* Timeline Desktop / Stack Mobile */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[72px] left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                {/* Step circle with number */}
                <div className="flex flex-col items-center text-center">
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl mb-6 z-10`}>
                    <step.icon className="w-8 h-8 text-white" />
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center border-2 border-white">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                </div>

                {/* Mobile connector */}
                {i < STEPS.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-300 to-mint-300 rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
