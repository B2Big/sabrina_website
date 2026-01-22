'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/cart-context';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // 1. Clear the cart since payment is done
    clearCart();

    // 2. Celebration!
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center border border-slate-100">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Merci de votre confiance !
        </h1>
        
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          Votre paiement a été validé avec succès. Sabrina a bien reçu votre demande et vous recontactera sous 24h pour fixer vos rendez-vous.
        </p>

        <div className="space-y-4 mb-10">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-training">
                    <Calendar size={20} />
                </div>
                <div>
                    <p className="text-xs font-black uppercase text-slate-400">Prochaine étape</p>
                    <p className="text-sm font-bold text-slate-700">Appel de confirmation (24h)</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-care">
                    <MessageSquare size={20} />
                </div>
                <div>
                    <p className="text-xs font-black uppercase text-slate-400">Support</p>
                    <p className="text-sm font-bold text-slate-700">sabcompan8306@gmail.com</p>
                </div>
            </div>
        </div>

        <Button className="w-full h-14 rounded-xl text-lg font-black bg-slate-900 text-white hover:bg-slate-800 transition-all" asChild>
          <Link href="/">
            Retour à l&apos;accueil <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
