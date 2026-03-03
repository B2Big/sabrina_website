# 🔁 Logique Complète - Boutons & Emails Resend

**Fichier principal** : `src/components/contact-form.tsx`  
**Action Server** : `src/app/actions.ts`  
**API Checkout** : `src/app/api/checkout/route.ts`

---

## 🎨 Interface - Les 2 Boutons

```tsx
// Dans src/components/contact-form.tsx (lignes 351-464)

<form action={formAction}>  // ← Le form a une action par défaut

  {/* BOUTON A - "Réserver uniquement" */}
  <Button type="submit">
    <CalendarCheck />
    "Réserver uniquement"
  </Button>

  {/* SÉPARATEUR "OU" - visible uniquement si panier */}
  <div className="relative flex items-center justify-center my-2">
    <span className="relative bg-white px-2 text-[10px]">OU</span>
  </div>

  {/* BOUTON B - "Réserver et payer en ligne" */}
  <Button 
    type="button"  // ← IMPORTANT: type="button" pas "submit"
    onClick={async () => { /* logique checkout */ }}
  >
    <CreditCard />
    "Réserver et payer en ligne"
  </Button>

</form>
```

---

## 🔄 Flux Bouton A : "Réserver uniquement"

### Déclencheur
```
Utilisateur clique sur "Réserver uniquement"
    ↓
<form> déclenche formAction={createReservationSurPlace}
    ↓
Appel à l'Action Server (src/app/actions.ts)
```

### Code exécuté
```tsx
// src/components/contact-form.tsx
<Button type="submit">
  Réserver uniquement
</Button>

// Déclenche automatiquement :
const [state, formAction, isPending] = useActionState(createReservationSurPlace, initialState);
```

### Backend - Action Server
```typescript
// src/app/actions.ts
export async function createReservationSurPlace(prevState: any, formData: FormData) {
  // 1. VALIDATION
  const result = ContactSchema.safeParse(rawData);
  
  // 2. CRÉATION RÉSERVATION
  const reservation = await prisma.reservation.create({
    data: {
      status: 'attente_paiement_sur_place',
      customerName: name,
      customerEmail: email,
      // ... autres champs
    }
  });
  
  // 3. EMAIL INSTANTANÉ - Client (🟠 Orange)
  await sendConfirmationToCustomerSurPlace({
    customerName: name,
    customerEmail: email,
    reservationId: reservation.id,
    services: cartItems,
    total: totalAmount,
  });
  
  // 4. EMAIL INSTANTANÉ - Sabrina (🟠 Orange)
  await sendNotificationToSabrinaSurPlace({
    reservationId: reservation.id,
    customerName: name,
    // ... autres infos
  });
  
  return { success: true, message: "Réservation confirmée !" };
}
```

### Emails envoyés (Instantané)

| Destinataire | Type | Couleur | Contenu |
|--------------|------|---------|---------|
| **Client** | Confirmation | 🟠 Orange | "Votre réservation est enregistrée. Paiement sur place." |
| **Sabrina** | Notification | 🟠 Orange | "Nouvelle réservation. À percevoir: X€" |

---

## 💳 Flux Bouton B : "Réserver et payer en ligne"

### Déclencheur
```
Utilisateur clique sur "Réserver et payer en ligne"
    ↓
Button onClick s'exécute (pas de submit form)
    ↓
Fetch vers /api/checkout
```

### Code exécuté
```tsx
// src/components/contact-form.tsx
<Button 
  type="button"  // ← Ne soumet PAS le form
  onClick={async () => {
    setIsCheckoutLoading(true);
    
    // Validation des champs
    if (!name || !email || !phone) { ... }
    
    // APPEL API CHECKOUT
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({
        items: checkoutItems,
        customerName: nameInput.value,
        customerEmail: emailInput.value,
        // ...
      })
    });
    
    const data = await res.json();
    
    // Redirection Stripe
    if (data.url) {
      window.location.href = data.url;
    }
  }}
>
  Réserver et payer en ligne
</Button>
```

### Backend - API Checkout
```typescript
// src/app/api/checkout/route.ts
export async function POST(req: Request) {
  // 1. VALIDATION
  const { items, customerName, customerEmail } = checkoutSchema.parse(body);
  
  // 2. RÉCUPÉRATION PRIX (sécurisé depuis DB)
  const servicesFromDb = await prisma.service.findMany({...});
  
  // 3. CRÉATION RÉSERVATION (avant paiement!)
  const reservation = await prisma.reservation.create({
    data: {
      status: 'attente_paiement_sur_place',  // ← Même statut initial
      customerName: customerName,
      customerEmail: customerEmail,
      // ...
      stripeSessionId: null,  // ← Sera mis à jour après
    }
  });
  
  // 4. 📧 EMAIL INSTANTANÉ - Sabrina (🟠 Orange)
  // "Double Déclencheur" - Notifier immédiatement
  await sendNotificationToSabrinaSurPlace({
    reservationId: reservation.id,
    customerName: customerName,
    // ...
  });
  
  // 5. CRÉATION SESSION STRIPE
  const session = await stripe.checkout.sessions.create({
    // ...
    metadata: {
      reservation_id: reservation.id,  // ← Lien vers notre réservation
    }
  });
  
  // 6. MISE À JOUR RÉSERVATION AVEC SESSION STRIPE
  await prisma.reservation.update({
    where: { id: reservation.id },
    data: { stripeSessionId: session.id }
  });
  
  // 7. REDIRECTION CLIENT VERS STRIPE
  return NextResponse.json({ url: session.url });
}
```

### Ce qui se passe après (Webhook Stripe)

```
Client paye sur Stripe
    ↓
Stripe envoie webhook checkout.session.completed
    ↓
/api/webhooks/stripe reçoit l'événement
    ↓
```

```typescript
// src/app/api/webhooks/stripe/route.ts
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // 1. RÉCUPÉRER LA RÉSERVATION
  const reservation = await prisma.reservation.findUnique({
    where: { stripeSessionId: session.id }
  });
  
  // 2. VÉRIFICATION ANTI-DOUBLON
  if (reservation.status === 'paye_confirme') {
    return;  // Déjà traité, on arrête
  }
  
  // 3. MISE À JOUR STATUT
  await prisma.reservation.update({
    where: { id: reservation.id },
    data: {
      status: 'paye_confirme',
      stripePaymentId: session.payment_intent,
      paidAt: new Date()
    }
  });
  
  // 4. 📧 EMAIL PAIEMENT - Client (🟢 Vert)
  await sendConfirmationToCustomerPaye({
    customerName: reservation.customerName,
    stripeReceiptUrl: receiptUrl,  // ← Reçu Stripe inclus!
    paidAt: new Date(),
    // ...
  });
  
  // 5. 📧 EMAIL PAIEMENT - Sabrina (🟢 Vert)
  await sendNotificationToSabrinaPaye({
    stripePaymentId: reservation.stripePaymentId,
    paidAt: new Date(),
    // ...
  });
}
```

### Emails envoyés (Bouton B)

| Moment | Destinataire | Type | Couleur | Contenu |
|--------|--------------|------|---------|---------|
| **Instant** (création résa) | Sabrina | Notification | 🟠 Orange | "Nouvelle réservation en attente de paiement" |
| **Après paiement** (webhook) | Client | Confirmation | 🟢 Vert | "Réservation confirmée + Reçu Stripe" |
| **Après paiement** (webhook) | Sabrina | Notification | 🟢 Vert | "Paiement reçu !" |

---

## 📊 Tableau Récapitulatif

| Aspect | Bouton A "Uniquement" | Bouton B "Payer en ligne" |
|--------|----------------------|---------------------------|
| **Type bouton** | `type="submit"` | `type="button"` |
| **Action** | Soumet le formulaire | Fetch API + Redirect |
| **Backend** | `actions.ts` Server Action | `/api/checkout` Route API |
| **Paiement** | Sur place (cash/CB) | Stripe en ligne |
| **Emails instantanés** | ✅ Oui (Client + Sabrina) | ✅ Oui (Sabrina uniquement) |
| **Emails différés** | ❌ Non | ✅ Oui (après paiement Stripe) |
| **Statut initial** | `attente_paiement_sur_place` | `attente_paiement_sur_place` |
| **Statut final** | Reste en attente | `paye_confirme` (après webhook) |

---

## 🎯 Pourquoi cette architecture ?

### Double Déclencheur (Email Instantané)

**Problème** : Si on attend le webhook Stripe pour envoyer le premier email, Sabrina ne sait pas qu'une réservation est en cours.

**Solution** : 
- Email instantané dès la création (🟠 Orange)
- Email de confirmation après paiement (🟢 Vert)

### Avantages

1. **Sabrina est notifiée immédiatement** dans les deux cas
2. **Pas de perte de client** - même si le paiement Stripe échoue, la réservation existe
3. **Traçabilité complète** - chaque étape est enregistrée
4. **Anti-doublon** - le webhook vérifie si déjà traité

---

## 🔍 Diagramme de Séquence Complet

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────┐     ┌─────────┐
│ Client  │     │ Formulaire  │     │   Server    │     │  Stripe  │     │ Sabrina │
└────┬────┘     └──────┬──────┘     └──────┬──────┘     └────┬─────┘     └────┬────┘
     │                 │                   │                 │                │
     │ Clique "Réserver uniquement"         │                 │                │
     │────────────────>│                   │                 │                │
     │                 │ formAction        │                 │                │
     │                 │──────────────────>│                 │                │
     │                 │                   │ Créer Résa      │                │
     │                 │                   │───────────────>│                │
     │                 │                   │                 │                │
     │                 │                   │ 📧 Email 🟠     │                │
     │                 │                   │─────────────────────────────────>│
     │                 │                   │                 │                │
     │                 │ Success           │                 │                │
     │                 │<──────────────────│                 │                │
     │                 │                   │                 │                │
     │ Confetti + Msg  │                   │                 │                │
     │<────────────────│                   │                 │                │
     │                 │                   │                 │                │
     ═════════════════════════════════════════════════════════════════════════════
     │                 │                   │                 │                │
     │ Clique "Réserver et payer en ligne"  │                 │                │
     │────────────────>│                   │                 │                │
     │                 │ onClick fetch     │                 │                │
     │                 │──────────────────>│                 │                │
     │                 │                   │ Créer Résa      │                │
     │                 │                   │───────────────>│                │
     │                 │                   │                 │                │
     │                 │                   │ 📧 Email 🟠     │                │
     │                 │                   │─────────────────────────────────>│
     │                 │                   │                 │                │
     │                 │ Créer Session     │                 │                │
     │                 │────────────────────────────────────>│                │
     │                 │                   │                 │                │
     │                 │ URL Stripe        │                 │                │
     │                 │<────────────────────────────────────│                │
     │                 │                   │                 │                │
     │ Redirect Stripe │                   │                 │                │
     │<────────────────│                   │                 │                │
     │                 │                   │                 │                │
     │ Paiement CB     │                   │                 │                │
     │──────────────────────────────────────────────────────>│                │
     │                 │                   │                 │                │
     │                 │                   │ Webhook         │                │
     │                 │                   │<────────────────│                │
     │                 │                   │                 │                │
     │                 │                   │ 📧 Email 🟢     │                │
     │                 │                   │─────────────────────────────────>│
     │                 │                   │                 │                │
     │                 │                   │ 📧 Email 🟢     │                │
     │                 │                   │──────────────────────────────────>
     │                 │                   │                 │                │
     │ Page Succès     │                   │                 │                │
     │<───────────────────────────────────────────────────────────────────────│
     │                 │                   │                 │                │
```

---

## ✅ Checklist pour Tester

### Test Bouton A (Sur Place)
1. [ ] Remplir le formulaire
2. [ ] Cliquer "Réserver uniquement"
3. [ ] Vérifier email reçu par Sabrina (🟠)
4. [ ] Vérifier email reçu par client (🟠)
5. [ ] Vérifier réservation créée dans Supabase

### Test Bouton B (Stripe)
1. [ ] Remplir le formulaire
2. [ ] Cliquer "Réserver et payer en ligne"
3. [ ] Vérifier email reçu par Sabrina (🟠) - AVANT paiement
4. [ ] Compléter paiement Stripe (carte test)
5. [ ] Vérifier email reçu par client (🟢) - APRÈS paiement
6. [ ] Vérifier email reçu par Sabrina (🟢) - APRÈS paiement
7. [ ] Vérifier statut = "paye_confirme" dans Supabase

---

## 📧 Templates Email Utilisés

### 🟠 Sur Place (Orange)
- `sendConfirmationToCustomerSurPlace()` - Client
- `sendNotificationToSabrinaSurPlace()` - Sabrina

### 🟢 Payé (Vert)
- `sendConfirmationToCustomerPaye()` - Client (avec reçu Stripe)
- `sendNotificationToSabrinaPaye()` - Sabrina

**Fichier** : `src/lib/resend.ts`

---

*Document créé pour comprendre la logique complète des réservations et emails.*
