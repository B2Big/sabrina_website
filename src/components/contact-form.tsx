'use client';

import { useActionState, useEffect, useState, Suspense } from 'react';
import { createReservationSurPlace } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Dumbbell, Sparkles, HelpCircle, ShoppingBag, X, Wallet, CreditCard, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cart-context';

const initialState = {
  success: false,
  message: '',
  errors: undefined,
};

const SUBJECTS = [
  { id: 'coaching', label: 'Coaching Sportif', icon: Dumbbell, color: 'text-training', bg: 'bg-training/10 border-training/20' },
  { id: 'massage', label: 'Massage & Soins', icon: Sparkles, color: 'text-care', bg: 'bg-care/10 border-care/20' },
  { id: 'autre', label: 'Autre demande', icon: HelpCircle, color: 'text-slate-500', bg: 'bg-slate-100 border-slate-200' },
];

function ContactFormContent() {
  const [state, formAction, isPending] = useActionState(createReservationSurPlace, initialState);
  const [selectedSubject, setSelectedSubject] = useState<string>('coaching');
  const [messageText, setMessageText] = useState('');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [cguAccepted, setCguAccepted] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);

  const { items, total, removeFromCart, clearCart } = useCart();
  const searchParams = useSearchParams();

  // Auto-fill from Cart OR URL
  useEffect(() => {
    // Priority 1: Cart Items
    if (items.length > 0) {
        // Classify subject based on dominance
        const hasMassage = items.some(i => i.category === 'Massages' || i.category === 'Cures');
        const hasCoaching = items.some(i => i.category === 'Coaching');
        
        if (hasMassage && !hasCoaching) setSelectedSubject('massage');
        else if (!hasMassage && hasCoaching) setSelectedSubject('coaching');
        else setSelectedSubject('autre'); // Mixed

        // Generate Message
        const summary = items.map(i => `- ${i.quantity}x ${i.title} : ${i.price}`).join('\n');
        setMessageText(`Bonjour Sabrina,\n\nJe souhaite réserver les séances suivantes :\n${summary}\n\nTotal estimé : ${total} €\n\nMes disponibilités sont...`);
        return;
    }

    // Priority 2: URL Param (Legacy single item link support)
    const serviceName = searchParams.get('service');
    if (serviceName) {
      const lowerName = serviceName.toLowerCase();
      if (lowerName.includes('massage') || lowerName.includes('soin') || lowerName.includes('cure') || lowerName.includes('jambes')) {
        setSelectedSubject('massage');
      } else {
        setSelectedSubject('coaching');
      }
      setMessageText(`Bonjour Sabrina,\n\nJe souhaiterais prendre RDV pour la prestation : "${serviceName}".\nMes disponibilités sont...`);
    }
  }, [items, total, searchParams]);

  // Trigger Confetti on Success & Clear Cart
  useEffect(() => {
    if (state.success) {
      // Vider le panier
      clearCart();

      // Confettis
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
            Nouveau message
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

          {/* CART SUMMARY (If items exist) */}
          {items.length > 0 && (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4 text-slate-900 font-black uppercase tracking-wider text-sm">
                    <ShoppingBag className="w-5 h-5" />
                    Ma Sélection ({items.length})
                </div>
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl shadow-sm gap-2 sm:gap-3">
                            {/* Ligne 1: Quantité + Titre (toute la largeur sur mobile) */}
                            <div className="flex items-center gap-3">
                                <span className="bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                    {item.quantity}
                                </span>
                                <span className="font-bold text-slate-700 text-sm">{item.title}</span>
                            </div>
                            {/* Ligne 2: Prix + Bouton (aligné à droite sur desktop, même ligne sur mobile) */}
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
                        <div className="flex items-center justify-center gap-4 text-slate-600">
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
                        </div>
                        <p className="text-[10px] text-slate-400 text-center italic">Sur place ou en ligne</p>
                    </div>
                </div>
            </div>
          )}

          {/* Subject Selection (Hidden if cart active? No, let user adjust if needed, or maybe just default to inferred one) */}
          {items.length === 0 && (
            <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">
                Je suis intéressé(e) par...
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SUBJECTS.map((subject) => (
                    <button
                    key={subject.id}
                    type="button"
                    onClick={() => setSelectedSubject(subject.id)}
                    className={cn(
                        "relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer outline-none",
                        selectedSubject === subject.id 
                        ? `${subject.bg} ring-1 ring-offset-2 ring-slate-200` 
                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400 grayscale hover:grayscale-0"
                    )}
                    >
                    <subject.icon className={cn("w-6 h-6 mb-1", selectedSubject === subject.id ? subject.color : "text-slate-400")} />
                    <span className={cn("text-xs font-bold", selectedSubject === subject.id ? "text-slate-900" : "text-slate-400")}>
                        {subject.label}
                    </span>
                    </button>
                ))}
                </div>
            </div>
          )}

          <input type="hidden" name="subject" value={selectedSubject} />

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
              <label htmlFor="message" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">
                Votre Message {items.length > 0 && <span className="text-training text-xs normal-case font-medium">(Pré-rempli avec votre sélection)</span>}
              </label>
              <textarea
                id="message"
                name="message"
                rows={8}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:outline-none focus:border-slate-300 focus:bg-white transition-all resize-none shadow-sm"
                placeholder="Bonjour, je souhaiterais avoir des informations sur..."
              />
              {state.errors?.message?.[0] && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{state.errors.message[0]}</p>
              )}
            </div>
          </div>

          {/* Global Payment Info - Enhanced */}
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
                disabled={isPending || isCheckoutLoading || !cguAccepted}
                className="w-full h-16 text-sm sm:text-base md:text-lg rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 font-black tracking-tight transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none px-4"
            >
                {isPending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Envoi...
                </>
                ) : (
                <span className="truncate">Réserver et régler sur place</span>
                )}
            </Button>

            {items.length > 0 && (
                <div className="relative flex items-center justify-center my-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                    <span className="relative bg-white px-2 text-[10px] text-slate-400 uppercase font-bold">OU</span>
                </div>
            )}

            {items.length > 0 && (
                <Button
                    type="button"
                    disabled={isPending || isCheckoutLoading}
                    onClick={async () => {
                        try {
                            setIsCheckoutLoading(true);
                            setCheckoutError(null);

                            // Valider les champs obligatoires avant checkout
                            const nameInput = document.getElementById('name') as HTMLInputElement;
                            const emailInput = document.getElementById('email') as HTMLInputElement;
                            const phoneInput = document.getElementById('phone') as HTMLInputElement;

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

                            // 🔒 Envoyer id, quantity + infos client
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
                                    message: messageText,
                                    newsletter: newsletterOptIn,
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
                    className="w-full h-16 text-base md:text-lg rounded-2xl bg-[#3B82F6] text-white hover:bg-blue-600 shadow-xl shadow-blue-500/20 font-black tracking-tight transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 px-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isCheckoutLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                            <span className="truncate">Chargement...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5 shrink-0" />
                            <span className="truncate">Réserver & Payer en ligne</span>
                        </>
                    )}
                </Button>
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