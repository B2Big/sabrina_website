'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Shield, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { loginAction, clearRedirectUrl } from './actions'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryAfter, setRetryAfter] = useState<number | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Gérer les messages de la query string
  useEffect(() => {
    const reason = searchParams.get('reason')
    if (reason === 'timeout') {
      setError('Session expirée pour inactivité. Veuillez vous reconnecter.')
    } else if (reason === 'expired') {
      setError('Votre session a expiré. Veuillez vous reconnecter.')
    } else if (reason === 'logout') {
      setError(null) // Déconnexion réussie, pas d'erreur
    }
  }, [searchParams])

  // Compte à rebours pour rate limit
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter(prev => {
          if (prev && prev > 1) return prev - 1
          clearInterval(timer)
          return null
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [retryAfter])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRetryAfter(null)

    try {
      const result = await loginAction(email, password, rememberMe)

      if (!result.success) {
        setError(result.error || 'Une erreur est survenue')
        if (result.retryAfter) {
          setRetryAfter(result.retryAfter)
        }
      } else {
        // Effacer le cookie de redirection
        await clearRedirectUrl()
        
        // Redirection
        router.refresh()
        router.push(result.redirectTo || '/admin')
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            SAB<span className="text-care">-</span>FIT
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Espace Administration</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="mb-6">
            <Link href="/" className="text-slate-400 hover:text-slate-600 flex items-center gap-2 mb-6 text-sm font-medium transition-colors">
              <ArrowLeft size={16} /> Retour au site
            </Link>
            <h2 className="text-xl font-black text-slate-900">Connexion sécurisée</h2>
            <p className="text-slate-500 mt-1 text-sm">Accédez à votre espace d&apos;administration</p>
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
                disabled={loading || !!retryAfter}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all pr-12"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading || !!retryAfter}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                disabled={loading || !!retryAfter}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
                Rester connecté pendant 30 jours
              </label>
            </div>

            {error && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                error.includes('expirée') 
                  ? 'bg-amber-50 border border-amber-100 text-amber-700'
                  : 'bg-red-50 border border-red-100 text-red-600'
              }`}>
                {error}
                {retryAfter && (
                  <p className="mt-1 text-xs">
                    Réessayez dans {Math.floor(retryAfter / 60)}:{String(retryAfter % 60).padStart(2, '0')}
                  </p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 font-bold text-base shadow-lg shadow-slate-900/10 transition-all"
              disabled={loading || !!retryAfter}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Connexion...
                </>
              ) : retryAfter ? (
                'Trop de tentatives'
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Accès réservé aux administrateurs.
            </p>
            <p className="text-xs text-slate-400">
              🔒 Toute tentative d&apos;intrusion est enregistrée et surveillée.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-8">
          © {new Date().getFullYear()} Sab-Fit Coaching. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-slate-400" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
