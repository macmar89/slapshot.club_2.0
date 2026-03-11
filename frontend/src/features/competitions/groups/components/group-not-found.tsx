'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAppParams } from '@/hooks/use-app-params';

export const GroupNotFound = () => {
  const t = useTranslations('Groups');
  const router = useRouter();

  const { slug } = useAppParams(['slug']);

  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
      <IceGlassCard className="flex max-w-md flex-col items-center gap-6 p-8 text-center">
        <div className="from-warning/20 border-warning/30 flex h-16 w-16 items-center justify-center rounded-full border bg-gradient-to-br to-black shadow-[0_0_20px_rgba(250,204,21,0.1)]">
          <AlertTriangle className="text-warning h-8 w-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-white uppercase italic md:text-2xl">
            {t('error_state_title') || 'Skupina sa nenašla'}
          </h2>
          <p className="text-sm leading-relaxed font-medium text-white/50">
            {t('error_state_description') ||
              'Skupina sa nenašla alebo nemáte oprávnenie na jej zobrazenie.'}
          </p>
        </div>

        <Button
          onClick={() => router.push(`/${slug}/groups`)}
          variant="outline"
          className="group hover:bg-warning hover:border-warning mt-2 w-full gap-2 transition-all duration-300 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t('back_to_list') || 'Späť na zoznam'}
        </Button>
      </IceGlassCard>
    </div>
  );
};
