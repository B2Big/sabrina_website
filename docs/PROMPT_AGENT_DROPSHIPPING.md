# 🤖 PROMPT AGENT IA — Boutique Dropshipping Vêtements & Accessoires

> **Mission** : Transformer l'application Sab-Fit existante en boutique e-commerce dropshipping  
> **Dossier de travail** : `/home/syu99/projets/shop/`  
> **Date** : 2026-05-14  
> **Budget temps** : 25-35h de développement  

---

## 🎯 OBJECTIF FINAL

Créer une boutique e-commerce moderne, responsive et performante pour vendre des **vêtements et accessoires** en dropshipping.

**URL cible** : https://www.ta-boutique.com (à configurer plus tard)  
**Nom de la boutique** : Aethelgard  
**Style** : Médiéval / Dark Fantasy / Gothic — inspiré de la maquette existante  
**Images produits** : Déjà copiées dans `public/images/` (17 images depuis la maquette)

---

## 🖼️ MAQUETTE EXISTANTE

Une maquette HTML/CSS/JS complète est située ici :
```
/home/syu99/projets/shop/Mock-up/Kimi_Agent_Deployment_v13/
```

**Cette maquette contient** :
- `index.html` — la structure complète du site (hero, catégories, produits, footer)
- `images/` — 17 images de produits et ambiances :
  - `hero-gargantua.jpg` — image hero principale
  - `ambiance-cathedral.jpg` — image d'ambiance
  - `prod-cape.jpg`, `prod-gloves.jpg`, `prod-choker.jpg` — produits
  - `prod-cg-1/2/3.jpg`, `prod-da-1/2/3.jpg`, `prod-wg-1/2/3.jpg` — galerie produits
  - `pillar-cg.jpg`, `pillar-da.jpg`, `pillar-wg.jpg` — images catégories
- `assets/index-DMBqNTr0.css` — le CSS compilé avec les couleurs et styles
- `assets/index-Bfw_wcOE.js` — le JS compilé

**TU DOIS T'INSPIRER DE CETTE MAQUETTE** pour :
- Les couleurs (marron cuir, orange brûlé, ivoire)
- Les polices (Cinzel Decorative pour les titres, Cinzel pour les sous-titres, Inter pour le corps)
- Le layout (hero pleine largeur, 3 piliers de catégories, grille produits)
- Les images (copier les images de la maquette dans `public/images/`)

---

## 🏗️ POINT DE DÉPART — ON NE PART PAS DE ZÉRO

Tu travailles dans `/home/syu99/projets/shop/` qui contient DÉJÀ une application e-commerce complète et déployée en production.

### Stack déjà installée et fonctionnelle

```
Next.js 16.1.6 (App Router)
React 19.2.3 + TypeScript 5
Tailwind CSS 4
Prisma 5 + Supabase PostgreSQL
Stripe Checkout + Klarna 3x
Resend API (emails)
Framer Motion (animations)
Lucide React (icônes)
PWA (installable)
```

### Ce qui existe DÉJÀ et que tu DOIS réutiliser

| Feature | Fichier(s) | État |
|---------|-----------|------|
| **Système de paiement Stripe** | `src/app/api/checkout/`, `src/lib/stripe.ts` | ✅ À adapter (ajouter adresse livraison) |
| **Panier flottant** | `src/context/cart-context.tsx`, `src/components/ui/floating-cart.tsx` | ✅ À adapter (quantités, variants) |
| **Dashboard admin CRUD** | `src/app/admin/`, `src/components/admin/` | ✅ À adapter (produits au lieu de services) |
| **Auth admin** | `src/app/login/`, `src/lib/auth/`, `middleware.ts` | ✅ Inchangé |
| **Emails transactionnels** | `src/lib/resend.ts` | ✅ À adapter (confirmation commande dropshipping) |
| **SEO (JSON-LD, sitemap)** | `src/components/json-ld.tsx`, `src/app/sitemap.ts` | ✅ À adapter |
| **Base de données PostgreSQL** | `prisma/schema.prisma` | ⚠️ À modifier (voir schéma cible) |
| **Audit trail** | `src/lib/audit.ts` | ✅ Inchangé |
| **Newsletter** | `src/app/admin/newsletter-actions.ts` | ✅ Inchangé |
| **Composants UI** | `src/components/ui/button.tsx`, `marquee.tsx`, etc. | ✅ Réutiliser |

### Ce qu'il NE FAUT PAS TOUCHER

- `src/app/api/webhooks/stripe/` — sauf adaptation des champs
- `src/lib/auth/` — l'auth fonctionne, ne pas y toucher
- `middleware.ts` — la protection des routes admin est bonne
- `src/lib/supabase/` — la connexion DB est opérationnelle

---

## 📐 SCHÉMA DE DONNÉES CIBLE (Prisma)

Remplace le contenu de `prisma/schema.prisma` par :

```prisma
// prisma/schema.prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "windows"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  order       Int       @default(0)
  isActive    Boolean   @default(true)
  
  products    Product[]
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@map("categories")
}

model Product {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String
  price         Float
  originalPrice Float?
  sku           String?   @unique
  stock         Int       @default(0)
  weight        Float?    // en grammes, pour calcul frais de port
  isActive      Boolean   @default(true)
  isFeatured    Boolean   @default(false)
  
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  
  images        ProductImage[]
  variants      ProductVariant[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@map("products")
}

model ProductImage {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  order     Int      @default(0)
  
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@map("product_images")
}

model ProductVariant {
  id        String   @id @default(cuid())
  size      String?  // S, M, L, XL ou null si taille unique
  color     String?  // Noir, Blanc, etc. ou null si couleur unique
  stock     Int      @default(0)
  sku       String?
  
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("product_variants")
}

model Customer {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?
  
  addresses     Address[]
  orders        Order[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@map("customers")
}

model Address {
  id         String   @id @default(cuid())
  street     String
  city       String
  zip        String
  country    String   @default("France")
  isDefault  Boolean  @default(false)
  
  customerId String
  customer   Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  
  @@map("addresses")
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

model Order {
  id              String      @id @default(cuid())
  stripeSessionId String?     @unique
  stripePaymentId String?
  
  amount          Float
  currency        String      @default("eur")
  status          OrderStatus @default(PENDING)
  
  customerEmail   String
  customerName    String?
  customerPhone   String?
  
  // Adresses
  shippingAddress Json?       @map("shipping_address")
  billingAddress  Json?       @map("billing_address")
  
  // Suivi
  trackingNumber  String?     @map("tracking_number")
  shippedAt       DateTime?   @map("shipped_at")
  deliveredAt     DateTime?   @map("delivered_at")
  
  // Items
  items           Json        // [{productId, name, variant, qty, price}]
  itemCount       Int         @default(0)
  
  paidAt          DateTime?   @map("paid_at")
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@index([customerEmail])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

model Promotion {
  id              String   @id @default(cuid())
  code            String   @unique
  description     String?
  discountPercent Int?
  discountAmount  Float?
  minOrderAmount  Float?
  isActive        Boolean  @default(true)
  startDate       DateTime?
  endDate         DateTime?
  usageLimit      Int?
  usageCount      Int      @default(0)
  
  createdAt       DateTime @default(now())
  
  @@map("promotions")
}

model NewsletterSubscriber {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  source            String    @default("footer")
  isSubscribed      Boolean   @default(true)
  unsubscribeToken  String    @unique @default(cuid())
  subscribedAt      DateTime  @default(now())
  unsubscribedAt    DateTime?
  consentGiven      Boolean   @default(true)
  
  @@index([email])
  @@map("newsletter_subscribers")
}

model AdminLog {
  id          String   @id @default(cuid())
  userId      String
  userEmail   String
  action      String
  entityType  String
  entityId    String?
  details     String?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
  @@map("admin_logs")
}
```

**Après modification du schéma** : `npx prisma migrate dev --name init_shop && npx prisma generate`

---

## 📁 STRUCTURE DES FICHIERS À CRÉER/MODIFIER

### Pages à créer/modifier

```
src/app/
├── page.tsx                    ← HOMEPAGE (hero, catégories vedettes, produits populaires)
├── layout.tsx                  ← Adapter le titre/meta pour la boutique
├── produits/
│   └── page.tsx                ← LISTE PRODUITS (grille + filtres sidebar)
├── produits/[slug]/
│   └── page.tsx                ← PAGE PRODUIT (galerie, variants, description, CTA)
├── categories/[slug]/
│   └── page.tsx                ← PAGE CATÉGORIE (grille produits filtrée)
├── panier/
│   └── page.tsx                ← PAGE PANIER DÉTAILLÉE (tableau, quantités, total)
├── checkout/
│   └── page.tsx                ← CHECKOUT (adresse + paiement Stripe)
├── compte/
│   └── page.tsx                ← COMPTE CLIENT (historique, adresses)
├── confirmation/
│   └── page.tsx                ← PAGE MERCI (récap commande)
├── admin/
│   └── page.tsx                ← Adapter le dashboard (CRUD produits/categories)
├── api/
│   ├── checkout/route.ts       ← Adapter pour products + adresse livraison
│   ├── products/route.ts       ← Nouveau (GET liste produits)
│   ├── products/[slug]/route.ts ← Nouveau (GET détail produit)
│   ├── categories/route.ts     ← Nouveau (GET catégories)
│   └── webhooks/stripe/route.ts ← Adapter les statuts Order
```

### Composants à créer

```
src/components/
├── product-card.tsx            ← Card produit (image, nom, prix, badge)
├── product-grid.tsx            ← Grille responsive de cards
├── product-gallery.tsx         ← Galerie images (main + thumbnails + zoom)
├── product-variants.tsx        ← Sélecteur taille/couleur
├── product-filters.tsx         ← Sidebar filtres (catégorie, prix, taille)
├── breadcrumb.tsx              ← Fil d'ariane
├── cart-drawer.tsx             ← Drawer panier latéral
├── cart-line-item.tsx          ← Ligne produit dans le panier
├── quantity-selector.tsx       ← +/- quantité
├── price-display.tsx           ← Prix barré + prix promo
├── section-hero.tsx            ← Hero homepage boutique
├── section-categories.tsx      ← Grille catégories vedettes
├── section-featured.tsx        ← Produits en vedette
├── section-newsletter.tsx      ← Inscription newsletter
└── sections/                   ← Conserver les sections existantes si pertinent
```

### Lib à créer/modifier

```
src/lib/
├── db-products.ts              ← Remplacer db-services.ts (CRUD produits/catégories)
├── stripe.ts                   ← Adapter pour le nouveau checkout
├── resend.ts                   ← Adapter les templates email
└── validations/schemas.ts      ← Ajouter schemas produit/commande
```

---

## 🎨 DESIGN SYSTEM — Charte Graphique

### Palette (à définir dans `globals.css`)

**Ces couleurs sont extraites de la maquette existante** :

```css
/* Palette Aethelgard — Médiéval / Dark Fantasy */
--color-primary:    #1A0F0A;   /* Brun très foncé (presque noir) */
--color-accent:     #CC5500;   /* Orange brûlé / rouille */
--color-accent-light: #FF6B35; /* Orange plus vif */
--color-surface:    #E8E0D4;   /* Ivoire / parchemin */
--color-surface-dark: #8A8279; /* Gris taupe */
--color-text:       #1A0F0A;   /* Texte principal brun foncé */
--color-muted:      #8A8279;   /* Texte secondaire taupe */
--color-gold:       #8B4513;   /* Or cuivré / selle */
```

### Polices

**La maquette utilise ces polices** — les importer via Google Fonts :
- **Titres hero / décoratifs** : `Cinzel Decorative` (400, 700, 900)
- **Titres section / sous-titres** : `Cinzel` (400, 500, 600, 700)
- **Corps de texte / UI** : `Inter` (300, 400, 500, 600, 700)

Dans `src/app/layout.tsx`, ajouter :
```tsx
import { Cinzel, Cinzel_Decorative, Inter } from 'next/font/google';

const cinzelDecorative = Cinzel_Decorative({ 
  subsets: ['latin'], 
  weight: ['400', '700', '900'],
  variable: '--font-cinzel-decorative'
});

const cinzel = Cinzel({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel'
});

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
});
```

### Principes de design (issus de la maquette)

- **Hero pleine largeur** : image hero immersive avec overlay texte centré
- **3 piliers de catégories** : 3 colonnes égales avec images verticales (pillars)
- **Grille produits** : cards avec image, nom, prix, bouton
- **Typographie médiévale** : Cinzel Decorative pour les titres impactants
- **Couleurs chaudes** : dominante brun/orange sur fond ivoire
- **Ambiance dark fantasy** : images gothiques/médiévales
- **Mobile-first** : le traffic e-commerce est majoritairement mobile

### Assets à copier de la maquette

```bash
# Copier les images de la maquette vers le projet
cp /home/syu99/projets/shop/Mock-up/Kimi_Agent_Deployment_v13/images/* /home/syu99/projets/shop/public/images/
```

---

## 🛒 FONCTIONNALITÉS OBLIGATOIRES

### Phase 1 — Catalogue (prioritaire)
- [ ] Homepage avec hero, catégories, produits vedettes
- [ ] Page liste produits avec filtres (catégorie, prix, taille)
- [ ] Page produit détaillée (galerie, description, variants, ajout panier)
- [ ] Page catégorie
- [ ] Breadcrumb navigation

### Phase 2 — Panier & Checkout
- [ ] Panier persistant (localStorage + context)
- [ ] Page panier détaillée (modifier quantités, supprimer)
- [ ] Checkout avec adresse de livraison
- [ ] Paiement Stripe
- [ ] Page confirmation

### Phase 3 — Compte Client
- [ ] Compte client (email + mot de passe)
- [ ] Historique des commandes
- [ ] Gestion des adresses

### Phase 4 — Admin
- [ ] CRUD produits (avec upload images)
- [ ] CRUD catégories
- [ ] Gestion des commandes (statuts, numéro de suivi)
- [ ] CRUD promotions (codes promo)

### Phase 5 — SEO & Polish
- [ ] JSON-LD Product / Organization
- [ ] Meta tags dynamiques par produit
- [ ] Sitemap produits
- [ ] PWA

---

## ⚡ RÈGLES STRICTES

### 🔴 INTERDICTIONS
1. **Ne PAS toucher** `src/lib/auth/` (l'auth fonctionne)
2. **Ne PAS toucher** `middleware.ts` (sauf ajout de routes publiques)
3. **Ne PAS toucher** `src/lib/supabase/` (la connexion DB est bonne)
4. **Ne PAS ajouter** de nouvelle librairie sans demander (pas de Swiper, pas de GSAP)
5. **Ne PAS supprimer** les composants UI existants (button, marquee, abstract-shape)

### 🟡 CONTRAINTES
6. **Mobile-first** : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
7. **`next/image`** obligatoire pour TOUTES les images
8. **Images WebP** uniquement, max 1200px de large, qualité 80
9. **`'use client'`** uniquement si nécessaire (interactions, state)
10. **TypeScript strict** : jamais de `any`
11. **Props typées** : interface pour chaque composant

### 🟢 BONNES PRATIQUES
12. **Réutiliser les composants UI existants** : `Button`, `Marquee`, etc.
13. **Couleurs via tokens** : pas de couleurs hardcodées en hex
14. **Container** : `container mx-auto px-4 md:px-8`
15. **Espacement cohérent** : `py-20` pour les sections

---

## 📤 PLAN D'EXÉCUTION (par étapes)

### Étape 1 : Fondations (2-3h)
1. Modifier `prisma/schema.prisma` avec le nouveau schéma
2. Lancer `npx prisma migrate dev` et `npx prisma generate`
3. Créer `src/lib/db-products.ts` avec les fonctions CRUD
4. Créer quelques produits de test via un seed script

### Étape 2 : Catalogue (6-8h)
5. Créer `src/components/product-card.tsx`
6. Créer `src/components/product-grid.tsx`
7. Modifier `src/app/page.tsx` (homepage boutique)
8. Créer `src/app/produits/page.tsx` (liste produits)
9. Créer `src/app/produits/[slug]/page.tsx` (page produit)
10. Créer `src/app/categories/[slug]/page.tsx` (page catégorie)
11. Créer `src/components/product-gallery.tsx`
12. Créer `src/components/product-variants.tsx`

### Étape 3 : Panier & Checkout (4-6h)
13. Adapter `src/context/cart-context.tsx` pour les variants
14. Créer `src/app/panier/page.tsx`
15. Créer `src/components/cart-line-item.tsx`
16. Adapter `src/app/api/checkout/route.ts` (ajouter adresse)
17. Créer `src/app/checkout/page.tsx`
18. Créer `src/app/confirmation/page.tsx`

### Étape 4 : Admin (3-4h)
19. Adapter `src/app/admin/page.tsx` (CRUD produits)
20. Créer le formulaire produit (avec upload images)
21. Adapter l'audit trail pour les nouvelles entités

### Étape 5 : Polish (2-3h)
22. Adapter `src/lib/resend.ts` (templates email boutique)
23. Adapter `src/components/json-ld.tsx`
24. Tests build + responsive

---

## 🧪 VÉRIFICATION AVANT LIVRAISON

- [ ] `npx next build` passe sans erreur
- [ ] Aucune erreur TypeScript
- [ ] Responsive testé (mobile 375px, desktop 1440px)
- [ ] Panier fonctionne (ajout, suppression, quantité)
- [ ] Checkout Stripe fonctionne (test mode)
- [ ] Admin CRUD produits fonctionne
- [ ] Emails partent correctement

---

## 📞 EN CAS DE DOUTE

| Problème | Solution |
|----------|----------|
| Doute sur un composant existant | Regarde dans `src/components/ui/` |
| Doute sur une couleur/token | Regarde `src/app/globals.css` |
| Doute sur la DB | Regarde `prisma/schema.prisma` |
| Build échoue | Lance `npx next build` et lis l'erreur |

---

**Tu as toute l'infrastructure. Tu as le schéma. Tu as le plan.**
**Maintenant, construis la boutique.** 🚀
