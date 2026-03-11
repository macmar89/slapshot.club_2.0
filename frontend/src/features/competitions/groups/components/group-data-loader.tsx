// src/components/groups/group-data-loader.tsx
import { DataLoader } from '@/components/common/data-loader';
import { GroupDetailSkeleton } from '@/features/competitions/groups/components/group-detail-skeleton';
import { GroupNotFound } from '@/features/competitions/groups/components/group-not-found';

interface GroupDataLoaderProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: any;
  children: (data: T) => React.ReactNode;
}

export function GroupDataLoader<T>({ data, isLoading, error, children }: GroupDataLoaderProps<T>) {
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
