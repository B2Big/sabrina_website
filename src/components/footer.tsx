import Link from 'next/link';
import { Mail, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-warrior-dark border-t border-warrior-red/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tighter">
              SABRINA<span className="text-warrior-red">.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Coaching sportif et massages bien-être. 
              Révélez votre force intérieure et récupérez comme une guerrière.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#coaching" className="text-gray-400 hover:text-warrior-red transition-colors text-sm">
                  Coaching Sportif
                </Link>
              </li>
              <li>
                <Link href="#massage" className="text-gray-400 hover:text-warrior-red transition-colors text-sm">
                  Massages
                </Link>
              </li>
              <li>
                <Link href="#tarifs" className="text-gray-400 hover:text-warrior-red transition-colors text-sm">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-sm">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:contact@sabrina-coach.fr" className="flex items-center gap-3 text-gray-400 hover:text-warrior-red transition-colors group">
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-warrior-red/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">contact@sabrina-coach.fr</span>
              </a>
              {/* Phone is optional as per instructions, but good to have ready structure */}
              {/* <div className="flex items-center gap-3 text-gray-400">
                <div className="p-2 bg-white/5 rounded-full">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">+33 6 00 00 00 00</span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Sabrina Coaching. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-warrior-red transition-colors">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
