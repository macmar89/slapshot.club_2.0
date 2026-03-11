import { ReactNode } from 'react';
import { ErrorView } from './error-view';

interface DataLoaderProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: any;
  skeleton: ReactNode;
  notFound: ReactNode;
  children: (data: T) => ReactNode;
}

export function DataLoader<T>({
  data,
  isLoading,
  error,
  skeleton,
  notFound,
  children,
}: DataLoaderProps<T>) {
  if (isLoading) return <>{skeleton}</>;

  if (error) {
    return <ErrorView status={error.status} />;
  }

  if (!data) return <>{notFound}</>;

  return <>{children(data)}</>;
}
