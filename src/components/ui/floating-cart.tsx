'use client';

import { useCart } from '@/context/cart-context';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingCart() {
  const { items, total } = useCart();

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-[90px] md:bottom-8 left-4 right-4 z-[60] md:left-auto md:right-8 md:w-auto"
        >
          <Link 
            href="#contact"
            className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-2xl shadow-slate-900/30 hover:scale-105 transition-transform group cursor-pointer"
          >
            <div className="flex items-center gap-4 pr-6">
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-300">Ma Sélection</span>
                <span className="text-lg font-black leading-none">{total} €</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-white/20 transition-colors">
              Finaliser <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
