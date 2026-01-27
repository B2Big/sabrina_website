import { User } from '@supabase/supabase-js'

export enum Role {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER'
}

export type UserRole = Role.ADMIN | Role.DEVELOPER

/**
 * Récupère le rôle d'un utilisateur depuis ses métadonnées Supabase
 */
export function getUserRole(user: User | null): UserRole | null {
  if (!user) return null

  // Le rôle est stocké dans app_metadata.role par l'Admin API
  const role = user.app_metadata?.role as UserRole | undefined

  return role || null
}

/**
 * Vérifie si un utilisateur a un rôle administrateur (ADMIN ou DEVELOPER)
 *
 * Fallback temporaire : Si pas de rôle dans app_metadata, vérifier l'email
 * TODO: Retirer le fallback email une fois tous les utilisateurs configurés
 */
export function hasAdminAccess(user: User | null): boolean {
  const role = getUserRole(user)

  // Si le rôle est défini, l'utiliser
  if (role === Role.ADMIN || role === Role.DEVELOPER) {
    return true
  }

  // Fallback temporaire : vérifier l'email
  // IMPORTANT : Retirer cette ligne après avoir exécuté setup-admin-users.ts
  return isAuthorizedEmail(user?.email)
}

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  const role = getUserRole(user)
  return role === requiredRole
}

/**
 * Liste des emails autorisés (fallback si les métadonnées ne sont pas encore configurées)
 * TODO: À supprimer une fois que tous les utilisateurs ont un rôle dans leurs métadonnées
 */
export const AUTHORIZED_EMAILS = [
  'sabcompan8306@gmail.com',  // Admin - Sabrina
] as const

/**
 * Vérification temporaire par email (à utiliser en transition)
 */
export function isAuthorizedEmail(email: string | undefined): boolean {
  if (!email) return false
  return AUTHORIZED_EMAILS.includes(email as any)
}
