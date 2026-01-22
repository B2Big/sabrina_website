# Contexte du Projet Sabrina - Coaching & Massage

## Vision Globale
Site vitrine et de réservation pour Sabrina, Coach Sportive et Praticienne Bien-être.
**Direction Artistique "Pop & Wellness" (Janvier 2026 - v2) :**
- **Cible :** Mixte (Hommes & Femmes).
- **Style :** Lumineux, Inclusif, Pop, Pastel.
- **Concept Visuel :** Forte dissociation visuelle entre les deux pôles d'activité.
    - **Pole Training :** Bleu Pop & Menthe (Énergie, Sport, Dynamisme).
    - **Pole Care :** Corail/Rose Pastel (Douceur, Récupération).
- **Fond :** Blanc / Gris très clair.

## Stratégie Business (Mise à jour Janvier 2026)
1.  **Focalisation Services (Site Web) :**
    - Coaching 1-to-1 : **60€**.
    - Pack Transformation (10 séances) : **550€**.
    - Massages : 70€ / 45€.
    - **Suppression du SaaS "Club Run"** (Déplacé vers une app native dédiée).
2.  **Panier de Réservation (Upsell) :**
    - Possibilité d'ajouter plusieurs services (ex: Massage + Coaching).
    - Formulaire de contact intelligent pré-rempli avec le panier.

## Fonctionnalités Clés
1.  **Système de Panier (Cart Context) :**
    - Ajout/Retrait de services.
    - Calcul du total estimé en temps réel.
    - Indicateur flottant "Panier" sur mobile/desktop.
2.  **Présentation des services :**
    - Cartes avec code couleur automatique (Bleu pour Coaching / Rose pour Massage).
    - Bouton "Ajouter" remplaçant le lien direct de paiement.
3.  **Contact Intelligent :**
    - Le formulaire détecte le contenu du panier.
    - Pré-remplissage du message avec la liste des prestations souhaitées.
4.  **Options de Règlement :**
    - Multi-plateformes : Règlement sur place ou en ligne.
    - Modes acceptés : Espèces, CB et PayPal.
5.  **Application Native (Projet séparé) :**
    - Le calculateur VMA et le tracker GPS sont désormais dans le projet `run-app-native`.

## Stack Technique
- **Framework :** Next.js 15
- **Styling :** Tailwind CSS v4.
- **State Management :** React Context (CartProvider).
- **Paiement :** (Désactivé temporairement pour privilégier le contact direct).
