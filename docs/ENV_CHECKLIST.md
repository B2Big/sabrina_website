# Checklist Variables d'Environnement Netlify - Sab-Fit

## ✅ Variables Requises pour la Production

### Base de données (Supabase/Prisma)
```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

### Authentification (Supabase)
```
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (pour scripts admin uniquement)
```

### Paiement (Stripe)
```
STRIPE_SECRET_KEY=sk_live_... (⚠️ CLÉ LIVE EN PROD)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email (Resend)
```
RESEND_API_KEY=re_...
```

### Application
```
NEXT_PUBLIC_URL=https://sab-fit.com
NODE_ENV=production
```

## 🔍 Comment Vérifier sur Netlify

1. Aller sur **Site settings** > **Environment variables**
2. Vérifier que toutes les variables ci-dessus sont présentes
3. S'assurer qu'il n'y a pas de variables `sk_test_` (Stripe test) en prod

## ⚠️ Points de Vigilance

- [ ] `STRIPE_SECRET_KEY` doit commencer par `sk_live_` (pas `sk_test_`)
- [ ] `NEXT_PUBLIC_URL` doit être `https://sab-fit.com` (sans slash final)
- [ ] Aucune clé API ne doit être exposée dans le code source
- [ ] Les variables `NEXT_PUBLIC_*` sont visibles côté client

## 🚨 Vérification Post-Déploiement

 Tester :
1. Paiement Stripe en mode LIVE (petit montant)
2. Réception des emails de confirmation
3. Webhook Stripe (status 200 dans logs)
4. Connexion admin fonctionnelle
