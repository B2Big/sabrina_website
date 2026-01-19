import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { ContactForm } from "@/components/contact-form";
import { Marquee } from "@/components/ui/marquee";
import { ParallaxBackground } from "@/components/parallax-background";
import { AbstractShape } from "@/components/ui/abstract-shape";
import { SERVICES } from "@/data/content";

export default function Home() {
  const coachingServices = SERVICES.filter((s) => s.category === "Coaching");
  const massageServices = SERVICES.filter((s) => s.category === "Massages" || s.category === "Cures");

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden text-slate-900 selection:bg-training/30">
      
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

        {/* Services Section - Coaching */}
        <section id="coaching" className="py-32 relative">
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
                  Des programmes construits pour vous, qui s'adaptent à votre rythme et vos objectifs.
                  Repoussez vos limites dans un cadre sécurisé.
                </p>
              </div>

              {/* Forme Abstraite Training */}
              <div className="lg:w-1/2 w-full flex justify-center">
                <AbstractShape type="training" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10">
              {coachingServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Spacer */}
        <div className="h-32 w-full" />

        {/* Services Section - Massage */}
        <section id="massage" className="py-32 relative">
          <div className="container relative mx-auto px-4 md:px-8">
            
            {/* Header avec Forme Abstraite Care */}
            <div className="flex flex-col lg:flex-row-reverse items-center justify-between mb-20 gap-12">
               <div className="space-y-6 lg:w-1/2 text-right relative">
                <span className="inline-block px-4 py-1.5 rounded-full bg-care text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-care/30">
                  Wellness
                </span>
                <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  Massages <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-care to-accent-peach">
                    & Cures
                  </span>
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-md ml-auto backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-white/40">
                  Déconnectez. Relâchez. Réparez. Des soins essentiels pour durer et retrouver votre harmonie.
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

        {/* Contact Section */}
        <section id="contact" className="py-24 relative overflow-hidden">
          <div className="container relative mx-auto px-4 md:px-8">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden text-white">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                <div className="space-y-10 flex flex-col justify-center">
                  <div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                      Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-training to-care">Start</span>.
                    </h2>
                    <p className="text-slate-400 text-xl leading-relaxed max-w-md">
                      Chaque grand changement commence par un petit message. Écrivez-moi.
                    </p>
                  </div>

                  <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
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

                <div className="bg-white rounded-3xl p-8 text-slate-900 shadow-xl">
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