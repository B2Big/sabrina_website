# 🔐 Rotation des Credentials Exposés

## ✅ Rotation effectuée le 2026-09-05

- [x] **Mots de passe admin Supabase changés** (comptes `sabcompan8306@gmail.com` et `johan.dev.pro@gmail.com`) via `scripts/rotate-admin-passwords.mjs` — nouveaux mots de passe générés aléatoirement (20 caractères).
- [x] **`scripts/setup-admin-users.ts` sécurisé** — les mots de passe sont désormais lus depuis les variables d'environnement `ADMIN_SABRINA_PASSWORD` et `ADMIN_JOHAN_PASSWORD` (plus aucun secret en dur dans le code).
- [x] **`scripts/create-admin.js` supprimé** — script obsolète (mot de passe passé en argument de ligne de commande, ciblait l'ancien setup SQLite).
- [x] **`.gitignore` durci** — `.env.example` re-tracké, `.rotated-passwords.txt` ignoré.
- [x] **Le repo GitHub étant privé**, le nettoyage d'historique (git filter-repo) reste **optionnel** : la rotation rend les anciens mots de passe inutilisables. À faire seulement si le repo devient public.

> ⚠️ Après la rotation : penser à supprimer le script `scripts/rotate-admin-passwords.mjs` et le fichier `.rotated-passwords.txt` une fois les nouveaux mots de passe sauvegardés dans un gestionnaire de mots de passe.

---

## ⚠️ Contexte d'origine

Vos credentials avaient été exposés dans le fichier `.env.local` et potentiellement dans l'historique Git.

---

## 📋 Checklist de Sécurisation

- [ ] 1. Régénérer les clés Supabase
- [ ] 2. Changer le mot de passe PostgreSQL
- [ ] 3. Régénérer la clé API Resend
- [ ] 4. Nettoyer l'historique Git
- [ ] 5. Mettre à jour .gitignore
- [ ] 6. Mettre à jour les variables sur la plateforme de déploiement

---

## 1️⃣ Régénérer les Clés Supabase

### Dashboard → Settings → API

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans **Settings** → **API**

### Clé Anon (NEXT_PUBLIC_SUPABASE_ANON_KEY)

⚠️ **IMPORTANT** : La clé anon peut être publique (elle a des permissions limitées par RLS)
- Toutefois, par précaution, vous pouvez la regénérer
- Cette opération nécessite de redéployer l'application

**Pour régénérer** :
1. Dans Settings → API
2. Section "Project API keys"
3. Cliquer sur "Generate new anon key" (si disponible)
4. OU créer un nouveau projet et migrer les données

### Clé Service Role (SUPABASE_SERVICE_ROLE_KEY)

🚨 **CRITIQUE** : Cette clé donne un accès complet à votre base de données

Si elle est exposée :
1. La régénération n'est pas directement possible via l'interface
2. **Option 1** : Contacter le support Supabase pour rotation
3. **Option 2** : Créer un nouveau projet et migrer

**Pour l'instant** :
- Assurez-vous qu'elle n'est **JAMAIS** dans le code client
- Elle ne doit être que dans `.env.local` (git-ignoré) et sur le serveur

---

## 2️⃣ Changer le Mot de Passe PostgreSQL

### Dashboard → Settings → Database

1. Aller dans **Settings** → **Database**
2. Section "Database password"
3. Cliquer sur "Reset database password"
4. Copier le nouveau mot de passe
5. **IMPORTANT** : Supabase met à jour automatiquement les connection strings

### Mettre à jour .env.local

Après la rotation, Supabase vous donnera de nouvelles URLs :

```bash
# Ancien (EXPOSÉ - NE PLUS UTILISER)
DATABASE_URL="postgresql://postgres.xxx:ANCIEN_MOT_DE_PASSE@..."

# Nouveau (après rotation)
DATABASE_URL="postgresql://postgres.xxx:NOUVEAU_MOT_DE_PASSE@..."
DIRECT_URL="postgresql://postgres.xxx:NOUVEAU_MOT_DE_PASSE@..."
```

---

## 3️⃣ Régénérer la Clé API Resend

1. Aller sur https://resend.com/api-keys
2. Trouver la clé actuelle : `re_EXAMPLE_...`
3. Cliquer sur "Delete" ou "Revoke"
4. Créer une nouvelle clé :
   - Cliquer sur "Create API Key"
   - Nom : "Sabrina PWA Production"
   - Permissions : Send emails
   - Copier la nouvelle clé

### Mettre à jour .env.local

```bash
# Ancien (EXPOSÉ - NE PLUS UTILISER)
RESEND_API_KEY=re_VOTRE_NOUVELLE_CLE_ICI

# Nouveau
RESEND_API_KEY=re_NOUVELLE_CLE_ICI
```

---

## 4️⃣ Nettoyer l'Historique Git

Les credentials sont dans l'historique Git. **Deux options** :

### Option A : Supprimer le fichier de l'historique (Recommandée)

```bash
# Installer git-filter-repo (si pas déjà fait)
# macOS
brew install git-filter-repo

# Windows
# Télécharger depuis https://github.com/newren/git-filter-repo

# Supprimer .env.local de TOUT l'historique
git filter-repo --invert-paths --path .env.local --force

# Forcer le push (ATTENTION : destructif)
git push origin --force --all
```

### Option B : Créer un nouveau repository (Plus sûr)

```bash
# 1. Sauvegarder le code actuel
cd ..
cp -r sabrina sabrina-backup

# 2. Supprimer le dossier .git
cd sabrina
rm -rf .git

# 3. Initialiser un nouveau repo
git init
git add .
git commit -m "Initial commit - Clean history"

# 4. Créer un nouveau repo sur GitHub/GitLab
# 5. Pusher
git remote add origin https://github.com/votre-compte/nouveau-repo.git
git push -u origin main
```

---

## 5️⃣ Mettre à Jour .gitignore

Vérifier que `.gitignore` contient bien :

```gitignore
# Environment variables
.env
.env.local
.env*.local
.env.development
.env.production

# Éviter les fichiers sensibles
*.pem
*.key
secrets/
credentials/
```

### Vérifier que .env.local est ignoré

```bash
git status

# Ne devrait PAS afficher .env.local
# Si affiché, le retirer :
git rm --cached .env.local
git commit -m "Remove sensitive .env.local from tracking"
```

---

## 6️⃣ Mettre à Jour les Variables de Production

Si votre site est déjà déployé (Vercel, Netlify, etc.), mettre à jour les variables :

### Vercel

1. Aller sur https://vercel.com
2. Sélectionner votre projet
3. Settings → Environment Variables
4. Mettre à jour :
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `STRIPE_SECRET_KEY` (si vous l'aviez)
   - `STRIPE_WEBHOOK_SECRET` (si configuré)

5. **Redéployer** : Settings → Deployments → Dernière deployment → "Redeploy"

### Netlify

1. Site settings → Environment variables
2. Mettre à jour toutes les variables
3. Trigger deploy : Deploys → Trigger deploy

---

## 7️⃣ Nouvelles Bonnes Pratiques

### Utiliser un .env.example

Créer un fichier `.env.example` (SANS valeurs réelles) :

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
RESEND_API_KEY=re_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
NEXT_PUBLIC_URL=http://localhost:3000
```

Ce fichier peut être commité (il ne contient pas de valeurs secrètes).

### Utiliser un gestionnaire de secrets

Pour le développement en équipe :
- **1Password** / **Bitwarden** : Partager les secrets de manière sécurisée
- **Doppler** / **Infisical** : Gestionnaires de secrets pour équipes
- **GitHub Secrets** : Pour les variables CI/CD

---

## 🧪 Vérification

Après rotation, tester :

1. **Local** :
   ```bash
   npm run dev
   ```
   - Connexion au dashboard fonctionne
   - Création/modification de services fonctionne
   - Checkout Stripe fonctionne

2. **Production** :
   - Redéployer l'application
   - Tester les mêmes fonctionnalités

3. **Vérifier qu'aucun secret n'est exposé** :
   ```bash
   # Rechercher les anciens secrets dans le code
   grep -r "ANCIEN_MOT_DE_PASSE" .
   grep -r "re_EXAMPLE" .

   # Ne devrait rien trouver (sauf dans ce fichier doc)
   ```

---

## ✅ Checklist Finale

Après avoir tout fait :

- [ ] Tous les credentials ont été régénérés
- [ ] `.env.local` contient les nouvelles valeurs
- [ ] `.env.local` est dans `.gitignore`
- [ ] L'historique Git a été nettoyé
- [ ] Les variables de production sont à jour
- [ ] L'application fonctionne en local
- [ ] L'application fonctionne en production
- [ ] Aucun ancien secret n'est trouvé dans le code

---

## 📞 Support

Si vous avez des problèmes :

- **Supabase** : https://supabase.com/support
- **Resend** : support@resend.com
- **Stripe** : https://support.stripe.com

---

## ⏰ Temps Estimé

- Rotation Supabase : 10 minutes
- Rotation Resend : 2 minutes
- Nettoyage Git : 15 minutes
- Tests : 10 minutes

**Total : ~40 minutes**

**À FAIRE MAINTENANT** - Ne pas reporter cette tâche !
