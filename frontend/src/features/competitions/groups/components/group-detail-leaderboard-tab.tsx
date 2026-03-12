import { DataLoader } from '@/components/common/data-loader';
import { ListSkeleton } from '@/components/common/skeletons';
import { API_ROUTES } from '@/lib/api-routes';
import useSWR from 'swr';
import { LeaderboardList } from '../../leaderboard/components/leaderboard-list';
import { CompetitionLeaderboardEntry } from '../../leaderboard/leaderboard.types';
import { ErrorView } from '@/components/common/error-view';

interface GroupDetailLeaderboardTabProps {
  groupSlug: string;
}

export const GroupDetailLeaderboardTab = ({ groupSlug }: GroupDetailLeaderboardTabProps) => {
  const { data, isLoading, error } = useSWR<CompetitionLeaderboardEntry[]>(
    API_ROUTES.GROUPS.DETAIL.LEADERBOARD(groupSlug),
  );

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<ListSkeleton rows={5} />}
      notFound={<ErrorView />}
    >
      {(data) => (
        <div className="min-h-0 flex-1">
          <LeaderboardList entries={data || []} isCurrentUserRowVisible={false} />
        </div>
      )}
    </DataLoader>
  );
};
