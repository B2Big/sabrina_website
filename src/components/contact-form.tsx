'use client';

import { useActionState } from 'react';
import { sendContactEmail } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
  errors: undefined,
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm font-medium text-center">
          {state.message}
        </div>
      )}

      {state.message && !state.success && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-slate-700">
          Nom complet
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-training focus:ring-1 focus:ring-training transition-all shadow-sm"
          placeholder="Votre nom"
        />
        {state.errors?.name && (
          <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-training focus:ring-1 focus:ring-training transition-all shadow-sm"
            placeholder="votre@email.com"
          />
          {state.errors?.email && (
            <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
            Téléphone (Optionnel)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-training focus:ring-1 focus:ring-training transition-all shadow-sm"
            placeholder="06..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-training focus:ring-1 focus:ring-training transition-all shadow-sm resize-none"
          placeholder="Bonjour, je souhaiterais des infos sur..."
        />
        {state.errors?.message && (
          <p className="text-red-500 text-xs mt-1">{state.errors.message[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 text-base rounded-lg bg-slate-900 hover:bg-slate-800"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          "Envoyer le message"
        )}
      </Button>
    </form>
  );
}