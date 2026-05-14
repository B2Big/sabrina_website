# 🏗️ État des Lieux — Architecture Sab-Fit : Base E-Commerce Existante

> **Document de conviction** pour démontrer qu'on ne part PAS de zéro  
> **Date** : 2026-05-12  
> **Objectif** : Cloner cette architecture pour une boutique dropshipping vêtements/accessoires

---

## 📊 Chiffres Clés du Code Existant

| Métrique | Valeur |
|----------|--------|
| **Fichiers sources** | 76 fichiers TypeScript/TSX |
| **Lignes de code** | ~11 200 lignes |
| **Dépendances** | 24 packages (React, Next.js, Prisma, Stripe, Supabase...) |
| **API routes** | 7 endpoints REST sécurisés |
| **Composants UI** | 35+ composants réutilisables |
| **Temps de build** | ~23 secondes (Turbopack) |
| **Déploiement** | En production depuis mars 2026 |

---

## 🏛️ Architecture Technique Complète

### Stack "Enterprise-Grade" déjà en place

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONT-END (Next.js 16)                   │
│  • App Router (React Server Components)                     │
│  • TypeScript 5 (typage strict)                             │
│  • Tailwind CSS 4 (design system complet)                   │
│  • Framer Motion (animations)                               │
│  • PWA installable (Service Worker)                         │
│  • Mobile-first, responsive                                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     BACK-END (API)                          │
│  • Next.js API Routes (Node.js runtime)                     │
│  • Prisma ORM v5 (type-safe queries)                        │
│  • Supabase PostgreSQL (BaaS)                               │
│  • Stripe Checkout (paiement CB + Klarna 3x)                │
│  • Webhooks Stripe (synchro commandes)                      │
│  • Resend API (emails transactionnels)                      │
│  • Zod validation (tous les inputs)                         │
│  • Middleware auth + rate limiting                          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE                            │
│  • Netlify (CDN global, SSL auto, edge functions)           │
│  • Supabase PostgreSQL (RLS activé, backups)                │
│  • Domaine personnalisé : sab-fit.com                       │
│  • SEO : JSON-LD, sitemap, meta tags, WebP                  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Ce qu'on a DÉJÀ (E-Commerce)

### 1. 💰 Système de Paiement Complet
- **Stripe Checkout** : paiement CB en ligne (clés LIVE en production)
- **Klarna 3x** : paiement fractionné sans frais
- **Paiement sur place** : pour les retraits/rencontres
- **Webhooks Stripe** : synchronisation automatique des statuts de commande
- **Historique des commandes** : model `Order` avec statuts (PENDING, COMPLETED, FAILED, REFUNDED)

### 2. 🛒 Panier / Cart
- **Panier flottant** : accessible depuis toutes les pages
- **Context React** : `cart-context.tsx` (ajout, suppression, quantité)
- **Persistance** : localStorage pour conserver le panier entre les sessions
- **Calcul du total** : en temps réel avec taxes

### 3. 🗄️ Base de Données Relationnelle (PostgreSQL)

**Tables existantes** :
| Table | Usage E-Commerce | Réutilisable ? |
|-------|------------------|----------------|
| `services` | Catalogue produits | ✅ → renommer `products` |
| `promotions` | Codes promo / soldes | ✅ → inchangé |
| `orders` | Commandes clients | ✅ → ajouter champs livraison |
| `newsletter_subscribers` | Marketing emails | ✅ → inchangé |
| `reservations` | RDV clients | ⚠️ → remplacer par `customers` |
| `admin_logs` | Audit trail | ✅ → inchangé |

**Indexes optimisés** : email, status, createdAt, relations

### 4. 🔐 Authentification & Sécurité
- **Auth double** : Supabase Auth + session custom
- **Rôles** : ADMIN / DEVELOPER
- **Middleware** : protection des routes /admin
- **RLS** : Row Level Security sur toutes les tables Supabase
- **Rate limiting** : protection brute-force
- **Validation Zod** : TOUS les inputs sont validés
- **Audit trail** : 12 types d'actions loggées (CREATE, UPDATE, DELETE...)

### 5. 📧 Système d'Emails Transactionnels
- **Resend API** : domaine sab-fit.com vérifié (DKIM + SPF)
- **4 templates HTML** : confirmation client, notification admin, paiement reçu, réservation
- **Newsletter** : opt-in RGPD, export CSV, segmentation

### 6. 🎛️ Dashboard Admin Complet
- **CRUD services** : créer, modifier, supprimer des prestations
- **Gestion des promotions** : créer des codes promo avec % de réduction
- **Audit trail** : historique de toutes les actions admin
- **Newsletter** : stats, export, copie des emails
- **Session sécurisée** : timeout 1h, remember me

### 7. 🔍 SEO & Performance
- **JSON-LD** : 6 schémas structurés (LocalBusiness, Service, FAQ...)
- **Sitemap XML** : généré dynamiquement
- **Images WebP** : optimisées automatiquement
- **PWA** : installable, offline-capable
- **Lighthouse** : score > 90 (perf, SEO, accessibilité)

### 8. 📱 Responsive & PWA
- **Mobile-first** : tous les composants sont responsive
- **PWA** : manifest.json, Service Worker, icônes
- **Touch-friendly** : boutons 44px+, gestes supportés

---

## 🔧 Ce qu'il FAUDRA Ajouter (Dropshipping)

| Feature | Complexité | Temps estimé |
|---------|------------|--------------|
| **Model Product** (variants taille/couleur, SKU, stock) | Moyenne | 2-3h |
| **Model Category** (arborescence) | Faible | 1h |
| **Model Customer** (compte client, historique) | Moyenne | 2-3h |
| **Upload images** (Supabase Storage) | Faible | 1-2h |
| **Galerie produit** (zoom, thumbnails) | Moyenne | 2-3h |
| **Filtres & recherche** (catégorie, prix, taille) | Moyenne | 3-4h |
| **Page catégorie** (grille produits) | Faible | 1-2h |
| **Wishlist / Favoris** | Faible | 1-2h |
| **Suivi de commande** (statuts enrichis) | Moyenne | 2-3h |
| **Emails dropshipping** (confirmation expédition) | Faible | 1-2h |
| **Fournisseur** (model Supplier, sync API) | Forte | 4-6h |
| **Adresse livraison** (formulaire checkout) | Moyenne | 2-3h |

**Total estimé** : ~20-30h de dev (vs 200h+ partir de zéro)

---

## 💰 Coût : Notre Stack vs Shopify

| Coût | Notre Stack | Shopify Basic |
|------|-------------|---------------|
| **Hébergement** | 0€ (Netlify free) | 39€/mois |
| **Base de données** | 0€ (Supabase free) | inclus |
| **Paiement** | ~1,5% + 0,25€/trans (Stripe) | 2% + 0,25€/trans + abo |
| **Emails** | 0€ (Resend free tier) | inclus |
| **Domaine** | ~15€/an | ~15€/an |
| **Apps/plugins** | 0€ (code custom) | 5-50€/mois/app |
| **TOTAL/mois** | **~0€** | **~39€ + apps** |
| **Sur 1 an** | **~15€** | **~500-1000€** |

**Économie** : ~500-1000€/an

---

## 🎯 Pourquoi Cloner > Shopify

### ✅ Avantages de notre approche

1. **Contrôle total** : on possède le code, pas de vendor lock-in
2. **Pas de commissions cachées** : Stripe seulement, pas de % supplémentaire Shopify
3. **Customisable à l'infini** : on peut ajouter n'importe quelle feature
4. **Performance** : Next.js + Turbopack est plus rapide que Shopify liquid
5. **SEO** : contrôle total du HTML, des meta, des schemas
6. **Pas de thème payant** : design 100% sur-mesure
7. **Multi-domaine** : même code, plusieurs boutiques
8. **Données** : on possède TOUTES les données (pas d'export limité)

### ⚠️ Inconvénients à connaître

1. **Besoin d'un dev** : pour ajouter des features (mais on a déjà la base)
2. **Maintenance** : mises à jour de sécurité à gérer
3. **Plugins** : pas d'écosystème "1-clic" comme Shopify (mais on code ce qu'on veut)

---

## 🗺️ Plan de Clonage (Roadmap)

### Phase 1 : Clonage (2-3h)
```
1. Copier le repo
2. Renommer les variables d'environnement
3. Créer une nouvelle base Supabase
4. Adapter le schema Prisma (services → products)
5. Déployer sur un nouveau site Netlify
```

### Phase 2 : Adaptation Dropshipping (15-20h)
```
1. Model Product avec variants (taille, couleur)
2. Upload images produits (Supabase Storage)
3. Galerie produit + zoom
4. Filtres et recherche
5. Page catégorie
6. Adresse de livraison dans le checkout
7. Statuts de commande enrichis
8. Emails dropshipping
```

### Phase 3 : Polissage (5-10h)
```
1. Design sur-mesure (vêtements/accessoires)
2. Import produits (CSV/API fournisseur)
3. Tests paiement
4. SEO spécifique
5. Performance audit
```

**Total** : ~25-35h pour une boutique dropshipping complète et custom.

---

## 🏁 Verdict

> **On ne part PAS de zéro. On a ~70% de l'infrastructure e-commerce déjà construite et en production.**

Cloner + adapter cette architecture est :
- **10x moins cher** que Shopify sur le long terme
- **5x plus rapide** que partir de zéro
- **100% contrôlable** vs une solution SaaS

**La vraie question** n'est pas "Shopify ou custom ?" mais "est-ce qu'on a un dev pour maintenir ?" — et la réponse est OUI, puisqu'on a déjà construit et déployé cette app.

---

**Ce document est à montrer à l'agent IA** pour qu'il comprenne la base de départ.
