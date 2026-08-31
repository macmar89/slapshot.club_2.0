# Backlog

Priorizovaný zoznam plánovanej práce. Priority: **P0 (ultra high)** → **P1 (high)** →
**P2** → **P3**. Položka sa považuje za hotovú až po dokončení BE + FE + prekladov
(sk/cs/en) + testov.

Stav ku dňu: 2026-08-19.

Legenda stavov: `📋 backlog` · `🔎 upresňuje sa` · `🚧 rozpracované` · `✅ hotové`

| # | Položka | Priorita | Stav |
| --- | --- | --- | --- |
| [1](#1-zmena-bodovania--presné-skóre-jedného-tímu) | Zmena bodovania — presné skóre jedného tímu | **P0** | 📋 |
| [2](#2-mobile-first--pwa--push-notifikácie) | Mobile-first + PWA + push notifikácie | **P0** | 📋 |
| [3](#3-mesačný-ranking-vedľa-celkového) | Mesačný ranking vedľa celkového | **P1** | 📋 |
| [4](#4-odznaky-a-ocenenia) | Odznaky a ocenenia | **P1** | 📋 |

---

## 1. Zmena bodovania — presné skóre jedného tímu

**Priorita: P0 (ultra high) · Stav: 📋 backlog · Odhad: M (2–4 dni) + migračný beh**

### Zadanie

3 body získa hráč, ktorý trafí víťaza **a zároveň** presné skóre aspoň jedného tímu.
Príklad: výsledok **4:3**, tip **4:1** → víťaz sedí (domáci) + domáci gól count sedí (4) → **3 body**.

### Súčasný stav (zistené v kóde)

Bodovanie je v `backend/src/config/app.ts` → `APP_CONFIG.POINTS`:

| Konštanta | Hodnota | Podmienka (`calculatePoints`) |
| --- | --- | --- |
| `EXACT` | 5 | presné skóre oboch tímov |
| `DIFF` | 3 | správny víťaz **a** správny gólový rozdiel |
| `TREND` | 2 | správny víťaz (rozdiel nesedí) |
| `WRONG` | 0 | zlý víťaz |

Logika: `backend/src/services/predictions/predictionsLogic.service.ts:14` (`calculatePoints`),
volaná z `evaluateMatch` (tamže). Výsledok sa propaguje do:

- `predictions` — stĺpce `points`, `isExact`, `isTrend`, `isDiff`, `isWrong`
- `leaderboard_entries` — `totalPoints`, `exactGuesses`, `correctTrends`, `correctDiffs`,
  `wrongGuesses`, `currentForm` (písmená `E` / `S` / `W` / `L`, DB check constraint `^[ESWL]*$`)
- `user_stats` — `lifetimePoints`, `lifetimePossiblePoints` (= počet tipov × `POINTS.EXACT`),
  `lifeTime*` countery
- `competition_snapshots` — `exactGuesses`, `winnerDiff`, `winner`, `adjacent`
  (⚠️ `adjacent` vyzerá ako pozostatok staršieho systému, ktorý podobný koncept už mal — pred
  implementáciou skontrolovať, či sa dá recyklovať alebo treba zahodiť)

Reverz existuje: `revertMatchEvaluation()` — dá sa použiť ako základ pre prepočet.

### Otvorená otázka — MUSÍ sa rozhodnúť pred implementáciou 🔎

Nová podmienka **koliduje s existujúcou `DIFF`**, obe by dávali 3 body:

- výsledok 4:3, tip 4:1 → **nová podmienka** (jeden tím presne) → 3 b
- výsledok 4:3, tip 3:2 → **`DIFF`** (rozdiel +1 sedí, žiadny tím presne) → 3 b

Dve varianty:

**Varianta A — pridať nový tier, `DIFF` nechať (menší zásah)**

| Tier | Body | Podmienka |
| --- | --- | --- |
| `EXACT` | 5 | oba tímy presne |
| `PARTIAL` (nový) | 3 | správny víťaz + aspoň jeden tím presne |
| `DIFF` | 3 | správny víťaz + správny rozdiel |
| `TREND` | 2 | správny víťaz |
| `WRONG` | 0 | — |

Poradie vyhodnotenia: `EXACT` → `PARTIAL` → `DIFF` → `TREND` → `WRONG` (tip môže spĺňať
`PARTIAL` aj `DIFF` naraz, napr. 4:3 vs. 3:2? nie — ale 4:2 vs. 4:2 áno; treba jednoznačné
poradie, nech štatistiky nie sú dvojznačné).

**Varianta B — prekopať škálu, `DIFF` znížiť (čistejšie, ale prepočet celej histórie)**

| Tier | Body |
| --- | --- |
| `EXACT` | 5 |
| `PARTIAL` | 3 |
| `DIFF` | 2 |
| `TREND` | 1 |
| `WRONG` | 0 |

**Odporúčanie: Varianta A.** Nikomu neuberá body, takže sa dá nasadiť aj bez spätného
prepočtu (len „od dátumu X"), a rozdiel medzi `PARTIAL` a `DIFF` je stále čitateľný
v štatistikách. B je „krajšia" škála, ale znamená, že každému hráčovi klesnú body — to sa
bez retroaktívneho prepočtu a komunikácie nasadiť nedá.

### Ďalšie hraničné prípady na dorozhodnutie 🔎

- **Presné skóre jedného tímu + zlý víťaz** (výsledok 4:3, tip 1:3) → podľa zadania **0 bodov**
  (obe podmienky sú povinné). Potvrdiť.
- **Remíza** (výsledok 3:3, tip 3:3 = `EXACT`; tip 2:2 = správny „trend" + rozdiel 0). Overiť, či
  aplikácia vôbec pripúšťa remízy (hokej s predĺžením) alebo sa vždy ukladá výsledok po OT/SO.
- **Ktorý tím sa počíta ako „trafený"** pri tipe typu 4:4 na výsledok 4:3 — víťaz nesedí, takže 0.
  Konzistentné s bodom vyššie.

### Rozsah zmien

**Backend**

- `config/app.ts` — pridať `POINTS.PARTIAL`
- `types/prediction.types.ts` — `ScoringResult` + `isPartial`
- `services/predictions/predictionsLogic.service.ts` — `calculatePoints()` nová vetva,
  `evaluateMatch()` agregácia `partial`, nové písmeno do `currentForm`
- **Schéma (⚠️ migráciu negenerovať bez schválenia):**
  - `predictions` → `is_partial boolean default false not null`
  - `leaderboard_entries` → `correct_partials integer default 0`, uvoľniť check constraint
    `current_form_check` o nové písmeno (napr. `P`) → `^[ESPWL]*$`
  - `user_stats` → `life_time_correct_partials integer default 0`
- `revertMatchEvaluation()` — dorovnať o nový counter
- Skript na **spätný prepočet** (viď nižšie)

**Frontend**

- `messages/{sk,cs,en}.json` — nový typ výsledku, popis v pravidlách
- Komponenty s výsledkom tipu / legendou bodovania (badge, farba, ikona)
- `features/user-manual` — aktualizovať tabuľku bodovania
- Štatistiky hráča (`features/player`) — nový counter vedľa exact/diff/trend

**Testy**

- `services/predictions/__tests__/predictionsLogic.service.test.ts` je integračný test na
  `evaluateMatch`. Doplniť **čistý unit test pre `calculatePoints`** s maticou prípadov
  (min. 15 kombinácií vrátane remíz, nuly, zlého víťaza s presným tímom).

### Spätný prepočet — rozhodnúť 🔎

Tri možnosti:

1. **Bez prepočtu** — nové pravidlo platí len na zápasy vyhodnotené po nasadení.
   Najbezpečnejšie, ale v rámci jednej sezóny nespravodlivé.
2. **Prepočet aktuálnej sezóny** — one-off skript: pre každý `finished` zápas
   `revertMatchEvaluation()` + `evaluateMatch()`, potom `refreshCompetitionRankings()`.
   Pozor: `evaluateMatch` posiela notifikácie a enqueuuje joby → potrebuje „silent" režim.
3. **Prepočet celej histórie** vrátane `user_stats` a `competition_snapshots`.

**Odporúčanie: 2** — nasadiť medzi kolami, s Slack notifikáciou a zálohou DB pred behom.

### Definícia hotového

- [ ] Rozhodnutá varianta A/B a hraničné prípady
- [ ] Schéma navrhnutá, odsúhlasená, migrácia vygenerovaná
- [ ] `calculatePoints` + unit test matica zelená
- [ ] Reverz aktualizovaný, `evaluateMatch` → `revert` → `evaluateMatch` je idempotentné
- [ ] Preklady sk/cs/en + aktualizovaný user manual
- [ ] Prepočet zbehnutý na stagingu, poradie v rebríčku overené

---

## 2. Mobile-first + PWA + push notifikácie

**Priorita: P0 (ultra high) · Stav: 📋 backlog · Odhad: L (rozdeliť na 3 samostatné celky)**

### Súčasný stav (zistené v kóde)

**Čo už existuje:**

- `frontend/src/hooks/use-standalone.ts` — detekcia `display-mode: standalone` + iOS
  `navigator.standalone`, cez `useSyncExternalStore` (SSR-safe)
- `components/layout/pwa-only-nav.tsx` — tab nav sa renderuje len v standalone režime
- `components/layout/mobile-tab-nav.tsx`, `MainMobileNav.tsx`, `header/mobile-menu.tsx`
- `components/layout/orientation-lock.tsx` — blokuje landscape na mobile
- `PWA.orientation_lock` kľúče v `messages/{sk,cs,en}.json`
- In-app notifikácie: tabuľka `notifications`, enum `notification_type` (21 typov),
  `NOTIFICATION_GROUPS` (GAME / SOCIAL / COMPETITION / SYSTEM / ANNOUNCEMENTS),
  `notifications.queue.ts` + `notifications.worker.ts`, `notify()` service

**Čo chýba (nič z toho v repe nie je):**

- `manifest.webmanifest` / `app/manifest.ts` — **žiadny manifest**, takže appka sa reálne
  nedá nainštalovať; `useStandalone` je zatiaľ mŕtvy kód
- Ikonky — v `public/` je len `icon.webp`; treba kompletnú sadu (192/512, maskable, apple-touch)
- Service worker — žiadny; teda ani offline shell, ani príjem pushu
- Install prompt (`beforeinstallprompt`) + iOS „Pridať na plochu" návod
- Backend push: **žiadna** `web-push` závislosť, žiadna tabuľka pre subscriptions, žiadne VAPID
- `user_settings` má len `gdprConsent` / `marketingConsent` — **žiadne preferencie notifikácií**

### Celok 2a — Mobile-first audit a doladenie UI

- Definovať breakpoint stratégiu a zapísať ju do `frontend/CLAUDE.md` (teraz nikde nie je).
- Prejsť kľúčové obrazovky v poradí dôležitosti: **zadávanie tipov → dashboard → rebríček →
  detail zápasu → skupiny → profil**.
- Konkrétne body:
  - tap targety ≥ 44 px, žiadne hover-only interakcie
  - `env(safe-area-inset-bottom)` pre tab nav (iPhone home indicator)
  - dialógy na mobile ako bottom sheet, nie centrované modály
  - zadávanie tipu palcom — steppery / veľké tlačidlá namiesto number inputu
  - dlhé zoznamy (rebríček) — virtualizácia alebo stránkovanie, nie render 500 riadkov
  - skeletony namiesto spinnerov (časť už existuje, zjednotiť)
- Metriky: LCP / INP / CLS na mobile (Lighthouse mobile profil) — stanoviť cieľ pred zmenami.

### Celok 2b — PWA (inštalovateľnosť + offline shell)

- `app/manifest.ts` (Next 16 App Router): name, short_name, `display: standalone`,
  `orientation: portrait`, theme/background color, `start_url` s locale prefixom
  (pozor — `proxy.ts` vynucuje locale v URL, `start_url: "/"` skončí na redirecte),
  `id`, `scope`, shortcuts (Tipy / Rebríček).
- Sada ikon vrátane **maskable** varianty a `apple-touch-icon`.
- Service worker — **odporúčanie: Serwist** (`@serwist/next`), `next-pwa` pre Next 16
  nie je udržiavaný. Alternatíva: ručne písaný SW, keďže reálne potrebujeme len offline
  fallback + push handler.
  - cache stratégie: app shell precache, static assets stale-while-revalidate,
    **API volania necachovať** (auth cookies, live skóre)
  - offline fallback stránka
  - verzovanie SW + prompt „nová verzia, obnoviť"
- Install prompt: zachytiť `beforeinstallprompt`, vlastný nenápadný banner; pre iOS
  (kde event neexistuje) inštrukcie „Zdieľať → Pridať na plochu".
- Overiť správanie `OrientationLock` a `PwaOnlyNav` po tom, ako standalone začne reálne fungovať.

### Celok 2c — Push notifikácie

**Backend**

- Závislosť `web-push`, VAPID kľúče do env (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`,
  `VAPID_SUBJECT`); public kľúč vystaviť aj FE cez `NEXT_PUBLIC_*`.
- **Nová tabuľka `push_subscriptions`** (⚠️ migráciu negenerovať bez schválenia):
  `id`, `userId`, `endpoint` (unique), `p256dh`, `auth`, `userAgent`, `locale`,
  `lastSuccessAt`, `failureCount`, `createdAt`, `deletedAt`.
- Rozšíriť `notifications.service.ts` / `notifications.worker.ts`: po zápise in-app
  notifikácie fan-out na push. Doručenie musí byť **best-effort** — pád pushu nesmie
  zhodiť in-app notifikáciu.
- Odpoveď `404` / `410` z push služby → subscription zmazať. `429` → backoff.
- Rate limiting a batching (existujúci `notifications-queue` + BullMQ je na to pripravený).
- Preferencie: rozšíriť `user_settings` (alebo nová `user_notification_settings`) o toggle
  per `NOTIFICATION_GROUP` × kanál (in-app / push / email).

**Frontend**

- Push handler v SW (`push`, `notificationclick` → deep link do appky).
- Žiadosť o `Notification.permission` **len z user gesture** a až po tom, čo hráč videl
  hodnotu appky — nie hneď po načítaní.
- Obrazovka nastavení notifikácií.

**⚠️ iOS obmedzenia — počítať s nimi v UX:**

- Web push funguje od **iOS 16.4** a **len keď je appka pridaná na plochu** (standalone).
- Permission prompt musí prísť z user gesture.
- → na iOS treba flow: „nainštaluj na plochu" → až potom ponúknuť notifikácie.

**Prvé typy pushu (nezaplaviť hráčov):** `MATCH_REMINDER`, `DAILY_TIPS_REMINDER`,
`POINTS_AWARDED`, `GROUP_INVITE`. Zvyšok nechať len in-app.

### Definícia hotového

- [ ] Lighthouse mobile PWA audit prejde (installable, offline)
- [ ] Appka sa reálne nainštaluje na Android aj iOS a beží v standalone
- [ ] Push doručený na Android + iOS 16.4+ (reálne zariadenie, nie simulátor)
- [ ] Odhlásenie z notifikácií funguje a rešpektuje sa vo workeri
- [ ] Neplatné subscriptions sa samy čistia

---

## 3. Mesačný ranking vedľa celkového

**Priorita: P1 (high) · Stav: 📋 backlog · Odhad: M–L**

### Zadanie

Okrem celkového (sezónneho) poradia bežia aj **mesačné súťaže**, aby mali šancu aj hráči,
ktorí sa pripoja neskôr.

### Súčasný stav

`leaderboard_entries` je jednoznačne kľúčovaná cez unique index
`(userId, competitionId, seasonYear)` — teda **jeden riadok = jedna sezóna**. Prepočet poradia
robí `refreshCompetitionRankings(competitionId)` (`services/leaderboard.service.ts`),
spúšťaný jobom `recalculateCompetitionRanks` v `competitions.worker.ts` po každom vyhodnotení
zápasu. Existuje aj `competition_snapshots` (denné snímky poradia) — použiteľné na grafy,
nie ako zdroj pravdy pre mesačné poradie.

### Návrh riešenia

**Odporúčaná varianta: obdobie ako stĺpec v `leaderboard_entries`.**

- pridať `period_key varchar(7)` — `'total'` pre sezónu, `'2026-01'` pre mesiac
- unique index zmeniť na `(userId, competitionId, seasonYear, periodKey)`
- `evaluateMatch()` zapisuje **dva riadky** — `total` + mesiac zápasu
- `refreshCompetitionRankings()` dostane parameter `periodKey` a beží pre `total`
  aj pre aktuálny mesiac

Výhoda: rovnaký ranking engine, rovnaké UI komponenty, rovnaké countery, žiadna duplicitná
logika. Nevýhoda: migrácia existujúcich riadkov na `period_key = 'total'`.

Alternatíva (odmietnutá): počítať mesiac agregačným dotazom nad `predictions` + `matches.date`
za behu — menej zápisov, ale rank sa počíta pri každom čítaní a poradie nie je stabilné.

### Kritické detaily

- **Podľa čoho sa určuje mesiac** — podľa **dátumu zápasu** (`matches.date`), nie podľa dátumu
  vyhodnotenia. Inak by prepočet/reverz presunul body do iného mesiaca.
- **Časová zóna** — hranica mesiaca musí byť v jednej kanonickej zóne (`Europe/Bratislava`),
  do konfigu. NHL zápasy začínajú v noci SEČ, takže zápas z 31. 1. o 01:30 SEČ patrí do januára —
  ale hráč ho vnímal ako „30. januára večer". Rozhodnúť a **zdokumentovať v pravidlách**. 🔎
- **Minimálna účasť** — bez nej vyhrá mesiac hráč s 2 tipmi a 100 % úspešnosťou. Odporúčam
  prah (napr. min. 60 % odohraných zápasov mesiaca alebo min. N tipov), inak sa hráč
  v mesačnom rebríčku zobrazí, ale nie je „eligible" na výhru. 🔎
- **Uzavretie mesiaca** — cron job (rozšíriť `competitions.worker.ts`): po poslednom zápase
  mesiaca zmraziť poradie, zapísať do archívnej tabuľky `competition_period_results`
  (víťaz, podium, počet účastníkov), poslať notifikácie, udeliť odznaky (→ položka 4).
- **Reverz** — `revertMatchEvaluation()` musí odčítať z oboch riadkov (total + mesiac).

### Rozsah zmien

**Backend:** schéma (`leaderboard_entries.period_key`, nová `competition_period_results`),
`predictionsLogic.service.ts`, `leaderboard.service.ts`, `leaderboardEntries.repository.ts`,
`competitions.worker.ts` (nový job `closeMonthlyPeriod`), nové notifikačné typy
(`MONTHLY_PERIOD_STARTED`, `MONTHLY_PERIOD_FINISHED`).

**Frontend:** rebríček — prepínač `Celkovo | Mesiac` + výber mesiaca, sieň slávy s víťazmi
mesiacov, profil hráča s mesačnou históriou, preklady, user manual.

---

## 4. Odznaky a ocenenia

**Priorita: P1 (high) · Stav: 🔎 upresňuje sa · Odhad: L**

### Zadanie

Odznaky a ocenenia + vymyslieť **bodovací systém pre odznaky**.

### Kľúčové rozhodnutie 🔎

**Body za odznaky nesmú vstupovať do tipovacieho rebríčka.** Inak sa zmieša „kto lepšie tipuje"
s „kto viac nazbieral" a hlavná súťaž stratí zmysel.

**Odporúčanie: samostatná mena — `prestige` / XP.** Odznaky dávajú XP, XP tvorí samostatné
poradie („zberatelia") a level hráča. V `user_stats` už existujú **nevyužité stĺpce
`current_ovr` a `max_ovr_ever`** (všade sa zapisujú ako 0) — sú ideálny kandidát na to, aby ich
odznaky konečne naplnili. Overiť pri implementácii, či OVR nemá inde iný zamýšľaný význam.

### Návrh dátového modelu (⚠️ migráciu negenerovať bez schválenia)

- `badges` — `code` (unique, napr. `SNIPER_5`), `category`, `tier`, `xp`, `iconKey`,
  `criteria jsonb`, `isActive`, `sortOrder`
- `badges_locales` — `name`, `description`, `locale` (rovnaký pattern ako `competitions_locales`)
- `user_badges` — `userId`, `badgeId`, `competitionId?`, `periodKey?`, `awardedAt`,
  `meta jsonb`; unique `(userId, badgeId, competitionId, periodKey)` kvôli idempotencii

### Kategórie odznakov (návrh)

| Kategória | Príklady |
| --- | --- |
| **Presnosť** | 1. presný tip · 10 / 50 / 100 presných tipov · 3 presné v rade |
| **Séria** | 5 / 10 / 20 zápasov s bodmi v rade · tip každý deň v týždni |
| **Objem** | 50 / 250 / 1000 tipov · prvý tip v sezóne |
| **Mesačné** | víťaz mesiaca · podium mesiaca · 3× po sebe v top 10 (viaže sa na položku 3) |
| **Sezónne** | víťaz súťaže · top 1 % · dokončená sezóna bez vynechaného zápasu |
| **Sociálne** | pozvaný priateľ · vlastník skupiny · výhra v súkromnej lige |
| **Špeciálne** | trafený zápas s najnižšou úspešnosťou tipérov · comeback (z posledných 10 % do top 50 %) |

### Bodová škála (návrh)

| Tier | XP | Poznámka |
| --- | --- | --- |
| Bronze | 10 | ľahko dosiahnuteľné, onboarding |
| Silver | 25 | pravidelná aktivita |
| Gold | 50 | výkon nad priemer |
| Platinum | 100 | sezónne / mesačné víťazstvá |
| Special | 150 | udalostné, časovo obmedzené |

Doplniť **multiplikátor vzácnosti** — odznak, ktorý má < 5 % hráčov, dostane vyššiu váhu.
Alternatíva bez XP: odznaky len ako zbierka + „hall of fame" (jednoduchšie, menej motivujúce).
Rozhodnúť pred implementáciou. 🔎

### Vyhodnocovacia mašinéria

- **Deklaratívne pravidlá v kóde** (konštanty + predikátové funkcie), DB drží len metadáta
  a preklady. Pravidlá čisto v `jsonb` sa zvrhnú na neudržateľný mini-jazyk.
- Nový `badges.queue` + `badges.worker`; job sa enqueuuje po `evaluateMatch()`,
  po uzavretí mesiaca a po sociálnych udalostiach.
- **Idempotencia** — udelenie odznaku je `insert ... on conflict do nothing`.
- **Reverz** — `revertMatchEvaluation()` musí vedieť odznak odobrať, ak podmienka prestala
  platiť (napr. opravený výsledok zápasu). Rozhodnúť, či sa odoberá alebo sa ponechá. 🔎
- **Backfill** — pri spustení feature udeliť odznaky spätne z existujúcej histórie, inak
  začnú s prázdnou vitrínou aj dlhoroční hráči.

### Frontend

- Vitrína odznakov v profile (získané / nezískané so „zamknutým" stavom a progresom)
- Odznaky pri mene v rebríčku (max 1–3, aby sa neprebilo poradie)
- Toast / modal pri získaní + nový notifikačný typ `BADGE_AWARDED`
- Preklady názvov a popisov cez `badges_locales`, nie cez `messages/*.json`

---

## Poznámky k závislostiam medzi položkami

- **1 → 3, 4**: bodovanie meniť **pred** mesačným rankingom a odznakmi, inak sa prepočet
  robí dvakrát.
- **3 → 4**: mesačné odznaky (víťaz mesiaca) potrebujú hotový mesačný ranking.
- **2** je nezávislá — dá sa robiť paralelne. Push notifikácie sa však oplatí nasadiť skôr
  než odznaky, aby mali odznaky kanál na doručenie.
