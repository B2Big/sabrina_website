# 📧 Configuration du Système de Newsletter

**Statut** : ✅ Implémentation terminée
**Date** : 2026-01-27

---

## 🎉 Ce Qui a Été Ajouté

### 1. **Checkbox Newsletter au Checkout Stripe**
- Lors du paiement, les clients peuvent cocher "Je souhaite recevoir les offres"
- Consentement RGPD explicite ✅
- Facultatif (pas obligatoire pour acheter)

### 2. **Table Base de Données**
Nouveau modèle `NewsletterSubscriber` avec :
- Email + nom du client
- Source d'inscription (`checkout`, `footer`, `popup`)
- Statut actif/désinscrit
- Token de désinscription unique (RGPD)
- Consentement + IP (conformité)

### 3. **Enregistrement Automatique**
- Webhook Stripe détecte si le client a coché "Oui"
- Enregistrement automatique dans la base de données
- Réabonnement automatique si déjà désinscrit

### 4. **Dashboard Admin Complet**
Nouvel onglet "📧 Newsletter" avec :
- **Statistiques** : Total, Actifs, Désinscrits, Nouveaux cette semaine
- **Export CSV** : Un clic pour exporter tous les emails
- **Copier emails** : Copier la liste des emails actifs dans le presse-papiers
- **Filtres** : Afficher tous / actifs / désinscrits
- **Actions** : Désinscrire, Réabonner, Supprimer (RGPD)

### 5. **Page CGU/RGPD**
- Route `/cgu` créée
- Conditions générales conformes au droit français
- Section RGPD détaillée avec droits des utilisateurs

---

## 🚀 Mise en Service (Actions Requises)

### Étape 1 : Résoudre le Problème Prisma ⚠️

Vous avez une erreur d'authentification PostgreSQL. C'est à cause de l'encodage du mot de passe.

**Ouvrez `.env.local` et vérifiez** :

```bash
# Le @ dans votre mot de passe DOIT être encodé en %40
DIRECT_URL=postgresql://postgres.abfhvkrrlnuldwgzpxaj:MOT_DE_PASSE_ENCODE@db.abfhvkrrlnuldwgzpxaj.supabase.co:5432/postgres
```

Si ce n'est pas le cas, modifiez et relancez :

```bash
npx prisma db push
```

**Résultat attendu** :
```
✔ Database synced with Prisma schema
```

---

### Étape 2 : Tester le Checkout avec Newsletter

```bash
# 1. Relancer le serveur
npm run dev

# 2. Aller sur http://localhost:3000

# 3. Ajouter un service au panier

# 4. Cliquer sur "Payer"

# 5. Sur Stripe Checkout, vous verrez :
#    📧 Je souhaite recevoir les offres et nouveautés de Sabrina Wellness par email
#    [ Dropdown: Oui / Non ]

# 6. Sélectionner "Oui, je m'abonne"

# 7. Payer avec la carte test : 4242 4242 4242 4242

# 8. Vérifier dans /admin → onglet Newsletter
```

---

### Étape 3 : Vérifier dans le Dashboard

Aller sur http://localhost:3000/admin → Onglet **📧 Newsletter**

Vous devriez voir :
- ✅ Statistiques : 1 actif, 1 nouveau cette semaine
- ✅ L'email du client dans la liste
- ✅ Boutons : Export CSV, Copier emails, Désinscrire, Supprimer

---

## 💡 Utilisation au Quotidien

### Envoyer une Promo par Email

**Méthode 1 : Copier les Emails** (Rapide)
1. Admin → Newsletter
2. Cliquer sur "Copier emails actifs"
3. Ouvrir votre client email (Gmail, Outlook, etc.)
4. Nouveau message
5. Coller dans le champ "Cci" (pour masquer les destinataires)
6. Rédiger votre promo
7. Envoyer !

**Méthode 2 : Export CSV** (Pour outil externe)
1. Admin → Newsletter
2. Cliquer sur "Exporter CSV"
3. Importer le CSV dans :
   - **Brevo** (gratuit jusqu'à 300 emails/jour) 🇫🇷
   - **Mailchimp** (gratuit jusqu'à 500 contacts)
   - **Sendinblue** / **MailerLite**

4. Créer une campagne et envoyer

**Méthode 3 : Integration Resend** (Future amélioration)
- Créer un formulaire d'envoi dans l'admin
- Templates d'emails prédéfinis
- Envoi direct depuis le dashboard
- **Temps d'implémentation : ~1h** (à faire plus tard si besoin)

---

## 📊 Statistiques Disponibles

Dans l'onglet Newsletter, vous voyez :

| Métrique | Description |
|----------|-------------|
| **Total** | Nombre total d'abonnés (actifs + désinscrits) |
| **Actifs** | Nombre de personnes qui reçoivent les emails |
| **Désinscrits** | Nombre de personnes qui se sont désabonnées |
| **Cette semaine** | Nouveaux abonnés des 7 derniers jours |

---

## 🛡️ Conformité RGPD

### Ce qui est déjà conforme ✅

1. **Consentement explicite**
   - Checkbox facultative au checkout
   - Pas de case pré-cochée

2. **Droit de désinscription**
   - Token unique pour chaque abonné
   - Possibilité de se désinscrire à tout moment
   - Admin peut désinscrire manuellement

3. **Droit à l'effacement**
   - Bouton "Supprimer" dans l'admin
   - Suppression définitive des données

4. **Traçabilité**
   - Date d'inscription enregistrée
   - Source de l'inscription (checkout)
   - Consentement explicite stocké

5. **Transparence**
   - Page CGU accessible : `/cgu`
   - Droits RGPD expliqués clairement

### À ajouter (optionnel) :

- [ ] Lien de désinscription dans les emails
- [ ] Page de gestion des préférences
- [ ] Formulaire de contact pour exercer les droits RGPD

---

## 🎯 Workflows Recommandés

### Workflow 1 : Promo Mensuelle
```
1. Créer une nouvelle promotion dans l'admin
2. Aller sur Newsletter → Copier emails actifs
3. Créer un brouillon email dans Gmail/Outlook
4. Coller dans Cci
5. Écrire :
   Objet : 🎁 -20% sur tous les massages ce mois-ci !
   Corps : [Votre message + lien vers le site]
6. Envoyer
```

### Workflow 2 : Annonce Nouveau Service
```
1. Ajouter le nouveau service dans l'admin
2. Newsletter → Export CSV
3. Importer dans Brevo
4. Créer campagne "Nouveau service : [Nom]"
5. Utiliser template professionnel
6. Planifier envoi
```

### Workflow 3 : Offre Flash (48h)
```
1. Créer promo avec dates de début/fin
2. Copier emails
3. Email urgent :
   Objet : ⚡ Offre Flash 48h : -30% Coaching
   Message court + lien
4. Envoyer immédiatement
```

---

## 📈 Bonnes Pratiques Email Marketing

### Fréquence d'Envoi
- ✅ **1-2 fois par mois** : Idéal pour ne pas lasser
- ⚠️ **1 fois par semaine** : Maximum acceptable
- ❌ **Tous les jours** : Taux de désinscription élevé

### Contenu
- **80% de valeur, 20% de promo**
- Conseils bien-être, astuces coaching
- Témoignages clients
- Nouveautés

### Timing
- **Meilleur jour** : Mardi ou Jeudi
- **Meilleure heure** : 10h-11h ou 18h-19h
- Éviter : Lundi matin, Vendredi après-midi, Week-end

### Objet de l'Email
- ✅ Court (< 50 caractères)
- ✅ Actionnable : "Découvrez", "Profitez", "Réservez"
- ✅ Emoji (avec modération) : 🎁 ⚡ 💪
- ❌ TOUT EN MAJUSCULES
- ❌ Trop de !!!!!

---

## 🔮 Améliorations Futures (Optionnel)

### Phase 2 : Automatisation
- [ ] Email automatique 1 semaine après achat
- [ ] Email si pas d'achat depuis 3 mois
- [ ] Email d'anniversaire (si date collectée)

### Phase 3 : Segmentation
- [ ] Segmenter par type de service acheté
- [ ] Clients VIP (montant total > X€)
- [ ] Clients inactifs vs réguliers

### Phase 4 : Templates
- [ ] Templates d'emails pré-conçus
- [ ] Envoi depuis le dashboard admin
- [ ] Statistiques d'ouverture et clics

---

## 📝 Checklist de Lancement

Avant d'envoyer votre première newsletter :

- [ ] Tester un paiement avec checkbox "Oui"
- [ ] Vérifier que l'email apparaît dans l'admin
- [ ] Tester "Copier emails" et "Export CSV"
- [ ] Lire la page `/cgu` pour être conforme
- [ ] Préparer votre premier email
- [ ] Choisir un outil (Email direct ou Brevo)
- [ ] Définir votre calendrier d'envoi (1-2x/mois)

---

## 🐛 Dépannage

### Les abonnés n'apparaissent pas

**Vérifier** :
1. `npx prisma db push` a bien fonctionné
2. Le webhook Stripe est configuré (voir `docs/STRIPE_WEBHOOKS.md`)
3. Les logs du webhook : console du serveur dev

### Impossible d'exporter le CSV

**Solution** :
- Le navigateur bloque peut-être les téléchargements
- Autoriser les pop-ups pour localhost:3000

### Un client veut se désinscrire

**Méthode manuelle** :
1. Admin → Newsletter
2. Trouver l'email
3. Cliquer sur l'icône "Désinscrire" (UserX)
4. Confirmé !

---

## 📞 Support

- **Documentation complète** : `docs/SECURITE_RECAPITULATIF.md`
- **Webhooks Stripe** : `docs/STRIPE_WEBHOOKS.md`
- **CGU/RGPD** : Page `/cgu` du site

---

**🎉 Système newsletter prêt à l'emploi !**

*Prochaine étape : Envoyer votre première campagne !*
