'use client';

import { useTranslations } from 'next-intl';
import { Trophy, ArrowRight } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';

export const MissingTipsSummary = () => {
  const t = useTranslations('MissingTips.summary_card');

  const { data } = useSWR<{ count: number }>(API_ROUTES.PREDICTION.SUMMARY);
  const totalMissing = data?.count || 0;

  if (totalMissing === 0) return null;

  return (
    <IceGlassCard className="border-primary/20 bg-primary/5 mb-8 p-4 sm:p-6 md:mb-12">
      <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="bg-primary flex hidden h-10 w-10 items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] sm:flex sm:h-10 sm:h-14 sm:w-14">
            <Trophy className="h-5 w-5 text-black sm:h-7 sm:w-7" />
          </div>
          <div>
            <h3 className="text-md font-black tracking-tight text-white uppercase sm:text-xl">
              {t('title')}
            </h3>
            <p className="text-sm text-white/60 sm:text-base">
              {t('description', { count: totalMissing })}
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href="/arena/missing-tips" className="flex items-center gap-3">
            {t('action')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </IceGlassCard>
  );
};
