# Sabrina - Coaching & Massage PWA 🏋️‍♀️💆‍♀️

Application web progressive (PWA) moderne pour coaching sportif et massage, avec e-commerce intégré et dashboard d'administration.

## ⚠️ IMPORTANT - Première Installation

**🔴 ACTIONS REQUISES AVANT DE DÉMARRER** :

1. **Lire la documentation de sécurité** : [`docs/SECURITE_RECAPITULATIF.md`](./docs/SECURITE_RECAPITULATIF.md) ⭐
2. **Rotation des credentials** : [`docs/CREDENTIAL_ROTATION.md`](./docs/CREDENTIAL_ROTATION.md) 🔴 **URGENT**
3. **Documentation complète** : [`docs/README.md`](./docs/README.md) 📚

---

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner le repo (si pas déjà fait)
git clone https://github.com/votre-repo/sabrina.git
cd sabrina

# Installer les dépendances
npm install
```

### 2. Configuration

```bash
# Copier le template de configuration
cp .env.example .env.local

# Modifier .env.local avec vos vraies valeurs
# Voir docs/CREDENTIAL_ROTATION.md pour obtenir les clés
```

### 3. Base de Données

```bash
# Synchroniser le schéma Prisma
npx prisma db push

# Générer le client Prisma
npx prisma generate

# Optionnel : Visualiser les données
npx prisma studio
```

### 4. Utilisateurs Admin

```bash
# 1. Ajouter SUPABASE_SERVICE_ROLE_KEY dans .env.local
# 2. Modifier scripts/setup-admin-users.ts avec vos emails/mots de passe
# 3. Exécuter le script
npx tsx scripts/setup-admin-users.ts
```

### 5. Lancer l'Application

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🎨 Fonctionnalités

### 🏪 E-Commerce
- ✅ Catalogue de services (coaching, massages, cures)
- ✅ Panier d'achat interactif
- ✅ Paiement sécurisé (Stripe + PayPal)
- ✅ Système de promotions
- ✅ Validation des prix côté serveur

### 🔐 Dashboard Admin Sécurisé
- ✅ Authentification multi-utilisateurs (Supabase Auth)
- ✅ Système de rôles (ADMIN, DEVELOPER)
- ✅ CRUD complet pour services et promotions
- ✅ Protection rate limiting
- ✅ Validation Zod de tous les inputs

### 💳 Gestion des Paiements
- ✅ Intégration Stripe complète
- ✅ Webhooks pour confirmation des paiements
- ✅ Enregistrement des commandes en base de données
- ✅ Support carte bancaire + PayPal

### 📱 PWA (Progressive Web App)
- ✅ Installation sur mobile/desktop
- ✅ Fonctionne hors-ligne (mode cache)
- ✅ Icônes et splash screens
- ✅ Manifest configuré

### 🛡️ Sécurité
- ✅ Rate limiting (anti brute-force, anti DOS)
- ✅ Validation Zod complète
- ✅ Protection CSRF (Next.js intégré)
- ✅ Middlewares de protection
- ✅ Logs d'audit

---

## 💻 Stack Technique

**Frontend** :
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React Icons

**Backend** :
- Next.js API Routes
- Server Actions
- Supabase Auth
- Prisma ORM
- PostgreSQL (Supabase)

**Paiements & Services** :
- Stripe (paiements)
- Resend (emails)
- Supabase (BDD + Auth)

**Validation & Sécurité** :
- Zod (validation)
- Rate limiting custom
- HTTPS (production)

---

## 📁 Structure du Projet

```
sabrina/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Dashboard admin protégé
│   │   ├── login/              # Page de connexion
│   │   ├── api/                # API routes
│   │   │   ├── checkout/       # Paiement Stripe
│   │   │   ├── services/       # CRUD services
│   │   │   └── webhooks/       # Webhooks Stripe
│   │   ├── success/            # Page succès paiement
│   │   └── layout.tsx          # Layout racine
│   ├── components/             # Composants React
│   │   ├── admin/              # Composants dashboard
│   │   ├── ui/                 # UI primitives
│   │   └── pwa/                # PWA install prompt
│   ├── lib/                    # Utilitaires
│   │   ├── auth/               # Système de rôles
│   │   ├── supabase/           # Clients Supabase
│   │   ├── validations/        # Schémas Zod
│   │   ├── stripe.ts           # Config Stripe
│   │   ├── db-services.ts      # Helpers Prisma
│   │   └── rate-limit.ts       # Rate limiting
│   ├── context/                # React Context
│   │   └── cart-context.tsx    # État du panier
│   └── data/                   # Contenu statique
├── prisma/                     # Schéma et migrations
├── docs/                       # Documentation
│   ├── README.md               # Doc complète
│   ├── SECURITE_RECAPITULATIF.md  # Sécurité
│   ├── CREDENTIAL_ROTATION.md  # Rotation credentials
│   └── STRIPE_WEBHOOKS.md      # Config webhooks
├── scripts/                    # Scripts utilitaires
│   ├── setup-admin-users.ts    # Création users admin
│   └── README.md               # Doc script
└── public/                     # Assets statiques
```

---

## 🛠️ Commandes

### Développement

```bash
npm run dev          # Serveur dev (http://localhost:3000)
npm run build        # Build production
npm run start        # Serveur production
npm run lint         # ESLint
```

### Base de Données

```bash
npx prisma studio                  # Interface graphique
npx prisma db push                 # Sync schéma
npx prisma generate                # Générer client
npx prisma migrate dev             # Créer migration
```

### Scripts

```bash
npx tsx scripts/setup-admin-users.ts   # Créer users admin
```

---

## 🧪 Tests

Voir les tests manuels dans [`docs/SECURITE_RECAPITULATIF.md`](./docs/SECURITE_RECAPITULATIF.md)

**Cartes de test Stripe** :
- `4242 4242 4242 4242` : Paiement réussi
- `4000 0000 0000 9995` : Carte refusée

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`docs/README.md`](./docs/README.md) | Documentation complète |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | 🏗️ Architecture technique détaillée |
| [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) | 📜 Historique complet de développement |
| [`docs/SECURITE_RECAPITULATIF.md`](./docs/SECURITE_RECAPITULATIF.md) | ⭐ Récapitulatif sécurité |
| [`docs/CREDENTIAL_ROTATION.md`](./docs/CREDENTIAL_ROTATION.md) | 🔴 Rotation credentials |
| [`docs/STRIPE_WEBHOOKS.md`](./docs/STRIPE_WEBHOOKS.md) | Config webhooks Stripe |
| [`scripts/README.md`](./scripts/README.md) | Doc script admin users |

---

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement
# Settings → Environment Variables
```

### Checklist Pré-Déploiement

- [ ] Credentials régénérés
- [ ] Variables d'environnement production configurées
- [ ] Utilisateurs admin créés et testés
- [ ] Au moins 1 paiement test réussi
- [ ] Webhooks Stripe configurés en production
- [ ] Domaine personnalisé configuré

Voir [`docs/README.md`](./docs/README.md) pour le guide complet de déploiement.

---

## 🎯 Checklist Post-Installation

Après avoir cloné le projet :

**Configuration** :
- [ ] `npm install` exécuté
- [ ] `.env.local` créé et rempli
- [ ] `npx prisma db push` exécuté
- [ ] `npx prisma generate` exécuté

**Sécurité** :
- [ ] Documentation `SECURITE_RECAPITULATIF.md` lue
- [ ] Credentials régénérés (voir `CREDENTIAL_ROTATION.md`)
- [ ] `.env.local` PAS dans Git

**Utilisateurs** :
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajoutée
- [ ] `scripts/setup-admin-users.ts` modifié avec vos infos
- [ ] Script exécuté : `npx tsx scripts/setup-admin-users.ts`
- [ ] Connexion testée sur `/login`

**Stripe** :
- [ ] Webhook configuré (voir `STRIPE_WEBHOOKS.md`)
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté
- [ ] Au moins 1 paiement test effectué

**Tests** :
- [ ] Application démarre : `npm run dev`
- [ ] Accès admin fonctionne : `/admin`
- [ ] CRUD services fonctionne
- [ ] Panier + checkout fonctionne

---

## 🐛 Problèmes Courants

### "Cannot reach database server"

**Solution** : Vérifier `DATABASE_URL` et `DIRECT_URL` dans `.env.local`

### "Invalid API key" (Supabase)

**Solution** : Vérifier `NEXT_PUBLIC_SUPABASE_ANON_KEY` et relancer `npm run dev`

### Rate limit bloqué en dev

**Solution** : Redémarrer le serveur réinitialise les compteurs

Voir [`docs/README.md`](./docs/README.md) section "Dépannage" pour plus de solutions.

---

## 📞 Support

- **Documentation** : [`docs/README.md`](./docs/README.md)
- **Sécurité** : [`docs/SECURITE_RECAPITULATIF.md`](./docs/SECURITE_RECAPITULATIF.md)
- **Next.js** : https://nextjs.org/docs
- **Supabase** : https://supabase.com/docs
- **Stripe** : https://stripe.com/docs

---

## 📝 Changelog

**🎉 Voir l'historique complet dans [`docs/CHANGELOG.md`](./docs/CHANGELOG.md)**

### [Production Release] - 2026-01-29 🚀

**Status**: ✅ EN LIGNE sur https://www.sab-fit.com

**🌐 Déploiement Production** :
- Déploiement Netlify avec domaine sab-fit.com
- Stripe LIVE configuré avec webhook
- Row Level Security (RLS) activé sur Supabase
- Rotation de clé Resend pour sécurité
- Configuration DNS complète (SSL/HTTPS)
- Documentation technique (ARCHITECTURE.md, CHANGELOG.md)

### [Security Release] - 2026-01-27 🔒

**🔐 Sécurité & Authentification** :
- Système de rôles (ADMIN, DEVELOPER)
- Validation des prix côté serveur
- Rate limiting complet
- Validation Zod de tous les inputs
- Protection API avec authentification

**📧 Newsletter & Emails** :
- Système newsletter RGPD-compliant
- Migration vers Resend (emails professionnels)
- Intégration checkout Stripe
- Onglet Newsletter dans dashboard admin

**💳 Paiements** :
- Webhooks Stripe configurés
- Enregistrement commandes en DB
- Support PayPal via Stripe

**📖 Documentation** :
- Guide sécurité complet
- Guide rotation credentials
- Guide webhooks Stripe

### v1.0.0 - 2026-01-22

- Site vitrine initial
- PWA basique
- Intégration Stripe (checkout uniquement)

---

## 🎨 Design

Thème "Guerrière / Amazone" :
- **Dark Mode** par défaut
- **Accent Rouge Guerrier** : `#D92323`
- **Typographie** : Bold et impactante
- **Animations** : Fluides (Framer Motion)

---

## 📄 Licence

Projet privé - Tous droits réservés

---

**🎉 Prêt à démarrer ? Lisez d'abord [`docs/SECURITE_RECAPITULATIF.md`](./docs/SECURITE_RECAPITULATIF.md) !**