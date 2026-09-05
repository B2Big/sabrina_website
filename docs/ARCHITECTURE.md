# 🏗️ Architecture Technique - Sab-Fit PWA

**Date**: 2026-01-29
**Version**: 1.0.0
**Stack**: Next.js 16, Supabase, Stripe, Netlify

---

## 📊 Vue d'Ensemble Globale

```
┌─────────────────────────────────────────────────────────────────────┐
│                          UTILISATEURS                               │
│  👤 Clients          👤 Sabrina (Admin)      👤 Développeur        │
└─────────────────────┬───────────────────────┬───────────────────────┘
                      │                       │
                      ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🌐 DOMAINE PRODUCTION                            │
│                     https://www.sab-fit.com                         │
│                     (Netlify CDN + SSL)                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              📱 NEXT.JS 16 PWA (App Router)                         │
│  ┌─────────────────┬────────────────┬────────────────────────┐     │
│  │  Pages Publiques│  Pages Admin   │   API Routes           │     │
│  │  - Homepage     │  - Dashboard   │   - /api/checkout      │     │
│  │  - Services     │  - Services    │   - /api/webhooks      │     │
│  │  - Contact      │  - Promotions  │   - /api/services      │     │
│  │  - CGU          │  - Newsletter  │                        │     │
│  └─────────────────┴────────────────┴────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────┐  ┌─────────────────┐  ┌────────────────────┐
│  💳 STRIPE       │  │  🗄️ SUPABASE    │  │  📧 RESEND         │
│  - Checkout      │  │  - PostgreSQL   │  │  - Emails          │
│  - Webhooks      │  │  - Auth         │  │  - Domain          │
│  - PayPal        │  │  - RLS          │  │                    │
└──────────────────┘  └─────────────────┘  └────────────────────┘
```

---

## 🎨 Architecture Frontend (Client)

### **1. Structure des Pages**

```
src/app/
│
├── (public)                    # Routes publiques
│   ├── page.tsx               # Homepage avec hero + services
│   ├── cgu/                   # Conditions générales (RGPD)
│   └── success/               # Page de confirmation paiement
│
├── login/                     # Authentification admin
│   ├── page.tsx              # Formulaire de connexion
│   └── actions.ts            # Server action login
│
└── admin/                     # Dashboard protégé
    ├── page.tsx              # Layout admin
    ├── actions.ts            # CRUD services/promotions
    └── newsletter-actions.ts # Gestion newsletter
```

### **2. Composants UI**

```
src/components/
│
├── ui/                        # Composants de base
│   ├── button.tsx            # Boutons stylisés
│   ├── floating-cart.tsx     # Panier flottant
│   └── service-card.tsx      # Carte service
│
├── admin/                     # Composants admin
│   ├── admin-dashboard.tsx   # Layout dashboard
│   ├── service-form.tsx      # Formulaire CRUD service
│   ├── promo-list.tsx        # Liste promotions
│   └── newsletter-list.tsx   # Gestion newsletter
│
└── contact-form.tsx          # Formulaire de contact/réservation
```

### **3. PWA Configuration**

```
public/
│
├── manifest.json             # Manifeste PWA
│   ├── name: "Sab-Fit"
│   ├── icons: 192x192, 512x512
│   ├── start_url: "/"
│   └── display: "standalone"
│
├── sw.js                     # Service Worker (cache statique)
└── icons/                    # Icônes PWA
```

---

## ⚙️ Architecture Backend (Server)

### **1. API Routes (Route Handlers)**

```
src/app/api/
│
├── checkout/
│   └── route.ts              # POST - Créer session Stripe
│       ├── Rate limiting (10 req/h)
│       ├── Validation Zod
│       ├── Fetch prix depuis DB (sécurité!)
│       └── Création session Stripe + custom fields
│
├── webhooks/
│   └── stripe/
│       └── route.ts          # POST - Webhook Stripe
│           ├── Vérification signature (whsec_...)
│           ├── Enregistrement Order
│           ├── Newsletter opt-in
│           └── Envoi emails
│
└── services/
    └── route.ts              # GET/POST/PUT/DELETE
        ├── Protection admin (hasAdminAccess)
        ├── Validation Zod
        └── CRUD via Prisma
```

### **2. Server Actions**

```
src/app/
│
├── actions.ts                # Actions globales
│   └── sendContactEmail()   # Envoi emails via Resend
│       ├── Validation Zod
│       ├── Email à Sabrina
│       └── Email confirmation client
│
├── admin/
│   ├── actions.ts           # CRUD Services/Promotions
│   │   ├── upsertService()
│   │   ├── deleteService()
│   │   └── upsertPromotion()
│   │
│   └── newsletter-actions.ts # Newsletter
│       ├── getNewsletterSubscribers()
│       ├── getNewsletterStats()
│       ├── unsubscribeUser()
│       └── deleteSubscriber()
│
└── login/
    └── actions.ts           # Authentification
        └── signIn()         # Login Supabase Auth
```

---

## 🗄️ Architecture Base de Données

### **1. Schéma Prisma**

```
prisma/schema.prisma

┌────────────────────────────────────────────┐
│          📦 Service                        │
├────────────────────────────────────────────┤
│ id: String (cuid)                          │
│ category: String                           │
│ title: String                              │
│ description: String                        │
│ price: String                              │
│ originalPrice: String?                     │
│ duration: String?                          │
│ popular: Boolean                           │
│ bestValue: Boolean                         │
│ features: String[]                         │
│ promotions: Promotion[]                    │
└────────────────────────────────────────────┘
                  │
                  │ Many-to-Many
                  ▼
┌────────────────────────────────────────────┐
│          🎉 Promotion                      │
├────────────────────────────────────────────┤
│ id: String                                 │
│ text: String?                              │
│ discountPercent: Int?                      │
│ services: Service[]                        │
│ isActive: Boolean                          │
│ startDate: DateTime?                       │
│ endDate: DateTime?                         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│          💰 Order                          │
├────────────────────────────────────────────┤
│ id: String                                 │
│ stripeSessionId: String (unique)           │
│ amount: Float                              │
│ status: OrderStatus (enum)                 │
│ customerEmail: String                      │
│ customerName: String?                      │
│ serviceIds: String[]                       │
│ paidAt: DateTime?                          │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│     📧 NewsletterSubscriber                │
├────────────────────────────────────────────┤
│ id: String                                 │
│ email: String (unique)                     │
│ name: String?                              │
│ source: String (checkout/footer/popup)     │
│ isSubscribed: Boolean                      │
│ unsubscribeToken: String (unique)          │
│ subscribedAt: DateTime                     │
│ consentGiven: Boolean (RGPD)               │
└────────────────────────────────────────────┘
```

### **2. RLS (Row Level Security)**

```sql
-- Services & Promotions
✅ Lecture publique (affichage sur le site)
✅ Modification: service_role uniquement

-- Orders & Newsletter
✅ Aucun accès public
✅ service_role uniquement (via serveur)
```

---

## 🔐 Système d'Authentification

### **Architecture Auth**

```
┌─────────────────────────────────────────────────────────┐
│                  UTILISATEUR                            │
│                                                         │
│  Email: sabcompan8306@gmail.com                         │
│  Password: (géré via gestionnaire de mots de passe)     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            🔑 SUPABASE AUTH                             │
│                                                         │
│  ┌──────────────────────────────────────────┐          │
│  │  app_metadata:                           │          │
│  │    role: "ADMIN" | "DEVELOPER"           │          │
│  └──────────────────────────────────────────┘          │
│                                                         │
│  Session Cookie (httpOnly, secure)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│          🛡️ MIDDLEWARE PROTECTION                       │
│                                                         │
│  /admin/* → Check:                                      │
│    ✓ User authenticated?                               │
│    ✓ hasAdminAccess(user)?                             │
│    ✓ Role = ADMIN or DEVELOPER?                        │
│                                                         │
│  ❌ Non autorisé → Redirect /login                     │
└─────────────────────────────────────────────────────────┘
```

### **Rôles et Permissions**

```
┌─────────────────┬──────────────┬──────────────┐
│ Permission      │ ADMIN        │ DEVELOPER    │
├─────────────────┼──────────────┼──────────────┤
│ View Dashboard  │ ✅           │ ✅           │
│ CRUD Services   │ ✅           │ ✅           │
│ CRUD Promotions │ ✅           │ ✅           │
│ View Newsletter │ ✅           │ ✅           │
│ View Orders     │ ✅           │ ✅           │
│ Manage Users    │ ✅           │ ❌           │
└─────────────────┴──────────────┴──────────────┘
```

---

## 💳 Flux de Paiement Stripe

### **Parcours Complet**

```
1️⃣ CLIENT AJOUTE AU PANIER
   └─> CartContext (React Context)
       └─> Local state (items[], total)

2️⃣ CLIENT CLIQUE "PAYER"
   └─> FloatingCart scroll vers formulaire
       └─> Contact form pré-rempli avec panier

3️⃣ DEUX OPTIONS:

   A) "RÉSERVER ET RÉGLER SUR PLACE"
      └─> Server Action: sendContactEmail()
          ├─> Email à Sabrina (notification)
          └─> Email au client (confirmation)

   B) "RÉSERVER & PAYER EN LIGNE"
      └─> POST /api/checkout
          ├─> Validation Zod
          ├─> Fetch prix DB (sécurité!)
          ├─> Create Stripe Session
          │   ├─> payment_methods: [card, paypal]
          │   ├─> custom_field: newsletter_consent
          │   └─> success_url / cancel_url
          └─> Redirect → Stripe Checkout

4️⃣ STRIPE CHECKOUT
   ├─> Client entre ses infos
   ├─> Newsletter: Oui/Non (dropdown)
   └─> Paiement (carte ou PayPal)

5️⃣ PAIEMENT RÉUSSI
   └─> Stripe appelle webhook:
       POST /api/webhooks/stripe

       ├─> Vérification signature (whsec_...)
       ├─> Create Order (Prisma)
       ├─> Newsletter opt-in (si "yes")
       ├─> Email à Sabrina
       └─> Email confirmation client

6️⃣ REDIRECTION CLIENT
   └─> /success?session_id=xxx
       └─> Message de succès
```

### **Sécurité Stripe**

```
✅ Prix validés côté serveur (jamais trust client!)
✅ Webhook signature vérifiée (whsec_...)
✅ Rate limiting (10 req/h par IP)
✅ Validation Zod stricte
✅ HTTPS obligatoire
```

---

## 📧 Système d'Emails (Resend)

### **Architecture Email**

```
┌─────────────────────────────────────────────────────────┐
│              DÉCLENCHEURS D'EMAILS                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Réservation (formulaire)                           │
│     └─> sendContactEmail()                             │
│                                                         │
│  2. Paiement Stripe complété                           │
│     └─> webhook → sendReservationToSabrina()           │
│                  + sendConfirmationToCustomer()        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 📧 RESEND API                           │
│                                                         │
│  FROM: onboarding@resend.dev (temporaire)              │
│  TO BE: contact@sab-fit.com (domaine vérifié)          │
│                                                         │
│  Rate limit: 3000 emails/mois (plan gratuit)           │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌─────────────────┐      ┌─────────────────┐
│  📨 SABRINA     │      │  📨 CLIENT      │
│                 │      │                 │
│  Notification   │      │  Confirmation   │
│  - Nom client   │      │  - Récap panier │
│  - Téléphone    │      │  - Message      │
│  - Email        │      │  - Total        │
│  - Panier       │      │  - Contact      │
│  - Message      │      │                 │
└─────────────────┘      └─────────────────┘
```

### **Templates HTML**

```
src/lib/resend.ts
│
├── sendReservationToSabrina()    # Email à Sabrina
│   └─> HTML professionnel
│       ├─> Header bleu foncé
│       ├─> Infos client (nom, tel, email)
│       ├─> Panier détaillé
│       ├─> Message client
│       └─> Bouton "Répondre au client"
│
└── sendConfirmationToCustomer()  # Email au client
    └─> HTML professionnel
        ├─> Header bleu
        ├─> Message personnalisé
        ├─> Récap panier
        ├─> Contact Sabrina
        └─> Footer RGPD
```

---

## 🛡️ Sécurité & Protection

### **1. Validation des Données (Zod)**

```typescript
// src/lib/validations/schemas.ts

┌─────────────────────────────────────────┐
│  serviceSchema                          │
│  ✓ title: 3-100 caractères             │
│  ✓ price: format "XX €"                │
│  ✓ features: max 20 items              │
│  ✓ XSS protection (trim, sanitize)     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  checkoutSchema                         │
│  ✓ items: array d'objets               │
│  ✓ id: CUID format                     │
│  ✓ quantity: 1-100                     │
│  ✓ min: 1 item, max: 50 items          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  contactSchema                          │
│  ✓ name: 2-100 chars                   │
│  ✓ email: format valide                │
│  ✓ phone: min 10 chars                 │
│  ✓ message: 10-5000 chars              │
└─────────────────────────────────────────┘
```

### **2. Rate Limiting**

```typescript
// src/lib/rate-limit.ts

┌──────────────────┬──────────┬───────────┐
│ Endpoint         │ Limite   │ Période   │
├──────────────────┼──────────┼───────────┤
│ /login           │ 5 req    │ 15 min    │
│ /api/checkout    │ 10 req   │ 1 heure   │
│ /admin (actions) │ 100 req  │ 10 min    │
└──────────────────┴──────────┴───────────┘

Méthode: In-memory Map (simple, efficace)
Clé: IP address + endpoint
```

### **3. Protection Admin**

```typescript
// Middleware + Page Protection

1. src/lib/supabase/middleware.ts
   ├─> Intercept /admin/*
   ├─> Check session cookie
   ├─> Verify hasAdminAccess(user)
   └─> Redirect if unauthorized

2. src/app/admin/page.tsx
   ├─> export const dynamic = 'force-dynamic'
   ├─> Server-side auth check
   └─> Double protection!

3. src/lib/auth/roles.ts
   └─> getUserRole(user)
       ├─> Read app_metadata.role
       └─> Return ADMIN | DEVELOPER | null
```

### **4. Sécurité Stripe**

```
✅ Webhook signature verification (crypto)
✅ Prix fetched depuis DB (pas du client!)
✅ HTTPS only (SSL Netlify)
✅ Environment variables (secrets protégés)
✅ Service role key isolation
```

---

## 📊 Monitoring & Analytics

### **Logs Disponibles**

```
1. Netlify Function Logs
   ├─> /api/checkout errors
   ├─> /api/webhooks/stripe
   └─> Deploy logs

2. Stripe Dashboard
   ├─> Payments history
   ├─> Webhook deliveries
   └─> Failed payments

3. Supabase Logs
   ├─> Auth attempts
   ├─> Database queries
   └─> RLS policy violations

4. Resend Dashboard
   ├─> Email deliveries
   ├─> Bounces
   └─> Quota usage
```

---

## 🚀 Déploiement (Netlify)

### **Pipeline CI/CD**

```
┌─────────────────────────────────────────────────────────┐
│                  DÉVELOPPEMENT                          │
│                                                         │
│  1. Code en local (VSCode)                             │
│  2. Test: npm run dev (localhost:3000)                 │
│  3. Commit: git add . && git commit -m "..."           │
│  4. Push: git push origin main                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  GITHUB                                 │
│                                                         │
│  Repository: johanito/sabrina                          │
│  Branch: main                                          │
└────────────────────┬────────────────────────────────────┘
                     │ (webhook)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              NETLIFY AUTO-DEPLOY                        │
│                                                         │
│  1. Detect push to main                                │
│  2. npm install                                        │
│  3. npm run build                                      │
│  4. Deploy to CDN                                      │
│  5. ✅ Live: https://www.sab-fit.com                   │
│                                                         │
│  Build time: ~2-3 minutes                              │
└─────────────────────────────────────────────────────────┘
```

### **Variables d'Environnement Production**

```
Netlify Environment Variables:
├─> DATABASE_URL (Supabase pooler)
├─> DIRECT_URL (Supabase direct)
├─> NEXT_PUBLIC_SUPABASE_URL
├─> NEXT_PUBLIC_SUPABASE_ANON_KEY
├─> SUPABASE_SERVICE_ROLE_KEY
├─> STRIPE_SECRET_KEY (sk_live_...)
├─> NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
├─> STRIPE_WEBHOOK_SECRET (whsec_...)
├─> RESEND_API_KEY
└─> NEXT_PUBLIC_URL (https://www.sab-fit.com)
```

---

## 🎯 Performance & Optimisations

### **1. Next.js Optimisations**

```
✅ App Router (Server Components par défaut)
✅ Images optimisées (next/image)
✅ Static Generation (pages publiques)
✅ Server Actions (pas de routes API inutiles)
✅ CSS-in-JS avec Tailwind (bundle optimisé)
```

### **2. PWA Caching**

```javascript
// public/sw.js

Cache Strategy:
├─> Static assets: Cache First
│   └─> manifest.json, icons, CSS
│
├─> API calls: Network First
│   └─> /api/*, données dynamiques
│
└─> Pages: Network First, Cache Fallback
    └─> Offline mode avec page cached
```

### **3. Database Optimisations**

```sql
-- Indexes Prisma

Services:
  @@index([category])

Orders:
  @@index([customerEmail])
  @@index([status])
  @@index([createdAt])

Newsletter:
  @@index([email])
  @@index([isSubscribed])
```

---

## 📱 Responsive Design

### **Breakpoints Tailwind**

```
sm:  640px   → Mobile large
md:  768px   → Tablet
lg:  1024px  → Desktop
xl:  1280px  → Large desktop
2xl: 1536px  → Extra large
```

### **Layout Adaptatif**

```
Mobile (<768px):
├─> Single column
├─> Floating cart (bottom)
├─> Burger menu
└─> Touch-optimized buttons

Desktop (>768px):
├─> Multi-column grids
├─> Hover effects
├─> Fixed navigation
└─> Larger images
```

---

## 🔮 Évolutions Futures

### **Phase 2 (Court Terme)**

```
☐ Email professionnel (contact@sab-fit.com)
☐ Domaine Resend vérifié
☐ Rotation credentials exposés
☐ Google Business Profile
☐ Analytics (Google Analytics ou Plausible)
```

### **Phase 3 (Moyen Terme)**

```
☐ Dashboard commandes (/admin/orders)
☐ Système de réservation créneaux
☐ Templates emails pré-conçus
☐ Envoi newsletter depuis admin
☐ Segmentation clients
```

### **Phase 4 (Long Terme)**

```
☐ Programme fidélité (points)
☐ Espace client (historique)
☐ Paiement en plusieurs fois
☐ Intégration calendrier (Google Calendar)
☐ Messagerie client-coach
```

---

## 📚 Stack Technique Complète

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND                              │
├─────────────────────────────────────────────────────────┤
│ ⚛️  React 18                                            │
│ ⚡ Next.js 16 (App Router)                              │
│ 🎨 Tailwind CSS 3                                       │
│ 📱 PWA (manifest + service worker)                      │
│ 🎭 Framer Motion (animations)                           │
│ 🎊 Canvas Confetti (célébrations)                       │
│ 🍞 Sonner (toasts)                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   BACKEND                               │
├─────────────────────────────────────────────────────────┤
│ 🔧 Next.js Server Actions                               │
│ 🛣️  Next.js Route Handlers (API)                        │
│ 🗄️  Prisma ORM 5.22                                     │
│ 🐘 PostgreSQL (via Supabase)                            │
│ 🔐 Supabase Auth                                         │
│ ✅ Zod (validation)                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               SERVICES EXTERNES                         │
├─────────────────────────────────────────────────────────┤
│ 💳 Stripe (Paiements + PayPal)                          │
│ 📧 Resend (Emails transactionnels)                      │
│ 🌐 Netlify (Hébergement + CI/CD)                        │
│ 🗄️  Supabase (Database + Auth)                          │
│ 🌍 Infomaniak (Domaine DNS)                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 DÉVELOPPEMENT                           │
├─────────────────────────────────────────────────────────┤
│ 📝 TypeScript 5                                         │
│ 🧹 ESLint                                                │
│ 💅 Prettier (via Claude)                                │
│ 📦 npm (package manager)                                │
│ 🔀 Git + GitHub                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔗 URLs Importantes

```
Production:
  🌐 Site public: https://www.sab-fit.com
  🔐 Admin: https://www.sab-fit.com/admin
  📄 CGU: https://www.sab-fit.com/cgu

Services:
  💳 Stripe: https://dashboard.stripe.com
  🗄️  Supabase: https://supabase.com/dashboard
  📧 Resend: https://resend.com/dashboard
  🌐 Netlify: https://app.netlify.com

Repository:
  📦 GitHub: https://github.com/[username]/sabrina
```

---

## 👥 Contacts & Support

```
👤 Sabrina (Admin)
   Email: sabcompan8306@gmail.com
   Rôle: ADMIN

👨‍💻 Johan (Développeur)
   Email: johan.dev.pro@gmail.com
   Rôle: DEVELOPER
```

---

**🎉 Application Sab-Fit PWA - Architecture v1.0.0**

*Dernière mise à jour: 2026-01-29*
