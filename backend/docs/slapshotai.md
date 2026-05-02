# Slapshot AI Interné Endpointy

Tento dokument popisuje fungovanie interných API endpointov vytvorených pre lokálneho AI agenta projektu Slapshot.club.

## 1. Zabezpečenie (Autentifikácia)
Oba endpointy sú chránené middlewarom `isInternalAgent`, ktorý očakáva v HTTP hlavičkách prítomnosť:
```
Authorization: Bearer <TOKEN>
```
Token musí presne zodpovedať hodnote uloženej v `.env` premennej `SLAPSHOTAI_TOKEN` (64-znakový string). Pri nesúhlase server vráti chybový kód `403 Forbidden`.

## 2. Architektúra
- **Typy (`src/types/slapshotai.types.ts`)**: Definujú striktnú formu JSON odpovede v tvare `camelCase`.
- **Repozitár (`src/repositories/slapshotai.repository.ts`)**: Obsahuje plne typované Drizzle ORM príkazy pre komunikáciu s databázou. Agreguje zoznam aktívnych a registračných súťaží, ťahá zápasy, počty tipov, a nové registrácie.
- **Service (`src/services/slapshotai.service.ts`)**: Združuje dáta z repozitára. Vypočítava celkové množstvo tipov (`totalTips`) na úrovni súťaží aj jednotlivých zápasov, triedi zápasy a novoverifikovaných používateľov podľa súťaže a počíta percentuálne distribúcie tipov (1, 2) pre jednotlivé zápasy.
- **Utils (`src/utils/slapshotai/time.utils.ts`)**: Využíva knižnicu `date-fns` na presný výpočet referenčných časových okien (napr. posuny o 24 hodín vzad z fixného času, výpočet začiatku a konca ISO týždňa pre Slovensko).

## 3. Zoznam Endpointov

### A) Denný Report (Daily)
**Cesta:** `GET /api/v1/internal/slapshotai/stats`

Tento endpoint zhromažďuje dáta za **posledných 24 hodín** vzťahujúcich sa k pevne danému času v dňa.
- Defaultný generovací čas je definovaný v `src/config/slapshotai.config.ts` (momentálne **09:20**).
- **Ako sa počíta okno:**
  - Ak sa opýtaš na dáta dnes o 11:00, vráti sa okno **[Včera 09:20 - Dnes 09:20]**.
  - Ak sa opýtaš dnes o 08:00, systém vie, že dnešný report ešte nenastal, a vráti **[Predvčerom 09:20 - Včera 09:20]**.
- **Voliteľný parameter `?date=ISO_STRING`**: Umožňuje získať historický denný report. Výpočet vygeneruje 24h okno, ktorého koniec bude o 09:20 pre deň uvedený v parametri.

### B) Týždenný Report (Weekly)
**Cesta:** `GET /api/v1/internal/slapshotai/stats/weekly`

Tento endpoint zhromažďuje dáta pre kalendárny týždeň.
- Defaultný generovací čas je definovaný v `src/config/slapshotai.config.ts` (momentálne **Pondelok 09:30**).
- Týždne sú rátané podľa ISO 8601 (prvým dňom je pondelok).
- **Ako sa počíta okno:**
  - Pokiaľ sa opýtaš hocikedy v priebehu aktuálneho týždňa (napr. streda), systém vygeneruje ohraničenie od **[Minulý Pondelok 09:30]** do **[Tento Pondelok 09:30]**. Toto ohraničenie garantuje ucelené týždenné dáta za uplynulý, plne uzavretý týždeň.
- **Voliteľné parametre `?week=XX&year=XXXX`**: Umožňuje dopytovať presný ISO týždeň. Zobrazí sa ohraničenie, ktoré pokrýva daný ISO týždeň. Objekt `summary` bude na vrchu JSONu hlásiť vyžiadaný `week` a `year`.

## 4. Výstup a Dáta
Všetky výstupy sú servírované v camelCase štandarde.

**Competitions:**
Vypísané sú len súťaže, ktoré buď majú odohraté zápasy vo vybranom časovom okne, **alebo** sú vo fáze `isRegistrationOpen === true`.
Pre každú súťaž vidíš:
- `status` (napr. 'upcoming', 'active')
- `isRegistrationOpen` (boolean)
- `totalUsersCount` (celkový počet doteraz zaregistrovaných účastníkov - `totalParticipants`)
- `newUsersCount` a zoznam mien v `newCompetitionUsers` (účastníci, ktorí sa verifikovali a pridali do súťaže práve vo vybranom časovom okne)

**Matches:**
Objekt obsahujúci výsledky jednotlivých zápasov. Zahŕňa pole `date`, celkový počet tipov (`totalTips`), úspešnosti a presné počty zhôd, ako aj nicky ľudí, ktorí trafili presný výsledok (`perfectHitUsernames`).
