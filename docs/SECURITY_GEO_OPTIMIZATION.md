# Optimisation Sécurité & GEO - Sab-Fit

**Date** : 2026-03-03  
**Objectif** : Sécurisation Supabase RLS + Optimisation GEO (Generative Engine Optimization) + Logique Email Double Déclencheur

---

## 1. 🔐 SÉCURISATION SUPABASE (RLS)

### 1.1 Script SQL - Migration RLS Complète

**Fichier** : `prisma/migrations/enable_rls_reservations_complete/migration.sql`

```sql
-- Activer RLS sur la table reservations
ALTER TABLE "reservations" ENABLE ROW LEVEL SECURITY;

-- POLITIQUE 1: INSERT PUBLIC (ANONYME)
-- Permettre à tout le monde de créer une réservation
CREATE POLICY "Allow public insert on reservations" 
ON "reservations" 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- POLITIQUE 2: SELECT SERVICE_ROLE UNIQUEMENT
-- Seul le backend (Prisma/service_role) peut lire
CREATE POLICY "Service role can select all reservations" 
ON "reservations" 
FOR SELECT 
TO service_role
USING (true);

-- POLITIQUE 3: SELECT ADMINS
-- Les admins authentifiés peuvent voir toutes les réservations
CREATE POLICY "Admins can select all reservations" 
ON "reservations" 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
);

-- POLITIQUE 4: UPDATE ADMINS/SERVICE_ROLE
CREATE POLICY "Admins and service role can update reservations" 
ON "reservations" 
FOR UPDATE 
TO authenticated, service_role
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
);

-- POLITIQUE 5: DELETE ADMINS
CREATE POLICY "Admins can delete reservations" 
ON "reservations" 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_app_meta_data->>'role') IN ('ADMIN', 'DEVELOPER')
  )
);
```

### 1.2 Comment exécuter la migration

1. Se connecter au Dashboard Supabase : https://supabase.com/dashboard
2. Aller dans "SQL Editor" (éditeur SQL)
3. Copier-coller le contenu du fichier SQL
4. Exécuter

### 1.3 Vérification post-migration

```sql
-- Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'reservations';
-- Doit retourner : rowsecurity = true

-- Vérifier les politiques
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'reservations';
-- Doit retourner 5 politiques
```

### 1.4 Impact sur l'application

| Opération | Avant | Après |
|-----------|-------|-------|
| INSERT (public) | ✅ Possible | ✅ Possible (inchangé) |
| SELECT (public) | ⚠️ Risqué | ❌ Bloqué |
| SELECT (admin) | ✅ Possible | ✅ Possible (inchangé) |
| SELECT (service_role) | ✅ Possible | ✅ Possible (inchangé) |
| Webhook Stripe | ✅ Fonctionne | ✅ Fonctionne (service_role) |

---

## 2. 📧 LOGIQUE EMAIL "DOUBLE DÉCLENCHEUR"

### 2.1 Architecture Email

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUX DE RÉSERVATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │ Paiement Stripe │     │ Paiement Sur Place                │
│  └────────┬────────┘     └────────┬────────┘                   │
│           │                       │                             │
│           ▼                       ▼                             │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │ Création Résa   │     │ Création Résa   │                   │
│  │ (checkout/route)│     │ (actions.ts)    │                   │
│  └────────┬────────┘     └────────┬────────┘                   │
│           │                       │                             │
│           ▼                       ▼                             │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │ EMAIL INSTANT   │     │ EMAIL INSTANT   │  ◄── 1er DÉCLENCHEUR
│  │ → Sabrina       │     │ → Sabrina       │      (Nouvelle demande)
│  │ (Notification   │     │ (Notification   │                   │
│  │  "Nouvelle      │     │  "Nouvelle      │                   │
│  │   réservation") │     │   réservation") │                   │
│  └─────────────────┘     └─────────────────┘                   │
│           │                       │                             │
│           │                       ▼                             │
│           │              ┌─────────────────┐                   │
│           │              │ EMAIL CLIENT    │                   │
│           │              │ → Attente       │                   │
│           │              │   paiement      │                   │
│           │              └─────────────────┘                   │
│           │                                                    │
│           ▼                                                    │
│  ┌─────────────────┐                                          │
│  │ WEBHOOK STRIPE  │  ◄── Paiement confirmé                   │
│  │ (route.ts)      │                                          │
│  └────────┬────────┘                                          │
│           │                                                    │
│           ▼                                                    │
│  ┌─────────────────┐     ┌─────────────────┐                   │
│  │ Mise à jour     │     │ EMAIL PAYMENT   │  ◄── 2ème DÉCLENCHEUR
│  │ statut: payé    │     │ → Client +      │      (Confirmation)
│  │                 │     │   Sabrina       │                   │
│  │                 │     │ (Reçu Stripe    │                   │
│  │                 │     │  inclus)        │                   │
│  └─────────────────┘     └─────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Types d'emails

| Moment | Destinataire | Type | Contenu | Fichier |
|--------|--------------|------|---------|---------|
| **Instant** | Sabrina | 🟠 Notification | Nouvelle réservation créée | checkout/route.ts + actions.ts |
| **Instant** | Client | 🟠 Confirmation | Demande reçue, en attente | actions.ts |
| **Payment** | Client | 🟢 Confirmation | Paiement confirmé + Reçu | webhook/route.ts |
| **Payment** | Sabrina | 🟢 Notification | Paiement reçu | webhook/route.ts |

### 2.3 Modifications apportées

**Fichier** : `src/app/api/checkout/route.ts`

```typescript
// Ajout de l'import
import { sendNotificationToSabrinaSurPlace } from '@/lib/resend';

// Après création de la réservation, ajout de :
await sendNotificationToSabrinaSurPlace({
  reservationId: reservation.id,
  customerName: customerName,
  customerEmail: customerEmail,
  customerPhone: customerPhone,
  services: [...],
  total: (totalAmount / 100).toFixed(2),
  message: message || null,
  requestedDate: body.serviceDate ? new Date(body.serviceDate) : null,
});
```

### 2.4 Évitement des doublons

- **Email Instant** : Envoyé uniquement à la création (statut: `attente_paiement_sur_place`)
- **Email Payment** : Envoyé uniquement si le statut passe à `paye_confirme`
- **Vérification dans webhook** : 
  ```typescript
  if (reservation.status === 'paye_confirme') {
    console.log('[WEBHOOK] ℹ️ Réservation déjà marquée comme payée');
    return; // Évite les doublons
  }
  ```

---

## 3. 🔍 OPTIMISATION GEO (Generative Engine Optimization)

### 3.1 JSON-LD Ajouté - Person (Sabrina Perez)

**Fichier** : `src/components/json-ld.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://sab-fit.com/#sabrina-perez",
  "name": "Sabrina Perez",
  "jobTitle": "Coach Sportif & Masseuse Professionnelle",
  "description": "Fondatrice de Sab-Fit, coach sportif certifiée...",
  "url": "https://sab-fit.com",
  "email": "contact@sab-fit.com",
  "alumniOf": [
    { "@type": "EducationalOrganization", "name": "Coach Référent - Diplôme d'État" },
    { "@type": "EducationalOrganization", "name": "BP JEPS AGFF" }
  ],
  "knowsAbout": [
    "Coaching sportif personnalisé",
    "Perte de poids",
    "Madérothérapie",
    ...
  ]
}
```

### 3.2 Mise à jour ProfessionalService

Ajout des champs `founder` et `owner` liés à la Person :

```json
{
  "@type": "ProfessionalService",
  "founder": {
    "@type": "Person",
    "@id": "https://sab-fit.com/#sabrina-perez"
  },
  "owner": {
    "@type": "Person",
    "@id": "https://sab-fit.com/#sabrina-perez"
  }
}
```

### 3.3 FAQPage existant (déjà optimisé pour les IA)

Le fichier contient déjà 6 questions/réponses optimisées pour :
- ChatGPT
- Perplexity
- Google Bard

Exemples de questions :
- "Quels sont les tarifs du coaching sportif avec Sab-Fit ?"
- "Qu'est-ce que la madérothérapie et combien ça coûte ?"
- "Comment réserver un créneau avec Sabrina ?"

### 3.4 Schémas présents dans la page

| Schéma | Type | Objectif |
|--------|------|----------|
| Person | Sabrina Perez | Identité du propriétaire (E-E-A-T) |
| ProfessionalService | Sab-Fit | Entité principale |
| WebSite | sab-fit.com | Structure site |
| WebPage | Page d'accueil | Contenu spécifique |
| FAQPage | FAQ | Réponses aux IA |
| BreadcrumbList | Navigation | Structure hiérarchique |

---

## 4. 🔌 VÉRIFICATION WEBHOOK STRIPE

### 4.1 URL du Webhook configuré

**URL attendue** : `https://sab-fit.com/api/webhooks/stripe`

**Vérification dans le code** :

```typescript
// src/app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')
  
  // Vérification automatique de la signature
  event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
}
```

### 4.2 Configuration dans Stripe Dashboard

1. Aller sur : https://dashboard.stripe.com/webhooks
2. Vérifier que l'URL endpoint est : `https://sab-fit.com/api/webhooks/stripe`
3. **Important** : Sans les `www` pour éviter les redirections 301/302

### 4.3 Test du webhook

```bash
# Tester localement avec Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Tester en production
curl -X POST https://sab-fit.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
# Doit retourner 400 (signature manquante) - c'est normal
```

### 4.4 Événements écoutés

| Événement | Action |
|-----------|--------|
| `checkout.session.completed` | Confirme la réservation + envoie emails |
| `checkout.session.async_payment_succeeded` | Paiement asynchrone (virement) |
| `checkout.session.async_payment_failed` | Échec paiement asynchrone |
| `payment_intent.payment_failed` | Échec carte |

---

## 5. ✅ CHECKLIST DE DÉPLOIEMENT

### 5.1 Base de données
- [ ] Exécuter le script SQL RLS dans Supabase
- [ ] Vérifier que les politiques sont actives
- [ ] Tester une insertion anonyme (doit fonctionner)
- [ ] Tester un SELECT anonyme (doit échouer)

### 5.2 Emails
- [ ] Tester réservation "sur place" → Email instantané
- [ ] Tester réservation Stripe → Email instantané à Sabrina
- [ ] Tester paiement Stripe → Email confirmation client
- [ ] Vérifier qu'il n'y a pas de doublon

### 5.3 SEO/GEO
- [ ] Valider le JSON-LD sur https://validator.schema.org/
- [ ] Tester Rich Results : https://search.google.com/test/rich-results
- [ ] Vérifier que Sabrina Perez apparaît dans les données structurées

### 5.4 Webhook Stripe
- [ ] Vérifier l'URL dans Stripe Dashboard (sans www)
- [ ] Tester un paiement en mode test
- [ ] Vérifier les logs du webhook dans Stripe Dashboard

---

## 6. 🚨 POINTS D'ATTENTION

### 6.1 RLS et Prisma

**IMPORTANT** : Prisma utilise le `service_role` pour se connecter à la base de données. Cela signifie que :
- ✅ Les Server Actions (actions.ts) peuvent lire/écrire
- ✅ Les API Routes (checkout/route.ts) peuvent lire/écrire  
- ✅ Les Webhooks (webhooks/stripe/route.ts) peuvent lire/écrire
- ❌ Le client JavaScript Supabase (navigateur) ne peut PAS lire les réservations

C'est exactement ce qu'on veut !

### 6.2 Emails

Si un email échoue :
1. La réservation est quand même créée
2. L'erreur est loguée dans les logs Vercel/Netlify
3. Le client voit un message de succès avec une note sur l'email

### 6.3 Webhook Stripe et www

**Problème potentiel** : Si le webhook est configuré avec `www.sab-fit.com` au lieu de `sab-fit.com`, Stripe pourrait recevoir une redirection 301/302, ce qui causerait des erreurs.

**Solution** : Toujours utiliser `https://sab-fit.com/api/webhooks/stripe` (sans www)

---

## 7. 📞 SUPPORT

En cas de problème :
1. Vérifier les logs : Vercel/Netlify → Functions → Logs
2. Vérifier les logs Stripe : Dashboard → Developers → Webhooks → Logs
3. Vérifier les logs Supabase : Dashboard → Logs → API

---

**Document créé par** : Kimi Code CLI  
**Dernière mise à jour** : 2026-03-03
