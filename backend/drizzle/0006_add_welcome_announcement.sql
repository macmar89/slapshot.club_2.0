-- Custom SQL migration file
INSERT INTO "announcements" ("id", "slug", "type", "is_published", "is_pinned", "published_at", "created_at", "updated_at")
VALUES ('ucxz132221bwyfbw7bxrd2ew', 'welcome-to-the-roster', 'GENERAL', true, true, now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "announcements_locales" ("id", "parent_id", "locale", "title", "excerpt", "content") VALUES
('ghm0akfnyiqdk8owfnckxdcz', 'ucxz132221bwyfbw7bxrd2ew', 'cs', 'Vítej v sestavě Slapshot Clubu!', 'Vítej v sestavě Slapshot Clubu! 🏒 Koukni na pravidla bodování v kostce a zjisti, na jakých vylepšeních právě makáme. Vidíme se v Aréně!', '## Vítej v sestavě! 🏒

Jsem rád, že ses přidal k naší komunitě hokejových nadšencov. Aplikace je momentálně v **Beta verzi**, což znamená, že na ní neustále pracujeme a ladíme každý detail, aby byl tvůj zážitek z tipování co nejlepší.

### 🎁 Dárek pro tebe: PRO konto
Jako poděkování za to, že jsi s námi od začátku, získáváš automaticky **PRO konto úplně zdarma až do 31. 8. 2026**. 
Užívej si výhody jako:
* Vytváření vlastních soukromých skupin.
* Rozšířené statistiky tipů.
* Speciální označení v žebříčcích.

### 🛠️ Na čem pracujeme (Roadmap)
Některé funkce ještě nejsou stoprocentní nebo na ně v šatně teprve čekáme. V blízké době se můžeš těšit na:

* **Odznaky a Úspěchy:** Získávej speciální ocenění za své tipérské výkony a série vítězství.
* **Pokročilé notifikace:** Detailní nastavení, o čom všem chceš být informován (začátky zápasů, změny v žebříčku).
* **Tabulka týmů:** Přehledné statistiky týmů přímo u zápasů pro tvé jednodušší rozhodování při tipování.
* **Mobilní appka (PWA):** Neustrale vylepšujeme PWA verzi pro tvůj domovský displej i s podrobným návodem na instalaci.

### 📚 Základní pravidla v kostce
Tipuje se vždy **konečný výsledek** (včetně prodloužení a nájezdů).

* **5 bodů** – přesný zásah (trefa do černého).
* **3 body** – trefený vítěz a gólový rozdíl.
* **2 body** – trefený vítěz zápasu.

🔍 **Kde najdeš zbytek?**
Všechna podrobná pravidla, vysvětlení bodování a limity pro skupiny najdeš v sekci **[Uživatelská příručka](/user-manual)** (ikona knihy v menu).

### 💬 Tvůj názor rozhoduje
Pokud narazíš na chybu nebo máš nápad na vylepšení, neváhej použít sekci **Feedback**. Tvé připomínky čteme a pomáhají nám posouvat hru vpřed.

Máš už nabroušené brusle? Tak šup na led a ukaž, že jsi králem arény!

**Uvidíme se v žebříčku!**
*Tým Slapshot Club* ⛸️') ON CONFLICT (id) DO NOTHING;

INSERT INTO "announcements_locales" ("id", "parent_id", "locale", "title", "excerpt", "content") VALUES
('ghm0akfnyiqdk8owfnckxden', 'ucxz132221bwyfbw7bxrd2ew', 'en', 'Welcome to the Slapshot Club roster!', 'Welcome to the Slapshot Club roster! 🏒 Check out the scoring rules in a nutshell and see what improvements we’re working on. See you in the Arena!', '## Welcome to the roster! 🏒

I’m glad you’ve joined our community of hockey enthusiasts. The app is currently in **Beta**, which means we’re constantly working on it and tuning every detail to make your tipping experience the best it can be.

### 🎁 A gift for you: PRO account
As a thank you for being with us from the start, you automatically get a **PRO account completely free until August 31, 2026**. 
Enjoy benefits such as:
* Creating your own private groups.
* Enhanced tip statistics.
* Special badges in the leaderboards.

### 🛠️ What we’re working on (Roadmap)
Some features aren’t 100% yet, or we’re still preparing them in the locker room. In the near future, you can look forward to:

* **Badges and Achievements:** Earn special awards for your tipping performance and winning streaks.
* **Advanced Notifications:** Detailed settings for what you want to be notified about (game starts, leaderboard changes).
* **Team Standings:** Clear team statistics directly in the match view to help you make better tipping decisions.
* **Mobile App (PWA):** We’re constantly improving the PWA version for your home screen, including a detailed installation guide.

### 📚 Basic rules in a nutshell
Tips are always based on the **final score** (including overtime and shootouts).

* **5 points** – exact score (bullseye).
* **3 points** – correct winner and goal difference.
* **2 points** – correct match winner.

🔍 **Where can you find the rest?**
All detailed rules, scoring explanations, and group limits can be found in the **[User Manual](/user-manual)** section (book icon in the menu).

### 💬 Your opinion matters
If you run into a bug (icing) or have an idea for improvement, don’t hesitate to use the **Feedback** section. We read all your comments, and they help us move the game forward.

Are your skates sharpened yet? Then hit the ice and show that you’re the king of the arena!

**See you on the leaderboard!**
*The Slapshot Club Team* ⛸️') ON CONFLICT (id) DO NOTHING;

INSERT INTO "announcements_locales" ("id", "parent_id", "locale", "title", "excerpt", "content") VALUES
('ghm0akfnyiqdk8owfnckxdmj', 'ucxz132221bwyfbw7bxrd2ew', 'sk', 'Vitaj v zostave Slapshot Clubu!', 'Vitaj v zostave Slapshot Clubu! 🏒 Pozri si pravidlá bodovania v kocke a zisti, na akých vylepšeniach práve makáme. Vidíme sa v Aréne!', '## Vitaj v zostave! 🏒

Som rád, že si sa pridal k našej komunite hokejových nadšencov. Aplikácia je momentálne v **Beta verzii**, čo znamená, že na nej neustále pracujeme a ladíme každý detail, aby bol tvoj zážitok z tipovania čo najlepší.

### 🎁 Darček pre teba: PRO konto
Ako poďakovanie za to, že si s nami od začiatku, získavaš automaticky **PRO konto úplne zadarmo až do 31. 8. 2026**. 
Užívaj si výhody ako:
* Vytváranie vlastných súkromných skupín.
* Rozšírené štatistiky tipov.
* Špeciálne označenie v rebríčkoch.

### 🛠️ Na čom pracujeme (Roadmap)
Niektoré funkcie ešte nie sú stopercentné alebo na ne v šatni ešte len čakáme. V blízkej dobe sa môžeš tešiť na:

* **Odznaky a Úspechy:** Získavaj špeciálne ocenenia za svoje tipérske výkony a sériu víťazstiev.
* **Pokročilé notifikácie:** Detailné nastavenia, o čom všetkom chceš byť informovaný (začiatky zápasov, zmeny v rebríčku).
* **Tabuľka tímov:** Prehľadné štatistiky tímov priamo pri zápasoch pre tvoje jednoduchšie rozhodovanie pri tipovaní.
* **Mobilná appka (PWA):** Neustále vylepšujeme PWA verziu pre tvoj domovský displej aj s podrobným návodom na inštaláciu.

### 📚 Základné pravidlá v kocke
Tipuje se vždy **konečný výsledok** (vrátane predĺženia a nájazdov).

* **5 bodov** – presný zásah (trefa do čierneho).
* **3 body** – trafený víťaz a gólový rozdiel.
* **2 body** – trafený víťaz zápasu.

🔍 **Kde nájdeš zvyšok?**
Všetky podrobné pravidlá, vysvetlenia bodovania a limity pre skupiny nájdeš v sekcii **[Užívateľská príručka](/user-manual)** (ikona knihy v menu).

### 💬 Tvoj názor rozhoduje
Ak narazíš na chybu alebo máš nápad na vylepšenie, neváhaj použiť sekciu **Feedback**. Tvoje pripomienky čítame a pomáhajú nám posúvať hru vpred.

Máš už nabrúsené korčule? Tak šup na ľad a ukáž, že si kráľom arény!

**Vidíme sa v rebríčku!**
*Tím Slapshot Club* ⛸️') ON CONFLICT (id) DO NOTHING;