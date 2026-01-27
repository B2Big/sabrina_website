'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { rateLimit, RateLimitConfigs, getClientIp } from '@/lib/rate-limit'

type LoginResult = {
  success: boolean
  error?: string
  rateLimitExceeded?: boolean
  retryAfter?: number
}

export async function loginAction(email: string, password: string): Promise<LoginResult> {
  // 🔒 RATE LIMITING : Anti brute-force
  const headersList = await headers()
  const request = new Request('http://localhost', { headers: headersList })
  const clientIp = getClientIp(request)

  // Utiliser l'IP + un préfixe pour isoler les compteurs de login
  const rateLimitKey = `login:${clientIp}`
  const rateLimitResult = rateLimit(rateLimitKey, RateLimitConfigs.LOGIN)

  if (!rateLimitResult.success) {
    console.warn(`🚫 Rate limit dépassé pour login depuis ${clientIp}`)
    return {
      success: false,
      rateLimitExceeded: true,
      retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      error: 'Trop de tentatives de connexion. Réessayez dans quelques minutes.'
    }
  }

  // Authentification avec Supabase
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignoré si appelé depuis un Server Component
          }
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.warn(`❌ Échec de connexion pour ${email} depuis ${clientIp}`)
    return {
      success: false,
      error: error.message
    }
  }

  console.log(`✅ Connexion réussie pour ${email} depuis ${clientIp}`)
  return {
    success: true
  }
}
