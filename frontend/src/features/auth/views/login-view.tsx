'use client';

import React from 'react';
import { SlapshotLogo } from '@/components/common/slapshot-logo';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { LoginForm } from '@/features/auth/components/login-form';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { AuthFooter } from '@/features/auth/components/auth-footer';

export function LoginView() {
  const t = useTranslations('Login');

  return (
    <div className="selection:bg-gold/30 selection:text-gold-light relative flex min-h-screen flex-col">
      <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/80 to-slate-950/40" />
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-grow flex-col p-4 text-right lg:flex-row">
        {/* Left Column: Login Form */}
        <div className="relative z-40 order-2 flex w-full items-center justify-center p-2 sm:p-8 lg:order-1 lg:w-1/2 lg:p-12">
          <div className="w-full max-w-md">
            <IceGlassCard className="border-0 p-0 sm:p-0" backdropBlur="xl">
              <div className="relative z-10 flex w-full flex-col items-center border border-white/5 bg-white/5 p-6 shadow-inner sm:p-8">
                <React.Suspense fallback={<div className="text-white/50">Loading...</div>}>
                  <LoginForm />
                </React.Suspense>
              </div>
            </IceGlassCard>
          </div>
        </div>

        {/* Right Column: Hero Content */}
        <div className="relative order-1 min-h-[30vh] w-full overflow-hidden lg:order-2 lg:h-auto lg:w-1/2">
          <div className="relative z-20 flex h-full flex-col items-center justify-center p-6 pb-4 text-right sm:p-12 lg:items-end lg:p-24">
            <div className="flex flex-col space-y-2 sm:space-y-4">
              <div className="relative order-1 mx-auto mb-2 h-40 w-40 sm:mb-4 lg:mx-0 lg:ml-auto">
                <SlapshotLogo
                  width={160}
                  height={160}
                  className="ml-auto drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                />
              </div>

              <div className="order-3 mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-md sm:mr-0 sm:ml-auto lg:order-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                {t('hero.badge')}
              </div>

              <h1 className="order-2 mb-6 text-center text-4xl leading-none font-bold tracking-tighter text-white drop-shadow-2xl sm:text-right sm:text-5xl lg:order-3 lg:text-7xl">
                {t('hero.title_main')}
                <span className="text-primary ml-2 inline">{t('hero.title_sub')}</span>
              </h1>

              <p className="order-4 mx-auto hidden max-w-md text-center text-lg leading-relaxed font-medium text-white/60 sm:mr-0 sm:ml-auto sm:block sm:text-right sm:text-xl">
                {t('hero.description')}
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-20">
          <div className="bg-gold animate-pulse-slow absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-50 blur-[160px] filter" />
          <div className="bg-gold-dark animate-pulse-slow absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-30 blur-[160px] filter delay-700" />
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
