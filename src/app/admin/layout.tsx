'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  ADMIN_INACTIVITY_TIMEOUT, 
  ADMIN_WARNING_BEFORE_TIMEOUT,
  SESSION_CHECK_INTERVAL 
} from '@/lib/constants'

const INACTIVITY_TIMEOUT = ADMIN_INACTIVITY_TIMEOUT

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClient()

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login?reason=timeout')
  }, [router, supabase])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let warningTimeoutId: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeoutId)
      clearTimeout(warningTimeoutId)
      
      // Avertissement 2 minutes avant déconnexion
      warningTimeoutId = setTimeout(() => {
        if (confirm('Votre session va expirer dans 2 minutes pour des raisons de sécurité. Voulez-vous rester connecté ?')) {
          resetTimer()
        }
      }, INACTIVITY_TIMEOUT - ADMIN_WARNING_BEFORE_TIMEOUT)
      
      // Déconnexion après inactivité
      timeoutId = setTimeout(logout, INACTIVITY_TIMEOUT)
    }

    // Événements qui réinitialisent le timer
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    // Initialiser le timer
    resetTimer()

    // Ajouter les écouteurs
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })

    // Vérifier la session toutes les 5 minutes
    const checkSessionInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login?reason=expired')
      }
    }, SESSION_CHECK_INTERVAL)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(warningTimeoutId)
      clearInterval(checkSessionInterval)
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true)
      })
    }
  }, [logout, router, supabase])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Bandeau de sécurité */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center">
        <span className="font-bold">🔒 Zone Administrateur</span>
        {' • '}
        Session sécurisée avec déconnexion automatique après 1h d&apos;inactivité
      </div>
      
      {children}
    </div>
  )
}
