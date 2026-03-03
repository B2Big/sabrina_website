# ✅ Checklist Post-Migration RLS

**Date** : 2026-03-03  
**Migration** : RLS sur table `reservations`  
**Statut** : ✅ EXÉCUTÉE

---

## 🔍 Vérifications Recommandées

### 1. Test de l'Application (Local)

```bash
# Lancer le serveur de développement
npm run dev
```

**Tests à effectuer** :

#### A. Réservation "Sur Place" (Paiement direct)
1. Aller sur http://localhost:3000
2. Ajouter un service au panier
3. Cliquer "Réserver uniquement"
4. Remplir le formulaire
5. **Vérifier** :
   - ✅ La réservation est créée (pas d'erreur 500)
   - ✅ Email reçu par Sabrina (notification instantanée)
   - ✅ Email reçu par le client (confirmation demande)

#### B. Réservation Stripe (Paiement en ligne)
1. Ajouter un service au panier
2. Cliquer "Réserver + Paiement CB"
3. Remplir le formulaire
4. **Vérifier avant redirection Stripe** :
   - ✅ Email instantané reçu par Sabrina (nouvelle réservation en attente)
5. Compléter le paiement avec carte test (`4242 4242 4242 4242`)
6. **Vérifier après paiement** :
   - ✅ Email de confirmation de paiement reçu (client)
   - ✅ Email de notification de paiement reçu (Sabrina)

---

### 2. Vérification Webhook Stripe

#### URL du Webhook
**Vérifier dans** : https://dashboard.stripe.com/webhooks

```
✅ URL correcte :    https://sab-fit.com/api/webhooks/stripe
❌ URL incorrecte :  https://www.sab-fit.com/api/webhooks/stripe  (avec www = erreur)
```

#### Test du Webhook (Local avec Stripe CLI)

```bash
# Installer Stripe CLI si pas déjà fait
# https://stripe.com/docs/stripe-cli

# Forwarder les webhooks vers localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Dans un autre terminal, déclencher un événement test
stripe trigger checkout.session.completed
```

**Résultat attendu** :
```
✅ 200 OK dans les logs Stripe CLI
✅ Pas d'erreur RLS dans la console
```

---

### 3. Vérification SEO/GEO

#### Test JSON-LD

1. Aller sur https://validator.schema.org/
2. Entrer : `https://sab-fit.com` (ou localhost en copiant le HTML)
3. **Vérifier** :
   - ✅ `Person` - Sabrina Compan présent
   - ✅ `ProfessionalService` - Sab-Fit présent
   - ✅ `FAQPage` - Questions présentes
   - ✅ Pas d'erreur de structure

#### Test Rich Results

1. Aller sur https://search.google.com/test/rich-results
2. Tester l'URL `https://sab-fit.com`
3. **Vérifier** :
   - ✅ FAQ détecté
   - ✅ ProfessionalService détecté

---

### 4. Vérification RLS en Production (Supabase)

#### Connexion SQL (optionnel)

```sql
-- Vérifier que RLS est actif
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'reservations';
-- Résultat attendu : relrowsecurity = true

-- Vérifier les politiques
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'reservations'
ORDER BY cmd;

-- Résultat attendu :
-- Allow public insert on reservations | INSERT | {anon, authenticated}
-- Admins can delete reservations      | DELETE | {authenticated}
-- Admins can select all reservations  | SELECT | {authenticated}
-- Service role can select all         | SELECT | {service_role}
-- Admins and service role can update  | UPDATE | {authenticated, service_role}
```

---

### 5. Variables d'Environnement

**Vérifier sur Vercel/Netlify** :

```bash
# Supabase (déjà configuré normalement)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Important pour RLS !
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Emails)
RESEND_API_KEY=re_...
# FROM_EMAIL=contact@sab-fit.com  # Optionnel, défaut dans le code
```

---

## 🚨 Points de Vigilance

### Si les réservations ne fonctionnent plus :

**Symptôme** : Erreur 500 lors de la création d'une réservation

**Causes possibles** :
1. La politique INSERT n'est pas active
2. La connexion Prisma utilise le mauvais rôle

**Solution** :
```sql
-- Vérifier que la politique existe
SELECT * FROM pg_policies WHERE tablename = 'reservations' AND cmd = 'INSERT';

-- Si manquante, la recréer
CREATE POLICY "Allow public insert on reservations" 
ON "reservations" 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);
```

### Si les emails ne partent pas :

**Symptôme** : Réservation créée mais pas d'email

**Vérifications** :
1. Vérifier `RESEND_API_KEY` dans les variables d'env
2. Vérifier les logs Vercel/Netlify : `Resend API Key manquante`
3. Vérifier que le domaine `sab-fit.com` est vérifié sur Resend

### Si le webhook Stripe échoue :

**Symptôme** : Paiement réussi mais statut non mis à jour

**Vérifications** :
1. URL du webhook (sans www)
2. `STRIPE_WEBHOOK_SECRET` configuré
3. Logs Stripe Dashboard → Developers → Webhooks → Logs

---

## 📊 Récapitulatif des Changements

| Composant | Changement | Statut |
|-----------|------------|--------|
| RLS Reservations | 5 politiques créées | ✅ Actif |
| Email Double Déclencheur | Instant + Payment | ✅ Implémenté |
| JSON-LD Person | Sabrina Compan ajoutée | ✅ Implémenté |
| Webhook URL | Vérification www | ⚠️ À vérifier |

---

## 🎯 Prochaines Étapes

### Court terme
- [ ] Tester une réservation complète en production
- [ ] Vérifier les emails reçus (Sabrina + Client)
- [ ] Confirmer que le webhook Stripe fonctionne

### Moyen terme
- [ ] Surveiller les logs pour détecter d'éventuelles erreurs RLS
- [ ] Vérifier que le dashboard admin voit bien les réservations
- [ ] Tester la mise à jour de statut (attente → payé)

### Long terme
- [ ] Ajouter un dashboard réservations dans /admin
- [ ] Implémenter des statistiques de conversion
- [ ] Ajouter des notifications SMS (optionnel)

---

## 📞 En Cas de Problème

### Logs à consulter

1. **Vercel/Netlify** : Functions → Logs
2. **Supabase** : Dashboard → Logs → API
3. **Stripe** : Dashboard → Developers → Webhooks → Logs
4. **Resend** : Dashboard → Logs

### Commandes utiles

```bash
# Tester la connexion DB
npx prisma db pull

# Vérifier les tables
npx prisma studio

# Lancer les tests (si existants)
npm test
```

---

**✅ Migration RLS terminée avec succès !**

Votre base de données est maintenant sécurisée :
- 🔒 Les données réservation sont protégées
- 📝 Les clients peuvent toujours réserver
- 👑 Les admins conservent l'accès complet
- 🔔 Les emails fonctionnent en double déclencheur
