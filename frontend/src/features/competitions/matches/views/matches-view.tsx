'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useCompetitionStore } from '@/store/use-competition-store';
import { useTranslations } from 'next-intl';
import { CalendarDays } from 'lucide-react';
import { DateSwitcher } from '../components/date-switcher';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useParams, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useUserTimezone } from '@/hooks/use-user-config';
import { Match } from '@/features/competitions/matches/matches.types';
import { MatchCard } from '@/features/competitions/matches/components/match-card';
import { MatchesSkeleton } from '../components/matches-skeleton';

export const MatchesView = () => {
  const params = useParams();
  const slug = params.slug as string;

  const t = useTranslations('Dashboard.matches');

  const userTimezone = useUserTimezone();

  const searchParams = useSearchParams();
  const selectedDate = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const { data, mutate, isLoading } = useSWR<Match[]>(
    slug ? API_ROUTES.COMPETITIONS.MATCHES.LIST(slug, selectedDate, userTimezone) : null,
  );

  const competition = useCompetitionStore((state) => state.competition);

  if (isLoading) {
    return <MatchesSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title={competition?.name}
        description={t('description')}
        hideDescriptionOnMobile
        className="mb-4 md:mb-6"
      >
        <div className="flex w-full items-center gap-2 md:w-auto md:gap-4">
          <DateSwitcher />
        </div>
      </PageHeader>

      <div className="animate-in fade-in slide-in-from-bottom-4 -mx-1 grid grid-cols-1 gap-3 duration-700 md:mx-0 md:gap-6 lg:grid-cols-2">
        {data && data?.length > 0 ? (
          data.map((match: Match) => <MatchCard key={match.id} match={match} refresh={mutate} />)
        ) : (
          <IceGlassCard className="border-dashed border-white/10 bg-white/[0.02] p-12 lg:col-span-2">
            <div className="flex flex-col items-center gap-4 text-center">
              <CalendarDays className="h-12 w-12 text-white/10" />
              <p className="text-sm font-bold tracking-widest text-white/30 uppercase">
                {t('no_matches_day')}
              </p>
            </div>
          </IceGlassCard>
        )}
      </div>
    </div>
  );
};
