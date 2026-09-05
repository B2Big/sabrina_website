'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, HelpCircle } from 'lucide-react';
import { AbstractShape } from '@/components/ui/abstract-shape';
import { FAQS } from '@/data/faqs';

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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300">
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
