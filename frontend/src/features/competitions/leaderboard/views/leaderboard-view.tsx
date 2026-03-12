'use client';

import { useTranslations } from 'next-intl';
import { LeaderboardList } from '@/features/competitions/leaderboard/components/leaderboard-list';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useCompetitionStore } from '@/store/use-competition-store';
import { GroupLeaderboardEntry } from '@/features/competitions/groups/group.types';
import { DataLoader } from '@/components/common/data-loader';
import { ListSkeleton } from '@/components/common/skeletons';
import { ErrorView } from '@/components/common/error-view';

const LeaderBoardSkeleton = () => {
  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col overflow-hidden md:h-[calc(100dvh-7rem)]">
      <PageHeader title="..." description="..." className="mb-4" hideDescriptionOnMobile />
      <ListSkeleton rows={5} />{' '}
    </div>
  );
};

export const LeaderboardView = () => {
  const t = useTranslations('Dashboard.leaderboard');
  const params = useParams();

  const slug = params.slug as string;

  const competitionName = useCompetitionStore((state) => state.competition?.name);

  const {
    data: entries,
    isLoading,
    error,
  } = useSWR<GroupLeaderboardEntry[]>(API_ROUTES.COMPETITIONS.LEADERBOARD.LIST(slug));

  return (
    <DataLoader
      data={entries}
      isLoading={isLoading}
      error={error}
      skeleton={<LeaderBoardSkeleton />}
      notFound={<ErrorView />}
    >
      {(entries) => (
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
      )}
    </DataLoader>
  );
};
