# 📚 Documentation Sabrina PWA

Bienvenue dans la documentation complète de votre application PWA pour Sabrina.

---

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Installer les dépendances
npm install

# Copier le template de variables d'environnement
cp .env.example .env.local

# Remplir .env.local avec vos vraies valeurs
# (voir CREDENTIAL_ROTATION.md pour obtenir les clés)
```

### 2. Configuration Base de Données

```bash
# Synchroniser le schéma Prisma avec la DB
npx prisma db push

# Générer le client Prisma
npx prisma generate

# Optionnel : Ouvrir Prisma Studio
npx prisma studio
```

### 3. Configuration Utilisateurs Admin

```bash
# 1. Obtenir SUPABASE_SERVICE_ROLE_KEY depuis Supabase Dashboard
# 2. L'ajouter dans .env.local
# 3. Modifier scripts/setup-admin-users.ts avec vos emails/mots de passe
# 4. Exécuter le script
npx tsx scripts/setup-admin-users.ts
```

### 4. Lancer l'Application

```bash
# Mode développement
npm run dev

# L'application sera disponible sur http://localhost:3000
```

---

## 📖 Documentation Disponible

### 🔐 Sécurité

**[SECURITE_RECAPITULATIF.md](./SECURITE_RECAPITULATIF.md)** ⭐ **COMMENCER ICI**
- Vue d'ensemble complète de toutes les corrections de sécurité
- Checklist des actions requises
- Guide de tests
- Priorisation des tâches

**[CREDENTIAL_ROTATION.md](./CREDENTIAL_ROTATION.md)** 🔴 **URGENT**
- Guide étape par étape pour régénérer toutes les clés
- Nettoyage de l'historique Git
- Protection contre les credentials exposés
- **À FAIRE EN PRIORITÉ**

### 💳 Stripe & Paiements

**[STRIPE_WEBHOOKS.md](./STRIPE_WEBHOOKS.md)**
- Configuration des webhooks Stripe
- Tests en local avec Stripe CLI
- Vérification des paiements
- Dépannage

### 🛠️ Scripts

**[../scripts/README.md](../scripts/README.md)**
- Documentation du script setup-admin-users.ts
- Guide de création des utilisateurs admin
- Troubleshooting

---

## 🏗️ Architecture

### Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS 4
- **Base de données** : PostgreSQL (via Supabase)
- **ORM** : Prisma
- **Auth** : Supabase Auth
- **Paiements** : Stripe
- **Emails** : Resend
- **Validation** : Zod
- **PWA** : @ducanh2912/next-pwa

### Structure du Projet

```
sabrina/
├── src/
│   ├── app/              # Pages et API routes (Next.js App Router)
│   │   ├── admin/        # Dashboard admin protégé
│   │   ├── login/        # Page de connexion
│   │   ├── api/          # API routes
│   │   └── layout.tsx    # Layout racine
│   ├── components/       # Composants React réutilisables
│   ├── lib/              # Utilitaires et configuration
│   │   ├── auth/         # Système de rôles
│   │   ├── supabase/     # Clients Supabase
│   │   └── validations/  # Schémas Zod
│   ├── context/          # React Context (ex: cart)
│   └── data/             # Données statiques
├── prisma/               # Schéma et migrations
├── docs/                 # Documentation
└── scripts/              # Scripts utilitaires
```

---

## 🔑 Variables d'Environnement

Toutes les variables sont documentées dans `.env.example`.

**Variables obligatoires** :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Variables optionnelles** :
- `SUPABASE_SERVICE_ROLE_KEY` (pour script setup-admin-users.ts)
- `STRIPE_WEBHOOK_SECRET` (pour webhooks Stripe)
- `NEXT_PUBLIC_URL` (URL publique, défaut: localhost:3000)

---

## 🔒 Sécurité

### Système de Rôles

Deux rôles disponibles :
- **ADMIN** : Accès complet au dashboard (Sabrina)
- **DEVELOPER** : Accès complet au dashboard (développeur)

Rôles stockés dans `app_metadata.role` de Supabase Auth.

### Rate Limiting

| Route | Limite | Fenêtre |
|-------|--------|---------|
| /login | 5 tentatives | 15 min |
| /api/checkout | 10 paiements | 1 heure |
| Actions admin | 100 actions | 10 min |

### Validation

Tous les inputs sont validés avec Zod :
- Services (création/modification)
- Promotions (création/modification)
- Panier (checkout)
- Formulaire de contact

### Protection des Prix

Les prix sont **TOUJOURS** récupérés depuis la base de données côté serveur.
Le client ne peut pas manipuler les prix du panier.

---

## 🧪 Tests

### Tests Manuels

Voir la section "Tests de Validation" dans [SECURITE_RECAPITULATIF.md](./SECURITE_RECAPITULATIF.md)

### Cartes de Test Stripe

| Numéro de carte | Résultat |
|-----------------|----------|
| 4242 4242 4242 4242 | Paiement réussi |
| 4000 0025 0000 3155 | Requiert 3D Secure |
| 4000 0000 0000 9995 | Carte refusée (insuffisant) |
| 4000 0000 0000 0002 | Carte refusée (générique) |

Date : n'importe quelle date future
CVC : n'importe quel 3 chiffres

---

## 📦 Base de Données

### Modèles Principaux

**Service**
- Prestations proposées (coaching, massages, cures)
- Prix, durée, description, caractéristiques
- Badges (popular, bestValue)
- Liens vers promotions

**Promotion**
- Texte de promotion
- Pourcentage de réduction
- Dates de début/fin
- Services liés
- État actif/inactif

**Order**
- Commandes Stripe
- Statut (PENDING, COMPLETED, FAILED, REFUNDED)
- Informations client
- Montant, devise
- Services achetés

### Commandes Prisma Utiles

```bash
# Générer le client
npx prisma generate

# Synchroniser le schéma
npx prisma db push

# Créer une migration
npx prisma migrate dev --name nom_migration

# Ouvrir Prisma Studio
npx prisma studio

# Reset la base de données (ATTENTION: supprime toutes les données)
npx prisma migrate reset
```

---

## 🚀 Déploiement

### Prérequis

- [ ] Tous les credentials régénérés
- [ ] Variables d'environnement configurées
- [ ] Utilisateurs admin créés
- [ ] Webhooks Stripe configurés
- [ ] Au moins 1 paiement test réussi

### Plateformes Recommandées

**Vercel** (Recommandé pour Next.js)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add DATABASE_URL production
# ... etc
```

**Netlify**
```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod
```

### Après Déploiement

1. Configurer le domaine personnalisé
2. Activer HTTPS (automatique sur Vercel/Netlify)
3. Configurer les webhooks Stripe en production
4. Tester un paiement complet end-to-end
5. Installer la PWA sur mobile pour tester

---

## 🐛 Dépannage

### Erreur de connexion Supabase

```
Error: Invalid API key
```

**Solution** :
- Vérifier que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects
- Relancer le serveur après modification de .env.local

### Erreur Prisma

```
Error: P1001: Can't reach database server
```

**Solution** :
- Vérifier que `DATABASE_URL` et `DIRECT_URL` sont corrects
- Vérifier que le mot de passe PostgreSQL est correct
- Tester la connexion depuis Supabase Dashboard

### Rate Limit en Développement

Si vous êtes bloqué par le rate limiting en développement, redémarrer le serveur réinitialise les compteurs.

### Webhook Stripe Non Reçu

```
No webhook events received
```

**Solution** :
- Vérifier que `STRIPE_WEBHOOK_SECRET` est correct
- En local, utiliser Stripe CLI : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Vérifier les logs du webhook dans Stripe Dashboard

---

## 📞 Support

### Documentation Officielle

- **Next.js** : https://nextjs.org/docs
- **Supabase** : https://supabase.com/docs
- **Stripe** : https://stripe.com/docs
- **Prisma** : https://www.prisma.io/docs
- **Zod** : https://zod.dev

### Communautés

- **Next.js Discord** : https://discord.gg/nextjs
- **Supabase Discord** : https://discord.supabase.com
- **Stripe Discord** : https://discord.gg/stripe

---

## 📝 Changelog

### Version 2.0 - 2026-01-27

**Sécurité** :
- ✅ Système de rôles (ADMIN, DEVELOPER)
- ✅ Validation des prix côté serveur
- ✅ Protection API avec authentification
- ✅ Validation Zod complète
- ✅ Rate limiting sur routes sensibles

**Fonctionnalités** :
- ✅ Webhooks Stripe
- ✅ Enregistrement des commandes en DB
- ✅ Script setup utilisateurs admin

**Documentation** :
- ✅ Guide de rotation credentials
- ✅ Guide webhooks Stripe
- ✅ Récapitulatif sécurité complet

---

## 🎯 Roadmap

### À Court Terme

- [ ] Emails de confirmation automatiques
- [ ] Dashboard des commandes (/admin/orders)
- [ ] Export CSV des ventes
- [ ] Gestion des remboursements

### À Moyen Terme

- [ ] Tests automatisés (Jest/Playwright)
- [ ] Monitoring des erreurs (Sentry)
- [ ] Statistiques de ventes
- [ ] Notifications push PWA

### À Long Terme

- [ ] Application mobile native
- [ ] Programme de fidélité
- [ ] Système de réservation en ligne
- [ ] Chat support intégré

---

**🎉 Votre application est prête ! Bon développement !**

*Pour toute question, consultez d'abord [SECURITE_RECAPITULATIF.md](./SECURITE_RECAPITULATIF.md)*
