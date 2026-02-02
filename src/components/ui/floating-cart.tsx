'use client';

import { useCart } from '@/context/cart-context';
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function FloatingCart() {
  const { items, total } = useCart();
  const [isLoading] = useState(false);

  const handleCheckout = () => {
    // Scroll vers le formulaire de contact au lieu d'aller directement à Stripe
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Petit flash pour attirer l'attention sur le formulaire
      contactSection.classList.add('ring-4', 'ring-blue-500/30', 'ring-offset-4');
      setTimeout(() => {
        contactSection.classList.remove('ring-4', 'ring-blue-500/30', 'ring-offset-4');
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-[90px] md:bottom-8 left-4 right-4 z-[60] md:left-auto md:right-8 md:w-auto"
        >
          <button 
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full md:w-auto flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-2xl shadow-slate-900/30 hover:scale-105 transition-transform group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4 pr-6">
              <div className="relative">
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                ) : (
                    <ShoppingBag className="w-6 h-6" />
                )}
                {!isLoading && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                    {items.reduce((acc, i) => acc + i.quantity, 0)}
                    </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-slate-300">Ma Sélection</span>
                <span className="text-lg font-black leading-none">{total} €</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-white/20 transition-colors">
              {isLoading ? 'Chargement...' : 'Payer'} {!isLoading && <ArrowRight className="w-4 h-4" />}
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
