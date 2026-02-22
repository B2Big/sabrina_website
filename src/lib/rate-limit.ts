/**
 * Rate Limiting simplifié en mémoire
 *
 * Pour la production à grande échelle, utiliser Upstash Redis ou similaire
 * Cette implémentation convient pour une petite application
 */

type RateLimitConfig = {
  interval: number // Fenêtre de temps en millisecondes
  uniqueTokenPerInterval: number // Nombre de requêtes autorisées
}

type RateLimitRecord = {
  count: number
  resetAt: number
}

// Stockage en mémoire des tentatives par IP
const rateLimitMap = new Map<string, RateLimitRecord>()

import { SESSION_CHECK_INTERVAL } from './constants'

// Nettoyage périodique de la mémoire
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (record.resetAt < now) {
      rateLimitMap.delete(key)
    }
  }
}, SESSION_CHECK_INTERVAL)

/**
 * Vérifie si une requête dépasse la limite
 *
 * @param identifier - Identifiant unique (IP, user ID, etc.)
 * @param config - Configuration du rate limit
 * @returns { success: boolean, remaining: number, reset: number }
 */
export function rateLimit(identifier: string, config: RateLimitConfig) {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // Si aucun enregistrement ou fenêtre expirée, créer un nouveau
  if (!record || record.resetAt < now) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + config.interval
    }
    rateLimitMap.set(identifier, newRecord)

    return {
      success: true,
      remaining: config.uniqueTokenPerInterval - 1,
      reset: newRecord.resetAt
    }
  }

  // Vérifier si la limite est atteinte
  if (record.count >= config.uniqueTokenPerInterval) {
    return {
      success: false,
      remaining: 0,
      reset: record.resetAt
    }
  }

  // Incrémenter le compteur
  record.count++
  rateLimitMap.set(identifier, record)

  return {
    success: true,
    remaining: config.uniqueTokenPerInterval - record.count,
    reset: record.resetAt
  }
}

/**
 * Configurations prédéfinies pour différents cas d'usage
 */
import {
  RATE_LIMIT_LOGIN_WINDOW,
  RATE_LIMIT_LOGIN_ATTEMPTS,
  RATE_LIMIT_CHECKOUT_WINDOW,
  RATE_LIMIT_CHECKOUT_ATTEMPTS,
  RATE_LIMIT_ADMIN_WINDOW,
  RATE_LIMIT_ADMIN_ATTEMPTS,
  RATE_LIMIT_API_WINDOW,
  RATE_LIMIT_API_ATTEMPTS,
} from './constants'

export const RateLimitConfigs = {
  // Anti brute-force sur login
  LOGIN: {
    interval: RATE_LIMIT_LOGIN_WINDOW,
    uniqueTokenPerInterval: RATE_LIMIT_LOGIN_ATTEMPTS
  },

  // Protection checkout
  CHECKOUT: {
    interval: RATE_LIMIT_CHECKOUT_WINDOW,
    uniqueTokenPerInterval: RATE_LIMIT_CHECKOUT_ATTEMPTS
  },

  // Protection server actions admin
  ADMIN_ACTIONS: {
    interval: RATE_LIMIT_ADMIN_WINDOW,
    uniqueTokenPerInterval: RATE_LIMIT_ADMIN_ATTEMPTS
  },

  // Protection API publique
  API_PUBLIC: {
    interval: RATE_LIMIT_API_WINDOW,
    uniqueTokenPerInterval: RATE_LIMIT_API_ATTEMPTS
  }
} as const

/**
 * Extrait l'IP réelle du client depuis les headers
 * Gère les proxies et CDN (Cloudflare, Vercel, etc.)
 */
export function getClientIp(request: Request): string {
  // Essayer différents headers dans l'ordre de priorité
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip', // Cloudflare
    'x-vercel-forwarded-for' // Vercel
  ]

  for (const header of headers) {
    const value = request.headers.get(header)
    if (value) {
      // x-forwarded-for peut contenir plusieurs IPs séparées par des virgules
      const ip = value.split(',')[0].trim()
      if (ip) return ip
    }
  }

  return 'unknown'
}

/**
 * Helper pour créer une réponse de rate limit dépassé
 */
export function rateLimitExceededResponse(reset: number) {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000)

  return new Response(
    JSON.stringify({
      error: 'Trop de requêtes. Veuillez réessayer plus tard.',
      retryAfter
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString()
      }
    }
  )
}
