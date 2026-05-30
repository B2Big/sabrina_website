# Configuration des Webhooks Stripe

Les webhooks Stripe permettent de recevoir des notifications en temps réel lorsqu'un paiement est effectué, échoue, ou change de statut.

## 📋 Prérequis

- Compte Stripe configuré
- Application déployée (ou tunnel ngrok pour tests locaux)

---

## 🔧 Configuration en Production

### 1. Créer le webhook dans Stripe Dashboard

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer sur "Add endpoint"
3. Entrer l'URL du webhook : `https://votre-domaine.com/api/webhooks/stripe`
4. Sélectionner les événements à écouter :
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.async_payment_succeeded`
   - ✅ `checkout.session.async_payment_failed`
   - ✅ `payment_intent.payment_failed`

5. Cliquer sur "Add endpoint"

### 2. Récupérer le Webhook Secret

Après avoir créé le webhook :
1. Cliquer sur le webhook dans la liste
2. Dans la section "Signing secret", cliquer sur "Reveal"
3. Copier la clé qui commence par `whsec_...`

### 3. Ajouter le secret dans les variables d'environnement

Ajouter dans `.env.local` (et dans votre plateforme de déploiement) :

```bash
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_A_COPIER_DEPUIS_STRIPE
```

### 4. Redéployer l'application

Après avoir ajouté la variable d'environnement, redéployer pour que les changements prennent effet.

---

## 🧪 Tests en Local (avec ngrok)

Pour tester les webhooks en local, vous devez exposer votre serveur local à Internet.

### Méthode 1 : Stripe CLI (Recommandée)

1. **Installer Stripe CLI** :
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop install stripe

   # Linux
   # Télécharger depuis https://github.com/stripe/stripe-cli/releases
   ```

2. **Se connecter** :
   ```bash
   stripe login
   ```

3. **Lancer le serveur local** :
   ```bash
   npm run dev
   ```

4. **Rediriger les webhooks vers le local** :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

5. **Récupérer le webhook secret** :
   La commande affiche quelque chose comme :
   ```
   > Ready! Your webhook signing secret is whsec_xxxxx
   ```

6. **Ajouter dans .env.local** :
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

7. **Tester un paiement** :
   ```bash
   stripe trigger checkout.session.completed
   ```

### Méthode 2 : ngrok

1. **Installer ngrok** :
   ```bash
   # macOS
   brew install ngrok

   # Ou télécharger sur https://ngrok.com/download
   ```

2. **Lancer le serveur local** :
   ```bash
   npm run dev
   ```

3. **Exposer le serveur** :
   ```bash
   ngrok http 3000
   ```

4. **Configurer le webhook sur Stripe** :
   - URL : `https://xxxx-xx-xx-xx-xx.ngrok.io/api/webhooks/stripe`
   - Récupérer le webhook secret comme en production

---

## 🔍 Vérification

### Tester que le webhook fonctionne

1. **Effectuer un paiement test** :
   - Aller sur votre site
   - Ajouter un service au panier
   - Utiliser une carte de test Stripe : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

2. **Vérifier les logs** :
   - Dans votre terminal, vous devriez voir :
     ```
     ✅ Paiement réussi: { sessionId: 'cs_test_...', amount: 70, ... }
     ✅ Commande enregistrée en base de données: cuid...
     ```

3. **Vérifier dans Stripe Dashboard** :
   - Aller dans Webhooks → Votre webhook
   - Onglet "Logs" pour voir les événements reçus

4. **Vérifier en base de données** :
   ```bash
   npx prisma studio
   ```
   - Ouvrir le modèle `Order`
   - Vérifier que la commande est là avec status `COMPLETED`

### Cartes de test Stripe

| Carte | Résultat |
|-------|----------|
| `4242 4242 4242 4242` | Paiement réussi |
| `4000 0025 0000 3155` | Requiert 3D Secure |
| `4000 0000 0000 9995` | Carte refusée (insuffisant) |
| `4000 0000 0000 0002` | Carte refusée (générique) |

---

## 📊 Événements Traités

| Événement | Description | Action |
|-----------|-------------|--------|
| `checkout.session.completed` | Paiement immédiat réussi (carte, PayPal) | Créer la commande en DB avec status COMPLETED |
| `checkout.session.async_payment_succeeded` | Paiement asynchrone réussi (virement SEPA) | Créer/mettre à jour la commande en COMPLETED |
| `checkout.session.async_payment_failed` | Paiement asynchrone échoué | Créer/mettre à jour la commande en FAILED |
| `payment_intent.payment_failed` | Échec de paiement | Logger l'échec |

---

## 🐛 Dépannage

### Erreur "Signature manquante"

- Le header `stripe-signature` n'est pas reçu
- Vérifier que la requête vient bien de Stripe
- Vérifier la configuration du webhook dans Stripe Dashboard

### Erreur "Webhook signature verification failed"

- Le `STRIPE_WEBHOOK_SECRET` est incorrect
- Vérifier que vous utilisez le bon secret (production vs test)
- Vérifier que la variable d'environnement est bien chargée

### Webhook reçu mais commande non enregistrée

- Vérifier les logs dans la console
- Vérifier que Prisma est bien configuré
- Exécuter les migrations : `npx prisma db push`

### Événements en double

- C'est normal, Stripe peut renvoyer le même événement plusieurs fois
- Le code gère les doublons via `stripeSessionId` unique

---

## 🚀 Prochaines Étapes (Optionnel)

1. **Envoyer des emails de confirmation** :
   - Utiliser Resend (déjà configuré)
   - Créer un template d'email
   - Envoyer après `handleCheckoutCompleted()`

2. **Créer un dashboard des commandes** :
   - Page `/admin/orders`
   - Lister toutes les commandes
   - Filtrer par statut, date, client

3. **Gérer les remboursements** :
   - Écouter `charge.refunded`
   - Mettre à jour le statut en `REFUNDED`

---

## 📚 Ressources

- [Documentation Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Tester les webhooks](https://stripe.com/docs/webhooks/test)
