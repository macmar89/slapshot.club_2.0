# Backend — Slapshot Club

Express 5 + TypeScript (ESM), Drizzle ORM (postgres-js), BullMQ nad Redisom, Zod v4,
pino logger, argon2 + JWT v httpOnly cookie.

## Spúšťanie

Backend beží v Dockeri, spúšťa sa cez `Makefile` v roote:

```bash
make run-local       # celý stack (backend = tsx watch src/index.ts, port 4800)
make logs-local-be   # logy backendu
make local-be-sh     # shell v kontajneri
make local-be-check  # tsc build + prettier check
make local-be-test   # vitest proti postgres_test (postgres_test:5432)
```

Drizzle: `db:generate`, `db:migrate`, `db:push`, `db:studio` (+ `:test` varianty).
**Nikdy ich nespúšťaj sám** — schému najprv navrhni, ukáž a počkaj na moje schválenie.

## Aktuálny stav vs. cieľ

Kód je zatiaľ vo vrstvenom MVC (`controllers/`, `services/`, `repositories/`,
`routes/`, `shared/constants/schema/`, `types/`, `queues/`, `workers/`).
**Cieľ je feature-based štruktúra v `src/features/`.**

Pravidlo: *nová funkcionalita ide rovno feature-based; staré vrstvy sa nerozširujú.*
Keď zasahujem do existujúcej oblasti a dohodneme sa na tom, presuniem ju celú naraz —
žiadne polovičné feature (controller vo `features/`, service v `services/`).

### Cieľový tvar

```
src/
  index.ts                  bootstrap: listen, scheduler jobs, import workerov
  app.ts                    zostavenie express appky (middleware, cors, helmet)
  routes.ts                 root router — mountuje feature routery
  features/
    <feature>/
      index.ts              verejné API feature (router, adminRouter, exportované service fn)
      <feature>.routes.ts
      <feature>.controller.ts
      <feature>.service.ts        (viac súborov ak treba: <feature>Sync.service.ts …)
      <feature>.repository.ts
      <feature>.schema.ts         zod schémy pre validate()
      <feature>.types.ts
      <feature>.messages.ts       user-facing hlášky/konštanty
      <feature>.mapper.ts
      <feature>.queue.ts / <feature>.worker.ts   ak feature má background joby
      admin/                      admin varianty routes/controller/service tej istej domény
      __tests__/
  shared/
    config/       env, app, redis, subscription, externé API konfigy
    db/           schema/, helpers.ts, index.ts, migrate.ts, seed/
    middleware/   auth, admin, validate, rateLimit, error, pagination, turnstile …
    utils/        appError, catchAsync, jwt, logger, pagination, date, math …
    types/        express.d.ts, global/pagination typy
  integrations/   email, slack, turnstile, api-hockey, slapshotai klienti
```

Zoznam feature: `auth`, `users`, `competitions`, `matches`, `predictions`, `groups`,
`leaderboard`, `notifications`, `announcements`, `feedback`, `internal`.

### Pravidlá feature-based štruktúry

- Feature komunikuje s inou feature **len cez jej `index.ts`**, nikdy priamym importom
  vnútorného súboru. Ak by vznikol cyklus, logika patrí do `shared/` alebo do
  nadradenej feature.
- Repository číta/píše **len tabuľky svojej domény**. Cross-domain čítanie rieš
  volaním service druhej feature.
- Cesta dát: `routes → validate(schema) → controller → service → repository → drizzle`.
  Controller nerobí biznis logiku, service nepozná `req`/`res`, repository nevaliduje.
- Router feature exportuje `Router` bez svojho prefixu — prefix a auth guardy sa
  nastavujú v `src/routes.ts`.

## Konvencie kódu (platia už teraz)

- ESM: **každý relatívny import končí `.js`**, aj keď zdroj je `.ts`.
- `import type { … }` pre typy (`verbatimModuleSyntax` je zapnuté).
- `tsconfig` má `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` —
  optional property posielaj ako `{ x: value } | {}`, nie `{ x: undefined }`.
- Handlery: `export const xHandler = catchAsync(async (req, res) => …)`.
- Chyby: `throw new AppError(message, HttpStatusCode.X)`; globálny `errorHandler` ich
  premení na odpoveď. Nepoužívaj magické čísla — `HttpStatusCode` enum.
- Odpoveď API: `{ status: 'success', data: … }` / `{ status: 'error', message, errors? }`.
- Validácia: zod schéma tvaru `z.object({ body, query, params })`, mountovaná cez
  `validate(schema)` v routeri. Schéma je zdroj pravdy pre typy vstupu.
- Soft delete: `deletedAt` + helpery `notDeleted(table)` / `activeOnly(table, …)`
  z `db/helpers.js`. Nikdy netvor hard delete bez dohody.
- ID: cuid2 cez `generateCuid()`; timestampy cez `baseTimestampsFields` /
  `withUpdatesFields` (mode `'string'`, s timezone).
- Repository funkcie prijímajú voliteľné `tx` a fallbackujú na default `db`.
- Audit: dôležité mutácie logujem cez `logActivity(req, ACTION, target, meta)`
  s `.catch()` — audit nesmie zhodiť request.
- Logger: `logger` z `utils/logger.js` (pino). Žiadne `console.log` v novom kóde.

## Background joby

BullMQ queue + worker per doména; workery sa importujú v `src/index.ts` kvôli
side-effectu, opakované joby sa plánujú v `app.listen` callbacku
(`scheduleMatchesSyncMasterJob`, `scheduleLiveMatchesTicker`, `scheduleMissingTipsReminder`,
`scheduleDailyMissingTipsReminder`, `scheduleDailyStandingsSync`).
Joby musia byť **idempotentné** — scoring beží v Drizzle transakciách.

## Známy dlh (nerieš sám, len o ňom vieš)

- `middleware/` aj `middlewares/` — duplicitné adresáre, zlúčiť pri migrácii.
- `constants/` (notifications) vs `shared/constants/` — nekonzistentné umiestnenie.
- Časť repository metód má `tx?: any` a filtre pretypované cez `as any`.
- `verify-profile-logic.ts` v roote balíka je pozostatok ad-hoc skriptu.
- Testy sú len dva (`services/admin`, `services/predictions`), vitest config chýba
  (beží cez `dotenv -e .env.test -- vitest`).
