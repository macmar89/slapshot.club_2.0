'use client';

import React from 'react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { SlapshotLogo } from '@/components/common/slapshot-logo';
import { AuthFooter } from '@/features/auth/components/auth-footer';

export function ResetPasswordView() {
  const t = useTranslations('Login');

  return (
    <div className="selection:bg-gold/30 selection:text-gold-light relative flex min-h-screen flex-col">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-grow flex-col items-center gap-16 px-6 py-12 lg:flex-row lg:gap-24">
        {/* Left Column: Marketing / Branding */}
        <div className="flex-1 text-center lg:text-left">
          <div className="relative order-1 mx-auto mb-2 h-40 w-40 sm:mb-4 lg:mx-0 lg:ml-auto">
            <SlapshotLogo
              width={160}
              height={160}
              className="drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            />
          </div>

          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
            <Zap className="h-3 w-3 fill-white" />
            {t('hero.badge')}
          </div>

          <h1 className="mb-6 text-5xl leading-none font-bold tracking-tighter text-white drop-shadow-2xl lg:text-7xl">
            {t('hero.title_main')}
            <span className="text-primary ml-2 block lg:inline">{t('hero.title_sub')}</span>
          </h1>

          <p className="mb-12 max-w-xl text-xl leading-relaxed text-white/50">
            {t('hero.description')}
          </p>
        </div>

        {/* Right Column: Reset Password Form */}
        <div className="w-full max-w-md">
          <IceGlassCard className="border-0 p-0 sm:p-0" backdropBlur="xl">
            <div className="flex w-full flex-col items-center rounded-2xl border border-white/5 bg-white/5 p-6 shadow-inner">
              <React.Suspense fallback={<div className="text-white/50">Loading...</div>}>
                <ResetPasswordForm />
              </React.Suspense>
            </div>
          </IceGlassCard>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
