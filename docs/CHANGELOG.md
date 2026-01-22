# Changelog

## [Unreleased] - 2026-01-22

### Ajouts Majeurs
- **Supabase Integration** : Installation du client, middleware d'authentification.
- **Admin Dashboard** : Création de `/admin` pour gérer le contenu sans toucher au code.
- **Système de Promotion Avancé ("Panic Sell")** :
    - Bandeau d'urgence en haut du site.
    - Gestion des dates (Ventes flash 24h/48h).
    - **Réductions Multi-Produits** : Une promo peut s'appliquer à une liste de services.
- **Dynamic Pricing** : Le frontend recalcule les prix en temps réel selon les promos actives.

### Technique
- **Prisma** : Mise à jour du schéma (Relations Service <-> Promotion).
- **Downgrade Prisma** : Passage à v5 pour stabilité immédiate.
- **Refactoring** : Centralisation des appels DB dans `src/lib/db-services.ts`.

### UI/UX
- Ajout d'un lien discret "Dashboard" dans le footer.
- Formulaire d'admin ergonomique avec sélection multiple (Checkbox grid).
- Badges de réduction sur les cartes services.
