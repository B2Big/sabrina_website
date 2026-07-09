'use client';

import { useActionState, useEffect, useState, Suspense } from 'react';
import { createReservationSurPlace } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Loader2, Send, ShoppingBag, X, CalendarCheck, CreditCard, Globe, Wallet, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';

const initialState = {
  success: false,
  message: '',
  errors: undefined,
};

function ContactFormContent() {
  const [state, formAction, isPending] = useActionState(createReservationSurPlace, initialState);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [cguAccepted, setCguAccepted] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);

  const { items, total, removeFromCart, clearCart } = useCart();

  // Trigger Confetti on Success & Clear Cart
  useEffect(() => {
    if (state.success) {
      clearCart();

      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        const colors = ['#4F46E5', '#06B6D4', '#E11D48', '#F59E0B'];

        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors });
      }, 250);
    }
  }, [state.success, clearCart]);

  return (
    <form action={formAction} className="space-y-8">
      {state.success ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <div>
             <h3 className="text-3xl font-black text-slate-900 mb-2">Réservation Confirmée !</h3>
             <p className="text-slate-500 max-w-xs mx-auto font-medium">
               Un email de confirmation vous a été envoyé.<br/>Je vous réponds sous 24h.
             </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            type="button"
            className="rounded-full px-8"
          >
            Nouvelle réservation
          </Button>
        </div>
      ) : (
        <>
          {state.message && !state.success && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
              {state.message}
            </div>
          )}

          {/* CART SUMMARY */}
          {items.length > 0 ? (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4 text-slate-900 font-black uppercase tracking-wider text-sm">
                    <ShoppingBag className="w-5 h-5" />
                    Ma Sélection ({items.length})
                </div>
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl shadow-sm gap-2 sm:gap-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                    {item.quantity}
                                </span>
                                <span className="font-bold text-slate-700 text-sm">{item.title}</span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 pl-9 sm:pl-0">
                                <span className="font-black text-slate-900">{item.price}</span>
                                <button type="button" onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-slate-500">Total estimé</span>
                        <span className="text-xl font-black text-slate-900">{total} €</span>
                    </div>
                    
                    {/* Payment Info */}
                    <div className="bg-white/50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Options de règlement</p>
                        <div className="flex items-center justify-center gap-3 text-slate-600 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold">Espèces</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold">CB</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold">PayPal</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <div className="flex items-center gap-1.5 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                                <span className="text-[10px] font-bold text-pink-600">✓ Klarna 3x</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center italic">Sur place ou en ligne</p>
                    </div>
                </div>
            </div>
          ) : (
            <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl text-center">
              <p className="text-amber-900 font-bold text-sm">
                Ajoutez un ou plusieurs services à votre panier pour réserver.
              </p>
            </div>
          )}

          <input type="hidden" name="subject" value="reservation" />

          {/* Panier en JSON pour l'email */}
          <input
            type="hidden"
            name="cart"
            value={JSON.stringify({ items, total })}
          />

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">
                Votre Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 text-lg font-bold placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
                placeholder="Ex: Sophie Martin"
              />
              {state.errors?.name?.[0] && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{state.errors.name[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 text-lg font-bold placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
                  placeholder="hello@gmail.com"
                />
                {state.errors?.email?.[0] && (
                  <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{state.errors.email[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">
                  Téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 text-lg font-bold placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
                  placeholder="06 12 34 56 78"
                />
                {state.errors?.phone?.[0] && (
                  <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{state.errors.phone[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="serviceDate" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date souhaitée
              </label>
              <input
                id="serviceDate"
                name="serviceDate"
                type="date"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 text-lg font-bold focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
              />
              {state.errors?.serviceDate?.[0] && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{state.errors.serviceDate[0]}</p>
              )}
            </div>
          </div>

          {/* Global Payment Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Paiements acceptés</span>
            <div className="flex flex-wrap justify-center items-center gap-2">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm whitespace-nowrap">
                  <Wallet className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">Espèces</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm whitespace-nowrap">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">CB</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-lg shadow-sm whitespace-nowrap">
                  <Globe className="w-4 h-4 text-[#003087]" />
                  <span className="text-xs font-bold text-slate-700">PayPal</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-pink-100 border-2 border-pink-300 rounded-lg shadow-sm whitespace-nowrap">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#0A0B09"/>
                    <path d="M12 6c-2.5 0-4 1.5-4 3.5 0 1.5.8 2.3 2 3l-1.5 4h3l.8-2.5h1.4l-.8 2.5h3l1.5-4.5c.5-1.5-.5-3-2.5-3H12z" fill="#FFB3C7"/>
                  </svg>
                  <span className="text-xs font-bold text-pink-700">Klarna 3x sans frais</span>
               </div>
            </div>
          </div>

          {/* Erreur checkout */}
          {checkoutError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
              {checkoutError}
            </div>
          )}

          {/* CGU Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="cgu"
              name="cgu"
              checked={cguAccepted}
              onChange={(e) => setCguAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
              required
            />
            <label htmlFor="cgu" className="text-sm text-slate-500 cursor-pointer">
              J&apos;accepte les{' '}
              <Link href="/cgu" target="_blank" className="text-slate-900 font-bold underline underline-offset-2 hover:text-blue-600 transition-colors">
                Conditions Générales d&apos;Utilisation
              </Link>
              {' '}*
            </label>
          </div>

          {/* Newsletter Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="newsletter"
              name="newsletter"
              checked={newsletterOptIn}
              onChange={(e) => setNewsletterOptIn(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
            />
            <label htmlFor="newsletter" className="text-sm text-slate-500 cursor-pointer">
              Je souhaite recevoir les offres promotionnelles et actualités de Sab-Fit par email
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
                type="submit"
                disabled={isPending || isCheckoutLoading || !cguAccepted || items.length === 0}
                className="w-full h-auto min-h-[4rem] py-3 text-sm sm:text-base md:text-lg rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 font-black tracking-tight transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none px-4 flex items-center justify-center gap-2"
            >
                {isPending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                    <span className="whitespace-normal leading-tight">Envoi...</span>
                </>
                ) : (
                <>
                    <CalendarCheck className="w-5 h-5 shrink-0" />
                    <span className="whitespace-normal leading-tight">Réserver sans payer</span>
                </>
                )}
            </Button>

            {items.length > 0 && (
                <div className="relative flex items-center justify-center my-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                    <span className="relative bg-white px-2 text-[10px] text-slate-400 uppercase font-bold">OU payer en ligne</span>
                </div>
            )}

            {items.length > 0 && (
                <>
                <Button
                    type="button"
                    disabled={isPending || isCheckoutLoading || !cguAccepted}
                    onClick={async () => {
                        try {
                            setIsCheckoutLoading(true);
                            setCheckoutError(null);

                            const nameInput = document.getElementById('name') as HTMLInputElement;
                            const emailInput = document.getElementById('email') as HTMLInputElement;
                            const phoneInput = document.getElementById('phone') as HTMLInputElement;
                            const dateInput = document.getElementById('serviceDate') as HTMLInputElement;

                            if (!cguAccepted) {
                                setCheckoutError('Veuillez accepter les Conditions Générales d\'Utilisation pour continuer.');
                                setIsCheckoutLoading(false);
                                return;
                            }

                            if (!nameInput?.value?.trim() || !emailInput?.value?.trim() || !phoneInput?.value?.trim()) {
                                setCheckoutError('Veuillez remplir tous les champs obligatoires (nom, email, téléphone) avant de procéder au paiement.');
                                setIsCheckoutLoading(false);
                                if (!nameInput?.value?.trim()) nameInput?.focus();
                                else if (!emailInput?.value?.trim()) emailInput?.focus();
                                else phoneInput?.focus();
                                return;
                            }

                            if (!emailInput.checkValidity()) {
                                setCheckoutError('Veuillez entrer une adresse email valide.');
                                emailInput?.focus();
                                setIsCheckoutLoading(false);
                                return;
                            }

                            const checkoutItems = items.map(item => ({
                                id: item.id,
                                quantity: item.quantity
                            }));

                            const res = await fetch('/api/checkout', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    items: checkoutItems,
                                    customerName: nameInput.value.trim(),
                                    customerEmail: emailInput.value.trim(),
                                    customerPhone: phoneInput.value.trim(),
                                    message: 'Réservation via formulaire',
                                    newsletter: newsletterOptIn,
                                    preferredMethod: 'all',
                                    serviceDate: dateInput?.value || undefined,
                                }),
                            });

                            const data = await res.json();

                            if (!res.ok) {
                                throw new Error(data.error || 'Erreur lors du paiement');
                            }

                            if (data.url) {
                                window.location.href = data.url;
                            } else {
                                throw new Error('URL de paiement manquante');
                            }
                        } catch (error) {
                            console.error('❌ Erreur checkout:', error);
                            setCheckoutError(error instanceof Error ? error.message : 'Erreur lors du paiement. Veuillez réessayer.');
                        } finally {
                            setIsCheckoutLoading(false);
                        }
                    }}
                    className="w-full h-auto min-h-[4rem] py-3 text-sm sm:text-base md:text-lg rounded-2xl bg-[#3B82F6] text-white hover:bg-blue-600 shadow-xl shadow-blue-500/20 font-black tracking-tight transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 px-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isCheckoutLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                            <span className="whitespace-normal leading-tight">Chargement...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5 shrink-0" />
                            <span className="whitespace-normal leading-tight">Payer par CB ou PayPal</span>
                        </>
                    )}
                </Button>

                {/* Bouton Klarna 3x */}
                {Number(total) >= 35 && (
                    <Button
                        type="button"
                        disabled={isPending || isCheckoutLoading || !cguAccepted}
                        onClick={async () => {
                            try {
                                setIsCheckoutLoading(true);
                                setCheckoutError(null);

                                const nameInput = document.getElementById('name') as HTMLInputElement;
                                const emailInput = document.getElementById('email') as HTMLInputElement;
                                const phoneInput = document.getElementById('phone') as HTMLInputElement;
                                const dateInput = document.getElementById('serviceDate') as HTMLInputElement;

                                if (!cguAccepted) {
                                    setCheckoutError('Veuillez accepter les Conditions Générales d\'Utilisation pour continuer.');
                                    setIsCheckoutLoading(false);
                                    return;
                                }

                                if (!nameInput?.value?.trim() || !emailInput?.value?.trim() || !phoneInput?.value?.trim()) {
                                    setCheckoutError('Veuillez remplir tous les champs obligatoires (nom, email, téléphone) avant de procéder au paiement.');
                                    setIsCheckoutLoading(false);
                                    if (!nameInput?.value?.trim()) nameInput?.focus();
                                    else if (!emailInput?.value?.trim()) emailInput?.focus();
                                    else phoneInput?.focus();
                                    return;
                                }

                                if (!emailInput.checkValidity()) {
                                    setCheckoutError('Veuillez entrer une adresse email valide.');
                                    emailInput?.focus();
                                    setIsCheckoutLoading(false);
                                    return;
                                }

                                const checkoutItems = items.map(item => ({
                                    id: item.id,
                                    quantity: item.quantity
                                }));

                                const res = await fetch('/api/checkout', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        items: checkoutItems,
                                        customerName: nameInput.value.trim(),
                                        customerEmail: emailInput.value.trim(),
                                        customerPhone: phoneInput.value.trim(),
                                        message: 'Réservation via formulaire',
                                        newsletter: newsletterOptIn,
                                        preferredMethod: 'klarna',
                                        serviceDate: dateInput?.value || undefined,
                                    }),
                                });

                                const data = await res.json();

                                if (!res.ok) {
                                    throw new Error(data.error || 'Erreur lors du paiement');
                                }

                                if (data.url) {
                                    window.location.href = data.url;
                                } else {
                                    throw new Error('URL de paiement manquante');
                                }
                            } catch (error) {
                                console.error('❌ Erreur checkout Klarna:', error);
                                setCheckoutError(error instanceof Error ? error.message : 'Erreur lors du paiement. Veuillez réessayer.');
                            } finally {
                                setIsCheckoutLoading(false);
                            }
                        }}
                        className="w-full h-auto min-h-[4rem] py-3 text-sm sm:text-base md:text-lg rounded-2xl bg-[#FFB3C7] text-[#0A0B09] hover:bg-[#FF9BB5] shadow-xl shadow-pink-500/20 font-black tracking-tight transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 px-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border-2 border-pink-300"
                    >
                        {isCheckoutLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                                <span className="whitespace-normal leading-tight">Chargement...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                                    <rect width="24" height="24" rx="4" fill="#0A0B09"/>
                                    <path d="M12 6c-2.5 0-4 1.5-4 3.5 0 1.5.8 2.3 2 3l-1.5 4h3l.8-2.5h1.4l-.8 2.5h3l1.5-4.5c.5-1.5-.5-3-2.5-3H12z" fill="#FFB3C7"/>
                                </svg>
                                <span className="whitespace-normal leading-tight">Payer en 3x sans frais</span>
                            </>
                        )}
                    </Button>
                )}
                
                {/* Info Klarna si montant insuffisant */}
                {Number(total) < 35 && Number(total) > 0 && (
                    <div className="text-center py-2 px-4 bg-pink-50 border border-pink-200 rounded-xl">
                        <p className="text-xs text-pink-700">
                            💡 Ajoutez des services pour atteindre <strong>35€</strong> et accéder au paiement en 3x
                        </p>
                    </div>
                )}
                </>
            )}
          </div>
        </>
      )}
    </form>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Chargement du formulaire...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
