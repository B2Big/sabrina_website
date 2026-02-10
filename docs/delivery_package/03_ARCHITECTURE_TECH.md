# 🏗️ Architecture Technique - Sab-Fit
## Documentation Technique Complète

---

## Stack Technique

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SAB-FIT PLATFORM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │   🌐 FRONTEND WEB                                                    │  │
│  │   Next.js 16 (React 19)                                              │  │
│  │   Tailwind CSS 4                                                     │  │
│  │   PWA (Progressive Web App)                                          │  │
│  └──────────────────────────┬────────────────────────────────────────────┘  │
│                              │                                               │
│                              │ API / Server Actions                          │
│                              ▼                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │   ⚙️ BACKEND / BaaS                                                   │  │
│  │   Supabase (PostgreSQL + Auth)                                        │  │
│  │   Prisma ORM                                                          │  │
│  └──────────────────────────┬────────────────────────────────────────────┘  │
│                              │                                               │
│           ┌──────────────────┼──────────────────┐                           │
│           │                  │                  │                           │
│           ▼                  ▼                  ▼                           │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   💳 STRIPE │    │   📧 RESEND  │    │   🌐 NETLIFY │                   │
│  │   Paiement  │    │   Emails     │    │   Hosting    │                   │
│  └─────────────┘    └──────────────┘    └──────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technologies Détaillées

#### Frontend Web
| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 16.1.3 | Framework React avec App Router |
| React | 19.2.3 | UI Library |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 4.x | Styling utility-first |
| Framer Motion | 12.x | Animations |
| Zod | 4.x | Validation schémas |

#### Backend & Database
| Technologie | Version | Rôle |
|-------------|---------|------|
| Supabase | - | BaaS (Backend as a Service) |
| PostgreSQL | 15+ | Base de données relationnelle |
| Prisma | 5.22 | ORM (Object-Relational Mapping) |
| Supabase Auth | - | Authentification |
| Row Level Security | - | Sécurité base de données |

#### Services Externes
| Service | Usage |
|---------|-------|
| Stripe | Paiements en ligne (carte, PayPal) |
| Resend | Envoi d'emails transactionnels |
| Netlify | Hébergement et CI/CD |

---

## Architecture Détaillée

### Diagramme d'Architecture

```mermaid
flowchart TB
    subgraph CLIENT["👤 CLIENT"]
        direction TB
        WEB["🌐 Site Web\nNext.js + React"]
        MOBILE["📱 PWA Mobile\n(Installable)"]
    end

    subgraph EDGE["🌐 EDGE / CDN"]
        NETLIFY["Netlify\nSSL + CDN"]
    end

    subgraph SERVER["⚙️ SERVEUR"]
        direction TB
        NEXT["Next.js Server\nServer Actions\nAPI Routes"]
        
        subgraph MIDDLEWARE["🛡️ Middleware"]
            AUTH["Auth Supabase"]
            RATE["Rate Limiting"]
            VALID["Validation Zod"]
        end
    end

    subgraph DATABASE["🗄️ DATABASE LAYER"]
        direction TB
        SUPABASE["Supabase"]
        
        subgraph RLS["Row Level Security"]
            POLICIES["Policies\n- services: public read\n- admin: write\n- reservations: owner only"]
        end
        
        POSTGRES[("PostgreSQL")]
    end

    subgraph SERVICES["🔌 SERVICES EXTERNES"]
        STRIPE["💳 Stripe\nCheckout + Webhooks"]
        RESEND["📧 Resend\nEmails"]
    end

    WEB --> NETLIFY
    MOBILE -.->|"PWA Cache"| WEB
    NETLIFY --> NEXT
    
    NEXT --> MIDDLEWARE
    MIDDLEWARE --> SUPABASE
    
    SUPABASE --> RLS
    RLS --> POSTGRES
    
    NEXT -->|"Payment"| STRIPE
    STRIPE -->|"Webhook"| NEXT
    NEXT -->|"Send Email"| RESEND

    style WEB fill:#3B82F6,color:#fff
    style POSTGRES fill:#10B981,color:#fff
    style STRIPE fill:#635BFF,color:#fff
```

### Flux de Données

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Next.js
    participant S as Supabase
    participant St as Stripe
    participant R as Resend

    Note over C,R: Scénario: Réservation avec paiement

    C->>N: 1. Ajoute service au panier
    N->>C: Affiche panier flottant

    C->>N: 2. Soumet formulaire + choix "Payer en ligne"
    N->>S: 3. Crée réservation (statut: attente)
    S-->>N: ID réservation

    N->>St: 4. Crée session checkout
    St-->>N: URL checkout
    N-->>C: 5. Redirection Stripe

    C->>St: 6. Saisie carte + paiement
    St->>N: 7. Webhook: checkout.session.completed

    N->>S: 8. Met à jour réservation (statut: payé)
    N->>R: 9a. Email confirmation client
    N->>R: 9b. Email notification admin
    
    St-->>C: 10. Redirection page succès
```

---

## Schéma de Base de Données (ERD)

### Diagramme Entité-Relation

```mermaid
erDiagram
    SERVICE ||--o{ PROMOTION : "peut avoir"
    SERVICE ||--o{ RESERVATION : "concerne"
    RESERVATION ||--|| ORDER : "peut générer"
    CUSTOMER ||--o{ RESERVATION : "passe"
    CUSTOMER ||--o{ NEWSLETTER_SUBSCRIBER : "peut s'abonner"
    
    SERVICE {
        string id PK
        string category
        string title
        string description
        string price
        string originalPrice
        string duration
        boolean popular
        boolean bestValue
        string[] features
        datetime createdAt
        datetime updatedAt
    }
    
    PROMOTION {
        string id PK
        string text
        int discountPercent
        boolean isActive
        datetime startDate
        datetime endDate
        datetime createdAt
    }
    
    RESERVATION {
        string id PK
        enum status
        string customerName
        string customerEmail
        string customerPhone
        string message
        string serviceTitle
        float servicePrice
        int quantity
        float totalAmount
        string paymentMethod
        string stripeSessionId UK
        string stripePaymentId
        datetime paidAt
        datetime requestedDate
        datetime createdAt
        datetime updatedAt
    }
    
    ORDER {
        string id PK
        string stripeSessionId UK
        string stripePaymentId
        float amount
        string currency
        enum status
        string customerEmail
        string customerName
        string[] serviceIds
        int itemCount
        datetime paidAt
        datetime createdAt
    }
    
    NEWSLETTER_SUBSCRIBER {
        string id PK
        string email UK
        string name
        string source
        boolean isSubscribed
        string unsubscribeToken UK
        datetime subscribedAt
        datetime unsubscribedAt
        boolean consentGiven
        datetime createdAt
    }
    
    CUSTOMER {
        string id PK
        string email UK
        string name
        string phone
        datetime createdAt
    }
```

### Modèles Détaillés

#### 1. Service (Prestations)
```typescript
interface Service {
  id: string;              // CUID unique
  category: string;        // "Coaching", "Massages", "Cures"
  title: string;           // Nom du service
  description: string;     // Description longue
  price: string;           // Format: "70 €"
  originalPrice?: string;  // Prix barré (promo)
  duration?: string;       // "60 min"
  popular: boolean;        // Badge "Populaire"
  bestValue: boolean;      // Badge "Meilleur rapport"
  features: string[];      // Liste des avantages
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. Reservation (Réservations)
```typescript
enum ReservationStatus {
  'attente_paiement_sur_place',  // Créée, paiement à venir
  'paye_confirme',                // Payée (Stripe ou confirmé)
  'annule',                       // Annulée
  'termine'                       // Service rendu
}

interface Reservation {
  id: string;
  status: ReservationStatus;
  
  // Client
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message?: string;
  
  // Service (dénormalisé pour historique)
  serviceTitle: string;
  servicePrice: number;
  quantity: number;
  totalAmount: number;
  
  // Paiement
  paymentMethod: 'sur_place' | 'stripe';
  stripeSessionId?: string;  // Lien avec Stripe
  stripePaymentId?: string;  // ID transaction
  paidAt?: Date;
  
  // Planning
  requestedDate?: Date;      // Date souhaitée
  confirmedDate?: Date;      // Date confirmée par Sabrina
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### 3. Promotion (Offres spéciales)
```typescript
interface Promotion {
  id: string;
  text?: string;              // Texte de la promo
  discountPercent?: number;   // % de réduction
  services: Service[];        // Services concernés
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}
```

---

## PWA (Progressive Web App)

### Configuration

Le site est configuré comme une PWA via `@ducanh2912/next-pwa` :

```javascript
// next.config.js (simplifié)
const withPWA = require('@ducanh2912/next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});
```

### Fichiers PWA

```
public/
├── manifest.json          # Configuration PWA
├── sw.js                  # Service Worker (auto-généré)
└── icons/
    ├── icon-192x192.png   # Icône Android
    ├── icon-512x512.png   # Icône iOS/Splash
    └── apple-touch-icon.png
```

### Manifest.json

```json
{
  "name": "Sab-Fit",
  "short_name": "Sab-Fit",
  "description": "Coaching & Bien-être - Pop & Wellness",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#3B82F6",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512" }
  ]
}
```

### Capacités PWA

| Fonctionnalité | Statut | Description |
|----------------|--------|-------------|
| **Installable** | ✅ | Ajout à l'écran d'accueil |
| **Hors-ligne** | ✅ | Cache des pages visitées |
| **Réactivité** | ✅ | < 3s temps de chargement |
| **Push** | ⏳ | Notifications (Phase 2) |

---

## Sécurité

### Authentification (Supabase Auth)

```mermaid
flowchart LR
    A[Login Page] --> B{Credentials}
    B -->|Valid| C[JWT Token]
    B -->|Invalid| D[Error]
    C --> E[Middleware Check]
    E -->|Token OK| F[Admin Dashboard]
    E -->|Token Expired| G[Redirect Login]
```

### Row Level Security (RLS)

```sql
-- Exemple de policies RLS

-- Services: Lecture publique, écriture admin
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services visibles par tous" ON services
  FOR SELECT USING (true);

CREATE POLICY "Services modifiables par admin" ON services
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    auth.jwt() ->> 'role' IN ('ADMIN', 'DEVELOPER')
  );

-- Réservations: Accessible uniquement par l'admin (via serveur)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Réservations accessibles service_role" ON reservations
  FOR ALL USING (auth.role() = 'service_role');
```

---

## Déploiement

### Pipeline CI/CD (Netlify)

```mermaid
flowchart LR
    A[Developer] -->|git push| B[GitHub]
    B -->|Webhook| C[Netlify Build]
    C --> D[npm install]
    D --> E[prisma generate]
    E --> F[next build]
    F -->|Success| G[Deploy to CDN]
    F -->|Failure| H[Alert]
```

### Variables d'Environnement Requises

```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_URL=https://www.sab-fit.com
```

---

*Architecture Technique - Version 1.0*
