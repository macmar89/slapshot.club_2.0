'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export const AuthFooter = () => {
  const t = useTranslations('Login');

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-white/5 bg-slate-950/20 px-8 py-4 backdrop-blur-sm sm:px-12 lg:px-24">
      <div className="mx-auto flex max-w-[1920px] justify-center sm:justify-end">
        <span className="text-[10px] font-medium tracking-widest text-white/30 uppercase sm:text-xs">
          {t('hero.footer')}
        </span>
      </div>
    </footer>
  );
};
