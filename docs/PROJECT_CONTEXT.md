# Contexte du Projet Sabrina Coaching

## 1. Vue d'ensemble 360°
Plateforme web "Mobile-First" pour Sabrina, coach sportive et masseuse.
Le projet dépasse le simple site vitrine : c'est un **outil de conversion dynamique** (PWA) équipé d'un moteur de promotion psychologique ("Panic Sell").

## 2. Stack Technique
- **Framework** : Next.js 16 (App Router).
- **Langage** : TypeScript / React 19.
- **Styling** : Tailwind CSS 4 + Framer Motion (Animations).
- **Backend (BaaS)** : Supabase (PostgreSQL + Auth).
- **ORM** : Prisma v5 (Downgrade de v7 pour stabilité WSL/Windows).
- **Déploiement** : Vercel (Cible).

## 3. Architecture des Données
La base de données gère une relation **Many-to-Many** entre Services et Promotions.

### Modèles Principaux :
1.  **Service** : La prestation de base (Titre, Prix, Description, Catégorie).
2.  **Promotion** : L'offre temporaire.
    - `discountPercent` : % de réduction automatique.
    - `startDate` / `endDate` : Période de validité.
    - `services` : Liste des services concernés (Relation M:N).
3.  **User** : Administrateur (Sabrina) géré via Supabase Auth.

## 4. Fonctionnalités Implémentées

### A. Partie Publique (Front-Office)
- **Navigation** : Navbar rétractable + Mobile Nav (App-like) + Footer ajusté.
- **Catalogue** : Affichage dynamique des services (Coaching/Massage).
- **Moteur de Prix (Pricing Engine)** :
    - Le site détecte si une promo est active pour chaque service.
    - Si oui : calcul automatique du nouveau prix, affichage du prix barré et badge "-X%".
- **Bandeau "Panic Sell"** :
    - S'affiche uniquement si une promo est active ET dans les dates valides.
    - Défilement (Marquee) urgent en haut de page.
- **Mode Secours** : Si la BDD est hors ligne, le site bascule sur un fichier JSON statique (`content.ts`).

### B. Administration (Back-Office)
Accessible via `/admin` ou le lien discret en bas de page.
- **Dashboard Services** : CRUD complet (Créer, Lire, Mettre à jour, Supprimer).
- **Dashboard Promotions (Le "Cerveau")** :
    - **Ventes Flash** : Boutons rapides (24h, 48h, 3j) ou dates manuelles.
    - **Ciblage** : Sélection multiple de services via une grille de cases à cocher.
    - **Visualisation** : Indicateurs d'état (En cours, Planifié, Expiré).

## 5. État Actuel (22/01/2026)
- **Codebase** : Stable, build fonctionnel.
- **Base de données** : Schéma prêt. **Nécessite une connexion valide dans `.env`**.
- **UX Mobile** : Optimisée (Padding footer corrigé pour ne pas masquer le dashboard).

## 6. À Faire (Roadmap Technique)
1.  [URGENT] Corriger `DATABASE_URL` et lancer `npx prisma db push`.
2.  [URGENT] Créer le user Admin dans Supabase.
3.  [Medium] Connecter Stripe (Webhooks) pour valider les paiements automatiquement.
4.  [Low] Blog / Articles SEO.
