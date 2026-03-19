'use client';

import React from 'react';
import Image from 'next/image';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import logo from '@/assets/images/logo/ssc_logo_2.webp';

export function ResetPasswordView() {
  const t = useTranslations('Login');

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-16 px-6 py-12 lg:flex-row lg:gap-24">
        {/* Left Column: Marketing / Branding */}
        <div className="flex-1 text-center lg:text-left">
          <div className="animate-in fade-in slide-in-from-top-4 relative mx-auto mb-8 h-32 w-64 duration-700 lg:mx-0">
            <Image
              src={logo}
              alt="Slapshot Club"
              width={256}
              height={128}
              className="object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              priority
              quality={85}
            />
          </div>

          <div className="animate-in slide-in-from-left mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md duration-700">
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
        <div className="animate-in zoom-in fade-in w-full max-w-md duration-1000">
          <IceGlassCard className="border-0 p-0 sm:p-0" backdropBlur="xl">
            <div className="flex w-full flex-col items-center rounded-2xl border border-white/5 bg-white/5 p-6 shadow-inner">
              <React.Suspense fallback={<div className="text-white/50">Loading...</div>}>
                <ResetPasswordForm />
              </React.Suspense>
            </div>
          </IceGlassCard>

          <div className="mt-8 text-center text-xs font-medium tracking-[0.3em] text-white/30 uppercase">
            {t('hero.footer')}
          </div>
        </div>
      </div>
    </div>
  );
}
