'use client';

import Image from 'next/image';
import { Instagram, Award, MapPin, Clock, CheckCircle, Star } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';

export function AboutSection() {
  return (
    <section 
      id="about" 
      className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
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
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-training/10 text-training font-bold text-xs uppercase tracking-widest mb-4">
            Votre Coach dans le Var
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4" itemProp="headline">
            Qui est <span className="text-transparent bg-clip-text bg-gradient-to-r from-training to-care">Sabrina</span> ?
          </h2>
          <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
            Passionnée par le bien-être et le sport, je vous accompagne dans votre transformation physique et mentale depuis plus de 15 ans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image & Credentials */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/img/sabrina/sabrina-1.webp"
                alt="Sabrina - Coach sportif diplômée et praticienne massage bien-être dans le Var (83)"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
              />
              {/* Badge de certification */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-training/10 rounded-xl">
                    <Award className="w-6 h-6 text-training" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Coach Certifiée</p>
                    <p className="text-sm text-slate-500">Diplôme d'État + Spécialisation Massage</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-training">15</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">ans d&apos;expérience</p>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-black text-care">200+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Clients accompagnés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Content */}
          <div className="space-y-6">
            {/* E-E-A-T Signals */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <CheckCircle className="w-5 h-5 text-training mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Expertise</p>
                  <p className="text-xs text-slate-500">Coach sportif diplômée d&apos;État</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <Star className="w-5 h-5 text-care mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Expérience</p>
                  <p className="text-xs text-slate-500">5 ans dans le Var (83)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <MapPin className="w-5 h-5 text-training mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Local</p>
                  <p className="text-xs text-slate-500">Toulon, Hyères, La Seyne</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <Clock className="w-5 h-5 text-care mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Disponible</p>
                  <p className="text-xs text-slate-500">Lun-Sam, 8h-20h</p>
                </div>
              </div>
            </div>

            {/* Bio Text */}
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed">
                <strong className="text-slate-900">Sabrina, coach sportive et praticienne bien-être basée dans le Var (83).</strong> Mon parcours a débuté par une passion pour le sport et une volonté d&apos;aider les autres à se sentir mieux dans leur corps.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Après avoir obtenu mon <strong>diplôme d&apos;État de coach sportif</strong>, j&apos;ai complété ma formation par des spécialisations en <strong>massage bien-être et récupération sportive</strong>, incluant la madérothérapie et le drainage lymphatique.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Aujourd&apos;hui, je propose un accompagnement complet qui combine <strong>coaching fitness personnalisé</strong> et <strong>soins de récupération</strong>, à domicile ou en cabinet, sur Toulon, Hyères et les alentours.
              </p>
            </div>

            {/* Social Proof & Links */}
            <div className="pt-6 border-t border-slate-200">
              <p className="font-bold text-slate-900 mb-4">Suivez mon actualité sur Instagram</p>
              <div className="flex items-center gap-4">
                <a
                  href={CONTACT_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-transform hover:scale-105"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                  itemProp="sameAs"
                >
                  <Instagram className="w-5 h-5" />
                  <span>@sab.fit_coaching83</span>
                </a>
                <div className="hidden sm:block text-sm text-slate-500">
                  <p>Conseils, motivation et behind the scenes</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-3 py-1.5 bg-training/10 text-training text-xs font-bold rounded-full uppercase tracking-wide">
                Diplôme d&apos;État
              </span>
              <span className="px-3 py-1.5 bg-care/10 text-care text-xs font-bold rounded-full uppercase tracking-wide">
                Certifiée Massage
              </span>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wide">
                Assurance RC Pro
              </span>
              <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                Avis Vérifiés
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
