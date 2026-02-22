import Link from 'next/link'
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Accès interdit | Sab-Fit',
  description: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.',
}

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icône */}
        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>
        
        {/* Titre */}
        <h1 className="text-6xl font-black text-slate-900 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Accès interdit
        </h2>
        
        {/* Message */}
        <p className="text-slate-600 mb-8 leading-relaxed">
          Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page. 
          Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, contactez l&apos;administrateur.
        </p>
        
        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-training text-white font-bold rounded-xl hover:bg-training/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>
        
        {/* Footer */}
        <p className="mt-8 text-sm text-slate-400">
          Sab-Fit Coaching & Massage © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
