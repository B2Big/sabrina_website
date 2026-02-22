'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Award, MapPin, Clock, CheckCircle, Star, ChevronDown, User } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';

export function AboutSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section 
      id="about" 
      className="py-16 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
      itemScope 
      itemType="https://schema.org/Person"
    >
      {/* Schema.org hidden metadata */}
      <meta itemProp="name" content="Sabrina - Sab-Fit Coaching & Massage" />
      <meta itemProp="jobTitle" content="Coach Sportif & Praticienne Massage Bien-être" />
      <meta itemProp="description" content="Coach sportive diplômée et praticienne massages bien-être dans le Var (83). Spécialisée en coaching fitness personnalisé, madérothérapie et récupération sportive." />
      <meta itemProp="url" content="https://sab-fit.com" />
      <meta itemProp="email" content={CONTACT_INFO.email} />
      <link itemProp="sameAs" href={CONTACT_INFO.instagram} />
      
      <div className="container mx-auto px-4 md:px-8">
        {/* Header Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-training/10 text-training font-bold text-xs uppercase tracking-widest">
            <User className="w-4 h-4" />
            Votre Coach dans le Var
          </span>
        </div>

        {/* Modern Accordion Card */}
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            initial={false}
            animate={{ 
              boxShadow: isOpen 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)' 
                : '0 10px 40px -10px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Accordion Header - Always visible */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-6 md:p-8 flex items-center gap-6 hover:bg-slate-50/50 transition-colors group"
            >
              {/* Avatar */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src="/img/sabrina/sabrina-11.webp"
                  alt="Sabrina - Coach sportif"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Title & Summary */}
              <div className="flex-1 text-left">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                  Qui est <span className="text-transparent bg-clip-text bg-gradient-to-r from-training to-care">Sabrina</span> ?
                </h2>
                <p className="text-slate-600 text-sm md:text-base">
                  Coach sportive diplômée d&apos;État & praticienne bien-être • 15 ans d&apos;expérience
                </p>
              </div>

              {/* Expand/Collapse Icon */}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-training to-care flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <ChevronDown className="w-6 h-6 text-white" />
              </motion.div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-6 md:px-8 pb-8">
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                      {/* Left Column - Image & Quick Stats */}
                      <div className="space-y-6">
                        {/* Main Image with Mask Effect */}
                        <div className="relative">
                          <div 
                            className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl"
                            style={{
                              maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 2%, black 98%, transparent 100%)',
                              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 2%, black 98%, transparent 100%)',
                              maskComposite: 'intersect',
                              WebkitMaskComposite: 'source-in',
                            }}
                          >
                            <Image
                              src="/img/sabrina/sabrina-11.webp"
                              alt="Sabrina - Coach sportif diplômée et praticienne massage bien-être dans le Var (83)"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              quality={85}
                            />
                          </div>
                          
                          {/* Certification Badge */}
                          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-training/10 rounded-lg">
                                <Award className="w-5 h-5 text-training" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">Coach Certifiée</p>
                                <p className="text-xs text-slate-500">Diplôme d&apos;État + Massage</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-training/10 to-training/5 rounded-xl p-4 text-center">
                            <p className="text-3xl font-black text-training">15</p>
                            <p className="text-xs text-slate-600 uppercase tracking-wide">ans d&apos;expérience</p>
                          </div>
                          <div className="bg-gradient-to-br from-care/10 to-care/5 rounded-xl p-4 text-center">
                            <p className="text-3xl font-black text-care">200+</p>
                            <p className="text-xs text-slate-600 uppercase tracking-wide">Clients accompagnés</p>
                          </div>
                        </div>

                        {/* E-E-A-T Signals */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-training flex-shrink-0" />
                            <span className="text-xs font-medium text-slate-700">Coach diplômée d&apos;État</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <Star className="w-4 h-4 text-care flex-shrink-0" />
                            <span className="text-xs font-medium text-slate-700">5 ans dans le Var</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-training flex-shrink-0" />
                            <span className="text-xs font-medium text-slate-700">Hyères, Toulon, La Seyne</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <Clock className="w-4 h-4 text-care flex-shrink-0" />
                            <span className="text-xs font-medium text-slate-700">Lun-Sam, 8h-20h</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Bio Content */}
                      <div className="space-y-6">
                        {/* Bio Text */}
                        <div className="prose prose-slate max-w-none space-y-4">
                          <p className="text-slate-600 leading-relaxed">
                            <strong className="text-slate-900">Sabrina — Coach sportive & praticienne bien-être dans le Var (83)</strong>
                          </p>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            Le sport est bien plus qu&apos;un métier pour moi : c&apos;est une passion profonde et un mode de vie. Depuis toujours, j&apos;aime me challenger, repousser mes limites et me fixer de nouveaux objectifs, notamment à travers la course à pied, les runs et les défis sportifs qui rythment mon parcours.
                          </p>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            Depuis plus de 15 ans, j&apos;accompagne femmes et hommes vers leurs objectifs avec la même énergie et la même détermination qui m&apos;animent au quotidien.
                          </p>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            Perte de poids, remise en forme, préparation physique, reprise après une pause ou envie de se sentir plus fort dans son corps : chaque accompagnement est unique et construit sur mesure.
                          </p>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            Diplômée d&apos;État en coaching sportif, j&apos;ai développé une approche complète qui va au-delà du fitness classique. Parce qu&apos;un corps performant est aussi un corps qui récupère, j&apos;ai complété mon expertise avec des spécialisations en massage bien-être et récupération sportive.
                          </p>
                          <p className="text-slate-900 font-bold leading-relaxed text-sm">
                            Sab Fit Coaching & Massages, c&apos;est l&apos;alliance entre passion du sport, performance et bien-être.
                          </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-training/10 text-training text-xs font-bold rounded-full">
                            Diplôme d&apos;État
                          </span>
                          <span className="px-3 py-1.5 bg-care/10 text-care text-xs font-bold rounded-full">
                            Certifiée Massage
                          </span>
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                            Assurance RC Pro
                          </span>
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Avis Vérifiés
                          </span>
                        </div>

                        {/* Diplomas Accordion */}
                        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2">
                            <Award className="w-4 h-4 text-training" />
                            Diplômes & Certifications
                          </h4>
                          
                          <div className="space-y-2">
                            {[
                              { title: 'BPJEPS AF', desc: 'Brevet Professionnel — Activités de la Forme (Diplôme d\'État)', color: 'training' },
                              { title: 'Massage lymphatique', desc: 'Méthode brésilienne', color: 'care' },
                              { title: 'Madero thérapie', desc: 'Certification spécialisée', color: 'care' },
                              { title: 'Massage sportif & Deep Tissue', desc: 'École Dubarry Formation', color: 'care' },
                              { title: 'Massage californien', desc: 'Certification bien-être', color: 'care' },
                              { title: 'Réflexologie plantaire', desc: 'Certification bien-être', color: 'care' },
                            ].map((item, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${item.color} mt-1.5 flex-shrink-0`} />
                                <div>
                                  <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Instagram Link */}
                        <a
                          href={CONTACT_INFO.instagram}
                          target="_blank"
                          rel="noopener noreferrer me"
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold transition-transform hover:scale-[1.02]"
                          style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                          itemProp="sameAs"
                        >
                          <Instagram className="w-5 h-5" />
                          <span className="text-sm">@sab.fit_coaching83</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Hint text when closed */}
          {!isOpen && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-400 text-sm mt-4"
            >
              Cliquez pour découvrir mon parcours
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
