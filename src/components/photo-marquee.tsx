'use client';

import { motion } from 'framer-motion';
import { ParallaxImage } from './ui/parallax-image';

const IMAGES = [
  { src: '/img/sabrina/sabrina-1.jpg', alt: 'Sabrina coach sportif en séance de coaching fitness personnalisé dans le Var' },
  { src: '/img/sabrina/sabrina-2.jpg', alt: 'Séance de massage bien-être et récupération sportive à domicile' },
  { src: '/img/sabrina/sabrina-3.jpg', alt: 'Coaching sportif pour remise en forme et perte de poids dans le 83' },
  { src: '/img/sabrina/sabrina-4.jpg', alt: 'Massage madérothérapie sculptant aux bois de rose' },
  { src: '/img/sabrina/sabrina-5.jpg', alt: 'Séance de préparation physique et coaching personnalisé' },
  { src: '/img/sabrina/sabrina-6.jpg', alt: 'Massage sportif pour récupération musculaire dans le Var' },
  { src: '/img/sabrina/sabrina-7.jpg', alt: 'Coaching fitness à domicile - exercices personnalisés' },
  { src: '/img/sabrina/sabrina-8.jpg', alt: 'Séance de massage californien relaxation profonde' },
  { src: '/img/sabrina/sabrina-9.jpg', alt: 'Entraînement sportif avec coach professionnel Sabrina' },
  { src: '/img/sabrina/sabrina-10.jpg', alt: 'Drainage lymphatique et massage détoxifiant' },
  { src: '/img/sabrina/sabrina-11.jpg', alt: 'Cabinet de coaching et massage bien-être Sab-Fit' },
];

export function PhotoMarquee() {
  return (
    <section className="py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
          L'expertise <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-training to-care">
            En Action
          </span>
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {/* First row moving left */}
        <div className="flex overflow-hidden select-none">
          <motion.div 
            animate={{ x: [0, -1920] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex flex-nowrap gap-8 pr-8 will-change-transform"
          >
            {[...IMAGES, ...IMAGES].map((image, i) => (
              <div key={i} className="w-[300px] md:w-[450px] flex-shrink-0">
                <ParallaxImage 
                  src={image.src} 
                  alt={image.alt}
                  className="aspect-[4/5] rounded-[2rem]"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second row moving right (optional) */}
        <div className="flex overflow-hidden select-none">
          <motion.div 
            animate={{ x: [-1920, 0] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="flex flex-nowrap gap-8 pr-8 will-change-transform"
          >
            {[...IMAGES].reverse().concat([...IMAGES].reverse()).map((image, i) => (
              <div key={i} className="w-[250px] md:w-[350px] flex-shrink-0">
                <ParallaxImage 
                  src={image.src} 
                  alt={image.alt}
                  className="aspect-[1/1] rounded-[2rem]"
                  offset={30}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
