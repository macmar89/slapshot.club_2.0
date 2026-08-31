# Frontend — Slapshot Club

Next.js 16 (App Router, React 19), Tailwind v4, shadcn/ui (radix-ui), SWR, Zustand,
react-hook-form + zod, next-intl, axios, sonner.

Frontend beží v Dockeri, spúšťa sa cez `Makefile` v roote:

```bash
make run-local       # celý stack (frontend = next dev na porte 3800)
make logs-local-fe   # logy frontendu
make local-fe-sh     # shell v kontajneri
make local-fe-check  # eslint + next build
```

## Štruktúra

Frontend **už je feature-based** — drž sa toho.

```
src/
  app/[locale]/…        len routing, layouty, metadata; page.tsx importuje View z feature
    (app)/(arena)/…     prihlásená časť bez competition kontextu
    (app)/[slug]/…      competition kontext (dashboard, matches, groups, leaderboard, player)
    (auth)/…, (legal)/…, admin/…
  features/<feature>/
    <feature>.api.ts       axios/SWR volania
    <feature>.server.ts    server-side fetch (RSC)
    <feature>.schema.ts    zod
    <feature>.types.ts
    <feature>.utils.ts
    api/use-*.ts           SWR hooky, ak ich je viac
    components/            prezentačné komponenty feature
    views/*-view.tsx       kompozičný root, ktorý renderuje page.tsx
    store/use-*-store.ts   Zustand store feature
  components/ui|layout|common    zdieľané, feature-agnostické
  lib/          api.ts (axios + refresh interceptor), api-routes.ts, swr-fetcher.ts, utils.ts
  hooks/, config/, providers/, store/, i18n/, messages/, assets/
  proxy.ts      next middleware (auth + locale)
```

Väčšie feature môžu mať vnorené podfeature (`features/competitions/groups/…`,
`features/admin/matches/…`) s rovnakým vnútorným tvarom.

## Konvencie

- Súbory a adresáre **kebab-case** (`group-detail-view.tsx`), komponenty PascalCase.
- Server Component je default; `'use client'` len tam, kde treba interaktivitu —
  najnižšie v strome, nie na úrovni celého view.
- Dáta: RSC cez `<feature>.server.ts` + `lib/api-server.ts`, klient cez SWR
  (`swr-fetcher.ts`). Po mutácii invaliduj SWR kľúč, nerob `router.refresh()` naslepo.
- Endpointy nikdy nehardcoduj — `lib/api-routes.ts` (`API_ROUTES.*`).
- Auth beží na httpOnly cookies; refresh token flow rieši interceptor v `lib/api.ts`.
- Formuláre: react-hook-form + `zodResolver` nad schémou z `<feature>.schema.ts`.
- Texty **vždy cez next-intl** (`src/messages/{sk,cs,en}.json`), žiadne natvrdo
  napísané user-facing stringy. Locale prefix je vynútený v URL.
- UI: shadcn komponenty pridávaj cez `npx shadcn@latest add …` do `components/ui/`,
  neupravuj ich ad-hoc kópiami. Triedy skladaj cez `cn()` z `lib/utils.ts`.
- Toasty cez `sonner`, nie vlastné alerty.
