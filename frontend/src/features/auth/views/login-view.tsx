'use client';

import React from 'react';
import { SlapshotLogo } from '@/components/common/slapshot-logo';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { LoginForm } from '@/features/auth/components/login-form';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { AuthFooter } from '@/features/auth/components/auth-footer';
import { AuthHero } from '@/features/auth/components/auth-hero';

export function LoginView() {
  const t = useTranslations('Login');

  return (
    <div className="selection:bg-gold/30 selection:text-gold-light relative flex min-h-screen flex-col">
      <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/80 to-slate-950/40" />
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-grow flex-col p-4 lg:flex-row">
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

        {/* Right Column: AuthHero Content */}
        <AuthHero />

        <div className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-20">
          <div className="bg-gold animate-pulse-slow absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-50 blur-[160px] filter" />
          <div className="bg-gold-dark animate-pulse-slow absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-30 blur-[160px] filter delay-700" />
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
