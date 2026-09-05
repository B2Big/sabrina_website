import Image from 'next/image';

// 🏋️ Images Coaching / Sport (optimisées WebP)
const SPORT_IMAGES = [
  { src: '/img/sabrina/sport/webp/IMG_9920_1_1.webp', alt: 'Coaching sportif personnalisé' },
  { src: '/img/sabrina/sport/webp/IMG_9956_1.webp', alt: 'Entraînement fitness' },
  { src: '/img/sabrina/sport/webp/IMG_9758.webp', alt: 'Remise en forme' },
  { src: '/img/sabrina/sport/webp/IMG_0469_1.webp', alt: 'Sport à domicile' },
  { src: '/img/sabrina/sport/webp/IMG_0393.webp', alt: 'Programme coaching' },
  { src: '/img/sabrina/sport/webp/IMG_9800_1.webp', alt: 'Préparation physique' },
];

// 💆 Images Massage / Bien-être (optimisées WebP)
const MASSAGE_IMAGES = [
  { src: '/img/sabrina/massage/webp/111111111.webp', alt: 'Massage bien-être' },
  { src: '/img/sabrina/massage/webp/756.webp', alt: 'Massage relaxant' },
  { src: '/img/sabrina/massage/webp/18.webp', alt: 'Soin massage' },
  { src: '/img/sabrina/massage/webp/112233.webp', alt: 'Massage à domicile' },
  { src: '/img/sabrina/massage/webp/8.webp', alt: 'Massage récupération' },
  { src: '/img/sabrina/massage/webp/s.webp', alt: 'Moment détente' },
];

// 📸 Images portrait Sabrina
const PORTRAIT_IMAGES = [
  { src: '/img/sabrina/sabrina-2.webp', alt: 'Sabrina coach sportif' },
  { src: '/img/sabrina/sabrina-3.webp', alt: 'Sabrina masseuse' },
  { src: '/img/sabrina/sabrina-4.webp', alt: 'Expertise bien-être' },
  { src: '/img/sabrina/sabrina-5.webp', alt: 'Passion sport et massage' },
];

// Rangée 1 : alternance portrait → sport → massage
const ROW1_IMAGES = [
  PORTRAIT_IMAGES[0], SPORT_IMAGES[0], MASSAGE_IMAGES[0],
  PORTRAIT_IMAGES[1], SPORT_IMAGES[1], MASSAGE_IMAGES[1],
  PORTRAIT_IMAGES[2], SPORT_IMAGES[2], MASSAGE_IMAGES[2],
  PORTRAIT_IMAGES[3], SPORT_IMAGES[3], MASSAGE_IMAGES[3],
];

// Rangée 2 : inversé pour variété visuelle
const ROW2_IMAGES = [
  MASSAGE_IMAGES[4], SPORT_IMAGES[4], PORTRAIT_IMAGES[0],
  MASSAGE_IMAGES[5], SPORT_IMAGES[5], PORTRAIT_IMAGES[1],
  MASSAGE_IMAGES[0], SPORT_IMAGES[0], PORTRAIT_IMAGES[2],
  MASSAGE_IMAGES[1], SPORT_IMAGES[1], PORTRAIT_IMAGES[3],
];

/**
 * Marquee photo — défilement en animation CSS pure (compositeur GPU).
 * Remplace l'ancienne version framer-motion qui créait 24 listeners de scroll
 * (un useScroll + useSpring par image) : plus aucun travail JS par frame.
 */
export function PhotoMarquee() {
  return (
    <section className="py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
          L&apos;expertise <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300">
            En Action
          </span>
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {/* Rangée 1 - défilement vers la gauche */}
        <div className="flex overflow-hidden select-none" aria-hidden="true">
          <div className="flex flex-nowrap gap-8 pr-8 will-change-transform marquee-track marquee-left">
            {[...ROW1_IMAGES, ...ROW1_IMAGES].map((image, i) => (
              <div key={`r1-${i}`} className="relative w-[280px] md:w-[400px] flex-shrink-0 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 280px, 400px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rangée 2 - défilement vers la droite */}
        <div className="flex overflow-hidden select-none" aria-hidden="true">
          <div className="flex flex-nowrap gap-8 pr-8 will-change-transform marquee-track marquee-right">
            {[...ROW2_IMAGES, ...ROW2_IMAGES].map((image, i) => (
              <div key={`r2-${i}`} className="relative w-[240px] md:w-[320px] flex-shrink-0 aspect-[1/1] rounded-[2rem] overflow-hidden shadow-lg">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 240px, 320px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
