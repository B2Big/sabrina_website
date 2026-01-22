'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Wallet, CreditCard, Globe } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Coaching', href: '#coaching' },
  { name: 'Massage', href: '#massage' },
  { name: 'Tarifs', href: '#tarifs' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      {/* Top Bar - Payment Info */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white py-2 flex justify-center items-center gap-4 animate-in slide-in-from-top-2">
         <span className="font-bold text-xs uppercase tracking-widest opacity-90 hidden sm:inline">Règlement sur place ou en ligne</span>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5"><Wallet className="w-4 h-4 text-emerald-400" /> <span className="font-black text-[10px] uppercase tracking-wide">Espèces</span></div>
            <div className="w-1 h-1 bg-slate-600 rounded-full" />
            <div className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-blue-400" /> <span className="font-black text-[10px] uppercase tracking-wide">CB</span></div>
            <div className="w-1 h-1 bg-slate-600 rounded-full" />
            <div className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#003087]" /> <span className="font-black text-[10px] uppercase tracking-wide">PayPal</span></div>
         </div>
      </div>

      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="hidden md:flex fixed top-10 left-0 right-0 z-40 justify-center px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-200/50 rounded-full px-2 py-2 flex items-center gap-2 md:gap-4 max-w-2xl w-full justify-between">
          
          {/* Logo Pill */}
          <Link href="/" className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-black tracking-tight hover:bg-slate-800 transition-colors flex items-center">
            S<span className="text-training">.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center bg-slate-100/50 rounded-full px-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Button variant="training" size="sm" className="rounded-full px-6 h-10 shadow-lg shadow-training/20" asChild>
              <Link href="#contact" className="flex items-center gap-2">
                Prendre RDV <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>

            <button
              className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-900"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-24 z-40 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-[2rem] p-6 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="p-4 text-xl font-bold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex justify-between items-center"
                >
                  {link.name}
                  <ArrowUpRight className="w-5 h-5 text-slate-400" />
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              <Button className="w-full h-14 text-lg rounded-xl" onClick={() => setIsOpen(false)} asChild>
                <Link href="#contact">Prendre RDV maintenant</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
