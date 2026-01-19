# Contexte du Projet Sabrina - Coaching & Massage

## Vision Globale
Site hybride (Physique + Digital) pour Sabrina, Coach Sportive et Praticienne Bien-être.
**Direction Artistique "Pop & Wellness" (Janvier 2026 - v2) :**
- **Cible :** Mixte (Hommes & Femmes).
- **Style :** Lumineux, Inclusif, Pop, Pastel.
- **Concept Visuel :** Forte dissociation visuelle entre les deux pôles d'activité.
    - **Pole Training :** Bleu Pop & Menthe (Énergie, Sport, Dynamisme).
    - **Pole Care :** Corail/Rose Pastel (Douceur, Récupération).
- **Fond :** Blanc / Gris très clair.

## Stratégie Business (Mise à jour Janvier 2026)
1.  **Repositionnement Tarifaire (Rentabilité) :**
    - Coaching 1-to-1 : **60€** (au lieu de 50€).
    - Pack Transformation (10 séances) : **550€** (au lieu de 400€).
    - Massages inchangés (70€ / 45€).
2.  **Lancement Offre SaaS "Club Run" :**
    - Abonnement mensuel : **29.90€ / mois**.
    - Cible : Clients autonomes / Digital.
    - Inclus : App, Programmes, Vidéothèque, Calculateur VMA.

## Fonctionnalités Clés
1.  **E-Commerce / Réservation :**
    - Intégration Stripe pour les paiements (One-time & Recurring).
    - Liens de paiement directs sur les cartes services.
2.  **Présentation des services :**
    - Cartes avec code couleur automatique (Bleu pour Coaching / Rose pour Massage).
    - **Nouveau :** Carte spéciale "Abonnement SaaS" avec liste de features.
3.  **Contact :** Formulaire direct.

## Stack Technique
- **Framework :** Next.js 15
- **Styling :** Tailwind CSS v4.
- **Paiement :** Stripe (Mode Subscription & Payment).
- **Data :** JSON Schema pour les programmes d'entraînement (VMA).

## Configuration Stripe (Product IDs)
- `price_saas_29` : Club Run (Abo Mensuel)
- `price_premium_149` : Coaching Elite (Abo Mensuel)
- `price_massage_70` : Massage 1h (Ponctuel)
- `price_pack_550` : Pack 10 Séances (Ponctuel)