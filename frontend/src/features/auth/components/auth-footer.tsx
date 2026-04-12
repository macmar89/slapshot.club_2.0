import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { APP_CONFIG } from '@/config/app';

export const AuthFooter = () => {
  const t = useTranslations('Login');
  const tNav = useTranslations('Dashboard.nav');

  return (
    <footer className="relative z-50 mt-auto w-full border-t border-white/5 bg-slate-950/20 px-8 py-4 backdrop-blur-sm sm:px-12 lg:px-24">
      <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
        <div className="flex w-1/3 justify-start">
          <span className="text-[10px] font-medium tracking-tight text-white uppercase sm:text-xs">
            Support:{' '}
            <a
              href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`}
              className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"
            >
              {APP_CONFIG.SUPPORT_EMAIL}
            </a>
          </span>
        </div>

        <div className="flex w-1/3 items-center justify-center gap-3 text-[9px] font-medium tracking-widest text-white/50 uppercase sm:text-[10px]">
          <Link
            href="/terms"
            target="_blank"
            className="hover:text-white transition-colors hover:underline"
          >
            {tNav('terms')}
          </Link>
          <span className="opacity-50">&bull;</span>
          <Link
            href="/privacy-policy"
            target="_blank"
            className="hover:text-white transition-colors hover:underline"
          >
            {tNav('privacy')}
          </Link>
        </div>

        <div className="flex w-1/3 justify-end">
          <span className="text-[10px] font-medium tracking-widest text-white/60 uppercase sm:text-xs">
            {t('hero.footer')}
          </span>
        </div>
      </div>
    </footer>
  );
};
