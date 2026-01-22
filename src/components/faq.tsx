'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const FAQS = [
  { question: "Où se déroulent les séances ?", answer: "Je me déplace à votre domicile dans le Var (83) ou je vous reçois dans mon cabinet privé entièrement équipé." },
  { question: "Faut-il être sportif pour commencer ?", answer: "Absolument pas ! Le coaching est 100% sur-mesure. On commence à votre niveau et on progresse ensemble." },
  { question: "Quels sont les tarifs ?", answer: "Les tarifs varient selon la prestation (Coaching solo, duo, massage). Comptez environ 50€ pour un coaching et 70€ pour un massage d'1h. Forfaits disponibles." },
  { question: "Quels sont les moyens de paiement ?", answer: "Vous pouvez régler sur place ou en ligne. J'accepte les espèces, la Carte Bancaire (via terminal sécurisé) et PayPal." },
  { question: "Comment réserver ?", answer: "Le plus simple est d'utiliser le formulaire de contact ci-dessous. Je vous rappelle dans la journée pour fixer le créneau." },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-12 text-center">
          Questions Fréquentes
        </h3>
        
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className="border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors bg-slate-50/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-lg text-slate-800">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="w-6 h-6 text-slate-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
