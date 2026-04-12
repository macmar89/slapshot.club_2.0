export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://slapshot.club';

type SEOData = {
  title: string;
  description: string;
  keywords: string[];
};

export type GlobalSEOConfig = {
  home: Record<string, SEOData>;
  register: Record<string, SEOData>;
  default: Record<string, Omit<SEOData, 'keywords'> & { keywords?: string[] }>;
};

export const seoConfig: GlobalSEOConfig = {
  default: {
    sk: {
      title: 'slapshot.club',
      description: 'slapshot.club',
    },
    cs: {
      title: 'slapshot.club',
      description: 'slapshot.club',
    },
    en: {
      title: 'slapshot.club',
      description: 'slapshot.club',
    },
  },
  home: {
    sk: {
      title: 'Slapshot Club | Hokejová Tipovačka: NHL, Tipos Extraliga & MS',
      description:
        'Tipuj výsledky NHL, slovenskej ligy aj MS v hokeji. Vyzvi priateľov v súkromných ligách, sleduj live štatistiky a staň sa súčasťou najväčšej hokejovej komunity!',
      keywords: [
        'hokejová tipovačka',
        'fantasy hokej',
        'tipovanie hokeja',
        'nhl štatistiky',
        'tipos extraliga tipovanie',
        'hokejové výsledky live',
      ],
    },
    cs: {
      title: 'Slapshot Club | Hokejová Tipovačka: NHL, ELH & MS v hokeji',
      description:
        'Tipuj výsledky NHL, české Extraligy i MS v hokeji. Vyzvi kámoše v soukromých ligách, ovládej žebříčky a sleduj live statistiky v nejlepší hokejové komunitě!',
      keywords: [
        'hokejová tipovačka',
        'fantasy hokej',
        'tipování hokeje',
        'extraliga výsledky',
        'nhl statistiky',
        'hokejová komunita česko',
      ],
    },
    en: {
      title: 'Slapshot Club | Global Hockey Predictions: NHL, European Leagues & WC',
      description:
        'The ultimate prediction game for NHL and European hockey fans. Predict results, track live stats, and compete with friends in private leagues for free!',
      keywords: [
        'hockey prediction game',
        'fantasy hockey',
        'nhl betting app free',
        'european hockey stats',
        'hockey world championship prediction',
      ],
    },
  },
  register: {
    sk: {
      title: 'Registrácia do Slapshot Club | Vstúp do hokejovej arény',
      description:
        'Vytvor si bezplatný účet, vyzvi priateľov a začni tipovať NHL a svetový hokej. Staň sa súčasťou najlepšej komunity fanúšikov!',
      keywords: [
        'hokejová registrácia',
        'vytvoriť účet hokej',
        'fantasy hokej registrácia',
        'nhl tipovačka účet',
      ],
    },
    cs: {
      title: 'Registrace do Slapshot Club | Vstup do hokejové arény',
      description:
        'Vytvoř si bezplatný účet, vyzvi kámoše a začni tipovat NHL i českou ligu. Staň se součástí nejlepší komunity fanoušků ještě dnes!',
      keywords: [
        'hokejová registrace',
        'vytvořit účet hokej',
        'fantasy hokej registrace',
        'nhl tipovačka účet',
      ],
    },
    en: {
      title: 'Sign Up for Slapshot Club | Enter the Hockey Arena',
      description:
        'Create your free account to predict hockey games and compete with friends. Join the ultimate hockey fan community today!',
      keywords: [
        'hockey register',
        'create account fantasy',
        'hockey prediction signup',
        'join hockey community',
      ],
    },
  },
};

export function getSEO(key: keyof typeof seoConfig, locale: string) {
  // Fallback to 'sk' if locale is missing in our dictionaries
  const data = seoConfig[key][locale] || seoConfig[key]['sk'];
  return data;
}
