'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  { name: "Julie D.", text: "Le coaching m'a transformée. J'ai perdu 5kg mais surtout gagné une confiance énorme.", type: "training" },
  { name: "Marc P.", text: "Après mon marathon, le massage sportif a été un miracle pour mes jambes.", type: "care" },
  { name: "Sophie L.", text: "Sabrina est solaire ! Chaque séance est un boost d'énergie pure.", type: "training" },
  { name: "Thomas A.", text: "Douleurs de dos disparues après 3 séances. Une magicienne.", type: "care" },
  { name: "Léa M.", text: "L'approche mix sport + détente est géniale. On se dépense et on récupère.", type: "training" },
  { name: "Camille R.", text: "Je ne jure plus que par ses massages drainants. Résultat immédiat.", type: "care" },
  { name: "Antoine S.", text: "Un accompagnement sur-mesure qui m'a aidé à reprendre le sport après une blessure. Très pro.", type: "training" },
  { name: "Élodie B.", text: "La madérothérapie est bluffante. Ma peau est beaucoup plus ferme après seulement 5 séances.", type: "care" },
  { name: "Nicolas V.", text: "Le cardio-boxe est le meilleur moyen de se défouler. Sabrina pousse juste ce qu'il faut.", type: "training" },
  { name: "Clara H.", text: "Un moment hors du temps. Le massage californien m'a permis de vraiment lâcher prise.", type: "care" },
  { name: "Julien K.", text: "Objectif perte de poids atteint ! Sabrina ne lâche rien et c'est ce qu'il me fallait.", type: "training" },
  { name: "Marine F.", text: "J'avais les jambes lourdes en fin de journée, le drainage a tout changé. Je revis.", type: "care" },
  { name: "Paul L.", text: "Une coach qui comprend vraiment la physiologie. On travaille intelligemment, sans se blesser.", type: "training" },
  { name: "Inès G.", text: "L'huile de massage sent divinement bon et les mains de Sabrina sont expertes. Je recommande.", type: "care" },
  { name: "Maxime R.", text: "Small group entre collègues le midi : ambiance au top et on se sent en pleine forme.", type: "training" },
  { name: "Sarah T.", text: "Un accueil chaleureux et des soins de grande qualité. Le massage balinais est une pépite.", type: "care" },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotation automatique pour mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3500); // 3.5 secondes pour laisser le temps de lire
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Elles (et ils) ont adoré 
          <span className="text-care ml-2">♥</span>
        </h3>
      </div>
      
      {/* --- DESKTOP VIEW (Marquee Défilant) --- */}
      <div className="hidden md:flex relative overflow-hidden user-select-none">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex gap-6 min-w-full px-4"
        >
          {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div 
              key={i}
              className={`
                flex-shrink-0 w-[400px] p-6 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-shadow
                ${t.type === 'training' ? 'border-training/10' : 'border-care/10'}
              `}
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 fill-current ${t.type === 'training' ? 'text-training' : 'text-care'}`} />
                ))}
              </div>
              <p className="text-slate-700 font-medium text-lg mb-4 italic">
                &quot;{t.text}&quot;
              </p>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                — {t.name}
              </p>
            </div>
          ))}
        </motion.div>
        
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />
      </div>

      {/* --- MOBILE VIEW (Carrousel Fixe) --- */}
      <div className="md:hidden px-4 min-h-[250px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4 }}
            className={`
              w-full p-6 rounded-2xl border-2 bg-white shadow-lg
              ${currentTestimonial.type === 'training' ? 'border-training/20 shadow-training/5' : 'border-care/20 shadow-care/5'}
            `}
          >
             <div className="flex justify-between items-start mb-4">
               <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 fill-current ${currentTestimonial.type === 'training' ? 'text-training' : 'text-care'}`} />
                ))}
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${currentTestimonial.type === 'training' ? 'bg-training/10 text-training' : 'bg-care/10 text-care'}`}>
                 {currentTestimonial.type === 'training' ? 'Sport' : 'Massage'}
              </div>
             </div>
              
              <p className="text-slate-800 font-bold text-lg mb-4 leading-relaxed">
                &quot;{currentTestimonial.text}&quot;
              </p>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest text-right">
                — {currentTestimonial.name}
              </p>

              {/* Barre de progression temps lecture */}
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5, ease: "linear" }}
                className={`h-1 mt-4 rounded-full ${currentTestimonial.type === 'training' ? 'bg-training' : 'bg-care'}`}
              />
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}