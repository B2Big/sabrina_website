import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { ContactForm } from "@/components/contact-form";
import { SERVICES } from "@/data/content";

export default function Home() {
  const coachingServices = SERVICES.filter((s) => s.category === "Coaching");
  const massageServices = SERVICES.filter((s) => s.category === "Massages" || s.category === "Cures");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Services Section - Coaching */}
      <section id="coaching" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-warrior-dark/50" />
        <div className="container relative mx-auto px-4 md:px-8">
          <div className="mb-16 text-center space-y-4">
            <span className="text-warrior-red font-bold uppercase tracking-widest text-sm">
              Entraînement
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              Coaching Sportif
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dépassez vos limites. Des programmes adaptés pour sculpter votre corps et forger votre mental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coachingServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Massage */}
      <section id="massage" className="py-24 bg-warrior-dark relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(140,14,14,0.1),transparent_50%)]" />
        <div className="container relative mx-auto px-4 md:px-8">
          <div className="mb-16 text-center space-y-4">
            <span className="text-warrior-red font-bold uppercase tracking-widest text-sm">
              Récupération
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              Massages & Cures
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              La récupération fait partie de l&apos;entraînement. Soins drainants, relaxants et sportifs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {massageServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs Section (Brief Summary or Link to contact - prices are already in cards, so maybe just a global note) */}
      <section id="tarifs" className="py-16 bg-warrior-black border-y border-white/5">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Une question sur les tarifs ?
          </h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Les prix indiqués sont à la séance. Des forfaits dégressifs sont disponibles pour les cures et le coaching sur la durée.
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500 font-medium uppercase tracking-widest">
            <span>✓ Paiement sécurisé</span>
            <span>✓ Facture disponible</span>
            <span>✓ Chèques acceptés</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <span className="text-warrior-red font-bold uppercase tracking-widest text-sm">
                  Contact
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mt-4">
                  Rejoins l&apos;aventure
                </h2>
                <p className="text-gray-400 mt-6 leading-relaxed">
                  Prête à commencer ? Remplissez le formulaire ci-contre pour réserver une séance ou poser vos questions.
                  Sabrina vous répondra sous 24h.
                </p>
              </div>

              <div className="space-y-6">
                 <div className="p-6 bg-warrior-dark rounded-xl border border-white/5">
                    <h4 className="text-white font-bold mb-2">Zone d&apos;intervention</h4>
                    <p className="text-gray-400 text-sm">
                      Var (83) - À domicile ou en cabinet privé.
                    </p>
                 </div>
                 <div className="p-6 bg-warrior-dark rounded-xl border border-white/5">
                    <h4 className="text-white font-bold mb-2">Horaires</h4>
                    <p className="text-gray-400 text-sm">
                      Lundi - Vendredi : 08h - 20h<br/>
                      Samedi : 09h - 13h
                    </p>
                 </div>
              </div>
            </div>

            <div className="bg-warrior-dark p-8 rounded-2xl border border-white/10 shadow-2xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}