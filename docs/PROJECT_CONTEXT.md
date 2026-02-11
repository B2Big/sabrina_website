# Contexte du Projet Sabrina Coaching

**Dernière mise à jour** : 2026-02-11

---

## 1. Vue d'ensemble 360°

Plateforme web "Mobile-First" (PWA) pour Sabrina, coach sportive et masseuse.
Le projet est désormais consolidé autour d'une **application web unique** (Next.js) qui gère :
- La vitrine des services (Coaching & Massages)
- La réservation et le paiement en ligne (Stripe)
- **La réservation avec paiement sur place** (NOUVEAU)
- Un moteur de promotion psychologique ("Panic Sell")
- Une administration complète
- Les notifications email automatiques (Resend)

*Note : Le projet d'application native séparée a été abandonné pour centraliser les efforts sur cette PWA.*

---

## 2. Stack Technique

| Composant | Technologie |
|-----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Langage** | TypeScript / React 19 |
| **Styling** | Tailwind CSS 4 + Framer Motion |
| **Backend (BaaS)** | Supabase (PostgreSQL + Auth) |
| **ORM** | Prisma v5 |
| **Paiement** | Stripe Checkout |
| **Emails** | Resend API (domaine sab-fit.com vérifié) |
| **Déploiement** | Netlify |

---

## 3. Architecture des Données (PostgreSQL)

### Modèles Principaux :

1. **services** : Prestations (Titre, Prix, Catégorie, etc.)
2. **promotions** : Offres temporaires ("Panic Sell")
3. **users** : Administrateurs (Sabrina)
4. **reservations** : Réservations clients (NOUVEAU)
   - `status` : `attente_paiement_sur_place` | `paye_confirme` | `annule` | `termine`
   - `paymentMethod` : `sur_place` | `stripe`
   - `stripeSessionId`, `stripePaymentId`, `paidAt`
5. **newsletter_subscribers** : Abonnés newsletter (RGPD)

---

## 4. Fonctionnalités Clés

### A. Partie Publique (Front-Office)

#### Catalogue & Panier
- **Catalogue Dynamique** : Services récupérés en temps réel depuis la BDD
- **Panic Sell (Vente Flash)** : Bandeau d'alerte avec calcul auto des prix barrés
- **Panier Flottant** : Affiche le total et permet la réservation

#### Réservation (DUAL FLOW)

| Flux | Paiement | Emails | Statut |
|------|----------|--------|--------|
| **Sur Place** | Lors du RDV | 🟠 Orange (confirmation) | `attente_paiement_sur_place` |
| **En Ligne** | Stripe | 🟢 Vert (reçu inclus) | `paye_confirme` |

**Emails automatiques** (via Resend) :
- Client : Confirmation de réservation
- Sabrina : Notification nouvelle réservation

### B. Administration (Back-Office)

Accessible via `/admin`
- **Dashboard Services** : CRUD complet
- **Gestion Panic Sell** : Interface simplifiée One-Click
- **Newsletter** : Statistiques, export CSV, copie emails
- **Rôles** : ADMIN (Sabrina) / DEVELOPER (Johan)

---

## 5. État Actuel (11/02/2026)

### ✅ Opérationnel
- [x] Base de données connectée (Supabase)
- [x] Catalogue services dynamique
- [x] **Réservation "sur place" + emails** (NOUVEAU)
- [x] **Paiement Stripe + webhooks** (NOUVEAU)
- [x] **Emails Resend configurés** (domaine vérifié)
- [x] Dashboard admin sécurisé
- [x] Système newsletter RGPD
- [x] Page CGU/RGPD
- [x] PWA installable

### ⚠️ Configuration Production
- [ ] Mettre à jour URL webhook Stripe (`www.sab-fit.com`)
- [ ] Vérifier variables d'environnement Netlify
- [ ] Tester avec vrai paiement Stripe

---

## 6. Flux de Réservation (Détail)

### A. Paiement sur Place
```
Formulaire → Validation Zod → Création DB (attente_paiement_sur_place)
→ Email client (🟠) → Email Sabrina (🟠)
```

### B. Paiement en Ligne (Stripe)
```
Formulaire → Création DB → Session Stripe → Redirection paiement
→ Webhook checkout.session.completed → Mise à jour DB (paye_confirme)
→ Email client (🟢 avec reçu) → Email Sabrina (🟢)
```

---

## 7. Fichiers Clés

| Fichier | Rôle |
|---------|------|
| `src/app/actions.ts` | Server action réservation sur place |
| `src/lib/resend.ts` | Templates emails (4 variants) |
| `src/app/api/webhooks/stripe/route.ts` | Handler webhook Stripe |
| `src/components/contact-form.tsx` | Formulaire réservation |
| `prisma/schema.prisma` | Modèle Reservation |

---

## 8. Configuration Email (Resend)

- **Domaine** : `sab-fit.com` ✅ Vérifié (DKIM + SPF)
- **From** : `contact@sab-fit.com`
- **To Client** : Email fourni dans le formulaire
- **To Admin** : `sabcompan8306@gmail.com`

**Templates** :
- `sendConfirmationToCustomerSurPlace()` - 🟠 Client (sur place)
- `sendNotificationToSabrinaSurPlace()` - 🟠 Admin (sur place)
- `sendConfirmationToCustomerPaye()` - 🟢 Client (payé)
- `sendNotificationToSabrinaPaye()` - 🟢 Admin (payé)

---

## 9. Roadmap

### Court Terme
- [ ] Dashboard réservations dans /admin
- [ ] Statistiques de vente
- [ ] Gestion des créneaux horaires

### Moyen Terme
- [ ] Programme de fidélité
- [ ] Espace client avec historique
- [ ] Rappels automatiques (RDV)

### Long Terme
- [ ] Application mobile native (si besoin)
- [ ] Intégration calendrier (Google/Outlook)

---

**Projet stable et prêt pour production** 🚀
