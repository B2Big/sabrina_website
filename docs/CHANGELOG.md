# 📜 Changelog - Sab-Fit PWA

> Historique complet de tous les développements et déploiements de l'application Sab-Fit

---

## 🎯 Vue d'Ensemble Rapide

### Status Production
| Composant | Status | URL/Info |
|-----------|--------|----------|
| **Site Web** | ✅ EN LIGNE | https://www.sab-fit.com |
| **Domaine** | ✅ Actif | sab-fit.com (Infomaniak) |
| **Hébergement** | ✅ Déployé | Netlify |
| **Base de Données** | ✅ Opérationnelle | Supabase PostgreSQL |
| **Authentification** | ✅ Active | Supabase Auth (2 users) |
| **Paiements** | ✅ LIVE | Stripe (LIVE keys) |
| **Emails** | ✅ Actif | Resend (domaine en vérification) |
| **SSL/HTTPS** | ✅ Actif | Certificat Netlify |
| **RLS Database** | ✅ Activé | Toutes les tables protégées |

### Checklist Développement Complète

#### ✅ Phase 1: Sécurité & Authentification (27 Jan)
- [x] Système d'authentification Supabase avec rôles
- [x] Middleware de protection des routes /admin
- [x] Page de login fonctionnelle
- [x] Création de 2 utilisateurs admin (Sabrina + Developer)
- [x] Validation Zod sur tous les inputs
- [x] Audit de sécurité complet du code
- [x] Server-side validation des prix Stripe
- [x] Protection contre manipulation de prix côté client

#### ✅ Phase 2: Newsletter & Emails (27 Jan)
- [x] Modèle NewsletterSubscriber (RGPD compliant)
- [x] Intégration newsletter dans Stripe checkout
- [x] Webhook Stripe pour capture des abonnements
- [x] Dashboard admin - Onglet Newsletter
- [x] Migration vers Resend (remplace FormSubmit.co)
- [x] Templates HTML professionnels pour emails
- [x] Double envoi (notification Sabrina + confirmation client)
- [x] Panier intégré dans le formulaire de contact
- [x] Page CGU complète (mentions légales + RGPD)

#### ✅ Phase 3: Production Deployment (29 Jan)
- [x] Achat et configuration domaine sab-fit.com
- [x] Configuration DNS sur Infomaniak
- [x] Déploiement Netlify avec 20 variables d'environnement
- [x] Stripe LIVE - Configuration compte production
- [x] Stripe LIVE - Création et configuration webhook
- [x] Séparation TEST (local) / LIVE (production)
- [x] Rotation clé Resend (sécurité GitHub)
- [x] Configuration DNS Resend pour domaine
- [x] Résolution erreur "Invalid API key" en production
- [x] Activation Row Level Security (RLS) sur Supabase
- [x] Politiques RLS pour toutes les tables

#### ✅ Phase 4: Documentation (29 Jan)
- [x] ARCHITECTURE.md - Documentation technique complète (786 lignes)
- [x] CHANGELOG.md - Historique complet de développement
- [x] .env.production - Template variables production
- [x] CREDENTIAL_ROTATION.md - Nettoyage secrets exposés
- [x] enable-rls.sql - Script SQL pour activer RLS

#### ⏳ Tâches en Attente
- [ ] **PRIORITÉ HAUTE**: Vérifier domaine Resend (attendre 24-48h DNS)
- [ ] **PRIORITÉ HAUTE**: Créer email contact@sab-fit.com
- [ ] **PRIORITÉ HAUTE**: Mettre à jour FROM_EMAIL dans src/lib/resend.ts
- [ ] **PRIORITÉ HAUTE**: Test paiement réel avec petit montant (5€)
- [ ] **PRIORITÉ MOYENNE**: Google Business Profile pour SEO local
- [ ] **PRIORITÉ MOYENNE**: Ajouter services réels via dashboard admin
- [ ] **PRIORITÉ MOYENNE**: Tester intégration PayPal en production
- [ ] **PRIORITÉ BASSE**: Analytics (Google Analytics / Plausible)
- [ ] **PRIORITÉ BASSE**: Monitoring erreurs (Sentry)

### Contacts & Accès Rapides

#### Services Configurés
| Service | URL Dashboard | Email / Compte |
|---------|---------------|----------------|
| **Netlify** | https://app.netlify.com | johan.dev.pro@gmail.com |
| **Supabase** | https://supabase.com/dashboard | johan.dev.pro@gmail.com |
| **Stripe** | https://dashboard.stripe.com | sabcompan8306@gmail.com |
| **Resend** | https://resend.com/domains | johan.dev.pro@gmail.com |
| **Infomaniak** | https://www.infomaniak.com | (compte domaine) |

#### Identifiants Admin
| Utilisateur | Email | Rôle |
|-------------|-------|------|
| **Sabrina** | sabcompan8306@gmail.com | ADMIN |
| **Developer** | johan.dev.pro@gmail.com | DEVELOPER |

#### Variables Critiques
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abfhvkrrlnuldwgzpxaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe LIVE (Production uniquement)
STRIPE_SECRET_KEY=sk_live_51SugwQFfIdJQX82q...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SugwQFfIdJQX82q...
STRIPE_WEBHOOK_SECRET=(obtenu de Stripe webhook)

# Stripe TEST (Local uniquement)
STRIPE_SECRET_KEY=sk_test_51Su9XeJuxdNEmvsbe...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Su9XeJuxdNEmvsbt...

# Resend
RESEND_API_KEY=re_4jhB5LDS_4Q9oZmH5wD2EWuZcN58H9dPp

# Database
DATABASE_URL=postgresql://postgres:12345%40johanXXX@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Métriques

#### Temps de Développement
- **Session 1 (27 Jan)**: ~4-5 heures - Sécurité & Authentification
- **Session 2 (29 Jan)**: ~3-4 heures - Production Deployment

#### Lignes de Code Ajoutées/Modifiées
- **Fichiers créés**: 12 nouveaux fichiers
- **Fichiers modifiés**: 18 fichiers
- **Documentation**: 4 fichiers .md (1500+ lignes)
- **Scripts**: 2 scripts (setup-admin-users.ts, enable-rls.sql)

#### Tests Effectués
- ✅ Authentification admin (local + production)
- ✅ CRUD services via dashboard
- ✅ Ajout au panier et checkout flow
- ✅ Envoi emails (Resend)
- ✅ Webhook Stripe (test local)
- ✅ RLS policies (accès public/service_role)
- ⏳ Paiement réel (en attente)

---

## [Production Release] - 2026-01-29 🚀

**Status**: ✅ EN LIGNE sur https://www.sab-fit.com

### 🎯 Objectifs de la Session
- Configurer tous les services de production (Stripe LIVE, Netlify, domaine)
- Déployer l'application en production
- Résoudre les problèmes de sécurité (RLS Supabase)
- Créer la documentation technique complète

---

### ✅ Configurations Production Complétées

#### 1. Stripe LIVE - Configuration Complète
- ✅ Création compte Stripe production
- ✅ Clés LIVE configurées sur Netlify
  - `STRIPE_SECRET_KEY`: sk_live_51SugwQFfIdJQX82q...
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: pk_live_51SugwQFfIdJQX82q...
- ✅ Webhook configuré: https://www.sab-fit.com/api/webhooks/stripe
- ✅ Signature webhook obtenue et configurée
- ✅ Événements écoutés: `checkout.session.completed`
- ✅ Séparation TEST (local) / LIVE (production) dans .env

**Fichiers modifiés**:
- `.env` et `.env.local`: Clés TEST uniquement (commentaires LIVE)
- `.env.production`: Clés LIVE pour Netlify

#### 2. Domaine et Hébergement
- ✅ Domaine acheté: **sab-fit.com**
- ✅ DNS configurés sur Infomaniak
- ✅ SSL/HTTPS activé automatiquement par Netlify
- ✅ Site accessible: https://www.sab-fit.com
- ✅ Variables d'environnement importées sur Netlify (20 variables)

#### 3. Sécurité Resend (Rotation de Clé)
**Problème**: GitHub a détecté une clé API exposée dans le repository
- ❌ Ancienne clé révoquée: `re_T87XcjJ6_XczUGHKk2gKmmKyF1ti9fZvE`
- ✅ Nouvelle clé créée: `re_4jhB5LDS_4Q9oZmH5wD2EWuZcN58H9dPp`
- ✅ Permission: "Sending Access" (recommandé pour sécurité)
- ✅ Fichiers nettoyés: docs/CREDENTIAL_ROTATION.md, .env, .env.local, .env.production
- ✅ DNS Resend configurés sur Infomaniak pour sab-fit.com
- ⏳ En attente: Vérification du domaine (propagation DNS 24-48h)

**Fichiers modifiés**:
- `docs/CREDENTIAL_ROTATION.md`: Placeholders au lieu de vraies clés
- `.env`, `.env.local`, `.env.production`: Nouvelle clé Resend

#### 4. Row Level Security (RLS) Supabase
**Problème**: 6 alertes de sécurité Supabase - RLS désactivé sur toutes les tables

**Solution implémentée**: Script SQL complet pour activer RLS + politiques

**Fichier créé**: `scripts/enable-rls.sql` (79 lignes)

**Politiques de sécurité**:
- ✅ `services`: Lecture publique, écriture service_role uniquement
- ✅ `promotions`: Lecture publique, écriture service_role uniquement
- ✅ `orders`: Accès service_role uniquement (données sensibles)
- ✅ `newsletter_subscribers`: Accès service_role uniquement (RGPD)

**Commande exécutée** (via Supabase SQL Editor):
```sql
-- Activation RLS sur 4 tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- + Politiques détaillées pour chaque table
```

---

### 🐛 Problèmes Résolus (Session 2)

#### Erreur 1: Webhook URL Incorrecte
**Symptômes**: Webhook Stripe mal configuré
- ❌ URL initiale incorrecte: `https://sab-fit.com/api/webhook`
- ✅ URL corrigée: `https://www.sab-fit.com/api/webhooks/stripe`

**Problèmes identifiés**:
1. Manque du sous-domaine `www.`
2. Mauvais chemin: `/api/webhook` au lieu de `/api/webhooks/stripe`

**Résolution**: User a recréé le webhook avec la bonne URL

---

#### Erreur 2: Invalid API Key en Production
**Symptômes**: Erreur "Invalid api key" lors de la connexion admin sur www.sab-fit.com

**Cause**: Variables d'environnement Supabase mal configurées sur Netlify

**Diagnostic**:
```
NEXT_PUBLIC_SUPABASE_URL=https://abfhvkrrlnuldwgzpxaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (vérifier pas d'espaces)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (vérifier pas de troncature)
```

**Résolution**:
- Vérification de toutes les variables sur Netlify
- Redéploiement après correction
- ✅ Connexion admin fonctionnelle

---

#### Erreur 3: Services Disparus en Production
**Symptômes**: "toute les offres que j'avais crée on disparu"

**Cause**: Liée à l'erreur #2 (Invalid API key empêchant l'accès DB)

**Résolution**: Après correction des variables Supabase, les services sont réapparus

---

#### Erreur 4: Clés Stripe LIVE en Local
**Symptômes**: User avait décommenté les clés LIVE dans `.env.local`

**Risque**: Transactions réelles lors des tests locaux

**Résolution**:
- Re-commenté les clés LIVE dans `.env.local`
- Gardé uniquement les clés TEST actives pour développement
- Documentation ajoutée pour éviter future confusion

**Fichier modifié**: `.env.local` (lignes 23-25)

---

#### Erreur 5: Confusion Variables Webhook
**Symptômes**: User demande "je lui donne la clé privé de stripe?" pour webhook

**Cause**: Confusion sur le sens du webhook secret

**Clarification fournie**:
- ❌ FAUX: On ne donne PAS de clé À Stripe
- ✅ VRAI: Stripe DONNE une clé signature à nous
- Cette clé sert à vérifier que les webhooks viennent bien de Stripe

---

### 📚 Documentation Créée (Session 2)

#### 1. ARCHITECTURE.md (786 lignes)
**Fichier**: `docs/ARCHITECTURE.md`

**Contenu complet**:
- Vue d'ensemble du système (ASCII diagram)
- Stack technique détaillée
- Architecture Next.js App Router
- Flux d'authentification (diagramme séquence)
- Flux de paiement Stripe (diagramme séquence)
- Flux webhook (diagramme séquence)
- Flux newsletter (diagramme séquence)
- Système d'emails avec Resend
- Schéma base de données Prisma
- Configuration déploiement Netlify
- Sécurité et bonnes pratiques
- Structure de fichiers complète
- Flows utilisateur détaillés
- Configuration environnement
- Tests et monitoring

**Diagrammes ASCII inclus**:
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────▶│   Next.js    │─────▶│  Supabase   │
│  (Browser)  │      │ (App Router) │      │   (Auth)    │
└─────────────┘      └──────────────┘      └─────────────┘
       │                     │                      │
       │                     ├─────────────────────▶│
       │                     │                      │  PostgreSQL
       │                     │     Stripe API       └─────────────┘
       │                     ├─────────────────────▶
       │                     │                      ┌─────────────┐
       │                     │     Resend API       │   Stripe    │
       │                     ├─────────────────────▶│  (Payment)  │
       │                     │                      └─────────────┘
       └────────────────────▶│                      ┌─────────────┐
                Netlify      │                      │   Resend    │
              (Hosting)      │                      │   (Email)   │
                             └─────────────────────▶└─────────────┘
```

#### 2. CHANGELOG.md (Ce fichier)
Historique complet de toutes les sessions de développement

#### 3. .env.production
Template pour les variables de production sur Netlify

---

### 🔄 Tests Effectués

#### Tests de Production
- ✅ Connexion admin sur www.sab-fit.com
- ✅ Création/modification de services
- ✅ Affichage des services sur la page principale
- ✅ Ajout au panier fonctionnel
- ✅ Formulaire de contact opérationnel
- ⏳ Test paiement réel (à faire avec petit montant)

#### Tests de Sécurité
- ✅ Accès /admin sans authentification → Redirige vers /login
- ✅ Accès /admin avec email non autorisé → Redirige vers /
- ✅ RLS activé sur toutes les tables sensibles
- ✅ Service role key jamais exposée côté client
- ✅ Validation Zod sur tous les inputs

---

### 📊 État Actuel de Production

#### Services Configurés
| Service | Status | Environnement | Notes |
|---------|--------|---------------|-------|
| Netlify | ✅ LIVE | Production | www.sab-fit.com |
| Supabase Auth | ✅ LIVE | Production | RLS activé |
| Supabase DB | ✅ LIVE | Production | Port 6543 (Pooler) |
| Stripe | ✅ LIVE | Production | Webhook configuré |
| Resend | ✅ LIVE | Production | Domaine en vérification |
| DNS | ✅ LIVE | Infomaniak | SSL actif |

#### Variables d'Environnement Netlify (20)
```
DATABASE_URL                          ✅
DIRECT_URL                            ✅
NEXT_PUBLIC_SUPABASE_URL              ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY         ✅
SUPABASE_SERVICE_ROLE_KEY             ✅
STRIPE_SECRET_KEY                     ✅ (LIVE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY    ✅ (LIVE)
STRIPE_WEBHOOK_SECRET                 ✅
RESEND_API_KEY                        ✅
NEXT_PUBLIC_URL                       ✅
```

#### Utilisateurs Admin Créés
1. **Sabrina** (ADMIN)
   - Email: sabcompan8306@gmail.com
   - Role: ADMIN
   - Accès: Dashboard complet

2. **Developer** (DEVELOPER)
   - Email: johan.dev.pro@gmail.com
   - Role: DEVELOPER
   - Accès: Dashboard complet

---

### 📝 Tâches en Attente

#### Priorité Haute
- [ ] **Vérifier domaine Resend**: Attendre propagation DNS (24-48h), puis vérifier sur dashboard Resend
- [ ] **Créer email professionnel**: contact@sab-fit.com (ce soir selon user)
- [ ] **Mettre à jour FROM_EMAIL**: Remplacer `onboarding@resend.dev` par `contact@sab-fit.com` dans `src/lib/resend.ts`
- [ ] **Test paiement réel**: Effectuer un premier paiement test avec petit montant (5€)

#### Priorité Moyenne
- [ ] **Google Business Profile**: Créer profil pour référencement local
- [ ] **Ajouter services réels**: Sabrina doit ajouter ses offres via dashboard admin
- [ ] **Tester PayPal**: Vérifier intégration PayPal en production

#### Priorité Basse
- [ ] **Analytics**: Ajouter Google Analytics ou Plausible
- [ ] **Monitoring**: Configurer alertes pour erreurs production (Sentry)

---

## [Security Release] - 2026-01-27 🔒

**Status**: ✅ COMPLÉTÉ - Système d'authentification et sécurité implémentés

### 🎯 Objectifs de la Session
- Sécuriser le dashboard admin (actuellement accessible publiquement)
- Créer système de login avec credentials pour Sabrina (admin) et developer
- Audit de sécurité complet du code
- Intégration Stripe pour paiements

---

### ✅ Fonctionnalités Majeures Implémentées

#### 1. Système d'Authentification Supabase
**Nouveau système role-based avec Supabase Auth**

**Fichier créé**: `src/lib/auth/roles.ts` (55 lignes)
```typescript
export enum Role {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER'
}

export function hasAdminAccess(user: User | null): boolean {
  const role = getUserRole(user)
  return role === Role.ADMIN || role === Role.DEVELOPER
}
```

**Fonctionnalités**:
- ✅ Enum des rôles (ADMIN, DEVELOPER)
- ✅ Fonction `getUserRole()` - récupère le rôle depuis `app_metadata`
- ✅ Fonction `hasAdminAccess()` - vérifie si user a accès admin
- ✅ Fonction `isAuthorizedEmail()` - whitelist d'emails autorisés
- ✅ Logs de sécurité pour tentatives d'accès non autorisées

---

#### 2. Middleware de Protection
**Fichier modifié**: `src/lib/supabase/middleware.ts`

**Protection implémentée**:
```typescript
if (request.nextUrl.pathname.startsWith('/admin')) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log('❌ Accès refusé: Utilisateur non authentifié')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!hasAdminAccess(user)) {
    console.warn(`⚠️  Tentative d'accès non autorisée par ${user.email}`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  console.log(`✅ Accès admin autorisé pour ${user.email}`)
}
```

**Comportement**:
- Non authentifié → Redirige vers `/login`
- Email non autorisé → Redirige vers `/`
- Admin/Developer → Accès accordé avec log

---

#### 3. Dashboard Admin Sécurisé
**Fichier modifié**: `src/app/admin/page.tsx`

**Changements**:
```typescript
export const dynamic = 'force-dynamic' // Désactive cache Next.js

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (!hasAdminAccess(user)) redirect('/')

  // Double vérification server-side
  // ...
}
```

**Sécurité**:
- ✅ Server Component (pas de code client)
- ✅ Force dynamic rendering (pas de cache)
- ✅ Double vérification: middleware + page
- ✅ Redirection explicite si non autorisé

---

#### 4. Newsletter System (RGPD Compliant)
**Contexte**: User a demandé si besoin de comptes clients → Recommandé newsletter à la place

**Fichier modifié**: `prisma/schema.prisma`
```prisma
model NewsletterSubscriber {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  source            String    @default("checkout")
  isSubscribed      Boolean   @default(true)
  unsubscribeToken  String    @unique @default(cuid())
  subscribedAt      DateTime  @default(now())
  unsubscribedAt    DateTime?
  consentGiven      Boolean   @default(true)
  ipAddress         String?

  @@map("newsletter_subscribers")
}
```

**Fonctionnalités RGPD**:
- ✅ Token de désinscription unique
- ✅ Consentement explicite enregistré
- ✅ Source de souscription trackée (checkout, formulaire, etc.)
- ✅ Date de souscription et désinscription
- ✅ IP address optionnelle pour audit

**Intégration Stripe Checkout**:
**Fichier modifié**: `src/app/api/checkout/route.ts`

Ajout d'un champ custom dans Stripe Checkout:
```typescript
custom_fields: [{
  key: 'newsletter_consent',
  label: {
    type: 'custom',
    custom: '📧 Recevoir nos offres par email'
  },
  type: 'dropdown',
  dropdown: {
    options: [
      { label: 'Oui, je m\'abonne', value: 'yes' },
      { label: 'Non merci', value: 'no' }
    ]
  }
}]
```

**Webhook Newsletter**:
**Fichier modifié**: `src/app/api/webhooks/stripe/route.ts`

Capture du consentement après paiement:
```typescript
const newsletterField = customFields.find(
  (field: any) => field.key === 'newsletter_consent'
)

if (newsletterField?.dropdown?.value === 'yes' && session.customer_details?.email) {
  await prisma.newsletterSubscriber.create({
    data: {
      email: session.customer_details.email,
      name: session.customer_details.name || '',
      source: 'checkout',
      consentGiven: true,
      isSubscribed: true
    }
  })
}
```

**Dashboard Admin - Onglet Newsletter**:
**Fichier modifié**: `src/components/admin/admin-dashboard.tsx`

Nouvel onglet "Newsletter" dans le dashboard avec:
- ✅ Liste des inscrits avec email, date, source
- ✅ Statistiques (total, nouveaux ce mois, taux de désabonnement)
- ✅ Bouton "Exporter CSV" (futur)
- ✅ Design cohérent avec le reste du dashboard

---

#### 5. Système d'Emails avec Resend
**Contexte**: Migration de FormSubmit.co vers Resend (plus professionnel)

**Fichier créé**: `src/lib/resend.ts` (287 lignes)

**Emails implémentés**:

**A. Email à Sabrina (Notification)**:
```typescript
export async function sendReservationToSabrina({
  customerName,
  customerEmail,
  customerPhone,
  message,
  cartItems,
  total,
})
```
- Design HTML professionnel avec logo
- Tableau des services commandés
- Informations client complètes
- Total de la commande
- Footer avec lien désabonnement

**B. Email au Client (Confirmation)**:
```typescript
export async function sendConfirmationToCustomer({
  customerName,
  customerEmail,
  message,
  cartItems,
  total,
})
```
- Message de remerciement personnalisé
- Résumé de la commande
- Coordonnées de Sabrina
- Branding Sab-Fit cohérent

**Fichier modifié**: `src/app/actions.ts`

Migration du formulaire de contact vers Resend:
```typescript
export async function sendContactEmail(prevState: any, formData: FormData) {
  // ... validation Zod ...

  // 1. Email à Sabrina
  await sendReservationToSabrina({ ... })

  // 2. Email au client
  await sendConfirmationToCustomer({ ... })

  return { success: true, message: '✅ Réservation envoyée !' }
}
```

---

#### 6. Panier Intégré au Formulaire
**Contexte**: Meilleure UX - éviter double saisie (formulaire + Stripe)

**Fichier modifié**: `src/components/contact-form.tsx`

**Changements**:
- ✅ Champ caché avec données du panier en JSON
- ✅ Clear automatique du panier après succès
- ✅ Confettis 🎉 après envoi réussi
- ✅ Toast de confirmation

**Fichier modifié**: `src/components/ui/floating-cart.tsx`

**Changement de comportement**:
```typescript
const handleCheckout = () => {
  // AVANT: Redirection vers Stripe
  // window.location.href = '/api/checkout'

  // APRÈS: Scroll vers formulaire de contact
  const contactSection = document.getElementById('contact')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' })
    // Effet visuel ring temporaire
    contactSection.classList.add('ring-4', 'ring-blue-500/30')
  }
}
```

---

#### 7. Validation Zod Renforcée
**Fichier créé**: `src/lib/validations/schemas.ts` (104 lignes)

**Schémas créés**:
```typescript
// Services
export const serviceSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.number().positive().max(10000),
  duration: z.number().int().positive().max(600),
  category: z.enum(['MASSAGE', 'CURE', 'MIXRUNNING', 'OTHER']),
  isActive: z.boolean().default(true)
})

// Checkout (fix pour IDs existants)
export const checkoutItemSchema = z.object({
  id: z.string().min(1, 'ID de service requis').max(100),
  quantity: z.number().int().positive().default(1)
})

// Promotions
export const promotionSchema = z.object({
  title: z.string().min(3).max(100),
  discount: z.number().int().min(1).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean().default(true)
})

// Contact Form
export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[\d\s\+\-\(\)]+$/),
  message: z.string().min(10).max(1000),
  cart: z.string().optional()
})
```

**Usage dans API routes**:
```typescript
// src/app/api/services/route.ts
const validatedData = serviceSchema.parse(body)
```

**Gestion d'erreurs améliorée**:
```typescript
try {
  const data = schema.parse(input)
} catch (error) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.issues[0].message }, // Utilise .issues pas .errors
      { status: 400 }
    )
  }
}
```

---

#### 8. Sécurité Stripe - Validation Serveur
**Fichier modifié**: `src/app/api/checkout/route.ts`

**Problème**: Client pouvait envoyer n'importe quel prix

**Solution**: Fetch des prix depuis la DB côté serveur
```typescript
// ❌ AVANT (Vulnérable)
const items = body.items.map(item => ({
  price: item.price, // Prix venant du client !!
  quantity: item.quantity
}))

// ✅ APRÈS (Sécurisé)
const { items } = checkoutSchema.parse(body) // Client envoie juste IDs

const servicesFromDb = await prisma.service.findMany({
  where: { id: { in: serviceIds } }
})

const line_items = servicesFromDb.map(service => ({
  price_data: {
    currency: 'eur',
    product_data: { name: service.title },
    unit_amount: Math.round(service.price * 100) // Prix depuis DB
  },
  quantity: 1
}))
```

---

#### 9. Script Setup Admin Users
**Fichier créé**: `scripts/setup-admin-users.ts` (93 lignes)

**Utilisateurs créés**:
```typescript
const ADMIN_USERS: AdminUser[] = [
  {
    email: 'sabcompan8306@gmail.com',
    password: '$@brinafit1418X',
    name: 'Sabrina',
    role: 'ADMIN'
  },
  {
    email: 'johan.dev.pro@gmail.com',
    password: '1418@johan$XXX',
    name: 'Developer',
    role: 'DEVELOPER'
  }
]
```

**Fonctionnalités du script**:
- ✅ Création des utilisateurs via Supabase Admin API
- ✅ Ajout du rôle dans `app_metadata`
- ✅ Confirmation par email désactivée (auto-confirm)
- ✅ Gestion des erreurs (utilisateur déjà existant)
- ✅ Logs détaillés du processus

**Commande d'exécution**:
```bash
npx tsx scripts/setup-admin-users.ts
```

---

#### 10. Page CGU (RGPD)
**Fichier créé**: `src/app/cgu/page.tsx` (358 lignes)

**Contenu légal complet**:
1. **Mentions Légales**
   - Éditeur du site
   - Hébergement
   - Contact

2. **Conditions d'Utilisation**
   - Acceptation des CGU
   - Description des services
   - Modification des CGU

3. **Protection des Données (RGPD)**
   - Données collectées
   - Finalités du traitement
   - Base légale
   - Durée de conservation
   - Droits des utilisateurs (accès, rectification, effacement, etc.)
   - Contact DPO

4. **Cookies**
   - Types de cookies utilisés
   - Gestion du consentement

5. **Propriété Intellectuelle**

6. **Responsabilité**

---

### 🐛 Problèmes Résolus (Session 1)

#### Erreur 1: TypeScript - ZodError.errors
**Symptômes**:
```
Property 'errors' does not exist on type 'ZodError<unknown>'
```

**Cause**: Mauvaise propriété utilisée sur ZodError

**Fix**:
```typescript
// ❌ AVANT
if (error instanceof ZodError) {
  return { error: error.errors[0].message }
}

// ✅ APRÈS
if (error instanceof ZodError) {
  return { error: error.issues[0].message }
}
```

**Fichiers corrigés**:
- `src/app/admin/actions.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/services/route.ts`

---

#### Erreur 2: Prisma Authentication Failed
**Symptômes**:
```
P1000: Authentication failed against database server at `db.abfhvkrrlnuldwgzpxaj.supabase.co`
```

**Cause**: Symbole @ dans le mot de passe non encodé en URL

**Mot de passe**: `12345@johanXXX`

**Fix dans .env**:
```bash
# ❌ AVANT
DATABASE_URL="postgresql://postgres:12345@johanXXX@db..."
DIRECT_URL="postgresql://postgres:12345@johanXXX@db..."

# ✅ APRÈS
DATABASE_URL="postgresql://postgres:12345%40johanXXX@db..."
DIRECT_URL="postgresql://postgres:12345%40johanXXX@db..."
```

**Encodage**: @ → %40 (URL encoding)

---

#### Erreur 3: Port 5432 Unreachable depuis WSL
**Symptômes**:
```
P1001: Can't reach database server at `db.xxx.supabase.co:5432`
```

**Cause**: Restrictions réseau WSL empêchant connexion directe port 5432

**Solution**: Utiliser PowerShell Windows au lieu de WSL
```powershell
# Dans PowerShell (pas WSL)
npx prisma db push
npx prisma generate
```

**Résultat**: ✅ Synchronisation réussie

---

#### Erreur 4: Checkout ID Validation Trop Stricte
**Symptômes**: User a reporté erreur lors de l'ajout au panier
> "quand jai add un service au panier"

**Cause**: Validation `.cuid()` trop stricte pour IDs existants

**Fix dans schemas.ts**:
```typescript
// ❌ AVANT
export const checkoutItemSchema = z.object({
  id: z.string().cuid('ID de service invalide')
})

// ✅ APRÈS
export const checkoutItemSchema = z.object({
  id: z.string().min(1, 'ID de service requis').max(100, 'ID trop long')
})
```

---

#### Erreur 5: Stripe Custom Field Label Trop Long
**Symptômes**: Erreur Stripe lors de création checkout session

**Erreur**:
```
Invalid string: 📧 Je souhaite recevoir les offres... must be at most 50 characters
```

**Cause**: Label newsletter trop long (80+ caractères), limite Stripe = 50

**Fix**:
```typescript
// ❌ AVANT (80 caractères)
custom: '📧 Je souhaite recevoir les offres et nouveautés par email'

// ✅ APRÈS (32 caractères)
custom: '📧 Recevoir nos offres par email'
```

---

### 🔒 Améliorations de Sécurité

#### 1. Rate Limiting (Basique)
**Fichier**: `src/lib/rate-limit.ts` (créé)

**Implémentation**:
```typescript
const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, limit = 10, windowMs = 60000) {
  const now = Date.now()
  const record = rateLimit.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false // Rate limit atteint
  }

  record.count++
  return true
}
```

**Usage**:
```typescript
// Dans API routes
if (!checkRateLimit(request.ip || 'anonymous', 10, 60000)) {
  return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 })
}
```

#### 2. Server Actions vs Client Components
**Principe**: Toutes les opérations sensibles en Server Components

**Implémentation**:
- ✅ Dashboard admin: Server Component
- ✅ API routes: Validation serveur
- ✅ Prix Stripe: Fetch depuis DB côté serveur
- ✅ Service role key: Jamais exposée client

#### 3. Middleware Logging
**Ajout de logs de sécurité**:
```typescript
console.log('✅ Accès admin autorisé pour', user.email)
console.warn('⚠️  Tentative d'accès non autorisée par', user.email)
console.log('❌ Accès refusé: Utilisateur non authentifié')
```

---

### 📊 État Après Session 1

#### Base de Données Supabase
- ✅ 4 tables créées: services, promotions, orders, newsletter_subscribers
- ✅ Relations configurées (Order → Services)
- ✅ Indexes pour performance
- ✅ Connexion via Pooler (port 6543) fonctionnelle

#### Authentification
- ✅ 2 utilisateurs admin créés
- ✅ Login page fonctionnelle
- ✅ Middleware de protection actif
- ✅ Rôles configurés dans app_metadata

#### Stripe (Mode TEST)
- ✅ Clés TEST configurées localement
- ✅ Checkout session fonctionnel
- ✅ Webhook local configuré
- ✅ Newsletter consent intégré
- ⏳ Webhook production (à configurer en Session 2)

#### Emails
- ✅ Resend configuré (clé API)
- ✅ Templates HTML professionnels
- ✅ Double envoi (Sabrina + Client)
- ✅ Panier intégré dans emails

---

### 🔍 Audit de Sécurité Effectué

**Checklist complétée**:
- ✅ Pas de secrets exposés côté client
- ✅ Validation Zod sur tous les inputs
- ✅ Authentification sur routes sensibles
- ✅ Server-side validation des prix
- ✅ Rate limiting basique
- ✅ CORS non nécessaire (same-origin)
- ✅ HTTPS en production (Netlify)
- ✅ Pas de SQL injection (Prisma ORM)
- ✅ XSS protection (React escape by default)
- ✅ CSRF protection (Supabase PKCE flow)

---

## 🛠 Guide de Maintenance

### Commandes Utiles

#### Développement Local
```bash
# Démarrer le serveur de développement
npm run dev

# Build production (test avant deploy)
npm run build

# Linter et formatage
npm run lint
npm run format

# Prisma
npx prisma generate          # Générer le client Prisma
npx prisma db push           # Pousser le schéma vers la DB
npx prisma studio            # Interface graphique DB

# Scripts personnalisés
npx tsx scripts/setup-admin-users.ts    # Créer users admin
```

#### Déploiement
```bash
# Netlify (auto-deploy via Git)
git add .
git commit -m "Description"
git push origin main

# Netlify CLI (optionnel)
netlify deploy --prod
netlify env:list              # Voir les variables d'env
```

#### Base de Données
```sql
-- Exécuter dans Supabase SQL Editor

-- Vérifier RLS activé
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Lister les politiques RLS
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';

-- Compter les services actifs
SELECT COUNT(*) FROM services WHERE "isActive" = true;

-- Compter les abonnés newsletter
SELECT COUNT(*) FROM newsletter_subscribers WHERE "isSubscribed" = true;
```

### Dépannage Rapide

#### Problème: Erreur d'authentification Prisma
**Symptômes**: `P1000: Authentication failed`

**Solutions**:
1. Vérifier que le mot de passe dans DATABASE_URL est encodé URL (@ → %40)
2. Vérifier que DIRECT_URL utilise le bon port (5432)
3. Tester depuis PowerShell si WSL ne fonctionne pas

#### Problème: Variables d'environnement non prises en compte
**Symptômes**: `undefined` ou valeurs par défaut

**Solutions**:
1. Vérifier le nom exact de la variable (NEXT_PUBLIC_ pour client-side)
2. Redémarrer le serveur dev après modification .env
3. En production: Vérifier sur Netlify → Site settings → Environment variables
4. Redéployer après changement de variables

#### Problème: Webhook Stripe ne fonctionne pas
**Symptômes**: Commandes créées mais pas enregistrées en DB

**Solutions**:
1. Vérifier que l'URL du webhook est correcte: https://www.sab-fit.com/api/webhooks/stripe
2. Vérifier que STRIPE_WEBHOOK_SECRET est configuré sur Netlify
3. Vérifier les événements écoutés: `checkout.session.completed`
4. Consulter les logs: Stripe Dashboard → Developers → Webhooks → Logs

#### Problème: Emails ne partent pas
**Symptômes**: Erreur Resend ou emails non reçus

**Solutions**:
1. Vérifier RESEND_API_KEY dans les variables d'environnement
2. Vérifier que le domaine est vérifié sur Resend
3. Vérifier les DNS records (SPF, DKIM, DMARC)
4. Consulter les logs: Resend Dashboard → Logs
5. Vérifier que FROM_EMAIL est correct

#### Problème: Accès admin refusé
**Symptômes**: Redirection vers /login ou /

**Solutions**:
1. Vérifier que l'utilisateur existe dans Supabase Auth
2. Vérifier que le rôle est dans app_metadata:
   ```sql
   -- Dans Supabase SQL Editor
   SELECT raw_app_meta_data FROM auth.users WHERE email = 'ton@email.com';
   ```
3. Si le rôle manque, utiliser le script:
   ```bash
   npx tsx scripts/setup-admin-users.ts
   ```

#### Problème: Services ne s'affichent pas en production
**Symptômes**: Page vide ou erreur de chargement

**Solutions**:
1. Vérifier les variables Supabase sur Netlify
2. Vérifier RLS activé sur la table services
3. Vérifier la politique RLS permet la lecture publique:
   ```sql
   -- Doit exister
   SELECT * FROM pg_policies WHERE tablename = 'services' AND policyname = 'Allow public read access';
   ```
4. Consulter les logs Netlify: Site → Functions → Logs

### Sauvegardes et Sécurité

#### Sauvegardes Database Supabase
**Fréquence**: Automatique quotidienne (Supabase)

**Backup manuel**:
1. Supabase Dashboard → Database → Backups
2. Cliquer sur "Backup now"
3. Télécharger le dump si nécessaire

#### Rotation des Secrets (Checklist)
Si un secret est exposé:
- [ ] Révoquer l'ancienne clé immédiatement
- [ ] Générer une nouvelle clé
- [ ] Mettre à jour .env.local (local)
- [ ] Mettre à jour variables Netlify (production)
- [ ] Redéployer l'application
- [ ] Vérifier que l'ancienne clé ne fonctionne plus
- [ ] Nettoyer l'historique Git si nécessaire (git-filter-repo)

#### Monitoring Recommandé
1. **Stripe Dashboard**: Surveiller les paiements et webhooks
2. **Supabase Dashboard**: Monitorer l'utilisation DB et auth
3. **Resend Dashboard**: Vérifier le taux de livraison des emails
4. **Netlify Analytics**: Trafic et erreurs
5. **GitHub Alerts**: Secrets exposés

### Liens Utiles

#### Documentation Officielle
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Resend**: https://resend.com/docs
- **Netlify**: https://docs.netlify.com

#### Dashboards
- **Site Production**: https://www.sab-fit.com
- **Netlify**: https://app.netlify.com
- **Supabase**: https://supabase.com/dashboard/project/abfhvkrrlnuldwgzpxaj
- **Stripe**: https://dashboard.stripe.com
- **Resend**: https://resend.com/domains

#### Support
- **Supabase Support**: https://supabase.com/support
- **Stripe Support**: https://support.stripe.com
- **Resend Support**: support@resend.com
- **Netlify Support**: https://answers.netlify.com

---

## 📝 Notes de Développement

### Architecture Decisions Records (ADR)

#### ADR-001: Choix de Supabase pour Auth
**Date**: 27 Jan 2026
**Décision**: Utiliser Supabase Auth au lieu de NextAuth.js
**Raison**:
- Déjà utilisé pour la DB (PostgreSQL)
- Auth + DB dans le même service
- Row Level Security natif
- Moins de configuration

#### ADR-002: Newsletter au lieu de Comptes Clients
**Date**: 27 Jan 2026
**Décision**: Système newsletter RGPD-compliant au lieu de comptes clients
**Raison**:
- Pas besoin de gestion de commandes client (pas de livraison)
- Services = prestations physiques (pas de digital)
- Newsletter suffisante pour retargeting marketing
- Plus simple à implémenter et maintenir
- RGPD-compliant avec tokens de désinscription

#### ADR-003: Resend au lieu de FormSubmit.co
**Date**: 27 Jan 2026
**Décision**: Migration vers Resend pour les emails transactionnels
**Raison**:
- Plus professionnel (pas de branding tiers)
- Templates HTML customisables
- Meilleur délivrabilité avec domaine vérifié
- Analytics détaillées
- Programmable (API)

#### ADR-004: Stripe au lieu de PayPal uniquement
**Date**: 27 Jan 2026
**Décision**: Stripe comme processeur principal avec PayPal intégré
**Raison**:
- Interface plus moderne
- Support PayPal via Stripe Checkout
- Meilleure documentation
- Webhooks plus fiables
- Fees compétitifs (1.5% + 0.25€)

#### ADR-005: Séparation TEST/LIVE stricte
**Date**: 29 Jan 2026
**Décision**: .env.local = TEST keys, .env.production = LIVE keys
**Raison**:
- Éviter charges accidentelles pendant développement
- Séparation claire des environnements
- Sécurité: LIVE keys jamais committées
- Tests sans risque en local

### Lessons Learned

#### ✅ Ce qui a bien fonctionné
1. **Supabase RLS**: Protection automatique des données sensibles
2. **Prisma**: ORM fiable, migrations faciles
3. **Zod Validation**: Catch les erreurs avant la DB
4. **Server Components**: Moins de JavaScript côté client
5. **Netlify Deploy**: CI/CD automatique via Git push

#### ⚠️ Points d'Attention
1. **URL Encoding**: Toujours encoder les mots de passe avec caractères spéciaux (%40 pour @)
2. **WSL Network**: Utiliser PowerShell pour connexions DB directes si WSL bloque
3. **Stripe Labels**: Limite 50 caractères pour custom fields
4. **Webhook URLs**: Toujours vérifier le domaine exact (www. ou pas)
5. **Environment Variables**: Redémarrer dev server après modification .env

#### 💡 Améliorations Futures
1. **Tests Automatisés**: Ajouter Jest + Playwright pour tests E2E
2. **Rate Limiting Avancé**: Implémenter avec Redis au lieu de Map en mémoire
3. **Monitoring**: Ajouter Sentry pour error tracking
4. **Analytics**: Google Analytics ou Plausible pour métriques
5. **CDN**: Optimiser images avec Cloudinary ou imgix
6. **Cache**: Implémenter ISR (Incremental Static Regeneration) pour pages services

---

## 🎓 Guide pour Nouveaux Développeurs

### Onboarding Rapide

#### Prérequis
- Node.js 18+
- npm ou pnpm
- Git
- Compte Supabase (accès fourni par admin)
- Compte Netlify (accès fourni par admin)

#### Setup Initial (15 min)
```bash
# 1. Clone du repository
git clone <repo-url>
cd sabrina

# 2. Installation des dépendances
npm install

# 3. Copier .env.example vers .env.local
cp .env.example .env.local

# 4. Demander au lead dev de remplir .env.local avec les bonnes valeurs

# 5. Générer le client Prisma
npx prisma generate

# 6. Démarrer le serveur dev
npm run dev

# 7. Ouvrir http://localhost:3000
```

#### Structure du Projet
```
sabrina/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── admin/        # Dashboard admin (protégé)
│   │   ├── api/          # API routes
│   │   │   ├── checkout/ # Stripe checkout
│   │   │   ├── services/ # CRUD services
│   │   │   └── webhooks/ # Stripe webhooks
│   │   ├── login/        # Page de connexion
│   │   └── cgu/          # CGU/Mentions légales
│   ├── components/       # React components
│   │   ├── admin/        # Composants dashboard
│   │   ├── ui/           # Composants UI réutilisables
│   │   └── ...
│   └── lib/              # Utilitaires
│       ├── auth/         # Système d'authentification
│       ├── supabase/     # Client Supabase
│       ├── validations/  # Schémas Zod
│       └── resend.ts     # Service emails
├── prisma/
│   └── schema.prisma     # Schéma DB
├── scripts/              # Scripts utilitaires
├── docs/                 # Documentation
└── public/               # Assets statiques
```

#### Points d'Entrée Importants
1. **Page d'accueil**: `src/app/page.tsx`
2. **Dashboard admin**: `src/app/admin/page.tsx`
3. **API Stripe**: `src/app/api/checkout/route.ts`
4. **Webhook Stripe**: `src/app/api/webhooks/stripe/route.ts`
5. **Middleware auth**: `src/lib/supabase/middleware.ts`

#### Conventions de Code
- **TypeScript**: Obligatoire (pas de `.js`)
- **Formatting**: Prettier (run `npm run format`)
- **Linting**: ESLint (run `npm run lint`)
- **Commits**: Messages clairs en français (feat:, fix:, docs:, etc.)
- **Branches**: feature/nom-feature, fix/nom-bug

#### Workflow Git
```bash
# 1. Créer une branche
git checkout -b feature/ma-fonctionnalite

# 2. Développer et committer
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# 3. Pusher
git push origin feature/ma-fonctionnalite

# 4. Créer une Pull Request sur GitHub

# 5. Après review et merge, pull main
git checkout main
git pull origin main
```

---

## [Unreleased] - 2026-01-23 (Soirée)

### 🚀 Major Features (Fonctionnalités Majeures)
- **Database Full Sync** : Connexion réussie à Supabase (contournement du port 5432 via Pooler 6543).
    - Création des tables `services` et `promotions` avec mappage strict PostgreSQL.
    - Import (Seed) de toutes les offres historiques (Mix Running, Cures, Massages...).
- **Admin Dashboard 2.0** :
    - Refonte UX complète : Couleurs Pop & Wellness (Bleu/Corail).
    - Formulaire Services : Ajout automatique du symbole "€".
    - Formulaire Panic Sell : Interface simplifiée "Vente Flash" (Titre, %, Durée).
- **Stripe Integration** :
    - Configuration du SDK Stripe.
    - API `/api/checkout` fonctionnelle.
    - Bouton "Payer" dans le panier flottant connecté au Checkout.
    - Page de succès avec confettis 🎉.
- **Mobile UX** :
    - **Promo Banner** : Nouveau slider vertical pour mobile (plus lisible).
    - **Hero Marquee** : Retour de l'animation "3D/Slide" pour les mots clés sur mobile.
    - **Optimisation** : Animations allégées (Fade/Slide) pour éviter les lags.

### 🛠 Fixes & Improvements
- **Fix Prisma** : Correction des erreurs `table not found` (case sensitivity).
- **Fix Marquee** : Correction du bug CSS `min-w-full` sur mobile (remplacé par `w-max`).
- **Cleanup** : Abandon du projet d'application native séparée (code archivé/ignoré) au profit de la PWA unique.

---

## [Unreleased] - 2026-01-22 (Soirée)
*Voir historique précédent...*
