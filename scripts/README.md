# Scripts d'Administration

## 🔐 setup-admin-users.ts

Script pour créer et configurer les utilisateurs administrateurs avec leurs rôles.

### Prérequis

1. **Obtenir la clé Service Role de Supabase** :
   - Aller sur https://supabase.com/dashboard
   - Sélectionner votre projet
   - Aller dans `Settings` > `API`
   - Dans la section "Project API keys", copier la clé `service_role` (pas anon !)
   - ⚠️ ATTENTION : Cette clé a tous les pouvoirs, ne JAMAIS la committer ou l'exposer côté client

2. **Ajouter la clé dans .env.local** :
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Modifier le fichier setup-admin-users.ts** :
   - Remplir l'email et le mot de passe de Sabrina
   - Remplir votre email et mot de passe développeur
   - Les mots de passe doivent être forts (min 6 caractères pour Supabase)

### Utilisation

```bash
# Exécuter le script
npx tsx scripts/setup-admin-users.ts
```

### Que fait ce script ?

1. Crée les utilisateurs dans Supabase Auth (avec email auto-confirmé)
2. Attribue les rôles via les `app_metadata` :
   - `ADMIN` pour Sabrina (accès complet au dashboard)
   - `DEVELOPER` pour vous (accès complet au dashboard)
3. Si les utilisateurs existent déjà, met à jour leurs métadonnées

### Sécurité

⚠️ **IMPORTANT** : Ce script contient des mots de passe en clair !

Après utilisation :
1. Supprimer les mots de passe du fichier
2. OU supprimer le script complètement
3. OU ajouter `scripts/` au `.gitignore`

### Vérification

Après avoir exécuté le script :

1. Tester la connexion :
   - Aller sur http://localhost:3000/login
   - Se connecter avec l'un des comptes créés
   - Vérifier la redirection vers /admin

2. Vérifier dans Supabase Dashboard :
   - Aller dans `Authentication` > `Users`
   - Cliquer sur un utilisateur
   - Dans la section "User Metadata", vérifier que `app_metadata.role` est bien défini

### Dépannage

**Erreur "Variables manquantes"** :
- Vérifier que SUPABASE_SERVICE_ROLE_KEY est bien dans .env.local
- Relancer le terminal/IDE pour recharger les variables

**Erreur "Password should be at least 6 characters"** :
- Les mots de passe Supabase doivent faire au moins 6 caractères

**Utilisateur créé mais ne peut pas se connecter** :
- Vérifier dans Supabase Dashboard que l'email est confirmé
- Vérifier que `app_metadata.role` est bien défini
- Vérifier les logs du middleware (console.log dans middleware.ts)
