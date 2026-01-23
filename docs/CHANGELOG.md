# Changelog

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
