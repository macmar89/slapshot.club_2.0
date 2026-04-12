'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { IceGlassCard } from '@/components/ui/ice-glass-card';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <Container className="flex min-h-screen items-center justify-center p-4 py-20">
      <IceGlassCard className="w-full max-w-2xl px-6 py-16 text-center sm:px-12 sm:py-24 shadow-2xl">
        <div className="relative">
          {/* Large background text */}
          <div className="text-[8rem] md:text-[12rem] font-black leading-none text-white/10 font-sora select-none pointer-events-none">
            404
          </div>
          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-bold tracking-widest text-primary font-space uppercase">
              {t('subtitle')}
            </p>
            <h2 className="mt-2 text-3xl md:text-5xl font-bold font-sora text-white">
              {t('title')}
            </h2>
          </div>
        </div>
        
        <p className="mx-auto mt-6 max-w-lg text-white/70 md:text-lg">
          {t('description')}
        </p>
        
        <Button asChild className="mt-10" size="lg">
          <Link href="/">{t('button')}</Link>
        </Button>
      </IceGlassCard>
    </Container>
  );
}
