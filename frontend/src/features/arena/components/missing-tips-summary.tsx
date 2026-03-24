'use client';

import { useTranslations } from 'next-intl';
import { Trophy, ArrowRight } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Link } from '@/i18n/routing';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { format, addDays } from 'date-fns';
import { useMemo } from 'react';

export const MissingTipsSummary = () => {
  const t = useTranslations('MissingTips.summary_card');
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const threeDaysLater = format(addDays(new Date(), 3), 'yyyy-MM-dd');

  const { data: countsData } = useSWR<Record<string, number>>(
    API_ROUTES.PREDICTION.MISSING_CALENDAR(today, threeDaysLater),
  );

  const totalMissing = useMemo(() => {
    if (!countsData) return 0;
    return Object.values(countsData).reduce((sum, count) => sum + count, 0);
  }, [countsData]);

  if (!countsData || totalMissing === 0) return null;

  return (
    <IceGlassCard className="mb-8 border-primary/20 bg-primary/5 p-6 md:mb-12">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-5">
          <div className="bg-primary flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
            <Trophy className="h-7 w-7 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              {t('title')}
            </h3>
            <p className="text-white/60">
              {t('description', { count: totalMissing })}
            </p>
          </div>
        </div>
        
        <Link
          href="/arena/missing-tips"
          className="bg-primary hover:bg-primary/90 rounded-app flex h-14 items-center gap-3 px-8 text-sm font-black text-black transition-all hover:scale-105 active:scale-95"
        >
          {t('action')}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </IceGlassCard>
  );
};
