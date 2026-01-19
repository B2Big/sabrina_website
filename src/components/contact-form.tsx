'use client';

import { useActionState } from 'react'; // React 19 / Next 15
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
    <form action={formAction} className="space-y-6">
      {state.success && (
        <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
          {state.message}
        </div>
      )}

      {state.message && !state.success && (
        <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">
          Nom complet
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full bg-warrior-black border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-warrior-red focus:ring-1 focus:ring-warrior-red transition-all"
          placeholder="Votre nom"
        />
        {state.errors?.name && (
          <p className="text-red-500 text-xs">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-warrior-black border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-warrior-red focus:ring-1 focus:ring-warrior-red transition-all"
            placeholder="votre@email.com"
          />
          {state.errors?.email && (
            <p className="text-red-500 text-xs">{state.errors.email[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-300">
            Téléphone (Optionnel)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full bg-warrior-black border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-warrior-red focus:ring-1 focus:ring-warrior-red transition-all"
            placeholder="06..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-300">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full bg-warrior-black border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-warrior-red focus:ring-1 focus:ring-warrior-red transition-all resize-none"
          placeholder="Je souhaite avoir des informations sur..."
        />
        {state.errors?.message && (
          <p className="text-red-500 text-xs">{state.errors.message[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        variant="warrior"
        className="w-full h-12 text-base"
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
