# Vision Produit : Sabrina Run (Native App)

## 1. Vision & Objectifs
Créer une application de running **native, minimaliste et haute performance** pour iOS et Android.
L'objectif est d'offrir aux coureurs un outil "sans friction" : on lance l'app, on a l'info, on court.

## 2. Piliers Fonctionnels

### A. Smart Calculator (VMA & Allures)
- **Problème :** Saisir "1h 05m 00s" est fastidieux sur mobile.
- **Solution :** Saisie intelligente "Smart Parsing".
- **Comportement :**
    - Tape `45` → `45m 00s`
    - Tape `4500` → `45m 00s`
    - Tape `110` → `1h 10m`
    - Tape `11000` → `1h 10m 00s`
- **Output :** VMA + Allures (EF, Marathon, Seuil) instantanées.

### B. Live Abstract Tracker
- **Design :** Pas de carte Google Maps classique (trop chargé).
- **Visuel :** Un tracé abstrait (ligne pointillée "Electric Blue" #3B82F6) qui se dessine sur fond noir profond (#09090B).
- **Data :** Dashboard ultra-lisible (Gros chiffres) : Chrono, Distance, Vitesse.

### C. Métronome Persistant
- **Technique :** Audio natif (pas de web hack).
- **Performance :** Doit fonctionner écran éteint.
- **Réglage :** 180 BPM par défaut (cadence idéale).

## 3. Design System (Dark Mode Only)
- **Background :** Deep Black (`#09090B`) ou Zinc 900 (`#18181B`).
- **Primaire :** Electric Blue (`#3B82F6`).
- **Typographie :** Sans-serif, Bold, tabular-nums pour les chronos.