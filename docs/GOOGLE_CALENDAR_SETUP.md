# 🔗 Guide : Connecter Google Calendar (OAuth2) au booking Sab-Fit

Ce guide explique comment créer le projet Google Cloud nécessaire pour activer la
synchronisation de l'agenda Google de Sabrina avec le système de réservation.

**Durée estimée : 15-20 minutes.** Aucun coût (Google Cloud est gratuit pour cet usage).

---

## Prérequis

- Un compte Google (celui de l'agenda de Sabrina, ex. `sabcompan8306@gmail.com`)
- Le site déployé avec la branche `feature/booking` (ou au minimum l'URL du redirect connue)

---

## Étape 1 : Créer le projet Google Cloud

1. Aller sur https://console.cloud.google.com/
2. En haut à gauche, cliquer sur le sélecteur de projet → **Nouveau projet**
3. Nom : `sab-fit-calendar` (ou ce que tu veux)
4. Cliquer **Créer** et attendre la création (quelques secondes)

## Étape 2 : Activer l'API Google Calendar

1. Dans le menu (☰) → **APIs et services** → **Bibliothèque**
2. Rechercher **"Google Calendar API"**
3. Cliquer dessus → **Activer**

## Étape 3 : Configurer l'écran de consentement OAuth

1. Menu (☰) → **APIs et services** → **Écran de consentement OAuth**
2. Type d'utilisateurs : **Externe** → Créer
3. Remplir :
   - Nom de l'application : `Sab-Fit`
   - Email d'assistance : l'email de Sabrina
   - Domaine autorisé : `sab-fit.com`
   - Email du développeur : l'email de Sabrina
4. **Champs d'application** (scopes) : cliquer **Ajouter ou supprimer des champs d'application** et ajouter :
   - `.../auth/calendar.events` (lecture/écriture des événements)
   - `.../auth/userinfo.email` (récupérer l'email du compte)
5. **Utilisateurs test** : ajouter l'email Google de Sabrina (indispensable tant que l'app est en mode "Test")
6. Terminer l'assistant

> ⚠️ L'app restera en mode **"Test"** tant qu'on ne la publie pas. En mode Test :
> seuls les utilisateurs listés peuvent se connecter, et le refresh token expire au bout de 7 jours.
> Pour un usage quotidien sans re-connexion hebdomadaire, il faudra **publier l'application**
> (Écran de consentement → Publier l'application — vérification Google possible mais pas obligatoire
> pour une app à usage interne mono-compte).

## Étape 4 : Créer l'identifiant OAuth (client)

1. Menu (☰) → **APIs et services** → **Identifiants**
2. **Créer des identifiants** → **ID client OAuth**
3. Type d'application : **Application Web**
4. Nom : `Sab-Fit Web`
5. **URI de redirection autorisés** — ajouter LES DEUX :
   - `https://www.sab-fit.com/api/admin/google-calendar/callback` (production)
   - `http://localhost:3000/api/admin/google-calendar/callback` (développement local)
6. Cliquer **Créer**

## Étape 5 : Récupérer le Client ID et le Secret

1. Dans la liste des identifiants, cliquer sur l'ID client créé
2. Noter :
   - **ID client** (ex. `1234567890-xxxx.apps.googleusercontent.com`)
   - **Code secret du client** (ex. `GOCSPX-xxxx`)

## Étape 6 : Générer la clé de chiffrement

Cette clé sert à chiffrer les tokens Google stockés en base. Génère-la avec :

```bash
openssl rand -base64 32
```

Copier le résultat (une longue chaîne de caractères).

## Étape 7 : Configurer les variables d'environnement

### En local (fichier `.env.local` — jamais commité)

```bash
GOOGLE_CLIENT_ID=1234567890-xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
CALENDAR_ENCRYPTION_KEY=<le résultat d'openssl>
```

### Sur Netlify (production)

1. Site settings → **Environment variables**
2. Ajouter les 3 mêmes variables avec les mêmes valeurs
3. **Redéployer** (Deploys → Trigger deploy)

## Étape 8 : Connecter l'agenda depuis l'admin

1. Ouvrir https://www.sab-fit.com/admin → onglet **Réservations**
2. Section **Google Calendar** → bouton **Connecter**
3. Se connecter avec le compte Google de Sabrina (celui de l'agenda)
4. Accepter le consentement (autoriser l'accès aux événements)
5. Retour sur l'admin : la section affiche **"Connecté"** avec l'email
6. Cliquer **Synchroniser** : les indispos de l'agenda masquent les créneaux du site

## Étape 9 : Vérifier le fonctionnement

1. Dans l'agenda Google de Sabrina, créer un événement demain à 10h
2. Admin → Réservations → **Synchroniser**
3. Vérifier que le créneau est bloqué sur le site (sélecteur de créneaux)
4. Faire une réservation test payée → l'événement apparaît dans l'agenda Google
5. Annuler la réservation → l'événement est supprimé de l'agenda

---

## Dépannage

| Problème | Solution |
|---|---|
| "Google Calendar non configuré" (503) | Les 3 variables d'env manquent ou le redéploiement Netlify n'a pas été fait |
| Refresh token expiré / reconnexion demandée | L'app est en mode "Test" → publier l'application (Étape 3) |
| "Refresh token manquant" | Déconnecter puis reconnecter avec l'option "Choisir un autre compte" |
| Redirect URI mismatch | Vérifier que les 2 URIs de l'Étape 4 sont exactement celles configurées |
| Synchronisation échouée | Vérifier que l'API Calendar est activée (Étape 2) |

## Rappel de sécurité

- Le code secret du client et la clé de chiffrement ne doivent JAMAIS être commités
- Les tokens sont stockés chiffrés (AES-256-GCM) dans Supabase
- Les routes d'administration Google Calendar sont protégées (admin uniquement)
