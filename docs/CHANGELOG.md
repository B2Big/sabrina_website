# Changelog

## [Unreleased] - 2026-01-22 (Soirée)

### ✨ Features (Fonctionnalités)
- **Multi-Service Promo** : Possibilité de sélectionner plusieurs services pour une même promotion.
- **Auto-Discount Logic** : Le formulaire admin génère automatiquement le texte (ex: "-20% sur X services") et le frontend applique la réduction mathématique.
- **Smart Dates** : Ajout de boutons "Vente Flash" (24h/48h) qui calculent automatiquement la date de fin.
- **Badge Promo** : Affichage visuel du pourcentage de réduction dans la liste admin.

### 🐛 Bug Fixes & Polishing
- **Prisma Windows/WSL** : Ajout de `binaryTargets = ["native", "windows"]` pour corriger les erreurs de compilation cross-platform.
- **Mobile UX** : Ajout de `pb-24` au footer pour éviter que la barre de navigation mobile ne cache le lien Dashboard.
- **Build Error** : Correction du typage strict sur `PromoBanner` (gestion des textes nuls).
- **Refactoring** : Nettoyage de `promo-list.tsx` après une erreur de copier-coller.

---

## [Unreleased] - 2026-01-22 (Après-midi)

### 🚀 Major Updates
- **Supabase Integration** : Mise en place complète de l'auth et du client DB.
- **Admin Dashboard** : Interface sécurisée pour gérer Services et Promotions.
- **Panic Sell V1** : Première version du bandeau défilant.
- **Database** : Migration vers Prisma avec relation Many-to-Many (Services <-> Promotions).

### 🛠 Technique
- **Prisma Downgrade** : Retour à la v5 pour assurer la stabilité.
- **Seed Script** : Création de `prisma/seed.ts` pour importer les données existantes.