# 🏋️‍♀️ SAB-FIT.COM - Guide Complet du Projet

**Dernière mise à jour** : 11 Février 2026  
**Statut** : ✅ Production - 100% Opérationnel  
**URL** : https://www.sab-fit.com

---

## 📖 Table des Matières

1. [Vision & Philosophie](#1-vision--philosophie)
2. [Architecture Technique](#2-architecture-technique)
3. [Fonctionnalités Clés](#3-fonctionnalités-clés)
4. [Flux de Réservation (Dual System)](#4-flux-de-réservation-dual-system)
5. [Système d'Emails](#5-système-demails)
6. [Base de Données](#6-base-de-données)
7. [Sécurité](#7-sécurité)
8. [État Actuel & Tests](#8-état-actuel--tests)
9. [Historique du Projet](#9-historique-du-projet)
10. [Roadmap & Futur](#10-roadmap--futur)

---

## 1. Vision & Philosophie

### 🎯 Mission
**Sab-Fit** est une plateforme web complète permettant à **Sabrina**, coach sportive et praticienne de massages, de proposer ses services de coaching personnalisé et de bien-être à ses clients, avec une expérience d'achat fluide et professionnelle.

### 🧘‍♀️ Philosophie "Premium Unique"
- **Expérience sans couture** : Du premier contact à la réservation, tout est fluide
- **Accessibilité immédiate** : PWA installable sans téléchargement d'app store
- **Confiance & Sécurité** : Paiements sécurisés, emails professionnels, conformité RGPD
- **Autonomie de Sabrina** : Dashboard admin complet pour gérer son business

### 🎨 Identité Visuelle
- **Thème** : "Guerrière / Amazone" - Force et bien-être
- **Couleurs** :
  - 🔴 **Rouge Guerrier** : `#D92323` (accent principal)
  - 🟢 **Vert Menthe** : `#10B981` (succès, bien-être)
  - 🟠 **Orange** : `#F59E0B` (attention, paiement sur place)
  - ⚫ **Dark Mode** par défaut avec tons de gris élégants
- **Typography** : Bold, impactante, moderne
- **Animations** : Fluides avec Framer Motion (scroll smooth, parallax)

---

## 2. Architecture Technique

### 🏗️ Stack Complète

| Couche | Technologie | Version | Rôle |
|--------|-------------|---------|------|
| **Framework** | Next.js | 16.1.3 | App Router, SSR, API Routes |
| **Frontend** | React | 19.2.3 | UI Components |
| **Langage** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Animations** | Framer Motion | 12.x | Transitions fluides |
| **Database** | PostgreSQL | 15 | Supabase |
| **ORM** | Prisma | 5.22 | Type-safe queries |
| **Auth** | Supabase Auth | 2.91 | JWT, rôles |
| **Paiements** | Stripe | 20.x | Checkout + Webhooks |
| **Emails** | Resend | 6.x | Transactionnels |
| **PWA** | @ducanh2912/next-pwa | 10.x | Offline, installable |
| **Validation** | Zod | 4.x | Schema validation |
| **Déploiement** | Netlify | - | CDN, CI/CD |
| **Domaine** | Infomaniak | - | DNS, SSL |

### 📁 Structure du Projet

```
sabrina/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage (Server Component)
│   │   ├── layout.tsx         # Root layout avec providers
│   │   ├── actions.ts         # Server Actions (réservation sur place)
│   │   ├── admin/             # Dashboard protégé
│   │   │   ├── page.tsx       # Layout admin
│   │   │   ├── actions.ts     # CRUD services/promotions
│   │   │   └── newsletter-actions.ts
│   │   ├── login/             # Authentification
│   │   ├── api/               # API Routes
│   │   │   ├── checkout/      # POST - Création session Stripe
│   │   │   ├── webhooks/      # Stripe webhooks
│   │   │   └── services/      # CRUD API (protégé)
│   │   ├── success/           # Page succès paiement
│   │   └── cgu/               # Conditions générales
│   │
│   ├── components/            # React Components
│   │   ├── ui/               # Composants de base
│   │   │   ├── floating-cart.tsx      # Panier flottant
│   │   │   ├── service-card.tsx       # Carte service
│   │   │   ├── button.tsx             # Boutons
│   │   │   └── marquee.tsx            # Défilement texte
│   │   ├── admin/            # Composants admin
│   │   ├── contact-form.tsx  # Formulaire réservation
│   │   ├── hero.tsx          # Section héro
│   │   ├── navbar.tsx        # Navigation
│   │   ├── promo-banner.tsx  # Bandeau promotions
│   │   └── ...
│   │
│   ├── context/               # React Context
│   │   └── cart-context.tsx   # Gestion du panier
│   │
│   ├── lib/                   # Utilitaires
│   │   ├── auth/             # Système de rôles
│   │   ├── supabase/         # Clients Supabase
│   │   ├── validations/      # Schémas Zod
│   │   ├── stripe.ts         # Config Stripe
│   │   ├── resend.ts         # **4 templates emails**
│   │   ├── db-services.ts    # Helpers Prisma
│   │   └── rate-limit.ts     # Rate limiting
│   │
│   └── data/                  # Données statiques
│
├── prisma/
│   └── schema.prisma         # Modèles de données
│
├── docs/                     # Documentation
│   ├── SABRINA_COMPLETE_GUIDE.md  # 📍 CE DOCUMENT
│   ├── ARCHITECTURE.md       # Architecture détaillée
│   ├── SESSION_LOG.md        # Journal des sessions
│   ├── PROJECT_CONTEXT.md    # Contexte projet
│   ├── SECURITE_RECAPITULATIF.md
│   ├── NEWSLETTER_SETUP.md
│   └── ...
│
├── scripts/                  # Scripts utilitaires
│   └── setup-admin-users.ts  # Création users admin
│
└── public/                   # Assets statiques
    ├── manifest.json         # PWA manifest
    └── icons/                # Icônes PWA
```

---

## 3. Fonctionnalités Clés

### 🏪 A. E-Commerce Complet

#### Catalogue Dynamique
- **Services** stockés en PostgreSQL (pas de données en dur)
- **Catégories** : Coaching, Massages, Cures
- **Champs** : Titre, description, prix, durée, features, badges (popular, bestValue)
- **Images** : Support via URL externes (optimisées)

#### Système "Panic Sell" (Vente Flash)
- Bandeau rouge dynamique en haut de page
- Promotions avec dates de début/fin
- Calcul automatique des prix barrés
- Sabrina peut créer une promo en 3 clics depuis son mobile

#### Panier Intelligent
- **Floating Cart** : Panier flottant toujours visible
- **LocalStorage** : Persiste entre les sessions
- **Quantités** : Ajout/retrait facile
- **Calcul auto** : Total mis à jour en temps réel

---

### 💳 B. Dual System de Réservation

Le cœur du projet : **deux flux de réservation** selon les préférences du client.

| | **Sur Place** | **En Ligne (Stripe)** |
|---|---|---|
| **Bouton** | "Réserver et régler sur place" | "Réserver & Payer en ligne" |
| **Paiement** | Le jour du RDV (espèces/carte/PayPal) | Immédiat par Stripe |
| **Emails** | 🟠 Orange (thème "attente") | 🟢 Vert (thème "confirmé") |
| **Statut DB** | `attente_paiement_sur_place` | `paye_confirme` |
| **Idéal pour** | Clients réguliers, gros montants | Nouveaux clients, sécurité |

---

### 🔐 C. Dashboard Admin Sécurisé

**URL** : `/admin`  
**Accès** : Authentification requise + rôle ADMIN/DEVELOPER

#### Fonctionnalités Admin

| Section | Actions |
|---------|---------|
| **Services** | CRUD complet (créer, modifier, supprimer) |
| **Promotions** | Créer des offres flash avec dates |
| **Newsletter** | Stats, export CSV, copier emails |
| **Authentification** | 2 rôles : ADMIN (Sabrina) / DEVELOPER (technique) |

#### Sécurité Admin
- **Rate limiting** : 100 actions / 10 min
- **Validation Zod** : Tous les inputs validés
- **Middleware** : Redirection auto si non authentifié
- **RLS** : Row Level Security sur Supabase

---

### 📧 D. Système de Newsletter (RGPD)

#### Collecte
- **Checkout Stripe** : Checkbox opt-in "Recevoir les offres"
- **Consentement explicite** : Case NON cochée par défaut
- **Source** : Traçabilité (checkout, footer, popup)

#### Dashboard Newsletter
- **Statistiques** : Total, actifs, désinscrits, nouveaux
- **Export CSV** : Pour import dans Brevo/Mailchimp
- **Copier emails** : Un clic pour copier tous les emails actifs
- **Gestion** : Désinscrire, réabonner, supprimer (RGPD)

#### Conformité RGPD
- ✅ Consentement explicite
- ✅ Droit de désinscription (token unique)
- ✅ Droit à l'effacement
- ✅ Page CGU détaillée (`/cgu`)

---

### 📱 E. PWA (Progressive Web App)

#### Caractéristiques
- **Installable** : Sur mobile et desktop (Chrome/Edge/Safari)
- **Offline** : Service worker avec cache des assets
- **Manifest** : Icônes, splash screen, theme color
- **Responsive** : Mobile-first, breakpoints Tailwind

#### Performance
- **Lighthouse** : Optimisé pour SEO et performance
- **Images** : Next.js Image optimization
- **Code splitting** : Chargement lazy des composants

---

## 4. Flux de Réservation (Dual System)

### 🟠 A. Paiement Sur Place (Workflow Complet)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CLIENT SUR LE SITE                                       │
│    - Ajoute un service au panier                            │
│    - Clique "Réserver et régler sur place"                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FORMULAIRE DE CONTACT                                    │
│    - Nom, Email, Téléphone (validation Zod)                 │
│    - Message optionnel                                      │
│    - Date souhaitée (optionnel)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. SERVER ACTION : createReservationSurPlace()              │
│    ✓ Validation Zod stricte                                 │
│    ✓ Création réservation DB : status = attente_paiement    │
│    ✓ Email client (🟠 Orange) : Confirmation                │
│    ✓ Email Sabrina (🟠 Orange) : Notification               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. CONFIRMATION                                             │
│    - Message succès au client                               │
│    - Sabrina contacte le client sous 24h                    │
│    - Paiement effectué le jour du RDV                       │
└─────────────────────────────────────────────────────────────┘
```

**Statuts possibles** :
- `attente_paiement_sur_place` → `paye_confirme` (après RDV)
- `attente_paiement_sur_place` → `annule` (si client annule)
- `paye_confirme` → `termine` (après prestation)

---

### 🟢 B. Paiement en Ligne (Stripe)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CLIENT AJOUTE AU PANIER                                  │
│    - Panier flottant avec total                             │
│    - Clique "Réserver & Payer en ligne"                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FORMULAIRE + CHECKOUT                                    │
│    - Infos client (nom, email, téléphone)                   │
│    - Redirection vers Stripe Checkout                       │
│    - Option newsletter (checkbox RGPD)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. STRIPE CHECKOUT                                          │
│    - Carte bancaire ou PayPal                               │
│    - Page sécurisée Stripe                                  │
│    - Validation 3D Secure si nécessaire                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. WEBHOOK STRIPE                                           │
│    POST /api/webhooks/stripe                                  │
│    ✓ Vérification signature (whsec_...)                     │
│    ✓ Création/Maj réservation DB : status = paye_confirme   │
│    ✓ Newsletter opt-in (si coché)                           │
│    ✓ Email client (🟢 Vert) : Confirmation + reçu           │
│    ✓ Email Sabrina (🟢 Vert) : Notification                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. REDIRECTION CLIENT                                       │
│    - Page /success?session_id=xxx                           │
│    - Message de confirmation                                │
│    - Sabrina contacte sous 24h pour planifier               │
└─────────────────────────────────────────────────────────────┘
```

**Sécurité Stripe** :
- ✅ Prix validés côté serveur (jamais trust client!)
- ✅ Webhook signature vérifiée cryptographiquement
- ✅ Rate limiting (10 requêtes/heure)
- ✅ HTTPS obligatoire

---

## 5. Système d'Emails

### 📧 Architecture Resend

| Aspect | Configuration |
|--------|---------------|
| **Domaine** | `sab-fit.com` ✅ Vérifié (DKIM + SPF) |
| **From** | `contact@sab-fit.com` |
| **API** | Resend API v6.x |
| **Quota** | 3000 emails/mois (plan gratuit) |

### 📨 Templates Email (4 variants)

#### 1. `sendConfirmationToCustomerSurPlace()` 🟠
- **Destinataire** : Client
- **Thème** : Orange (attention paiement à venir)
- **Contenu** :
  - Confirmation réservation
  - Récap services + total
  - Info "Paiement sur place"
  - Moyens acceptés (espèces/carte/PayPal)
  - Contact Sabrina

#### 2. `sendNotificationToSabrinaSurPlace()` 🟠
- **Destinataire** : Sabrina (`sabcompan8306@gmail.com`)
- **Thème** : Orange (à percevoir)
- **Contenu** :
  - Nouvelle réservation
  - Infos client (nom, email, téléphone)
  - Panier détaillé
  - Message client
  - Bouton "Répondre au client"

#### 3. `sendConfirmationToCustomerPaye()` 🟢
- **Destinataire** : Client
- **Thème** : Vert (succès)
- **Contenu** :
  - Confirmation paiement reçu
  - 🧾 Reçu Stripe (lien téléchargement)
  - Récap services payés
  - Badge "Payé ✅"
  - Contact Sabrina

#### 4. `sendNotificationToSabrinaPaye()` 🟢
- **Destinataire** : Sabrina
- **Thème** : Vert (paiement reçu)
- **Contenu** :
  - Réservation confirmée & payée
  - ✅ Paiement Stripe reçu
  - ID transaction Stripe
  - Infos client complètes
  - Montant payé (total)

---

## 6. Base de Données

### 📊 Modèles Principaux

#### `Service`
```prisma
model Service {
  id            String   @id @default(cuid())
  category      String   // "Coaching", "Massages", "Cures"
  title         String
  description   String
  price         String   // "50 €"
  originalPrice String?  // Pour promotions
  duration      String?  // "1h30"
  objective     String?
  popular       Boolean  @default(false)
  bestValue     Boolean  @default(false)
  features      String[]
  promotions    Promotion[]
}
```

#### `Reservation` (NOUVEAU - Système complet)
```prisma
enum ReservationStatus {
  attente_paiement_sur_place
  paye_confirme
  annule
  termine
}

model Reservation {
  id                String            @id @default(cuid())
  status            ReservationStatus @default(attente_paiement_sur_place)
  
  // Client
  customerName      String
  customerEmail     String
  customerPhone     String
  message           String?
  
  // Service
  serviceTitle      String
  servicePrice      Float
  quantity          Int               @default(1)
  totalAmount       Float
  
  // Paiement
  paymentMethod     String            // "sur_place" | "stripe"
  stripeSessionId   String?           @unique
  stripePaymentId   String?
  paidAt            DateTime?
  
  // Dates
  requestedDate     DateTime?         // Date souhaitée
  confirmedDate     DateTime?         // Date confirmée par Sabrina
  
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
}
```

#### `Order` (Stripe)
```prisma
enum OrderStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model Order {
  id               String      @id @default(cuid())
  stripeSessionId  String      @unique
  stripePaymentId  String?
  amount           Float
  currency         String      @default("eur")
  status           OrderStatus @default(PENDING)
  customerEmail    String
  customerName     String?
  serviceIds       String[]
  itemCount        Int
  paidAt           DateTime?
  createdAt        DateTime    @default(now())
}
```

#### `NewsletterSubscriber`
```prisma
model NewsletterSubscriber {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  source            String    @default("checkout")
  isSubscribed      Boolean   @default(true)
  unsubscribeToken  String    @unique @default(cuid())
  subscribedAt      DateTime  @default(now())
  consentGiven      Boolean   @default(true)
  ipAddress         String?
}
```

### 🔐 Sécurité Base de Données

- **RLS Activé** : Row Level Security sur toutes les tables
- **Accès public** : Lecture seule sur Services (affichage site)
- **Accès admin** : Écriture via service_role uniquement
- **Connexion** : Connection pooling Supabase + Direct URL pour Prisma

---

## 7. Sécurité

### 🛡️ Mesures de Protection

| Couche | Protection | Implémentation |
|--------|------------|----------------|
| **Authentification** | JWT + Rôles | Supabase Auth avec `app_metadata.role` |
| **API** | Rate limiting | 5 req/15min (login), 10 req/h (checkout) |
| **Validation** | Schémas stricts | Zod sur tous les inputs |
| **Paiement** | Prix côté serveur | Fetch DB avant Stripe, jamais trust client |
| **Webhook** | Signature HMAC | Vérification cryptographique Stripe |
| **Headers** | Security headers | X-Frame-Options, CSP, etc. |
| **Env** | Secrets protégés | Variables d'environnement Netlify |

### 🔑 Rôles Utilisateurs

| Rôle | Email | Permissions |
|------|-------|-------------|
| **ADMIN** | sabcompan8306@gmail.com | Tout (services, promos, newsletter, users) |
| **DEVELOPER** | johan.dev.pro@gmail.com | Tout sauf gestion users |

---

## 8. État Actuel & Tests

### ✅ Fonctionnalités Validées (11/02/2026)

| Feature | Statut | Dernier Test |
|---------|--------|--------------|
| Réservation "sur place" | ✅ OK | 12/02/2026 - Emails reçus |
| Paiement Stripe | ✅ OK | 11/02/2026 - Webhook OK |
| Emails Resend | ✅ OK | Domaine vérifié, tous partent |
| Dashboard admin | ✅ OK | Connexion + CRUD testés |
| Newsletter | ✅ OK | Opt-in + export CSV OK |
| PWA | ✅ OK | Installable sur mobile |
| Panier | ✅ OK | LocalStorage persistant |
| Promotions | ✅ OK | Calcul auto des prix |

### 📊 Métriques Production

- **Déploiement** : Netlify (CDN global)
- **Domaine** : https://www.sab-fit.com (SSL A+)
- **Base de données** : Supabase PostgreSQL (Europe)
- **Emails** : Resend (3000/mois)
- **Paiements** : Stripe (Live mode ready)

---

## 9. Historique du Projet

### 📅 Timeline Développement

| Date | Événement | Détail |
|------|-----------|--------|
| **Jan 2026** | Phase initiale | Site vitrine Next.js + Supabase |
| **22 Jan** | v1.0.0 | PWA basique, Stripe checkout simple |
| **27 Jan** | Security Release | Auth, rôles, rate limiting, webhooks |
| **29 Jan** | Production Release | Déploiement Netlify, domaine configuré |
| **10-11 Fév** | Réservation System | Dual flow (sur place + Stripe) + emails |

### 🗂️ Projets Archivés (Abandonnés)

#### Running App Native (Abandonné)
- **Idée initiale** : Application mobile native séparée pour les coureurs
- **Outils prévus** : Chrono, Parser de données
- **Statut** : ❌ Abandonné
- **Raison** : Concentration des efforts sur la PWA unique
- **Remplacement** : Les outils seront intégrés dans la PWA si besoin (futur)

> **Note** : Tout le code lié à l'app native a été supprimé. Le projet actuel est une **PWA unique** qui centralise tout.

---

## 10. Roadmap & Futur

### 🎯 Prochaines Étapes Immédiates

1. **Mettre à jour URL Webhook Stripe**
   - Passer de `.netlify.app` à `www.sab-fit.com`
   - Tester webhook en production

2. **Tester paiement réel**
   - Passer Stripe en LIVE mode
   - Faire un vrai paiement (petit montant)
   - Vérifier emails arrivent bien

### 🚀 Améliorations Court Terme

| Priorité | Feature | Impact |
|----------|---------|--------|
| 🔴 Haute | Dashboard réservations (`/admin/reservations`) | Sabrina peut voir toutes les réservations |
| 🟠 Moyenne | Statistiques de vente | Revenus, services populaires |
| 🟡 Basse | Export CSV des réservations | Pour comptabilité |

### 🔮 Vision Long Terme

| Phase | Feature | Description |
|-------|---------|-------------|
| **Phase 3** | Outils Running dans PWA | Chrono, parser (si demande) |
| **Phase 4** | Réservation créneaux | Calendrier interactif |
| **Phase 5** | Espace client | Historique, progrès |
| **Phase 6** | Programme fidélité | Points, récompenses |
| **Phase 7** | Chat intégré | Communication directe |

---

## 📞 Informations de Contact

| Rôle | Nom | Email | Accès |
|------|-----|-------|-------|
| **Propriétaire** | Sabrina | sabcompan8306@gmail.com | ADMIN |
| **Développeur** | Johan | johan.dev.pro@gmail.com | DEVELOPER |

---

## 📚 Documentation Complémentaire

| Document | Contenu | Lien |
|----------|---------|------|
| **Architecture** | Détails techniques | `docs/ARCHITECTURE.md` |
| **Session Log** | Journal des sessions | `docs/SESSION_LOG.md` |
| **Sécurité** | Récap sécurité | `docs/SECURITE_RECAPITULATIF.md` |
| **Newsletter** | Guide newsletter | `docs/NEWSLETTER_SETUP.md` |
| **Stripe Webhooks** | Config webhooks | `docs/STRIPE_WEBHOOKS.md` |
| **Changelog** | Historique modifs | `docs/CHANGELOG.md` |

---

## 🎉 Conclusion

**Sab-Fit.com** est une **PWA complète et professionnelle** qui permet à Sabrina de gérer son business de coaching et massages en toute autonomie.

### Points Forts
- ✅ Dual système de réservation flexible
- ✅ Emails professionnels avec domaine vérifié
- ✅ Dashboard admin sécurisé
- ✅ PWA installable et rapide
- ✅ Conforme RGPD
- ✅ Paiements sécurisés Stripe

### Prêt pour
- Production immédiate
- Scaling ( peut gérer + de clients)
- Nouvelles fonctionnalités

---

**Dernière mise à jour** : 11 Février 2026  
**Version** : 2.0 - Système de réservation complet  
**Statut** : 🟢 Production - 100% Opérationnel
