/**
 * Constantes globales de l'application
 * Centralise les valeurs magiques pour faciliter la maintenance
 */

// ============================================
// SESSIONS & AUTHENTIFICATION
// ============================================

/** Timeout d'inactivité admin : 1 heure en ms */
export const ADMIN_INACTIVITY_TIMEOUT = 60 * 60 * 1000

/** Avertissement avant déconnexion : 2 minutes en ms */
export const ADMIN_WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000

/** Vérification de session : toutes les 5 minutes en ms */
export const SESSION_CHECK_INTERVAL = 5 * 60 * 1000

/** Durée "Remember Me" : 30 jours en secondes */
export const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60

/** Durée du cookie de redirection : 5 minutes en secondes */
export const REDIRECT_COOKIE_MAX_AGE = 5 * 60

// ============================================
// RATE LIMITING
// ============================================

/** Login : 5 tentatives par 15 minutes */
export const RATE_LIMIT_LOGIN_ATTEMPTS = 5
export const RATE_LIMIT_LOGIN_WINDOW = 15 * 60 * 1000

/** Checkout : 10 paiements par heure */
export const RATE_LIMIT_CHECKOUT_ATTEMPTS = 10
export const RATE_LIMIT_CHECKOUT_WINDOW = 60 * 60 * 1000

/** Actions admin : 100 par 10 minutes */
export const RATE_LIMIT_ADMIN_ATTEMPTS = 100
export const RATE_LIMIT_ADMIN_WINDOW = 10 * 60 * 1000

/** API publique : 60 requêtes par minute */
export const RATE_LIMIT_API_ATTEMPTS = 60
export const RATE_LIMIT_API_WINDOW = 60 * 1000

// ============================================
// AUDIT & LOGS
// ============================================

/** Nombre de logs audit par défaut */
export const DEFAULT_AUDIT_LOG_LIMIT = 100

/** Intervalle de rafraîchissement auto des logs : 30 secondes */
export const AUDIT_LOG_REFRESH_INTERVAL = 30 * 1000

// ============================================
// TEMPS (en ms)
// ============================================

export const ONE_MINUTE = 60 * 1000
export const ONE_HOUR = 60 * 60 * 1000
export const ONE_DAY = 24 * 60 * 60 * 1000
export const ONE_WEEK = 7 * ONE_DAY
export const THIRTY_DAYS = 30 * ONE_DAY

// ============================================
// PAGINATION
// ============================================

/** Limite par défaut pour les listes */
export const DEFAULT_PAGE_SIZE = 50
export const MAX_PAGE_SIZE = 100
