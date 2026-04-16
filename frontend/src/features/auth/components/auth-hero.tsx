import React from 'react';
import { SlapshotLogo } from '@/components/common/slapshot-logo';
import { useTranslations } from 'next-intl';

export function AuthHero() {
  const t = useTranslations('Login');

  return (
    <div className="relative order-1 min-h-[25vh] w-full overflow-hidden lg:order-2 lg:h-auto lg:w-1/2">
      <div className="relative z-20 flex h-full flex-col items-center justify-center p-6 text-center sm:p-12 lg:items-end lg:p-24 lg:text-right">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="relative order-1 mx-auto h-32 w-32 sm:h-40 sm:w-40 lg:mx-0 lg:ml-auto">
            <SlapshotLogo
              width={160}
              height={160}
              className="ml-auto drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            />
          </div>

          <div className="order-2 mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md sm:mr-0 sm:ml-auto sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            {t('hero.badge')}
          </div>

          <h1 className="order-3 text-center text-4xl leading-none font-bold tracking-tighter text-white drop-shadow-2xl sm:text-right sm:text-5xl lg:text-7xl">
            {t('hero.title_main')}
            <span className="text-primary ml-2 inline">{t('hero.title_sub')}</span>
          </h1>

          <p className="order-4 mx-auto max-w-2xl text-center text-sm leading-relaxed font-medium text-white/60 sm:mr-0 sm:ml-auto sm:text-right sm:text-lg lg:text-xl">
            {t('hero.description')}
            <br />
            {t('hero.description_sub')}
          </p>
        </div>
      </div>
    </div>
  );
}
