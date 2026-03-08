'use client';

import { useTranslations } from 'next-intl';
import { LeaderboardList } from '@/features/competitions/leaderboard/components/leaderboard-list';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useAuthStore } from '@/store/use-auth-store';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompetitionStore } from '@/store/use-competition-store';
import { CompetitionLeaderboardEntry } from '@/features/competitions/leaderboard/leaderboard.types';

export const LeaderboardView = () => {
  const t = useTranslations('Dashboard.leaderboard');
  const params = useParams();

  const slug = params.slug as string;
  const user = useAuthStore((state) => state.user);

  const competitionName = useCompetitionStore((state) => state.competition?.name);

  const { data: entries, isLoading } = useSWR<CompetitionLeaderboardEntry[]>(
    API_ROUTES.COMPETITIONS.LEADERBOARD.LIST(slug),
  );

  if (isLoading || !user) {
    return (
      <div className="flex h-[calc(100dvh-8rem)] flex-col overflow-hidden md:h-[calc(100dvh-7rem)]">
        <PageHeader
          title={competitionName || '...'}
          description={t('description')}
          className="mb-4"
        />
        <Skeleton className="flex-1" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col overflow-hidden md:h-[calc(100dvh-7rem)]">
      <PageHeader
        title={competitionName || '...'}
        description={t('description')}
        className="mb-4"
        hideDescriptionOnMobile
      />

      <div className="min-h-0 flex-1">
        <LeaderboardList entries={entries || []} />
      </div>
    </div>
  );
};
