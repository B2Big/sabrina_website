import Link from 'next/link';
import { Mail, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-24 md:pb-8" itemScope itemType="https://schema.org/WPFooter">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <aside className="space-y-4" itemScope itemType="https://schema.org/Organization">
            <meta itemProp="name" content="Sab-Fit Coaching & Massage" />
            <meta itemProp="url" content="https://sabrina-coaching-massage.fr" />
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              SABRINA<span className="text-care">.</span>
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs" itemProp="description">
              Coach sportive & Praticienne bien-être dans le Var (83).
              Coaching fitness et massages à domicile.
            </p>
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
                <Link href="#tarifs" className="text-slate-500 hover:text-training transition-colors text-sm">
                  Tarifs
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-100">
                <Link href="/admin" className="text-slate-300 hover:text-slate-500 transition-colors text-xs font-medium uppercase tracking-widest">
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <address className="space-y-4 not-italic" itemScope itemType="https://schema.org/ContactPoint">
            <meta itemProp="contactType" content="customer service" />
            <meta itemProp="areaServed" content="FR-83" />
            <meta itemProp="availableLanguage" content="French" />
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:contact@sab-fit.com" className="flex items-center gap-3 text-slate-500 hover:text-training transition-colors group" itemProp="email">
                <div className="p-2 bg-white border border-slate-200 rounded-full group-hover:border-training group-hover:text-training transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">contact@sab-fit.com</span>
              </a>
            </div>
          </address>

          {/* Réseaux Sociaux */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Réseaux</h4>
            <a 
              href="https://www.instagram.com/sab.fit_coaching83" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 group"
            >
              <div 
                className="p-2 rounded-full text-white"
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
              >
                <Instagram className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-500 group-hover:text-[#E1306C] transition-colors font-medium">@sab.fit_coaching83</span>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Sabrina Coaching. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}