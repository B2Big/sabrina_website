import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { ContactForm } from "@/components/contact-form";
import { Marquee } from "@/components/ui/marquee";
import { ParallaxBackground } from "@/components/parallax-background";
import { AbstractShape } from "@/components/ui/abstract-shape";
import { SmoothScroller } from "@/components/ui/smooth-scroller";
import { CustomCursor } from "@/components/ui/cursor";
import { Testimonials } from "@/components/testimonials";
import { Faq } from "@/components/faq";
import { ValuesSection } from "@/components/values-section";
import { PhotoMarquee } from "@/components/photo-marquee";
import { AboutSection } from "@/components/about-section";
import { Service } from "@/data/content";
import { FloatingCart } from "@/components/ui/floating-cart";
import { getAllServices, getActivePromotions } from "@/lib/db-services";
import { PromoBanner } from "@/components/promo-banner";
import { WhyChoose } from "@/components/sections/why-choose";
import { StatsSection } from "@/components/sections/stats-section";
import { CoachingProcess } from "@/components/sections/coaching-process";
import { MassageAmbiance } from "@/components/sections/massage-ambiance";
import { TestimonialsV2 } from "@/components/sections/testimonials-v2";
import { FaqVisual } from "@/components/sections/faq-visual";

export default async function Home() {
  const [dbServices, promotions] = await Promise.all([
    getAllServices(),
    getActivePromotions()
  ]);

  let services: Service[] = [];

  if (dbServices && dbServices.length > 0) {
      services = dbServices.map(s => {
          // 1. Check for active promotion for this service
          // A promo matches if it includes this service ID in its services list
          const activePromo = promotions.find(p => 
              p.isActive && 
              p.services && 
              p.services.some((linkedService: any) => linkedService.id === s.id)
          );

          let finalPrice = s.price;
          let finalOriginalPrice = s.originalPrice;
          let bestValue = s.bestValue;

          // 2. Apply Discount Logic
          if (activePromo && activePromo.discountPercent) {
             // Extract number from price string (e.g. "50 €" -> 50)
             const priceMatch = s.price.match(/(\d+)/);
             if (priceMatch) {
                const basePrice = parseInt(priceMatch[0]);
                const discountedPrice = Math.round(basePrice * (1 - activePromo.discountPercent / 100));
                
                finalOriginalPrice = s.price; // Move old price to original
                finalPrice = `${discountedPrice} €`; // Set new price
                bestValue = true; // Highlight as best value automatically
             }
          }

          return {
            ...s,
            price: finalPrice,
            originalPrice: finalOriginalPrice,
            bestValue: bestValue,
            category: s.category as any,
            features: s.features || [],
            paymentLink: s.paymentLink || undefined,
            note: s.note || undefined,
            duration: s.duration || undefined,
            objective: s.objective || undefined,
          };
      }) as Service[];
  }

  const coachingServices = services.filter((s) => s.category === "Coaching");
  const massageServices = services.filter((s) => s.category === "Massages" || s.category === "Cures");

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden text-slate-900 selection:bg-training/30 lg:cursor-none" role="main" itemScope itemType="https://schema.org/WebPage">
      {/* H1 SEO - caché visuellement mais présent pour les bots */}
      <h1 className="sr-only absolute top-0 left-0 w-px h-px overflow-hidden" itemProp="name">
        Sab-Fit Coaching Fitness & Massage dans le Var (83) - Domicile et Cabinet
      </h1>
      
      {/* 0. PANIC SELL BANNER */}
      <PromoBanner promotions={promotions} />

      {/* UX ENHANCEMENTS */}
      <SmoothScroller />
      <CustomCursor />

      {/* 1. GLOBAL PARALLAX BACKGROUND */}
      <ParallaxBackground />

      {/* Content z-index 10 to stay above background */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <FloatingCart />

        {/* Marquee Separator */}
        <Marquee 
          items={["PERFORMANCE", "RÉCUPÉRATION", "BIEN-ÊTRE", "ÉQUILIBRE", "FORCE", "SÉRÉNITÉ"]} 
          speed={30}
        />

        {/* WHY CHOOSE SECTION */}
        <WhyChoose />

        {/* STATS SECTION */}
        <StatsSection />

        {/* ABOUT SECTION - E-E-A-T Signal */}
        <AboutSection />

        {/* Services Section - Coaching */}
        <section id="coaching" className="py-20 relative" itemScope itemType="https://schema.org/Service">
          <meta itemProp="serviceType" content="Coaching Sportif" />
          <div className="container relative mx-auto px-4 md:px-8">
            
            {/* Header avec Forme Abstraite 3D */}
            <header className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-12">
              <div className="space-y-6 lg:w-1/2 relative">
                <span className="inline-block px-4 py-1.5 rounded-full bg-training text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-training/30">
                  Performance
                </span>
                <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]" itemProp="name">
                  Coaching <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300">
                    Fitness Sur Mesure
                  </span>
                </h2>
                <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-md backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-white/40" itemProp="description">
                  Programmes de coaching sportif personnalisés dans le Var. 
                  <span className="block mt-2 font-bold text-slate-900">
                    Perte de poids, remise en forme, préparation physique.
                  </span>
                </p>
              </div>

              {/* Forme Abstraite Training */}
              <div className="lg:w-1/2 w-full flex justify-center">
                <AbstractShape type="training" />
              </div>
            </header>

            {/* COACHING PROCESS */}
            <CoachingProcess />

            <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10 relative z-10">
              {coachingServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </article>
          </div>
        </section>

        {/* Photo Gallery Marquee */}
        <PhotoMarquee />

        {/* Services Section - Massage */}
        <section id="massage" className="py-20 relative" itemScope itemType="https://schema.org/Service">
          <meta itemProp="serviceType" content="Massage Bien-être" />
          <div className="container relative mx-auto px-4 md:px-8">
            
            {/* Header avec Forme Abstraite Care */}
            <header className="flex flex-col lg:flex-row-reverse items-center justify-between mb-20 gap-12">
               <div className="space-y-6 lg:w-1/2 text-center lg:text-right relative">
                <span className="inline-block px-4 py-1.5 rounded-full bg-care text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-care/30">
                  Self Care
                </span>
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]" itemProp="name">
                  Massage & <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-rose-300 to-amber-200">
                    Récupération Sportive
                  </span>
                </h2>
                <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto lg:ml-auto lg:mr-0 backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-white/40" itemProp="description">
                  Massages bien-être à domicile dans le Var (83). 
                  <span className="block mt-2 font-bold text-slate-900">
                    Madérothérapie, drainage lymphatique, massage sportif.
                  </span>
                </p>
              </div>

              {/* Forme Abstraite Care */}
              <div className="lg:w-1/2 w-full flex justify-center">
                <AbstractShape type="care" />
              </div>
            </header>

            {/* MASSAGE AMBIANCE */}
            <MassageAmbiance />

            <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10 relative z-10">
              {massageServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </article>
          </div>
        </section>

        {/* SOCIAL PROOF (TestimonialsV2) */}
        <TestimonialsV2 />

        {/* FAQ VISUAL SECTION */}
        <FaqVisual />

        {/* Contact Section - WITH SCARCITY */}
        <section id="contact" className="py-24 relative overflow-hidden" itemScope itemType="https://schema.org/ContactPoint">
          <meta itemProp="contactType" content="Réservation Coaching et Massage" />
          <meta itemProp="areaServed" content="Var, Provence-Alpes-Côte d'Azur" />
          <meta itemProp="availableLanguage" content="French" />
          <div className="container relative mx-auto px-0 md:px-8">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-none md:rounded-[3rem] md:p-16 border-0 md:border border-white/10 shadow-2xl relative overflow-hidden text-white">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 relative z-10">
                <div className="space-y-10 flex flex-col justify-center px-4 md:px-0 py-8 md:py-0">
                  <div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                      Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300">Start</span>.
                    </h2>
                    <p className="text-slate-400 text-xl leading-relaxed max-w-md">
                      Prêt(e) à changer ? N&apos;attendez plus, les créneaux partent vite.
                    </p>
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

                <div className="bg-white rounded-t-3xl md:rounded-3xl p-5 md:p-8 text-slate-900 shadow-xl">
                  <h3 className="text-2xl font-black mb-6">Réservation</h3>
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