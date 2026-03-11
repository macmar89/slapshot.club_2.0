import { ReactNode } from 'react';

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
    if (error.status === 404) {
      return <>{notFound}</>;
    }

    if (error.status === 403) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold">Prístup zamietnutý</h2>
          <p>Na zobrazenie tejto skupiny nemáte oprávnenie.</p>
        </div>
      );
    }

    return (
      <div className="bg-destructive/10 border-destructive rounded-lg border p-8 text-center">
        <h2 className="text-destructive text-xl font-bold">Ups! Niečo vybuchlo</h2>
        <p>Na serveri nastala chyba (kód {error.status}). Skúste to neskôr.</p>
      </div>
    );
  }

  if (!data) return <>{notFound}</>;

  return <>{children(data)}</>;
}
