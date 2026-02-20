'use server'

import { createClient } from '@/lib/supabase/server'
import { hasAdminAccess, getUserRole } from './roles'
import { rateLimit, RateLimitConfigs } from '@/lib/rate-limit'

export type SessionResult = {
  user: {
    id: string
    email: string
    role: string | null
  } | null
  error: string | null
}

/**
 * Récupère l'utilisateur courant avec son rôle
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email!,
    role: getUserRole(user),
    raw: user,
  }
}

/**
 * Vérifie si l'utilisateur est admin
 * À utiliser dans les Server Actions
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Non authentifié - Connexion requise')
  }
  
  return user
}

/**
 * Vérifie si l'utilisateur est admin avec rate limiting
 * À utiliser dans les Server Actions protégées
 */
export async function requireAdmin() {
  const user = await requireAuth()
  
  if (!hasAdminAccess(user.raw)) {
    console.warn(`Tentative d'action admin non autorisée par ${user.email} (rôle: ${user.role})`)
    throw new Error('Non autorisé - Rôle admin requis')
  }
  
  // Rate limiting par utilisateur
  const rateLimitKey = `admin-action:${user.email}`
  const rateLimitResult = rateLimit(rateLimitKey, RateLimitConfigs.ADMIN_ACTIONS)
  
  if (!rateLimitResult.success) {
    console.warn(`🚫 Rate limit dépassé pour actions admin par ${user.email}`)
    throw new Error('Trop de modifications rapides. Veuillez patienter quelques instants.')
  }
  
  return user
}

/**
 * Déconnexion
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
