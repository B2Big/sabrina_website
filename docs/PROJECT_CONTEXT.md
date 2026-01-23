# Contexte du Projet Sabrina Coaching

## 1. Vue d'ensemble 360°
Plateforme web "Mobile-First" (PWA) pour Sabrina, coach sportive et masseuse.
Le projet est désormais consolidé autour d'une **application web unique** (Next.js) qui gère :
- La vitrine des services (Coaching & Massages).
- La réservation et le paiement en ligne (Stripe).
- Un moteur de promotion psychologique ("Panic Sell").
- Une administration complète.

*Note : Le projet d'application native séparée a été abandonné pour centraliser les efforts sur cette PWA.*

## 2. Stack Technique
- **Framework** : Next.js 16 (App Router).
- **Langage** : TypeScript / React 19.
- **Styling** : Tailwind CSS 4 + Framer Motion (Animations).
- **Backend (BaaS)** : Supabase (PostgreSQL + Auth).
- **ORM** : Prisma v5 (Mappage PostgreSQL strict).
- **Paiement** : Stripe Checkout.
- **Déploiement** : Vercel / Netlify.

## 3. Architecture des Données (PostgreSQL)
La base de données est hébergée sur Supabase et gérée via Prisma.

### Modèles Principaux :
1.  **services** : Prestations (Titre, Prix, Catégorie, etc.).
2.  **promotions** : Offres temporaires ("Panic Sell").
    - Relation Many-to-Many avec les services.
    - Gestion des dates de validité et du % de réduction.
3.  **users** : Administrateurs (Sabrina).

## 4. Fonctionnalités Clés

### A. Partie Publique (Front-Office)
- **Catalogue Dynamique** : Services récupérés en temps réel depuis la BDD.
- **Panic Sell (Vente Flash)** :
    - Bandeau d'alerte rouge en haut de page (Mobile : Slider Vertical / Desktop : Marquee).
    - Calcul automatique des prix barrés.
- **Panier Flottant** : Affiche le total et permet le paiement direct.
- **Paiement Stripe** : Tunnel de paiement sécurisé avec redirection vers page de succès.

### B. Administration (Back-Office)
Accessible via `/admin`.
- **Dashboard Services** : CRUD complet. Prix gérés automatiquement en Euros.
- **Gestion Panic Sell** : 
    - Interface simplifiée "One-Click".
    - Création de promos globales ou ciblées.
    - Boutons rapides (24h, 48h).

## 5. État Actuel (23/01/2026)
- **Base de Données** : Connectée et Peuplée (Seed initial effectué avec les offres historiques).
- **Admin** : Opérationnel et designé (Pop & Wellness).
- **Paiement** : Connecté à Stripe (Mode Test).
- **Mobile UX** : Animations optimisées (Marquee Hero & Promo).

## 6. À Faire (Roadmap)
1.  **Déploiement** : Pousser en production (Vercel/Netlify) avec les variables d'environnement.
2.  **Emailing** : Configurer Resend pour les notifications de commande (webhook Stripe).
3.  **App Course** : Intégrer les outils (Chrono, Parser) directement dans la PWA (Section `/tools` ?) à la place de l'app native.