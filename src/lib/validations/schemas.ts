import { z } from 'zod'

/**
 * Schéma de validation pour un Service
 */
export const serviceSchema = z.object({
  id: z.string().min(1).max(100).optional(),
  title: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .trim(),
  category: z.string()
    .min(2, 'La catégorie est requise')
    .max(50, 'La catégorie ne peut pas dépasser 50 caractères')
    .trim(),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .trim(),
  price: z.string()
    .regex(/^\d+(\.\d{1,2})?\s*€?$/, 'Format de prix invalide (ex: 70 €)')
    .transform(val => val.trim()),
  originalPrice: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().regex(/^\d+(\.\d{1,2})?\s*€?$/, 'Format de prix invalide').nullable().optional()
  ),
  duration: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().max(50, 'La durée ne peut pas dépasser 50 caractères').nullable().optional()
  ),
  objective: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().max(500, 'L\'objectif ne peut pas dépasser 500 caractères').nullable().optional()
  ),
  popular: z.boolean().default(false),
  bestValue: z.boolean().default(false),
  note: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().max(200, 'La note ne peut pas dépasser 200 caractères').nullable().optional()
  ),
  features: z.array(
    z.string()
      .min(1, 'Une caractéristique ne peut pas être vide')
      .max(200, 'Une caractéristique ne peut pas dépasser 200 caractères')
      .trim()
  ).max(20, 'Maximum 20 caractéristiques'),
  paymentLink: z.preprocess(
    (val) => {
      // Transformer chaîne vide en null
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().url('Lien de paiement invalide').max(500).nullable().optional()
  ),
})

export type ServiceInput = z.infer<typeof serviceSchema>

/**
 * Schéma de validation pour une Promotion
 */
export const promotionSchema = z.object({
  id: z.string().min(1).max(100).optional(),
  text: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().min(5, 'Le texte doit contenir au moins 5 caractères').max(200, 'Le texte ne peut pas dépasser 200 caractères').nullable().optional()
  ),
  link: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().url('Lien invalide').max(500).nullable().optional()
  ),
  discountPercent: z.number()
    .int('Le pourcentage doit être un nombre entier')
    .min(1, 'Le pourcentage minimum est 1%')
    .max(100, 'Le pourcentage maximum est 100%')
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
  startDate: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().datetime('Date de début invalide').nullable().optional()
  ),
  endDate: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      return val;
    },
    z.string().datetime('Date de fin invalide').nullable().optional()
  ),
  serviceIds: z.array(z.string().min(1).max(100))
    .max(50, 'Maximum 50 services par promotion')
    .optional()
}).refine(
  (data) => {
    // Si les deux dates sont fournies, vérifier que endDate > startDate
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'La date de fin doit être après la date de début',
    path: ['endDate']
  }
)

export type PromotionInput = z.infer<typeof promotionSchema>

/**
 * Schéma de validation pour un item du panier lors du checkout
 */
export const checkoutItemSchema = z.object({
  id: z.string()
    .min(1, 'ID de service requis')
    .max(100, 'ID trop long'),
  quantity: z.number()
    .int('La quantité doit être un nombre entier')
    .min(1, 'La quantité minimum est 1')
    .max(100, 'La quantité maximum est 100')
})

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema)
    .min(1, 'Le panier ne peut pas être vide')
    .max(50, 'Maximum 50 articles par commande')
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

/**
 * Schéma pour l'email de contact
 */
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  email: z.string()
    .email('Email invalide')
    .max(254, 'Email trop long')
    .toLowerCase()
    .trim(),
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, 'Le message ne peut pas dépasser 5000 caractères')
    .trim()
})

export type ContactInput = z.infer<typeof contactSchema>
