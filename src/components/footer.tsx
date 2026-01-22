import Link from 'next/link';
import { Mail, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              SABRINA<span className="text-care">.</span>
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Coach sportive & Praticienne bien-être.
              Allier le corps et l&apos;esprit pour une santé durable.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#coaching" className="text-slate-500 hover:text-training transition-colors text-sm">
                  Coaching Sportif
                </Link>
              </li>
              <li>
                <Link href="#massage" className="text-slate-500 hover:text-care transition-colors text-sm">
                  Massages
                </Link>
              </li>
              <li>
                <Link href="#tarifs" className="text-slate-500 hover:text-training transition-colors text-sm">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:sabcompan8306@gmail.com" className="flex items-center gap-3 text-slate-500 hover:text-training transition-colors group">
                <div className="p-2 bg-white border border-slate-200 rounded-full group-hover:border-training group-hover:text-training transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">sabcompan8306@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} Sabrina Coaching. Tous droits réservés.
            </p>
            <Link href="/admin" className="text-slate-300 hover:text-slate-500 transition-colors text-[10px] font-medium uppercase tracking-widest">
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/sab.fit_coaching83" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-care transition-colors">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}