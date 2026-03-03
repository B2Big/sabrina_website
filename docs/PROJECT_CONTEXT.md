# Contexte du Projet Sabrina Coaching

**Dernière mise à jour** : 2026-03-03
**Version** : Admin Pro Release
**Session** : 2026-02-20 à 2026-03-03

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
- **Dashboard Services** : CRUD complet + **réorganisation par glisser-déposer**
- **Gestion Panic Sell** : Interface simplifiée One-Click
- **Newsletter** : Statistiques, export CSV, copie emails
- **Audit Trail** : **Historique complet des actions admin (NOUVEAU)**
- **Rôles** : ADMIN (Sabrina) / DEVELOPER (Johan)
- **Sécurité** : **Session 1h avec timeout, Remember Me (NOUVEAU)**

---

## 5. État Actuel (03/03/2026)

### ✅ Opérationnel
- [x] Base de données connectée (Supabase)
- [x] Catalogue services dynamique avec **ordre personnalisable**
- [x] **Réservation "sur place" + emails** (2 templates)
- [x] **Paiement Stripe + webhooks** (2 templates)
- [x] **Emails Resend configurés** (domaine vérifié)
- [x] Dashboard admin sécurisé avec **Audit Trail complet**
- [x] **Session admin 1h avec timeout** et remember me
- [x] Système newsletter RGPD
- [x] Page CGU/RGPD
- [x] PWA installable
- [x] **SEO optimisé** (JSON-LD, WebP, meta tags)
- [x] **Images optimisées WebP** (-60% poids)

### ⚠️ Configuration Production
- [x] URL webhook Stripe configurée (`www.sab-fit.com`)
- [x] Variables d'environnement Netlify OK
- [x] Paiement Stripe testé en production
- [ ] Analytics (Google Analytics / Plausible) - optionnel
- [ ] Monitoring erreurs (Sentry) - optionnel

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
| `src/lib/audit.ts` | **Système d'audit trail (NOUVEAU)** |
| `src/app/api/webhooks/stripe/route.ts` | Handler webhook Stripe |
| `src/app/api/admin/audit-logs/route.ts` | **API audit logs (NOUVEAU)** |
| `src/components/contact-form.tsx` | Formulaire réservation |
| `src/components/admin/audit-log.tsx` | **Panel audit admin (NOUVEAU)** |
| `src/app/admin/layout.tsx` | **Layout avec timeout 1h (NOUVEAU)** |
| `src/lib/constants.ts` | **Constantes centralisées (NOUVEAU)** |
| `prisma/schema.prisma` | Modèles Reservation, AdminLog |

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
- [ ] **Dashboard réservations** - Vue liste des réservations clients dans /admin
- [ ] **Export CSV** - Export des données audit et réservations
- [ ] **Filtres audit avancés** - Par date, par action, par admin
- [ ] **Statistiques de vente** - Graphiques et métriques

### Moyen Terme
- [ ] **Calendrier réservations** - Vue calendrier des RDV
- [ ] **Notifications email** - Alertes nouvelles réservations
- [ ] **Programme de fidélité** - Points et récompenses
- [ ] **Espace client** - Historique achats clients

### Long Terme
- [ ] **Rappels automatiques** - SMS/email avant RDV
- [ ] **Intégration calendrier** - Google/Outlook
- [ ] **Application mobile native** - Si besoin identifié

---

## 10. Sécurité & Audit

### Audit Trail (Nouveau)
**12 types d'actions trackées automatiquement**:
- Connexions/déconnexions (LOGIN, LOGOUT)
- CRUD services (CREATE, UPDATE, DELETE)
- Gestion promotions
- Réorganisation services
- Actions système (EXPORT, CLEANUP)

**Données stockées**:
- User ID, email, IP address
- Action, entité concernée, détails JSON
- Timestamp précis

### Session Admin
- Timeout après 1h d'inactivité
- Avertissement 2min avant déconnexion
- Remember Me optionnel (30 jours)
- Double vérification (middleware + page)

---

**Projet stable et prêt pour production** 🚀
