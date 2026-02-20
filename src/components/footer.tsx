import Link from 'next/link';
import { Mail, Instagram, Shield, MapPin, Phone } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-24 md:pb-8" itemScope itemType="https://schema.org/WPFooter">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <aside className="space-y-4" itemScope itemType="https://schema.org/Organization">
            <meta itemProp="name" content="Sab-Fit Coaching & Massage" />
            <meta itemProp="url" content="https://sab-fit.com" />
            <meta itemProp="email" content="contact@sab-fit.com" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              SABRINA<span className="text-care">.</span>
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs" itemProp="description">
              Coach sportive diplômée d&apos;État & Praticienne bien-être dans le Var (83).
              Coaching fitness personnalisé et massages à domicile.
            </p>
            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Site sécurisé - Paiement crypté</span>
            </div>
          </aside>

          {/* Quick Links */}
          <nav className="space-y-4" aria-label="Navigation secondaire">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#coaching" className="text-slate-500 hover:text-training transition-colors text-sm">
                  Coaching Fitness
                </Link>
              </li>
              <li>
                <Link href="#massage" className="text-slate-500 hover:text-care transition-colors text-sm">
                  Massages Bien-être
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-slate-500 hover:text-training transition-colors text-sm">
                  À Propos de Sabrina
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-slate-500 hover:text-care transition-colors text-sm">
                  Contact & Réservation
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <address className="space-y-4 not-italic" itemScope itemType="https://schema.org/ContactPoint">
            <meta itemProp="contactType" content="customer service" />
            <meta itemProp="areaServed" content="Var (83), Provence-Alpes-Côte d'Azur" />
            <meta itemProp="availableLanguage" content="French" />
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Contact</h4>
            <div className="space-y-3">
              <a 
                href={`mailto:${CONTACT_INFO.email}`} 
                className="flex items-center gap-3 text-slate-500 hover:text-training transition-colors group" 
                itemProp="email"
              >
                <div className="p-2 bg-white border border-slate-200 rounded-full group-hover:border-training group-hover:text-training transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">contact@sab-fit.com</span>
              </a>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-2 bg-white border border-slate-200 rounded-full">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-2 bg-white border border-slate-200 rounded-full">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">Var (83) - PACA</span>
              </div>
            </div>
          </address>

          {/* Réseaux Sociaux */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Suivez-moi</h4>
            <a 
              href={CONTACT_INFO.instagram}
              target="_blank" 
              rel="noopener noreferrer me"
              className="flex items-center gap-3 group"
              itemProp="sameAs"
            >
              <div 
                className="p-2 rounded-full text-white"
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
              >
                <Instagram className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-500 group-hover:text-[#E1306C] transition-colors font-medium">
                @sab.fit_coaching83
              </span>
            </a>
            <p className="text-xs text-slate-400">
              +3000 abonnés • Conseils quotidiens
            </p>
          </div>
        </div>

        {/* Mentions Légales */}
        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-slate-400 text-xs text-center md:text-left">
              © {currentYear} Sab-Fit Coaching & Massage. Tous droits réservés.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <Link href="/cgu" className="hover:text-slate-900 transition-colors">
                CGU
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/cgu" className="hover:text-slate-900 transition-colors">
                Mentions Légales
              </Link>
              <span className="text-slate-300">|</span>
              <span className="hover:text-slate-900 transition-colors cursor-pointer">
                Politique de Confidentialité
              </span>
            </div>
          </div>
          
          {/* Informations Légales Détaillées */}
          <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-500 space-y-2">
            <p>
              <strong>Éditeur du site :</strong> Sabrina [Nom complet], Auto-entrepreneur immatriculée au Registre du Commerce et des Sociétés de Toulon
            </p>
            <p>
              <strong>Siège social :</strong> Var (83), Provence-Alpes-Côte d&apos;Azur, France
            </p>
            <p>
              <strong>Contact :</strong> contact@sab-fit.com • {CONTACT_INFO.phone}
            </p>
            <p>
              <strong>Hébergement :</strong> Netlify, Inc. - 2325 3rd Street, Suite 215, San Francisco, CA 94107, USA
            </p>
            <p>
              <strong>Assurance :</strong> Responsabilité Civile Professionnelle souscrite auprès de [Nom assureur]
            </p>
            <p>
              <strong>Diplômes :</strong> Coach Sportif Diplôme d&apos;État (BPJEPS AGFF ou équivalent) • Certifications Massage Bien-être
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
