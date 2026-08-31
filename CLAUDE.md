# Slapshot Club 2.0

Monorepo (npm workspaces nepoužité — dva samostatné `package.json`) pre tipovaciu
hokejovú aplikáciu.

- `backend/` — Express 5 + TypeScript (ESM), Drizzle ORM, PostgreSQL, Redis + BullMQ
- `frontend/` — Next.js 16 (App Router, React 19), Tailwind v4, shadcn/ui, SWR, Zustand
- `docker-compose.local.yml` + `Makefile` — celý local dev stack v Dockeri
  (test/prod sa nasadzuje cez Coolify a v repe sa nerieši)

Detailné pravidlá pre každú časť: [backend/CLAUDE.md](./backend/CLAUDE.md),
[frontend/CLAUDE.md](./frontend/CLAUDE.md).

## Príkazy (spúšťaj z rootu)

Local dev beží **celý v Dockeri** cez `Makefile`. Neštartuj `npm run dev` na hoste.

| Príkaz | Čo robí |
| --- | --- |
| `make help` | zoznam všetkých targetov |
| `make local` | build + up v popredí (logy pripojené) |
| `make run-local` / `stop-local` | up -d / down |
| `make restart-local-be` / `-fe` | restart jedného kontajnera |
| `make setup` | run-local + migrácie + seed admina |
| `make logs-local[-be\|-fe]` | logy |
| `make local-be-sh` / `local-fe-sh` | shell v kontajneri |
| `make local-be-check` / `local-fe-check` / `check` | build, prettier, eslint, testy |
| `make local-be-test` | vitest proti `postgres_test` |
| `make local-db-migrate` / `local-db-generate` | Drizzle (**len na môj pokyn**) |
| `make local-db-push-test` | nasype schému do `postgres_test` (nutné pred `local-be-test`) |
| `make local-db-studio` / `local-db-seed` / `local-db-sh` | studio, seed, psql |
| `make clean-local` | `down -v` — **zmaže aj databázový volume** |
| `npm run release[:patch\|:minor\|:major]` | standard-version + CHANGELOG |

Porty (prepísateľné v `.env.local`): postgres **5462**, postgres_test **5463**,
redis **6379**, backend **4800**, frontend **3800**, drizzle studio **4983**.
Pred `make local` skontroluj kolízie týchto portov s inými projektmi.

### Konfigurácia prostredia

- `.env.local` (gitignored, vzor v `.env.local.example`) — **len** porty, kredenciály
  postgresu a host-specific override (`localhost` → názvy compose služieb).
- `backend/.env` a `frontend/.env` ostávajú zdrojom app configu. V kontajneri sa
  načítavajú prvé, `.env.local` je druhý a prepíše `DATABASE_URL`, `REDIS_URL`
  a `NEXT_PUBLIC_API_URL` na `postgres` / `redis` / `backend`.
- `backend/.env.test` mieri na `postgres_test:5432` — testy bežia v kontajneri.

## Git a release

- Vetvy: `main` (dev), `production` (prod). Feature prácu vetvi z `main`.
- Commit message: **Conventional Commits** v angličtine (`feat:`, `fix:`, `refactor:`,
  `chore:`, `docs:`, `style:`, `perf:`, `test:`) — CHANGELOG sa generuje z nich.
- Verzia sa bumpuje naraz v root/frontend/backend `package.json` (`.versionrc`).
- Commituj a pushuj **len keď o to požiadam**.

## Smerovanie architektúry

Cieľ je **feature-based štruktúra** na oboch stranách.

- Frontend ju už má (`src/features/<feature>/`) — drž sa jej.
- Backend je ešte v MVC (`controllers/`, `services/`, `repositories/`, `routes/`)
  a **postupne sa migruje** do `src/features/`. Presné pravidlá a cieľový tvar sú
  v [backend/CLAUDE.md](./backend/CLAUDE.md) — nová funkcionalita ide rovno
  feature-based, staré vrstvy sa nerozširujú.

## Konvencie naprieč repom

- Kód, názvy, log hlášky, commit message: **anglicky**. Komunikácia so mnou: **slovensky**.
- Žiadne komentáre v kóde, pokiaľ si ich nevyžiadam.
- Zod v4 na validáciu na oboch stranách.
- Formátovanie: `npm run format` (prettier) v príslušnom balíku.
- `.cursor/rules/*` sú staré Payload CMS pravidlá z iného projektu — **ignoruj ich**.

## Dokumentácia

`docs/sk/` a `docs/en/` (zatiaľ neexistujú, `backend/docs/` má izolované poznámky).
Automaticky píš len `docs/sk/`; anglickú vetvu len na výslovné vyžiadanie.
