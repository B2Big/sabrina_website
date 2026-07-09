'use client';

import { motion } from 'framer-motion';
import { AbstractShape } from '@/components/ui/abstract-shape';
import { CheckCircle2, Award, MapPin, CalendarCheck, CreditCard } from 'lucide-react';

const ARGUMENTS = [
  {
    icon: Award,
    title: 'Diplômée d\'État',
    desc: 'Certifications coaching sportif & massage bien-être. Un savoir-faire reconnu et à jour.',
  },
  {
    icon: CheckCircle2,
    title: '100% Sur-mesure',
    desc: 'Chaque séance est adaptée à VOTRE corps et VOS objectifs. Pas de programme copié-collé.',
  },
  {
    icon: MapPin,
    title: 'À domicile ou en cabinet',
    desc: 'Flexibilité totale dans le Var (83). Je me déplace chez vous ou vous recevez en cabinet.',
  },
  {
    icon: CalendarCheck,
    title: 'Suivi personnalisé',
    desc: 'Plans d\'entraînement évolutifs et ajustements continus selon votre progression.',
  },
  {
    icon: CreditCard,
    title: 'Paiement sécurisé',
    desc: 'CB en ligne via Stripe, paiement en 3x sans frais avec Klarna, ou sur place.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function WhyChoose() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container relative mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: Content */}
          <motion.div
            className="lg:w-3/5 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
                Pourquoi moi
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 mt-6 leading-[0.9]"
            >
              Pourquoi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300">
                choisir
              </span>{' '}
              Sab-Fit
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mt-6 max-w-xl"
            >
              Plus qu'une coach ou une masseuse, une accompagnatrice dédiée à votre transformation physique et mentale.
            </motion.p>

            {/* Stats highlight */}
            <motion.div
              variants={itemVariants}
              className="mt-8 inline-flex items-center gap-4 bg-training/5 border-2 border-training/10 rounded-2xl px-6 py-4"
            >
              <span className="text-4xl md:text-5xl font-black text-training">500+</span>
              <span className="text-slate-700 font-semibold text-sm md:text-base leading-tight">
                clients accompagnés<br />dans leur transformation
              </span>
            </motion.div>

            {/* Arguments list */}
            <div className="mt-10 space-y-5">
              {ARGUMENTS.map((arg) => (
                <motion.div
                  key={arg.title}
                  variants={itemVariants}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-300 via-cyan-300 to-mint-300 flex items-center justify-center shadow-lg shadow-indigo-300/20 group-hover:scale-110 transition-transform duration-300">
                    <arg.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base md:text-lg">{arg.title}</h4>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">{arg.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            className="lg:w-2/5 w-full flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="relative">
              <AbstractShape type="training" />
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-care text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Var (83)
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
