'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { rateLimit, RateLimitConfigs, getClientIp } from '@/lib/rate-limit'
import { logAdminAction } from '@/lib/audit'
import { hasAdminAccess } from '@/lib/auth/roles'

type LoginResult = {
  success: boolean
  error?: string
  rateLimitExceeded?: boolean
  retryAfter?: number
  isAdmin?: boolean
  redirectTo?: string
}

export async function loginAction(
  email: string, 
  password: string,
  rememberMe: boolean = false
): Promise<LoginResult> {
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
              cookieStore.set(name, value, {
                ...options,
                // 🔒 Remember me : étendre la durée de session à 30 jours
                maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
              })
            )
          } catch {
            // Ignoré si appelé depuis un Server Component
          }
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
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

  const user = data.user
  const isAdmin = hasAdminAccess(user)

  // 📝 LOG DE CONNEXION (audit trail)
  if (isAdmin) {
    await logAdminAction(
      user.id,
      user.email!,
      'LOGIN',
      'Session',
      undefined,
      {
        ip: clientIp,
        userAgent: headersList.get('user-agent'),
        rememberMe,
        timestamp: new Date().toISOString()
      }
    )
  }

  console.log(`✅ Connexion réussie pour ${email} (admin: ${isAdmin})`)

  return {
    success: true,
    isAdmin,
    redirectTo: isAdmin ? '/admin' : '/'
  }
}

/**
 * Déconnexion avec log
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().then(c => c.getAll())
        },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  if (user && hasAdminAccess(user)) {
    const headersList = await headers()
    const request = new Request('http://localhost', { headers: headersList })
    const clientIp = getClientIp(request)
    
    await logAdminAction(
      user.id,
      user.email!,
      'LOGOUT',
      'Session',
      undefined,
      { ip: clientIp, timestamp: new Date().toISOString() }
    )
  }

  await supabase.auth.signOut()
  
  return { success: true }
}

/**
 * Récupère l'URL de redirection après login
 * (pour rediriger vers la page demandée initialement)
 */
export async function getRedirectUrl(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('redirect_after_login')?.value || null
}

/**
 * Définit l'URL de redirection après login
 */
export async function setRedirectUrl(url: string) {
  const cookieStore = await cookies()
  cookieStore.set('redirect_after_login', url, {
    maxAge: 60 * 5, // 5 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
}

/**
 * Efface l'URL de redirection
 */
export async function clearRedirectUrl() {
  const cookieStore = await cookies()
  cookieStore.delete('redirect_after_login')
}
