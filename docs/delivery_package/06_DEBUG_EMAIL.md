# 🔧 Guide de Débogage - Problème Email

> Problème : Le paiement Stripe fonctionne mais l'email de confirmation n'arrive pas.

---

## 🎯 Cause Probable

Le problème vient très probablement de l'**email d'expéditeur** (`FROM_EMAIL`).

### Explication
Dans `src/lib/resend.ts`, on avait :
```typescript
FROM_EMAIL = 'contact@sab-fit.com'  // En production
```

**Mais** le domaine `sab-fit.com` doit être **vérifié** sur Resend avant de pouvoir envoyer des emails avec cette adresse. Sinon, les emails sont rejetés silencieusement.

### Solution Immédiate Appliquée
J'ai modifié le code pour utiliser :
```typescript
FROM_EMAIL = 'onboarding@resend.dev'  // Email de test Resend
```

Cet email fonctionne immédiatement (limite : 100 emails/jour).

---

## ✅ Étapes de Résolution

### Étape 1 : Vérifier sur Netlify (Logs)

1. Allez sur https://app.netlify.com
2. Cliquez sur votre site `sab-fit`
3. Allez dans l'onglet **"Functions"** (ou "Serverless Functions")
4. Regardez les logs après un paiement test

**Ce que vous devriez voir :**
```
[WEBHOOK] ✅ Réservation mise à jour: xxx
[WEBHOOK] 📧 Envoi des emails de confirmation payée...
[WEBHOOK] ✅ Email CLIENT [PAYÉ] envoyé: { id: '...' }
[WEBHOOK] ✅ Email SABRINA [PAYÉ] envoyé: { id: '...' }
```

**Si vous voyez une erreur Resend**, notez-la.

---

### Étape 2 : Vérifier la Variable d'Environnement Resend

Sur Netlify :
1. Allez dans **"Site settings"** → **"Environment variables"**
2. Vérifiez que `RESEND_API_KEY` existe et est valide
3. La clé doit commencer par `re_`

Pour vérifier la clé :
1. Allez sur https://resend.com/api-keys
2. Comparez avec celle sur Netlify

---

### Étape 3 : Tester l'Envoi d'Email (Local)

Dans votre terminal local :

```bash
# Ajoutez la clé API temporairement
export RESEND_API_KEY=re_votre_cle_ici

# Lancez le script de test
npx tsx scripts/test-email.ts
```

**Résultat attendu :**
```
🧪 Test de configuration Resend...

1️⃣ Vérification de la clé API...
✅ Clé API valide
📊 Domaines configurés: onboarding.resend.dev

2️⃣ Test d'envoi d'email...
✅ Email envoyé avec succès !
📧 ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Vérifiez ensuite votre boîte mail (sabcompan8306@gmail.com).

---

### Étape 4 : Vérifier les Spams

Même si l'email part, il peut finir dans les spams car :
- `onboarding@resend.dev` n'est pas un domaine professionnel
- C'est un email de test

**Vérifiez :**
1. Boîte de réception
2. Dossier **SPAM** / **Indésirables**
3. Dossier **Promotions** (Gmail)

---

## 🔧 Solutions

### Solution A : Utiliser onboarding@resend.dev (Actuelle)

**Avantage :** Fonctionne immédiatement  
**Inconvénient :** Limite 100 emails/jour, peut aller en spam

**Configuration :**
```typescript
// src/lib/resend.ts
export const FROM_EMAIL = 'onboarding@resend.dev';
```

---

### Solution B : Vérifier le Domaine sab-fit.com (Recommandé)

**Avantage :** Emails professionnels, meilleure délivrabilité  
**Inconvénient :** Nécessite configuration DNS (24-48h)

**Étapes :**

1. **Sur Resend :**
   - Allez sur https://resend.com/domains
   - Cliquez "Add Domain"
   - Entrez : `sab-fit.com`
   - Copiez les enregistrements DNS (DKIM, SPF)

2. **Sur Infomaniak (ou votre registrar DNS) :**
   - Ajoutez les enregistrements DNS fournis par Resend
   - Attendez 24-48h la propagation

3. **Vérification :**
   - Retournez sur Resend
   - Cliquez "Verify" sur le domaine
   - Une fois vérifié (vert ✅), modifiez le code :

```typescript
// src/lib/resend.ts
export const FROM_EMAIL = 'contact@sab-fit.com';
```

4. **Redéployez :**
   ```bash
   git add src/lib/resend.ts
   git commit -m "fix: use verified domain for emails"
   git push
   ```

---

## 🧪 Test Complet après Correction

1. **Faites un paiement test** avec la carte `4242 4242 4242 4242`
2. **Vérifiez les logs Netlify** (doivent montrer "✅ Email envoyé")
3. **Vérifiez votre email client** (celui utilisé pour le paiement)
4. **Vérifiez l'email de Sabrina** (sabcompan8306@gmail.com)

**Les deux emails doivent arriver :**
- Client : Confirmation verte avec reçu
- Sabrina : Notification verte "Paiement reçu"

---

## 📞 Si ça ne marche toujours pas

Vérifiez ces points et envoyez-moi les infos :

1. **Logs Netlify** (copier/coller les lignes avec [WEBHOOK])
2. **Variable RESEND_API_KEY** est-elle bien définie ?
3. **Résultat du script test** (`npx tsx scripts/test-email.ts`)
4. **Email utilisé pour le test** (vérifier spam)

---

## ⚡ Résumé Rapide

| Problème | Solution |
|----------|----------|
| Email n'arrive pas | Utiliser `onboarding@resend.dev` en attendant |
| Email en spam | Normal avec domaine non vérifié, vérifier dossier spam |
| Erreur API Resend | Vérifier la clé API dans les variables Netlify |
| Limite 100/jour | Vérifier le domaine `sab-fit.com` sur Resend |

---

*Guide de débogage - Version 1.0*
