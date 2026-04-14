import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { APP_CONFIG } from '@/config/app';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <IceGlassCard className="mx-auto max-w-4xl p-6 md:p-10">
        <div className="prose prose-invert max-w-none text-white/80">
          <h1 className="mb-8 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Zásady ochrany súkromia (Slapshot Club)
          </h1>

          <div className="mb-8 text-sm text-white/60">
            <p className="mb-2">Dátum účinnosti: 12. apríla 2026</p>
            <p>Prevádzkovateľ: Marián Karola</p>
            <p>Adresa: Súkennícka ulica 268/18, 971 01 Prievidza</p>
            <p>Kontakt: {APP_CONFIG.SUPPORT_EMAIL}</p>
          </div>

          <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <strong>Informace pro uživatele z České republiky: &gt;</strong> Tento dokument je
            vyhotoven ve slovenském jazyce, který je pro obě strany srozumitelný. Ochrana osobních
            údajů uživatelů z ČR se řídí stejnými standardy GDPR jako u uživatelů ze SR. Registrací
            do aplikace vyjadřujete souhlas s těmito podmínkami.
          </div>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">1. Úvod</h2>
          <p className="mb-8">
            Slapshot Club ("my", "nás", "naše") rešpektuje vaše súkromie a spracúvava osobné údaje v
            súlade so Všeobecným nariadením o ochrane osobných údajov (GDPR). Aplikácia je
            momentálne v štádiu Beta testovania a je poskytovaná bezodplatne.
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">2. Aké údaje zbierame</h2>
          <p className="mb-2">Pri používaní Služby zbierame len nevyhnutné údaje:</p>
          <ul className="mb-8 list-disc space-y-2 pl-6">
            <li>
              <strong>Informácie o účte:</strong> E-mailová adresa (slúži na prihlásenie a
              identifikáciu v rebríčkoch), prezývka (username).
            </li>
            <li>
              <strong>Herné dáta:</strong> Vaše tipy na zápasy a štatistiky s tým spojené.
            </li>
            <li>
              <strong>Technické logy:</strong> IP adresa a technické informácie o prehliadači
              (slúžia na zabezpečenie stability a ochranu pred podvodmi).
            </li>
          </ul>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">3. Ako používame údaje</h2>
          <p className="mb-2">Vaše údaje sú používané výhradne na:</p>
          <ul className="mb-8 list-disc space-y-2 pl-6">
            <li>Prevádzku tipovacej súťaže a správu rebríčkov.</li>
            <li>Zabezpečenie férového priebehu súťaže (kontrola duplicít).</li>
            <li>Zasielanie dôležitých oznámení týkajúcich sa vášho účtu.</li>
          </ul>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">
            4. Uloženie údajov a lokácia
          </h2>
          <p className="mb-8">
            Všetky údaje sú hostované na serveroch v Európskej únii (Nemecko) prostredníctvom
            infraštruktúry Coolify/Docker. Osobné údaje neprenášame mimo EÚ.
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">5. Služby tretích strán</h2>
          <p className="mb-8">
            V aktuálnej Beta verzii nepoužívame externé služby na spracovanie platieb ani AI modely.
            Používame len nevyhnutné systémy na beh aplikácie. (Google Analytics nepoužívame).
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">6. Vaše práva (GDPR)</h2>
          <p className="mb-8">
            Máte právo na prístup k údajom, ich opravu, vymazanie (právo na zabudnutie) a odvolanie
            súhlasu. Svoj účet a s ním spojené údaje môžete kedykoľvek odstrániť priamo v
            nastaveniach aplikácie.
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">7. Bezpečnosť</h2>
          <p className="mb-8">
            Heslá sú bezpečne šifrované (jednosmerný hash). Používame SSL šifrovanie pre prenos dát
            medzi vaším zariadením a serverom.
          </p>

          <h2 className="mt-8 mb-4 text-xl font-semibold text-white">8. Kontakt</h2>
          <p className="mb-8">V prípade otázok nás kontaktujte na: <a href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`} className="underline hover:text-white/80 transition-colors">{APP_CONFIG.SUPPORT_EMAIL}</a>.</p>
        </div>
      </IceGlassCard>
    </div>
  );
}
