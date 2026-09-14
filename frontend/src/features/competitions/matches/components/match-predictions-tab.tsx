import { MatchPredictionsList } from './match-prediction-list';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useParams, useSearchParams } from 'next/navigation';
import { useQueryFilters } from '@/hooks/use-query-filter';
import { PaginatedResponse } from '@/lib/types';
import { Prediction } from '../../predictions/prediction.types';
import { PredictionTeaser } from '../../predictions/components/prediction-teaser';
import { DataLoader } from '@/components/common/data-loader';
import { ErrorView } from '@/components/common/error-view';

export const MatchPredictionTab = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const groupSlug = searchParams.get('groupSlug');

  const { page, limit, search } = useQueryFilters();

  const { data, isLoading, error } = useSWR<PaginatedResponse<Prediction>>(
    groupSlug
      ? API_ROUTES.GROUPS.MATCHES.DETAIL.PREDICTIONS(groupSlug, id, { page, limit, search })
      : API_ROUTES.MATCHES.DETAIL.PREDICTIONS(id, { page, limit, search }),
    { keepPreviousData: true },
  );

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<div>LOADING TODO</div>}
      notFound={<ErrorView />}
    >
      {(data) => {
        const isScheduled = data?.meta?.matchStatus === 'scheduled';
        const totalPredictions = data.pagination.total;

        if (isScheduled) return <PredictionTeaser totalPredictions={totalPredictions ?? 0} />;

        return (
          <div className="relative w-full">
            <div className="w-full transition-all duration-700">
              <MatchPredictionsList
                predictions={data?.data || []}
                pagination={data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }}
                isFinished={data?.meta?.matchStatus === 'finished'}
              />
            </div>
          </div>
        );
      }}
    </DataLoader>
  );
};
