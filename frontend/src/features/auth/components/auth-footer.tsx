import { useTranslations } from 'next-intl';

export const AuthFooter = () => {
  const t = useTranslations('Login');

  return (
    <footer className="relative z-50 mt-auto w-full border-t border-white/5 bg-slate-950/20 px-8 py-4 backdrop-blur-sm sm:px-12 lg:px-24">
      <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0">
        <span className="text-[10px] font-medium tracking-tight text-white uppercase sm:text-xs">
          Support:{' '}
          <a
            href="mailto:support@slapshot.club"
            className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"
          >
            support@slapshot.club
          </a>
        </span>
        <span className="text-[10px] font-medium tracking-widest text-white/60 uppercase sm:text-xs">
          {t('hero.footer')}
        </span>
      </div>
    </footer>
  );
};
