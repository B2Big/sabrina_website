'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, HelpCircle } from 'lucide-react';
import { AbstractShape } from '@/components/ui/abstract-shape';

const FAQS = [
  {
    q: 'Je débute complètement, est-ce que c\'est pour moi ?',
    a: 'Absolument ! Chaque programme est 100% adapté à votre niveau. Que vous soyez débutant ou sportif confirmé, Sabrina ajuste l\'intensité et les exercices pour vous faire progresser en toute sécurité.',
  },
  {
    q: 'Où se passent les séances ?',
    a: 'À votre domicile dans tout le Var (83) ou en cabinet selon vos préférences et la prestation choisie. Le coaching à domicile inclut tout le matériel nécessaire.',
  },
  {
    q: 'Quels sont les moyens de paiement ?',
    a: 'Carte bancaire en ligne (via Stripe), paiement en 3x sans frais avec Klarna, ou espèces/CB sur place le jour de la séance.',
  },
  {
    q: 'Puis-je offrir une séance en cadeau ?',
    a: 'Oui ! Contactez-nous via le formulaire pour un bon cadeau personnalisé. Une belle idée pour faire découvrir le coaching ou le massage à vos proches.',
  },
  {
    q: 'Quelle tenue pour une séance de coaching ?',
    a: 'Une tenue de sport confortable et des baskets. Sabrina apporte tout le matériel nécessaire (haltères, élastiques, tapis, etc.).',
  },
  {
    q: 'Le massage est-il remboursé ?',
    a: 'Les massages bien-être ne sont pas remboursés par la Sécurité Sociale, mais certaines mutuelles prennent en charge les séances de kiné. Renseignez-vous auprès de la vôtre.',
  },
  {
    q: 'Combien de temps avant de voir des résultats ?',
    a: 'Dès les premières semaines avec un suivi régulier. La plupart des clients ressentent une différence dès la 3ème séance et des résultats visibles après 1 mois.',
  },
  {
    q: 'Comment annuler ou déplacer un rendez-vous ?',
    a: 'Contactez Sabrina par téléphone ou email au moins 24h à l\'avance. L\'annulation tardive peut entraîner des frais selon les conditions de la prestation.',
  },
];

export function FaqVisual() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container relative mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left: Title + visual */}
          <motion.div
            className="lg:w-2/5 w-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
              FAQ
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mt-6 leading-[0.9]">
              Questions{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-training to-accent-mint">
                fréquentes
              </span>
            </h2>

            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed mt-6">
              Vous avez des doutes ? Voici les réponses aux questions les plus courantes. N'hésitez pas à me contacter pour toute question spécifique.
            </p>

            <div className="mt-10 flex justify-center lg:justify-start">
              <AbstractShape type="care" />
            </div>
          </motion.div>

          {/* Right: Accordions */}
          <motion.div
            className="lg:w-3/5 w-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                    openIndex === i
                      ? 'border-training/30 bg-training/5'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center gap-4 p-5 md:p-6 text-left"
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        openIndex === i
                          ? 'bg-training text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {openIndex === i ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-bold text-slate-900 text-base md:text-lg pr-4">
                      {faq.q}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[72px]">
                          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
