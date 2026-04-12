import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { APP_CONFIG } from '@/config/app';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <IceGlassCard className="mx-auto max-w-4xl p-6 md:p-10">
        <div className="prose prose-invert max-w-none text-white/80">
          <h1 className="mb-8 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Všeobecné obchodné podmienky (Slapshot Club)
          </h1>
          
          <div className="mb-8 text-sm text-white/60">
            <p className="mb-2">Dátum účinnosti: 12. apríla 2026</p>
            <p>Prevádzkovateľ: Marián Karola</p>
            <p>Adresa: Súkennícka ulica 268/18, 971 01 Prievidza</p>
            <p>Kontakt: {APP_CONFIG.SUPPORT_EMAIL}</p>
          </div>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">1. Prehľad a charakter Služby</h2>
          <p className="mb-4">
            Tieto podmienky upravujú prístup k a používanie aplikácie Slapshot Club ("Služba").
          </p>
          <p className="mb-4">
            Slapshot Club je zábavná, nekomerčná fanúšikovská platforma určená na simuláciu tipovania výsledkov hokejových zápasov.
          </p>
          <p className="mb-8">
            Aplikácia nie je hazardnou hrou, stávkovou kanceláriou ani platformou na hazardné hry. Používatelia medzi sebou nesúťažia o žiadne finančné odmeny ani vecné ceny s peňažnou hodnotou. Body v aplikácii sú virtuálne a slúžia výhradne na účely zostavovania fanúšikovských rebríčkov.
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">2. Registrácia a účty</h2>
          <p className="mb-4">
            Používanie Služby je podmienené vytvorením používateľského konta.
          </p>
          <p className="mb-4">
            Ste zodpovední za zabezpečenie svojich prihlasovacích údajov.
          </p>
          <p className="mb-8">
            Registráciou v čase testovacej prevádzky (Beta) môže byť používateľovi udelený bezplatný prístup k rozšíreným funkciám (PRO účet). Tento prístup je darom od Prevádzkovateľa a nezakladá právny nárok na jeho trvalé zachovanie.
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">3. Používanie Služby a duševné vlastníctvo</h2>
          <p className="mb-4">
            <strong>Vlastníctvo platformy:</strong> Všetko duševné vlastníctvo súvisiace s kódom, dizajnom a logom Slapshot Club patrí Prevádzkovateľovi.
          </p>
          <p className="mb-8">
            <strong>Právna výhrada k logám (NHL):</strong> Slapshot Club je nezávislý fanúšikovský projekt a nie je pridružený, sponzorovaný ani schválený ligou NHL, jej tímami ani inými hokejovými organizáciami. Logá tímov a ochranné známky použité v aplikácii sú majetkom ich príslušných vlastníkov a sú použité výhradne na informačné a identifikačné účely v rámci fanúšikovskej komunity. Ich použitie nemá komerčný charakter.
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">4. Zakázané činnosti</h2>
          <p className="mb-2">Používateľ súhlasí, že nebude:</p>
          <ul className="mb-8 list-disc space-y-2 pl-6">
            <li>Používať Službu na akúkoľvek formu podvodu alebo manipuláciu s výsledkami.</li>
            <li>Vytvárať viacnásobné účty za účelom získania neoprávnenej výhody v rebríčkoch.</li>
            <li>Nahrávať obsah porušujúci dobré mravy alebo práva tretích strán.</li>
          </ul>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">5. Beta prevádzka a obmedzenie zodpovednosti</h2>
          <ul className="mb-8 list-disc space-y-2 pl-6">
            <li>Služba je poskytovaná v stave „tak, ako je“ (as is) počas trvania Beta testovania.</li>
            <li>Prevádzkovateľ nezaručuje nepretržitú dostupnosť Služby ani správnosť bodovania v prípade technických chýb.</li>
            <li>Prevádzkovateľ nenesie zodpovednosť za žiadne škody vzniknuté v súvislosti s používaním Služby.</li>
          </ul>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">6. Rozhodné právo</h2>
          <p className="mb-4">
            Tieto Podmienky sa riadia právom Slovenskej republiky.
          </p>
          <p className="mb-8">
            <strong>Informácia pre používateľov z ČR:</strong> Tieto podmienky sú vyhotovené v slovenskom jazyku a vzťahujú sa rovnako na používateľov z Českej republiky, s čím používateľ registráciou súhlasí.
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">7. Zmeny a Kontakt</h2>
          <p className="mb-4">
            Tieto Podmienky môžu byť aktualizované (najmä pri prechode na právnickú osobu s.r.o.). V prípade otázok nás kontaktujte na: <a href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`} className="underline hover:text-white/80 transition-colors">{APP_CONFIG.SUPPORT_EMAIL}</a>.
          </p>
        </div>
      </IceGlassCard>
    </div>
  );
}
