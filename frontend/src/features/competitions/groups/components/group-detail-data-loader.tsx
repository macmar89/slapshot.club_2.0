import { DataLoader } from '@/components/common/data-loader';
import { GroupDetailSkeleton } from '@/features/competitions/groups/components/group-detail-skeleton';
import { GroupNotFound } from '@/features/competitions/groups/components/group-not-found';

interface GroupDetailDataLoaderProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: any;
  children: (data: T) => React.ReactNode;
}

export function GroupDetailDataLoader<T>({
  data,
  isLoading,
  error,
  children,
}: GroupDetailDataLoaderProps<T>) {
  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<GroupDetailSkeleton />}
      notFound={<GroupNotFound />}
    >
      {children}
    </DataLoader>
  );
}
