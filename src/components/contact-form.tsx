'use client';

import { useActionState, useEffect, useState } from 'react';
import { sendContactEmail } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Dumbbell, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

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

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, initialState);
  const [selectedSubject, setSelectedSubject] = useState<string>('coaching');

  // Trigger Confetti on Success
  useEffect(() => {
    if (state.success) {
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
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-8">
      {state.success ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <div>
             <h3 className="text-3xl font-black text-slate-900 mb-2">Message Envoyé !</h3>
             <p className="text-slate-500 max-w-xs mx-auto font-medium">
               Je vous réponds très vite (sous 24h). <br/>Merci de votre confiance.
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

          {/* Subject Selection */}
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
            <input type="hidden" name="subject" value={selectedSubject} />
          </div>

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
              {state.errors?.name && (
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
                {state.errors?.email && (
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
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">
                Votre Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:outline-none focus:border-slate-300 focus:bg-white transition-all resize-none shadow-sm"
                placeholder="Bonjour, je souhaiterais avoir des informations sur..."
              />
              {state.errors?.message && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{state.errors.message[0]}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-16 text-lg rounded-2xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10 font-black tracking-wide transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer ma demande"
            )}
          </Button>
        </>
      )}
    </form>
  );
}
