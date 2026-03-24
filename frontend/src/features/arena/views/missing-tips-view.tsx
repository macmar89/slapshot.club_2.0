'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useTranslations } from 'next-intl';
import { CalendarDays } from 'lucide-react';
import { DateSwitcher } from '@/components/common/date-switcher/date-switcher';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useSearchParams } from 'next/navigation';
import { format, addDays } from 'date-fns';
import useSWR, { mutate as globalMutate } from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useUserTimezone } from '@/hooks/use-user-config';
import { Match } from '@/features/competitions/matches/matches.types';
import { MatchCard } from '@/features/competitions/matches/components/match-card';
import { MatchesSkeleton } from '@/features/competitions/matches/components/matches-skeleton';
import { DataLoader } from '@/components/common/data-loader';
import { ErrorView } from '@/components/common/error-view';

export const MissingTipsView = () => {
  const t = useTranslations('MissingTips');
  const timezone = useUserTimezone();
  const searchParams = useSearchParams();

  const today = format(new Date(), 'yyyy-MM-dd');
  const sevenDaysLater = format(addDays(new Date(), 7), 'yyyy-MM-dd');
  const selectedDate = searchParams.get('date') || today;

  // 1. Fetch calendar counts for next 7 days
  const { data: countsData } = useSWR<Record<string, number>>(
    API_ROUTES.PREDICTION.MISSING_CALENDAR(today, sevenDaysLater),
  );

  // 2. Fetch matches for selected day
  const {
    data: matchesData,
    mutate: localMutate,
    isLoading,
    error,
  } = useSWR<Match[]>(API_ROUTES.PREDICTION.MISSING(selectedDate, timezone));

  const handleRefresh = () => {
    localMutate();
    globalMutate(API_ROUTES.PREDICTION.SUMMARY);
    globalMutate(API_ROUTES.PREDICTION.MISSING_CALENDAR(today, sevenDaysLater));
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('title')} description={t('description')} />

      <div className="ms-auto mb-2 flex w-fit">
        <DateSwitcher 
          badges={countsData || {}} 
          availableDays={Array.from({ length: 7 }).map((_, i) => format(addDays(new Date(), i), 'yyyy-MM-dd'))}
        />
      </div>

      <DataLoader
        data={matchesData}
        isLoading={isLoading}
        error={error}
        skeleton={<MatchesSkeleton />}
        notFound={<ErrorView />}
      >
        {(matches) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-4 duration-700 lg:grid-cols-2">
            {matches && matches.length > 0 ? (
              matches.map((match: Match) => (
                <div key={match.id} className="relative">
                  {/* Small badge for competition name if needed, or just MatchCard handles it */}
                  <MatchCard match={match} refresh={handleRefresh} />
                </div>
              ))
            ) : (
              <IceGlassCard className="border-dashed border-white/10 bg-white/[0.02] p-12 lg:col-span-2">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                    <CalendarDays className="text-primary h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold tracking-tight text-white uppercase">
                      {t('all_done_title')}
                    </p>
                    <p className="text-sm text-white/40">{t('no_matches')}</p>
                  </div>
                </div>
              </IceGlassCard>
            )}
          </div>
        )}
      </DataLoader>
    </div>
  );
};
