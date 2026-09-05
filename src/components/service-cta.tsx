'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart, CalendarCheck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { type Service } from '@/data/content';

export function ServiceCTA({ service }: { service: Service }) {
  const { addToCart, items } = useCart();
  const isInCart = items.some((i) => i.id === service.id);

  const handleReserve = () => {
    if (!isInCart) {
      addToCart(service);
    }
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        onClick={handleReserve}
        className="w-full sm:w-auto h-auto min-h-[3.5rem] py-3 px-8 text-base md:text-lg rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 font-black tracking-tight transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
      >
        {isInCart ? (
          <>
            <CalendarCheck className="w-5 h-5 shrink-0" />
            <span>Déjà dans votre panier — Finaliser la réservation</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 shrink-0" />
            <span>Réserver cette prestation</span>
          </>
        )}
      </Button>
    </div>
  );
}
