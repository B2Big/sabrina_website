# ✅ Checklist Configuration Klarna 3x - Sab-Fit

**Date** : 2026-03-22  
**Statut** : Configuration technique terminée ✅

---

## 🎯 Résumé des Modifications

### 1. Backend - API Checkout
**Fichier** : `src/app/api/checkout/route.ts`
- ✅ Ajout de `'klarna'` dans `payment_method_types` (ligne 165)
- ✅ Support du paramètre `preferredMethod` : `'klarna'` ou `'all'`
- ✅ Type Stripe importé pour la validation TypeScript

### 2. Frontend - Formulaire de Contact (3 BOUTONS)
**Fichier** : `src/components/contact-form.tsx`

| Bouton | Couleur | Méthode | Condition |
|--------|---------|---------|-----------|
| **Réserver uniquement** | Noir | Sur place | Toujours visible |
| **Payer par CB ou PayPal** | Bleu | Stripe (toutes) | Si panier non vide |
| **Payer en 3x sans frais** | Rose Klarna | Klarna uniquement | Si total ≥ 35€ |

- ✅ Badge "Klarna 3x" dans les options de règlement (carte récapitulative)
- ✅ Badge Klarna dans la section "Paiements acceptés"
- ✅ Message informatif si montant < 35€

### 3. Emails
**Fichier** : `src/lib/resend.ts`
- ✅ Email "Sur Place" : Mention "Klarna 3x" dans les moyens acceptés
- ✅ Email "Stripe Pending" : Mention "Klarna 3x sans frais"

### 4. Webhook
**Fichier** : `src/app/api/webhooks/stripe/route.ts`
- ✅ Log pour identifier le mode de paiement utilisé (Klarna, card, paypal)

---

## 🎨 Interface Utilisateur

### Affichage des boutons selon le montant

#### Si panier vide ou < 35€ :
```
┌─────────────────────────────┐
│    Réserver uniquement      │  ← Noir
└─────────────────────────────┘
         --- OU payer en ligne ---
┌─────────────────────────────┐
│   Payer par CB ou PayPal    │  ← Bleu
└─────────────────────────────┘
💡 Ajoutez des services pour atteindre 35€
   et accéder au paiement en 3x
```

#### Si panier ≥ 35€ :
```
┌─────────────────────────────┐
│    Réserver uniquement      │  ← Noir
└─────────────────────────────┘
         --- OU payer en ligne ---
┌─────────────────────────────┐
│   Payer par CB ou PayPal    │  ← Bleu
└─────────────────────────────┘
┌─────────────────────────────┐
│   💳 Payer en 3x sans frais │  ← Rose
└─────────────────────────────┘
```

---

## ⚠️ Actions Requises sur Stripe Dashboard

### 1. Activer Klarna dans Stripe
1. Se connecter à https://dashboard.stripe.com
2. Aller dans **Paramètres** → **Méthodes de paiement**
3. Trouver **Klarna** et cliquer sur **Activer**
4. Vérifier les conditions et confirmer

### 2. Configuration du Webhook (Déjà fait)
L'URL webhook est déjà configurée : `https://www.sab-fit.com/api/webhooks/stripe`

Événements écoutés :
- ✅ `checkout.session.completed`
- ✅ `checkout.session.async_payment_succeeded`
- ✅ `checkout.session.async_payment_failed`
- ✅ `payment_intent.payment_failed`

### 3. Tester en Mode Test
Avant de passer en production :

```bash
# 1. Aller sur le site
https://www.sab-fit.com

# 2. Ajouter un service au panier (montant > 35€)

# 3. Le bouton "Payer en 3x sans frais" apparaît

# 4. Cliquer sur le bouton rose Klarna

# 5. Sur la page Stripe, Klarna est la seule option disponible
```

---

## 🧪 Test Complet du Pipeline Klarna

### Scénario 1 : Paiement Klarna Réussi (via bouton dédié)
```
1. Client ajoute un service (ex: 100€) au panier
2. Bouton "Payer en 3x sans frais" visible (rose)
3. Client clique sur le bouton Klarna
4. Reçoit email BLEU "Finalisez votre paiement"
5. Sur Stripe, uniquement Klarna est disponible
6. Client complète le paiement en 3x
7. Webhook reçu → Statut passe à "paye_confirme"
8. Client reçoit email VERT avec reçu
9. Sabrina reçoit email VERT "Paiement reçu"
```

### Scénario 2 : Paiement Mixte (via bouton bleu)
```
1. Client ajoute un service (ex: 100€) au panier
2. Clique sur "Payer par CB ou PayPal"
3. Sur Stripe : CB, PayPal ET Klarna disponibles
4. Client choisit Klarna parmi les options
5. Même flux de confirmation
```

### Scénario 3 : Montant insuffisant
```
1. Client ajoute un service à 20€
2. Bouton Klarna masqué
3. Message informatif affiché
4. Client peut quand même payer en ligne (CB/PayPal)
```

---

## 📋 Contraintes Klarna

| Contrainte | Valeur | Notes |
|------------|--------|-------|
| **Montant minimum** | 35€ | En dessous, le bouton est masqué |
| **Montant maximum** | Variable | Selon profil client |
| **Pays** | France | Détecté automatiquement par IP |
| **Devise** | EUR | Déjà configuré |
| **Frais** | 0€ pour le client | Payés par le commerçant |

---

## 🔍 Logs à Vérifier

Après un paiement Klarna, chercher dans les logs Netlify :

```
💳 [CHECKOUT] Mode paiement: KLANRA 3x uniquement
💳 [CHECKOUT] Création session Stripe...
✅ [CHECKOUT] Réservation KLANRA 3x créée: xxx
💳 [WEBHOOK] Paiement réussi via KLARNA
✅ [WEBHOOK] Réservation mise à jour: xxx
📧 [WEBHOOK] Email CLIENT [PAYÉ] envoyé
```

---

## 🚨 Dépannage

### Problème : Le bouton "Payer en 3x" n'apparaît pas
**Causes possibles** :
1. Montant < 35€
2. Panier vide

**Solution** : Vérifier le total affiché dans le panier

### Problème : Klarna n'apparaît pas sur la page Stripe (bouton dédié)
**Causes possibles** :
1. Klarna non activé dans le Dashboard Stripe
2. Compte Stripe en mode test sans configuration Klarna test

**Solution** :
- Vérifier l'activation dans Stripe Dashboard
- Contacter Stripe support si besoin

### Problème : Webhook ne reçoit pas l'événement Klarna
**Vérification** :
1. Aller dans Stripe Dashboard → Developers → Webhooks
2. Vérifier les logs du webhook
3. Chercher l'événement `checkout.session.completed`

---

## 📞 Support

- **Stripe** : https://support.stripe.com
- **Klarna** : https://www.klarna.com/fr/entreprise/
- **Documentation Stripe Klarna** : https://stripe.com/docs/payments/klarna

---

## ✅ Résumé des Fichiers Modifiés

| Fichier | Changement |
|---------|------------|
| `src/app/api/checkout/route.ts` | Support `preferredMethod: 'klarna'` |
| `src/components/contact-form.tsx` | 3 boutons avec logique conditionnelle |
| `src/lib/resend.ts` | Emails mis à jour |
| `src/app/api/webhooks/stripe/route.ts` | Log mode de paiement |

---

**Configuration technique terminée ✅**  
**Action requise** : Activer Klarna dans le Dashboard Stripe
