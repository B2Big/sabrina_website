'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Shield } from 'lucide-react'
import Link from 'next/link'
import { loginAction } from './actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await loginAction(email, password)

      if (!result.success) {
        setError(result.error || 'Une erreur est survenue')
      } else {
        router.refresh()
        router.push('/admin')
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            SABRINA<span className="text-care">.</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Espace Administration</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="mb-6">
            <Link href="/" className="text-slate-400 hover:text-slate-600 flex items-center gap-2 mb-6 text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Retour au site
            </Link>
            <h2 className="text-xl font-black text-slate-900">Connexion sécurisée</h2>
            <p className="text-slate-500 mt-1 text-sm">Accédez à votre espace d'administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                required
                placeholder="contact@sab-fit.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 font-bold text-base shadow-lg shadow-slate-900/10 transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Accès réservé aux administrateurs. <br/>
              Toute tentative d'intrusion est enregistrée.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-8">
          © {new Date().getFullYear()} Sabrina Coaching. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
