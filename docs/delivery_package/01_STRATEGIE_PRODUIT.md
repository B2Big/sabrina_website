# 📋 Stratégie Produit - Sab-Fit

## Vision : L'Alliance du Coaching Sportif et du Soin

### Positionnement
Sab-Fit incarne une **rupture douce** dans le monde du bien-être digital :
- **Côté Guerrière** : Performance, dépassement de soi, résultats concrets
- **Côté Care** : Écoute, récupération, bien-être holistique

> *"On ne choisit pas entre performance et bien-être. On les allie."*

### Promesse
Offrir à chaque client un **parcours digital fluide** qui accompagne son expérience de A à Z :
1. **Découverte** : Site web immersif et inspirant
2. **Engagement** : Réservation et paiement simplifiés
3. **Confirmation** : Emails professionnels et rassurants
4. **Fidélisation** : Suivi personnalisé et offres exclusives

---

## 👥 Personas

### Persona 1 : "Clara la Sportive Active"

```
┌─────────────────────────────────────────────────────────────┐
│  CLARA - 32 ans - Ingénieure - Paris                        │
├─────────────────────────────────────────────────────────────┤
│  🎯 Objectif : Se préparer pour un semi-marathon           │
│  💰 Budget : Premium (800-1200€/an pour coaching)          │
│  📱 Tech-savvy : Utilise son téléphone pour tout           │
├─────────────────────────────────────────────────────────────┤
│  FRUSTRATIONS :                                             │
│  • Ses anciens coaches utilisaient WhatsApp + Excel        │
│  • Difficile de réserver rapidement un créneau             │
│  • Veut payer en ligne sans appeler                        │
├─────────────────────────────────────────────────────────────┤
│  CE QU'ELLE AIME CHEZ SAB-FIT :                            │
│  • Pouvoir réserver et payer en 3 clics sur son tel        │
│  • Les visuels "badass" qui la motivent                    │
│  • Pouvoir réserver un massage post-course en ligne        │
└─────────────────────────────────────────────────────────────┘
```

**Parcours type :**
1. Découvre Sab-Fit via Instagram
2. Réserve un bilan fitness sur le site web depuis son téléphone
3. Paie en ligne avec sa carte
4. Reçoit la confirmation par email avec le détail
5. Réserve régulièrement des massages de récupération

---

### Persona 2 : "Marc en Récupération"

```
┌─────────────────────────────────────────────────────────────┐
│  MARC - 45 ans - Cadre - Stressé - Banlieue                 │
├─────────────────────────────────────────────────────────────┤
│  🎯 Objectif : Réduire son stress, retrouver le sommeil    │
│  💰 Budget : Moyen (300-500€/trimestre)                    │
│  📱 Tech : Utilise son téléphone mais préfère le simple    │
├─────────────────────────────────────────────────────────────┤
│  FRUSTRATIONS :                                             │
│  • Trop de choix sur Internet, ne sait pas vers qui se tourner│
│  • Peur des coachs trop "intenses"                          │
│  • Veut une approche douce mais efficace                   │
├─────────────────────────────────────────────────────────────┤
│  CE QU'IL AIME CHEZ SAB-FIT :                              │
│  • L'aspect "Wellness" du site (pas trop agressif)         │
│  • Pouvoir payer en ligne et tout gérer depuis son tel     │
│  • Les cures de massages avec forfait (simple à comprendre)│
└─────────────────────────────────────────────────────────────┘
```

**Parcours type :**
1. Recherche "massage thérapeutique + ville" sur Google
2. Atterrit sur sab-fit.com (design rassurant)
3. Achète une cure de 5 massages en ligne
4. Reçoit les confirmations par email
5. Débute un coaching doux pour reprendre le sport

---

## 📚 User Stories (Backlog Priorisé)

### 🔴 Priorité Haute (MVP - Livré)

#### En tant qu'Administrateur (Sabrina)...

```markdown
US-ADMIN-001
Titre : Gérer mes services
En tant que Sabrina
Je veux ajouter/modifier/supprimer des services (coaching, massage, cure)
Afin de mettre à jour mon catalogue en temps réel

Critères d'acceptation :
- [x] CRUD complet depuis le dashboard
- [x] Upload d'image pour chaque service
- [x] Gestion des prix et durées
- [x] Catégorisation (Coaching, Massages, Cures)
```

```markdown
US-ADMIN-002
Titre : Créer des promotions flash
En tant que Sabrina
Je veux lancer des offres promotionnelles en quelques clics
Afin de booster mes ventes ponctuellement

Critères d'acceptation :
- [x] Interface "One-Click" pour créer une promo
- [x] Sélection des services concernés
- [x] Durée de validité configurable
- [x] Pourcentage de réduction ajustable
- [x] Bandeau automatique sur le site
```

```markdown
US-ADMIN-003
Titre : Suivre les réservations
En tant que Sabrina
Je veux voir toutes mes réservations avec leur statut
Afin de gérer mon planning et mes paiements

Critères d'acceptation :
- [x] Liste des réservations avec filtres (date, statut, client)
- [x] Statuts : En attente de paiement, Payé, Annulé
- [x] Détails client (nom, téléphone, message)
- [x] Export des données si besoin
```

```markdown
US-ADMIN-004
Titre : Gérer ma newsletter
En tant que Sabrina
Je veux exporter mes abonnés et voir les statistiques
Afin de communiquer avec ma clientèle

Critères d'acceptation :
- [x] Export CSV des emails
- [x] Copie rapide des emails actifs
- [x] Statistiques (total, actifs, désinscrits)
- [x] Conformité RGPD (token de désinscription)
```

---

#### En tant que Client Web...

```markdown
US-WEB-001
Titre : Découvrir les services
En tant que visiteur
Je veux voir les prestations disponibles avec leurs détails
Afin de choisir celle qui me convient

Critères d'acceptation :
- [x] Page d'accueil avec catalogues dynamiques
- [x] Fiches service (titre, description, prix, durée)
- [x] Badges "Populaire" et "Meilleur Rapport Qualité/Prix"
- [x] Design responsive (mobile & desktop)
```

```markdown
US-WEB-002
Titre : Ajouter au panier et réserver
En tant que client
Je veux ajouter des services à mon panier et finaliser ma réservation
Afin de réserver mes séances facilement

Critères d'acceptation :
- [x] Panier flottant visible sur toute la page
- [x] Deux options de paiement : Sur Place ou En Ligne (Stripe)
- [x] Formulaire de contact intégré au panier
- [x] Email de confirmation automatique
```

```markdown
US-WEB-003
Titre : Payer en ligne sécurisé
En tant que client
Je veux payer par carte bancaire ou PayPal en toute sécurité
Afin de confirmer ma réservation immédiatement

Critères d'acceptation :
- [x] Redirection vers Stripe Checkout
- [x] Paiement par carte ou PayPal
- [x] Reçu automatique par email
- [x] Page de confirmation post-paiement
```

---

### 🟡 Priorité Moyenne (Phase 2)

```markdown
US-ADMIN-005
Titre : Gérer un calendrier de disponibilités
En tant que Sabrina
Je veux définir mes créneaux horaires disponibles
Afin que les clients réservent directement des slots précis

Critères d'acceptation :
- [ ] Interface calendrier (vue semaine)
- [ ] Définition des créneaux récurrents
- [ ] Gestion des indisponibilités (congés)
- [ ] Blocage automatique après réservation
```

```markdown
US-WEB-004
Titre : Espace client personnel
En tant que client
Je veux créer un compte pour voir mon historique
Afin de suivre mes séances et mes paiements

Critères d'acceptation :
- [ ] Inscription/Connexion
- [ ] Dashboard personnel (prochain RDV, historique)
- [ ] Téléchargement des factures
- [ ] Modification des coordonnées
```

```markdown
US-WEB-005
Titre : Recevoir des rappels automatiques
En tant que client
Je veux recevoir un email 24h avant mon RDV
Afin de ne pas oublier ma séance

Critères d'acceptation :
- [ ] Email automatique 24h avant
- [ ] SMS optionnel
- [ ] Possibilité de reporter depuis l'email
```

---

### 🟢 Priorité Basse (Phase 3)

```markdown
US-ADMIN-006
Titre : Programme de fidélité
En tant que Sabrina
Je veux attribuer des points à mes clients fidèles
Afin de les récompenser et les fidéliser

Critères d'acceptation :
- [ ] Système de points (1€ = 1 point)
- [ ] Seuils de récompense (ex: 500pts = 1h gratuite)
- [ ] Dashboard des clients VIP
- [ ] Notifications automatiques de récompenses
```

```markdown
US-WEB-006
Titre : Laisser un avis
En tant que client
Je veux laisser un témoignage sur ma séance
Afin de partager mon expérience

Critères d'acceptation :
- [ ] Formulaire d'avis post-séance
- [ ] Modération par Sabrina
- [ ] Affichage sur le site (optionnel)
- [ ] Photos avant/après (optionnel)
```

---

## 📊 Matrice de Priorisation

```
                    IMPACT ÉLEVÉ
                          │
    US-WEB-002           │    US-ADMIN-002
    (Panier/Paiement)    │    (Promotions)
                          │
    ─────────────────────┼─────────────────────
    US-ADMIN-001         │    US-WEB-004
    (Gestion Services)   │    (Espace client)
                          │
                    IMPACT FAIBLE
                    
    ←── EFFORT FAIBLE ───┼─── EFFORT ÉLEVÉ ──→
```

---

## 🎯 Métriques de Succès (KPIs)

| Métrique | Cible 3 mois | Cible 6 mois |
|----------|--------------|--------------|
| Taux de conversion (visite → réservation) | 5% | 8% |
| Panier moyen | 150€ | 200€ |
| % de paiements en ligne vs sur place | 60% | 70% |
| Taux d'ouverture des emails | 25% | 30% |
| Temps moyen de création d'une promo | < 2 min | < 1 min |
| Score de satisfaction client | 4.5/5 | 4.8/5 |

---

*Document stratégique - Version 1.0*
