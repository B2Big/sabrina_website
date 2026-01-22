# Contexte du Projet Sabrina Coaching

## 1. Vue d'ensemble
Application web pour Sabrina, coach sportive et praticienne bien-être.
Le site est une PWA (Progressive Web App) Next.js moderne, visuellement riche ("Wow effect"), et orientée conversion.

## 2. Stack Technique
- **Frontend** : Next.js 16 (App Router), React 19, TailwindCSS 4.
- **Backend** : Supabase (PostgreSQL), Prisma ORM.
- **Auth** : Supabase Auth.
- **UI/UX** : Framer Motion, Lucide React, Design "Bento" et "Glassmorphism".
- **Hébergement** : Vercel (prévu).

## 3. Fonctionnalités Clés

### A. Partie Publique
- **Présentation** : Hero section impactante, section "Pourquoi moi", témoignages.
- **Catalogue** : Liste des services (Coaching, Massages, Cures) avec prix et détails.
- **Panier Flottant** : Système de sélection de services simple.
- **Bandeau "Panic Sell"** : Marquee défilant en haut de page pour les promos urgentes.
- **Calcul de Prix Dynamique** : Les prix s'ajustent automatiquement si une promo est active.

### B. Administration (/admin)
- **Authentification** : Sécurisée via email/password.
- **Gestion des Services** : CRUD complet (Ajouter, Modifier, Supprimer, Mettre en avant).
- **Gestion des Promotions** :
    - Création de messages défilants.
    - **Ventes Flash** : Activation pour 24h, 48h ou dates précises.
    - **Réductions Automatiques** : Application d'un % de réduction sur un ou plusieurs services.
    - Le site barre automatiquement l'ancien prix et affiche le nouveau.

## 4. Structure de Données
- `User` : Admin access.
- `Service` : Les prestations vendues.
- `Promotion` : Les offres temporaires (liées à plusieurs services via Many-to-Many).

## 5. État Actuel (22/01/2026)
- Le site est fonctionnel.
- La base de données est configurée (attente de connexion valide dans `.env`).
- Mode "Secours" actif : Si la BDD ne répond pas, le site affiche des données statiques.