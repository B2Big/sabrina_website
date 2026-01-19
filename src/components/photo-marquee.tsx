'use client';

import { motion } from 'framer-motion';
import { ParallaxImage } from './ui/parallax-image';

const IMAGES = [
  '/img/sabrina/sabrina-1.jpg',
  '/img/sabrina/sabrina-2.jpg',
  '/img/sabrina/sabrina-3.jpg',
  '/img/sabrina/sabrina-4.jpg',
  '/img/sabrina/sabrina-5.jpg',
  '/img/sabrina/sabrina-6.jpg',
  '/img/sabrina/sabrina-7.jpg',
  '/img/sabrina/sabrina-8.jpg',
  '/img/sabrina/sabrina-9.jpg',
  '/img/sabrina/sabrina-10.jpg',
  '/img/sabrina/sabrina-11.jpg',
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
            className="flex flex-nowrap gap-8 pr-8"
          >
            {[...IMAGES, ...IMAGES].map((src, i) => (
              <div key={i} className="w-[300px] md:w-[450px] flex-shrink-0">
                <ParallaxImage 
                  src={src} 
                  alt={`Sabrina Coaching ${i}`} 
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
            className="flex flex-nowrap gap-8 pr-8"
          >
            {[...IMAGES].reverse().concat([...IMAGES].reverse()).map((src, i) => (
              <div key={i} className="w-[250px] md:w-[350px] flex-shrink-0">
                <ParallaxImage 
                  src={src} 
                  alt={`Sabrina Wellness ${i}`} 
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
