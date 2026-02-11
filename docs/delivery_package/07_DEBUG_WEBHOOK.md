# 🔧 Guide de Débogage - Webhook Stripe

> Problème : Le paiement fonctionne mais les emails ne partent pas  
> Cause : Le webhook Stripe n'est pas déclenché ou mal configuré

---

## 🔍 Analyse des Logs

D'après tes logs :
```
✅ [CHECKOUT] Réservation créée: cmlhu6sg80000he163ocp13ix
✅ [CHECKOUT] Session Stripe créée et liée: cs_test_b1iXwu2dG6RS8NWL...
🔗 [CHECKOUT] URL de paiement: https://checkout.stripe.com/...
```

**Mais après, RIEN !**  
Pas de log `[WEBHOOK]`, pas d'email, pas de mise à jour.

**Conclusion : Le webhook Stripe n'est pas appelé.**

---

## ✅ Étapes de Vérification

### Étape 1 : Vérifier le Webhook dans Stripe Dashboard

1. Connecte-toi à https://dashboard.stripe.com
2. Va dans **Developers** → **Webhooks**
3. Vérifie qu'il existe un endpoint :
   - **URL** : `https://www.sab-fit.com/api/webhooks/stripe`
   - **Version** : Latest API version

**Si l'endpoint n'existe pas → Le créer (voir Étape 2)**

---

### Étape 2 : Créer le Webhook (si inexistant)

Dans Stripe Dashboard :

1. **Developers** → **Webhooks** → **+ Add endpoint**
2. **Endpoint URL** : 
   ```
   https://www.sab-fit.com/api/webhooks/stripe
   ```
3. **Description** : "Sab-Fit Production"
4. **Listen to** : Sélectionner ces événements :
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_succeeded`
   - ✅ `checkout.session.async_payment_failed`
   - ✅ `payment_intent.payment_failed`

5. Cliquez **Add endpoint**

---

### Étape 3 : Récupérer le Webhook Secret

Après avoir créé le webhook :

1. Clique sur le webhook dans la liste
2. Section **"Signing secret"**
3. Clique sur **"Reveal"**
4. Copie la clé qui commence par `whsec_...`

**Cette clé doit être ajoutée dans Netlify :**

```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

---

### Étape 4 : Vérifier sur Netlify

1. Va sur https://app.netlify.com
2. Ton site → **Site settings** → **Environment variables**
3. Vérifie que ces variables existent :

```bash
# Doivent être présentes :
STRIPE_SECRET_KEY=sk_live_...        # ou sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...      # CLÉ MANQUANTE ?
RESEND_API_KEY=re_...
```

**Si `STRIPE_WEBHOOK_SECRET` manque → L'ajouter**

---

### Étape 5 : Redéployer

Après avoir ajouté la variable d'environnement :

```bash
git commit --allow-empty -m "trigger: redeploy with webhook secret"
git push origin main
```

Ou sur Netlify : **Deploys** → **Trigger deploy** → **Deploy site**

---

## 🧪 Test du Webhook

### Méthode 1 : Stripe CLI (Recommandé)

```bash
# Installer Stripe CLI : https://stripe.com/docs/stripe-cli

# Se connecter
stripe login

# Écouter les webhooks localement
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Tester un paiement
stripe trigger checkout.session.completed
```

### Méthode 2 : Test en Production

1. Fais un vrai paiement test sur sab-fit.com
2. Utilise la carte : `4242 4242 4242 4242`
3. Sur Stripe Dashboard, va dans ton webhook
4. Onglet **"Logs"** → Tu dois voir l'événement

**Si "Logs" est vide → Le webhook n'est pas appelé**

---

## 🐛 Problèmes Courants

### Problème 1 : "No signatures found" dans les logs Netlify

**Symptôme** :
```
[WEBHOOK] ❌ Erreur de vérification de signature: No signatures found
```

**Solution** :
- Le header `stripe-signature` n'est pas transmis
- Vérifier que le webhook est bien configuré en POST (pas GET)

### Problème 2 : "Invalid signature"

**Symptôme** :
```
[WEBHOOK] ❌ Erreur de vérification de signature: Invalid signature
```

**Solution** :
- Mauvais `STRIPE_WEBHOOK_SECRET`
- Copier la bonne clé depuis Stripe Dashboard
- Redéployer après modification

### Problème 3 : Webhook en mode TEST vs LIVE

**Attention** : Stripe a 2 environnements :
- **Test mode** : pour les tests avec `sk_test_...`
- **Live mode** : pour la production avec `sk_live_...`

**Vérifier** :
1. Si tu utilises `sk_test_...` → Webhook doit être créé en mode TEST
2. Si tu utilises `sk_live_...` → Webhook doit être créé en mode LIVE

Sur le dashboard Stripe, regarde en haut à droite :
- "Test mode" (toggle gris) = Mode test
- "Live mode" (toggle vert) = Mode production

---

## 📋 Checklist Finale

| Élément | Où vérifier | Statut |
|---------|-------------|--------|
| Webhook existe | Stripe → Developers → Webhooks | ☐ |
| URL correcte (`https://www.sab-fit.com/api/webhooks/stripe`) | Stripe → Webhook details | ☐ |
| Événements sélectionnés | Stripe → Webhook → Events | ☐ |
| `STRIPE_WEBHOOK_SECRET` dans Netlify | Netlify → Env vars | ☐ |
| Mode TEST/LIVE cohérent | Stripe Dashboard (toggle) | ☐ |

---

## 🎯 Résumé

**Pour que les emails partent, il faut :**

1. ✅ Créer le webhook sur Stripe (URL : `/api/webhooks/stripe`)
2. ✅ Copier le `Signing secret` (commence par `whsec_`)
3. ✅ Ajouter `STRIPE_WEBHOOK_SECRET` dans les variables Netlify
4. ✅ Redéployer le site
5. ✅ Tester un paiement

**Si tout est OK**, tu verras dans les logs Netlify :
```
[WEBHOOK] ✅ Événement reçu: checkout.session.completed
[WEBHOOK] ✅ Réservation mise à jour: xxx
[WEBHOOK] ✅ Email CLIENT [PAYÉ] envoyé
[WEBHOOK] ✅ Email SABRINA [PAYÉ] envoyé
```

---

*Guide de débogage Webhook - Version 1.0*
