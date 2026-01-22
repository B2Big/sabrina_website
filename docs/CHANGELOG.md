# Journal des Modifications (Changelog)

## [0.3.0] - 2026-01-22 - Panier de Réservation & Split App Native
### Ajouté (Fonctionnalités)
- **Système de Panier (`CartContext`) :**
    - Permet d'ajouter plusieurs services (Coaching + Massage).
    - Gestion des quantités (+/-).
    - Calcul automatique du total.
- **Formulaire Intelligent (`ContactForm`) :**
    - Affiche un récapitulatif de la sélection.
    - Pré-remplit le message avec la liste détaillée des services.
    - Détection automatique de la catégorie (Sport ou Soin) pour le thème du formulaire.
- **Composant `FloatingCart` :**
    - Bouton flottant en bas d'écran qui apparaît dès qu'un service est ajouté.
    - Lien direct vers la finalisation de la demande.

### Modifié (UX/UI)
- **`ServiceCard` :** Remplacement du bouton "Réserver" par "Ajouter" (avec gestion quantité).
- **Navigation :** Tous les appels à l'action redirigent vers le formulaire de contact (ancre `#contact`).
- **Nettoyage :** Suppression complète du module "Pace Calculator" et de la section SaaS (déplacés vers le projet `run-app-native`).

## [0.2.0] - 2026-01-19 - Redesign "Pop & Wellness"
### Modifié (Direction Artistique)
- **Refonte totale du Design System :**
    - Abandon du thème "Warrior" (Noir/Rouge).
    - Adoption du thème "Pop & Wellness" (Blanc/Bleu/Rose).
- **Typographie & Ambiance :**
    - Style plus neutre, mixte et inclusif.
    - Formes arrondies (Border radius importants) pour plus de douceur.
- **Couleurs :**
    - **Coaching :** Bleu Électrique (`#3B82F6`) + Menthe.
    - **Massage :** Corail Pastel (`#F472B6`) + Pêche.
    - **Background :** Blanc lumineux.

### Modifié (Composants)
- **`Hero` :** Nouveau visuel splitté (Bleu/Rose) avec slogan neutre "Boostez votre Énergie / Cultivez votre Bien-être".
- **`ServiceCard` :** Adaptation dynamique des couleurs (bordures, icones, badges) selon la catégorie du service.
- **`Navbar` / `Footer` :** Passage en thème clair.
- **`ContactForm` :** Style épuré sur fond blanc.

## [0.1.0] - 2026-01-19
- Initialisation du projet et première version "Warrior" (Obsolète).