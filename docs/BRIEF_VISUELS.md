# 🎨 Brief Visuels & Sections — Pour Agent IA Externe

> **Projet** : Sab-Fit PWA — Coaching Fitness & Massage (Var 83)  
> **Date du brief** : 2026-05-12  
> **Mission** : Créer des sections visuelles premium pour détailler et présenter les prestations, sans surcharger l'app existante.

---

## 1. Contexte du Projet

L'application est une PWA Next.js déjà en production (https://www.sab-fit.com). Elle possède :
- Un système de paiement Stripe + Klarna 3x fonctionnel
- Un panier flottant avec ajout de services
- 20 services en base de données (Coaching, Massages, Cures)
- Un dashboard admin complet
- Un carrousel hero et un photo marquee existants

**Ce qui manque** : Des sections visuelles qui "vendent le rêve" — processus par univers, preuve sociale, différenciation, FAQ visuelle, etc.

**Architecture de page cible** :
```
Hero → Marquee → WhyChoose → Stats → About →
CoachingHeader → CoachingProcess → CardsCoaching →
PhotoMarquee →
MassageHeader → MassageAmbiance → CardsMassage →
Testimonials → FAQ → Contact → Footer
```

---

## 2. Stack Technique Exacte

```
Next.js        16.1.6  (App Router)
React          19.2.3
TypeScript     5.x
Tailwind CSS   4.x  (nouvelle syntaxe @theme inline, pas de tailwind.config.js)
Framer Motion  12.x  (animations légères UNIQUEMENT)
Lucide React   0.x   (toutes les icônes)
Radix UI       1.x   (shadcn/ui base)
```

**Runtime** : Node.js (pas Edge runtime — Prisma requiert Node.js)

---

## 3. Architecture des Dossiers

```
src/
├── app/
│   ├── page.tsx              ← TON POINT D'INTÉGRATION PRINCIPAL
│   ├── layout.tsx
│   ├── globals.css           ← Tokens CSS, ne PAS modifier sans accord
│   └── api/                  ← NE JAMAIS TOUCHER
├── components/
│   ├── ui/                   ← Composants shadcn réutilisables
│   │   ├── button.tsx
│   │   ├── marquee.tsx
│   │   ├── abstract-shape.tsx
│   │   └── ...
│   ├── sections/             ← 🆕 TES NOUVELLES SECTIONS VONT ICI
│   ├── hero.tsx
│   ├── service-card.tsx
│   ├── photo-marquee.tsx
│   ├── testimonials.tsx
│   ├── faq.tsx
│   ├── values-section.tsx
│   ├── about-section.tsx
│   └── ...
├── lib/
│   ├── utils.ts              ← cn() helper (clsx + tailwind-merge)
│   └── db-services.ts        ← NE PAS TOUCHER
├── data/
│   └── content.ts            ← Types et données statiques
└── ...
```

---

## 4. Tokens de Design

### Palette (définie dans `src/app/globals.css`)

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-training` | `#2563EB` (Royal Blue) | Coaching, action masculine |
| `--color-care` | `#DB2777` (Pink 600) | Massage, soin, féminin |
| `--color-accent-mint` | `#34D399` | Détente, bien-être |
| `--color-accent-peach` | `#FBBF24` | Énergie, chaleur |
| `--color-indigo` | `#4F46E5` | Variante violette |
| `--color-cyan` | `#06B6D4` | Variante cyan |
| `--color-rose` | `#E11D48` | Urgence, alerte |
| `--color-amber` | `#F59E0B` | Accent chaud |

### Classes Tailwind disponibles

```tsx
// Textes avec dégradé
text-transparent bg-clip-text bg-gradient-to-r from-training to-accent-mint
text-transparent bg-clip-text bg-gradient-to-r from-care to-accent-peach

// Fond glassmorphism
bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg

// Fond dark glassmorphism
bg-slate-900/90 backdrop-blur-2xl border border-white/10

// Badge catégorie Coaching
inline-block px-4 py-1.5 rounded-full bg-training text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-training/30

// Badge catégorie Massage
inline-block px-4 py-1.5 rounded-full bg-care text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-care/30

// Titres principaux
text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9]

// Texte outline géant (décoratif)
text-[10rem] md:text-[18rem] font-black leading-none text-outline opacity-30 blur-sm
```

### Composant Button existant

```tsx
import { Button } from "@/components/ui/button";

// Variants disponibles
<Button variant="training" size="lg">Training</Button>
<Button variant="care" size="lg">Self Care</Button>
<Button variant="outline">Secondaire</Button>

// Props
interface ButtonProps {
  variant?: "default" | "outline" | "ghost" | "link" | "training" | "care";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

### Polices

```
Font sans : Geist Sans (variable), fallback system-ui
Font mono : Geist Mono
```

---

## 5. Composants UI Existant à Réutiliser

| Composant | Chemin | Usage |
|-----------|--------|-------|
| `Button` | `src/components/ui/button.tsx` | Tous les CTA |
| `Marquee` | `src/components/ui/marquee.tsx` | Bandeau défilant de mots |
| `AbstractShape` | `src/components/ui/abstract-shape.tsx` | Formes 3D décoratives (`type="training"` ou `type="care"`) |
| `SmoothScroller` | `src/components/ui/smooth-scroller.tsx` | Défilement smooth global (déjà dans layout) |
| `ParallaxBackground` | `src/components/parallax-background.tsx` | Fond parallax (déjà dans page.tsx) |

---

## 6. Les 6 Sections à Créer

### 📁 Dossier de destination : `src/components/sections/`

---

### Section 1 : WhyChoose — "Pourquoi choisir Sab-Fit"
**Fichier** : `src/components/sections/why-choose.tsx`
**Emplacement** : Après le Marquee, avant About
**Type** : Global

**Objectif** : Différenciation vs la concurrence + crédibilité.

**Spec design** :
- Layout asymétrique : texte à gauche (60%) + visuel abstrait à droite (40%)
- Liste de 4-5 arguments avec icône check + texte
- Un chiffre clé en grand (ex: "500+ clients accompagnés") — **utiliser un chiffre réaliste ou placeholder**
- Utiliser `AbstractShape type="training"` comme décoration

**Contenu** :
```
✅ Diplômée d'État — Certifications coaching sportif & massage bien-être
✅ 100% Sur-mesure — Chaque séance est adaptée à VOTRE corps et VOS objectifs
✅ À domicile ou en cabinet — Flexibilité totale dans le Var (83)
✅ Suivi personnalisé — Plans d'entraînement et ajustements continus
✅ Paiement sécurisé — CB, Klarna 3x sans frais, ou sur place
```

**Contraintes** :
- Le chiffre "500+" doit être un `<span>` facilement modifiable
- Mobile : empilé vertical

---

### Section 2 : StatsSection — "Les chiffres"
**Fichier** : `src/components/sections/stats-section.tsx`
**Emplacement** : Avant la section Coaching
**Type** : Global

**Objectif** : Crédibilité instantanée par les chiffres.

**Spec design** :
- Fond avec dégradé subtil ou glassmorphism
- 4 chiffres en grille 2x2 (mobile) / 4 colonnes (desktop)
- Chaque bloc : chiffre ENORME + label + petite icône
- Animation : compteur qui monte au scroll (Framer Motion `useInView` + `animate`)
- **PAS d'images, que du texte + icônes Lucide**

**Contenu (placeholder — facilement modifiable)** :
```
500+    Clients accompagnés
15+      Années d'expérience
20      Prestations proposées
100%    Satisfaction client
```

**Contraintes** :
- Les chiffres doivent être passés en props (composant réutilisable)
- Animation compteur légère (durée 1.5s max)
- `will-change: transform` pour GPU

---

### Section 3 : CoachingProcess — "Votre parcours coaching"
**Fichier** : `src/components/sections/coaching-process.tsx`
**Emplacement** : **Entre le header Coaching et les cards Coaching**
**Type** : Contextualisé Coaching

**Objectif** : Rassurer et vendre le processus AVANT de montrer les prix.

**Spec design** :
- Fond : très légèrement grisé (`bg-slate-50`) ou blanc avec forme décorative
- 4 étapes en horizontal (desktop) / vertical (mobile)
- Chaque étape : numéro rond grand (01, 02, 03, 04) avec dégradé training + icône Lucide + titre + description
- Ligne de connexion entre les étapes (desktop)
- Animation : fade-in stagger au scroll

**Contenu** :
```
01 — Bilan Initial 🎯
"30 minutes offertes pour évaluer ton niveau, tes objectifs et tes contraintes. On définit ensemble ta feuille de route."

02 — Programme Sur-mesure 📋
"Séances adaptées à TON corps et TON emploi du temps. Pas de programme copié-collé, tout est personnalisé."

03 — Suivi & Ajustements 📈
"Plans évolutifs, motivation continue, challenges personnalisés. Je m'adapte à ton évolution en temps réel."

04 — Résultats Durables 🏆
"L'objectif : graver de nouvelles habitudes pour ne plus jamais rechuter. Ton corps change, ta mentalité aussi."
```

**Contraintes** :
- Numéros : `bg-gradient-to-br from-training to-accent-mint` avec texte blanc
- Icônes Lucide : `Target`, `ClipboardList`, `TrendingUp`, `Trophy`
- Mobile : timeline verticale avec ligne à gauche

---

### Section 4 : MassageAmbiance — "Un moment rien que pour vous"
**Fichier** : `src/components/sections/massage-ambiance.tsx`
**Emplacement** : **Entre le header Massage et les cards Massage**
**Type** : Contextualisé Massage

**Objectif** : Créer l'envie et l'ambiance détente AVANT de montrer les tarifs.

**Spec design** :
- Fond : dégradé très subtil rosé ou blanc cassé
- Grande image ambiance à gauche (50%) + contenu à droite (50%)
- Image : utiliser une image existante WebP (`/img/sabrina/hero/webp/7.webp`)
- Overlay texte sur image : *"À domicile ou en cabinet, dans une atmosphère apaisante"*
- À droite : 4 mini-pills des techniques proposées
- CTA : *"Réserver mon moment de détente"* (scroll vers `#massage`)
- Mobile : empilé vertical, image en haut

**Contenu** :
```
Titre : "Un moment rien que pour vous"
Sous-titre : "À domicile ou en cabinet, dans une atmosphère apaisante"

Techniques (pills) :
• Massage Signature  • Madérothérapie  • Drainage lymphatique  • Glow Recovery

CTA : "Réserver mon moment de détente" → href="#massage"
```

**Contraintes** :
- `next/image` obligatoire avec `fill`, `sizes`, `quality={80}`
- Overlay image : `bg-gradient-to-r from-black/50 to-transparent`
- Pills : `rounded-full px-4 py-2 bg-care/10 text-care border border-care/20`
- Mobile : image pleine largeur, pills en wrap

---

### Section 5 : TestimonialsV2 — "Ils m'ont fait confiance"
**Fichier** : `src/components/sections/testimonials-v2.tsx`
**Emplacement** : Après la section Massage
**Type** : Global

**Objectif** : Preuve sociale premium.

**Spec design** :
- Fond blanc ou très clair
- 3 témoignages en cards avec guillemets décoratifs
- Chaque card : texte témoignage + prénom + note étoiles + initiales dans cercle coloré
- Style glassmorphism léger : `bg-white/60 backdrop-blur-sm border border-slate-100 shadow-lg rounded-2xl p-8`
- **PAS de carrousel** — 3 cards statiques côte à côte
- Mobile : 1 colonne empilée

**Contenu (placeholder)** :
```
"Sabrina a complètement transformé ma relation avec le sport. En 3 mois, j'ai perdu 8kg et je me sens plus énergique que jamais."
— Marie L., 5★

"Le massage post-course est magique. Je récupère deux fois plus vite et mes douleurs ont disparu."
— Thomas D., 5★

"Je pensais que le coaching à domicile serait compliqué, mais c'est l'inverse. Sabrina s'adapte à mon emploi du temps et à mon salon."
— Sophie M., 5★
```

---

### Section 6 : FaqVisual — "Questions fréquentes"
**Fichier** : `src/components/sections/faq-visual.tsx`
**Emplacement** : Avant la section Contact
**Type** : Global

**Objectif** : Éliminer les objections avant la réservation.

**Spec design** :
- Layout 2 colonnes : gauche (titre + illustration abstraite) + droite (accordéons)
- Accordéons : style minimaliste avec bordure et icône `+`/`×`
- Animation : hauteur smooth (Framer Motion `AnimatePresence`)
- Fond : très léger dégradé ou blanc pur

**Contenu (8 questions)** :
```
Q1 : Je débute complètement, est-ce que c'est pour moi ?
R1 : Absolument ! Chaque programme est 100% adapté à votre niveau. Que vous soyez débutant ou sportif confirmé, Sabrina ajuste l'intensité et les exercices.

Q2 : Où se passent les séances ?
R2 : À votre domicile dans tout le Var (83) ou en cabinet selon vos préférences et la prestation choisie.

Q3 : Quels sont les moyens de paiement ?
R3 : Carte bancaire en ligne (via Stripe), paiement en 3x sans frais avec Klarna, ou espèces/CB sur place le jour de la séance.

Q4 : Puis-je offrir une séance en cadeau ?
R4 : Oui ! Contactez-nous via le formulaire pour un bon cadeau personnalisé.

Q5 : Quelle tenue pour une séance de coaching ?
R5 : Une tenue de sport confortable et des baskets. Sabrina apporte tout le matériel nécessaire.

Q6 : Le massage est-il remboursé ?
R6 : Les massages bien-être ne sont pas remboursés par la Sécurité Sociale, mais certaines mutuelles prennent en charge les séances de kiné. Renseignez-vous auprès de la vôtre.

Q7 : Combien de temps avant de voir des résultats ?
R7 : Dès les premières semaines avec un suivi régulier. La plupart des clients ressentent une différence dès la 3ème séance.

Q8 : Comment annuler ou déplacer un rendez-vous ?
R8 : Contactez Sabrina par téléphone ou email au moins 24h à l'avance. L'annulation tardive peut entraîner des frais.
```

**Contraintes** :
- Utiliser Framer Motion `AnimatePresence` pour l'animation d'ouverture
- Mobile : 1 colonne, accordéons pleine largeur

---

## 7. Points d'Intégration dans `src/app/page.tsx`

Voici **EXACTEMENT** où insérer tes nouvelles sections (dans l'ordre) :

```tsx
<Navbar />
<Hero />
<FloatingCart />

{/* Marquee existant */}
<Marquee items={["PERFORMANCE", ...]} ... />

{/* ← INSÉRER : WhyChoose (après Marquee) */}
<WhyChoose />

{/* ← INSÉRER : StatsSection (avant About) */}
<StatsSection />

<ValuesSection />
<AboutSection />

{/* Section Coaching existante */}
<section id="coaching">
  <header>...Coaching Fitness Sur Mesure...</header>
  
  {/* ← INSÉRER : CoachingProcess (entre header et cards) */}
  <CoachingProcess />
  
  <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {coachingServices.map(...)}
  </article>
</section>

<PhotoMarquee />

{/* Section Massage existante */}
<section id="massage">
  <header>...Massage & Récupération...</header>
  
  {/* ← INSÉRER : MassageAmbiance (entre header et cards) */}
  <MassageAmbiance />
  
  <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {massageServices.map(...)}
  </article>
</section>

{/* ← INSÉRER : TestimonialsV2 (après Massage) */}
<TestimonialsV2 />

{/* ← INSÉRER : FaqVisual (avant Contact) */}
<FaqVisual />

{/* Contact existant */}
<section id="contact">...</section>

<Footer />
```

**Règle** : Ne supprime aucune section existante sans demander. Ajoute d'abord, on décidera ensuite ce qu'on garde.

---

## 8. Règles d'Or (À RESPECTER IMPÉRATIVEMENT)

### 🔴 INTERDICTIONS ABSOLUES
1. **Ne JAMAIS toucher à `src/app/api/`** — c'est le backend
2. **Ne JAMAIS toucher à `prisma/schema.prisma`** ou `prisma/seed.ts`
3. **Ne JAMAIS modifier `src/lib/db-services.ts`** ou `src/lib/resend.ts`
4. **Ne JAMAIS toucher au système de paiement** (Stripe, checkout, webhooks)
5. **Ne JAMAIS modifier le middleware** (`middleware.ts`)
6. **Ne JAMAIS ajouter de librairie npm** sans demander (pas de Swiper, pas de GSAP, pas de Three.js)

### 🟡 CONTRAINTES DE CODE
7. **Mobile-first** : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
8. **`next/image` obligatoire** pour TOUTES les images (pas de `<img>`)
9. **Images existantes uniquement** : réutiliser les WebP dans `public/img/sabrina/`
10. **Pas de `useEffect` inutile** : préférer CSS animations > JS animations
11. **Framer Motion uniquement** pour les animations complexes (pas d'autre lib)
12. **Lucide React** pour toutes les icônes (pas de SVG inline sauf si complexe)
13. **`'use client'`** uniquement si nécessaire (interactions, Framer Motion)
14. **Props typées** : toujours TypeScript, jamais `any`

### 🟢 BONNES PRATIQUES
15. **Composants purs** : props in, JSX out. Pas de logique métier dans les sections.
16. **Couleurs via tokens** : `text-training`, `bg-care`, jamais de couleurs hardcodées en hex
17. **Espacement cohérent** : `py-20` pour les sections, `gap-6 md:gap-8` pour les grilles
18. **Container** : `container relative mx-auto px-4 md:px-8` pour wrapper
19. **SEO** : `itemScope itemType` si pertinent (suivre le pattern des sections existantes)

---

## 9. Exemple de Composant Type

Voici le pattern exact à suivre pour chaque nouvelle section :

```tsx
'use client'; // Seulement si tu utilises Framer Motion ou state

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SomeIcon } from 'lucide-react';

interface CoachingProcessProps {
  // Tes props ici — même si vide au début, prévoir l'interface
}

export function CoachingProcess({}: CoachingProcessProps) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container relative mx-auto px-4 md:px-8">
        {/* Header de section */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-training text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-training/30">
            Parcours
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mt-6">
            Votre parcours <span className="text-transparent bg-clip-text bg-gradient-to-r from-training to-accent-mint">coaching</span>
          </h2>
        </div>

        {/* Grid content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cards... */}
        </div>
      </div>
    </section>
  );
}
```

---

## 10. Performance & Mobile

### Objectifs
- **Lighthouse Performance > 90**
- **LCP < 2.5s** (pas d'images trop lourdes dans les nouvelles sections)
- **CLS = 0** (dimensions fixes sur les images)

### Checklist avant de livrer
- [ ] Build passe (`npx next build`)
- [ ] Aucune erreur TypeScript
- [ ] Aucune console.error en dev
- [ ] Sections responsive testées (mobile 375px, desktop 1440px)
- [ ] Pas de layout shift au chargement
- [ ] Animations fluides sur mobile (60fps)

---

## 11. Livrables Attendus

```
src/components/sections/
├── why-choose.tsx
├── stats-section.tsx
├── coaching-process.tsx
├── massage-ambiance.tsx
├── testimonials-v2.tsx
└── faq-visual.tsx

// + modifications dans :
src/app/page.tsx  (intégration des sections)
```

**Ne pas livrer** :
- Nouvelles images lourdes
- Nouvelles dépendances npm
- Modifications du backend

---

## 12. Contact & Questions

Si tu as un doute sur :
- Une couleur → regarde `src/app/globals.css`
- Un composant existant → regarde `src/components/ui/`
- L'intégration → regarde `src/app/page.tsx`
- Le build → lance `npx next build`

**Ce brief est conçu pour être 100% autonome.** Tu dois pouvoir créer toutes les sections sans poser de questions. Bon courage ! 🚀
