# AGENTS.md — Sab-Fit (sab-fit.com)

Règles du projet. **À lire avant toute action.** Ces règles s'appliquent à tous les agents, à chaque session, y compris après un redémarrage complet.

---

## ⛔ RÈGLES STRICTES — PRODUCTION

Le site est **EN LIGNE** sur https://www.sab-fit.com (Netlify). La boutique (réservations, paiements Stripe, emails Resend) est **active** avec de vrais clients.

### 1. Git : AUCUN push sans autorisation explicite

- ❌ **Interdit** : `git push`, `git push --force`, `git reset --hard`, `git rebase`, `git push origin main` — sauf si l'utilisateur l'a **explicitement demandé dans la conversation en cours**.
- ✅ **Autorisé** : commits locaux, création de branches locales (`git checkout -b feature/...`).
- Les chantiers importants se font sur une **branche dédiée**, jamais directement sur `main`.
- Avant tout push autorisé : `npm run build` doit passer sans erreur.
- Ne jamais réécrire l'historique sans demande explicite (le repo contient l'historique de production).

### 2. Base de données de production (Supabase)

- ❌ **Interdit** sans autorisation explicite : `prisma db push`, `prisma migrate deploy/reset`, tout script SQL contre la prod (`scripts/*.sql`, `scripts/sync-sabrina-db.ts`), toute modification/insertion/suppression de données de production.
- Toute évolution de schéma se prépare en local, puis attend le feu vert de l'utilisateur pour l'application.

### 3. Secrets & credentials

- ❌ Ne jamais lire, modifier ou committer `.env`, `.env.local`, `.env.production` (le runtime s'en charge).
- ❌ Ne jamais committer de secret (clés Stripe/Resend/Supabase, mots de passe). **GitHub Push Protection bloque les pushes** contenant des secrets.
- Les mots de passe admin sont fournis via variables d'environnement uniquement (`ADMIN_SABRINA_PASSWORD`, `ADMIN_JOHAN_PASSWORD`).

### 4. Ne pas casser l'existant

- Le **flux de paiement actuel** (panier → formulaire → Stripe → webhook → emails) doit rester fonctionnel à chaque commit.
- Le **style visuel validé** (Excalidraw pastel, palette pastel, Comic Neue) est une contrainte de design à respecter.
- Toute modification du tunnel de vente ou du webhook Stripe exige une re-vérification manuelle du flux complet.

---

## 📋 Contexte du projet

- **Site** : https://www.sab-fit.com — coaching sportif & massages bien-être dans le Var (83).
- **Stack** : Next.js 16 (App Router), TypeScript strict, Tailwind CSS 4, framer-motion, Prisma 5, Supabase (PostgreSQL + Auth + RLS), Stripe Checkout + webhooks, Resend (emails), Netlify, PWA (next-pwa).
- **Repo** : `git@github-b2big:B2Big/sabrina_website.git` — config git locale : user `B2Big`.
- **Docs de contexte** : `docs/PROJECT_CONTEXT.md`, `docs/CHANGELOG.md`, `docs/sessions/**/*.md` (à mettre à jour en fin de session).
- **Roadmap en cours** : système de réservation par créneaux (booking) — voir `docs/sessions/2026-09/SESSION_2026-09-05.md`. Travail prévu sur branche `feature/booking`.
- **Build** : `npm run build` (webpack). Le lint est actuellement cassé (eslint 10 vs eslint-config-next).
- **Migrations** : l'historique utilise `prisma db push` (une ancienne migration `init` est corrompue — ne pas tenter de la réparer sans accord).

---

## ✅ Récap rapide pour chaque session

1. Le site est en production → **aucun push sans autorisation explicite de l'utilisateur**.
2. Commits locaux OK, branches locales OK, build local OK.
3. Base de prod, secrets et migrations : touche à rien sans feu vert.
4. Mets à jour `docs/sessions/` en fin de session.
