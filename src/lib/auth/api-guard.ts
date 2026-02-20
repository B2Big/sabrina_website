import { createClient } from '@/lib/supabase/server'
import { hasAdminAccess, getUserRole } from './roles'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

export type ApiUser = {
  id: string
  email: string
  role: string | null
  raw: User
}

export type AuthResult = {
  user: ApiUser | null
  error: NextResponse | null
}

/**
 * Vérifie l'authentification pour les routes API
 * Retourne l'utilisateur ou une réponse d'erreur
 */
export async function requireAuthApi(): Promise<AuthResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
  }
  
  return {
    user: {
      id: user.id,
      email: user.email!,
      role: getUserRole(user),
      raw: user,
    },
    error: null,
  }
}

/**
 * Vérifie les droits admin pour les routes API
 * Retourne l'utilisateur ou une réponse d'erreur 403
 */
export async function requireAdminApi(): Promise<AuthResult> {
  const { user, error } = await requireAuthApi()
  
  if (error) return { user: null, error }
  
  if (!hasAdminAccess(user!.raw)) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }
  }
  
  return { user, error: null }
}
