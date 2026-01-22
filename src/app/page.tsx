import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { ParallaxBackground } from "@/components/parallax-background";
import { AbstractShape } from "@/components/ui/abstract-shape";
import { SmoothScroller } from "@/components/ui/smooth-scroller";
import { CustomCursor } from "@/components/ui/cursor";
import { Testimonials } from "@/components/testimonials";
import { Faq } from "@/components/faq";
import { ValuesSection } from "@/components/values-section";
import { PhotoMarquee } from "@/components/photo-marquee";
import { SERVICES } from "@/data/content";
import { PaceCalculator } from "@/components/pace-calculator";

export default function Home() {
  const coachingServices = SERVICES.filter((s) => s.category === "Coaching");
  const massageServices = SERVICES.filter((s) => s.category === "Massages" || s.category === "Cures");

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden text-slate-900 selection:bg-training/30 cursor-none">
      
      {/* UX ENHANCEMENTS */}
      <SmoothScroller />
      <CustomCursor />

      {/* 1. GLOBAL PARALLAX BACKGROUND */}
      <ParallaxBackground />

      {/* Content z-index 10 to stay above background */}
      <div className="relative z-10">
        <Navbar />
        <Hero />

        {/* Marquee Separator */}
        <Marquee 
          items={["PERFORMANCE", "RÉCUPÉRATION", "BIEN-ÊTRE", "ÉQUILIBRE", "FORCE", "SÉRÉNITÉ"]} 
          speed={30}
          className="border-y-4 border-white shadow-2xl"
        />

        {/* NEW: WHY ME SECTION (Authority) */}
        <ValuesSection />

        {/* Services Section - Coaching */}
        <section id="coaching" className="py-20 relative">
          <div className="container relative mx-auto px-4 md:px-8">
            
            {/* Header avec Forme Abstraite 3D */}
            <div className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-12">
              <div className="space-y-6 lg:w-1/2 relative">
                <span className="inline-block px-4 py-1.5 rounded-full bg-training text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-training/30">
                  Performance
                </span>
                <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  Coaching <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-training to-accent-mint">
                    Sur Mesure
                  </span>
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-md backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-white/40">
                  Ne perdez plus de temps avec des programmes génériques.
                  <span className="block mt-2 font-bold text-slate-900">
                    Choisissez l&apos;excellence.
                  </span>
                </p>
              </div>

              {/* Pace Calculator Integration */}
              <div className="lg:w-1/2 w-full flex flex-col items-center gap-8">
                <div className="w-full transform hover:scale-[1.02] transition-transform duration-500">
                   <PaceCalculator />
                </div>
                {/* Visual Connector */}
                <p className="text-xs font-bold text-training/60 uppercase tracking-widest text-center">
                   ▲ Testez votre potentiel avec le simulateur Club Run
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10">
              {coachingServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Photo Gallery Marquee */}
        <PhotoMarquee />

        {/* Services Section - Massage */}
        <section id="massage" className="py-20 relative">
          <div className="container relative mx-auto px-4 md:px-8">
            
            {/* Header avec Forme Abstraite Care */}
            <div className="flex flex-col lg:flex-row-reverse items-center justify-between mb-20 gap-12">
               <div className="space-y-6 lg:w-1/2 text-right relative">
                <span className="inline-block px-4 py-1.5 rounded-full bg-care text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-care/30">
                  Self Care
                </span>
                <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  Soins & <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-care to-accent-peach">
                    Récupération
                  </span>
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-md ml-auto backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-white/40">
                  Votre corps est votre moteur, entretenez-le.
                  <span className="block mt-2 font-bold text-slate-900">
                    Drainage, relâchement musculaire ou pure détente : faites un &quot;Reset&quot; complet.
                  </span>
                </p>
              </div>

              {/* Forme Abstraite Care */}
              <div className="lg:w-1/2 w-full flex justify-center">
                <AbstractShape type="care" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10">
              {massageServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF (Testimonials) */}
        <Testimonials />

        {/* FAQ SECTION */}
        <Faq />

        {/* Contact Section - WITH SCARCITY */}
        <section id="contact" className="py-24 relative overflow-hidden">
          <div className="container relative mx-auto px-4 md:px-8">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden text-white">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative z-10">
                <div className="space-y-10 flex flex-col justify-center">
                  <div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                      Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-training to-care">Start</span>.
                    </h2>
                    <p className="text-slate-400 text-xl leading-relaxed max-w-md">
                      Prêt(e) à changer ? N&apos;attendez plus, les créneaux partent vite.
                    </p>
                  </div>

                  {/* SCARCITY INDICATOR */}
                  <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl animate-pulse">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-bold text-green-400 tracking-wide text-sm">
                      Disponibilité : Quelques places cette semaine
                    </span>
                  </div>

                  <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-hover">
                        <div className="h-12 w-12 rounded-full bg-training flex items-center justify-center font-bold text-xl">
                          83
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">Zone Var</h4>
                          <p className="text-slate-400 text-sm">Domicile ou Cabinet</p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 md:p-8 text-slate-900 shadow-xl">
                  <h3 className="text-2xl font-black mb-6">Envoyer un message</h3>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}