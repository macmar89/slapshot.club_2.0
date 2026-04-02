'use client';

import { useTableFilters } from '@/hooks/use-table-filters';
import { useAdminMatches } from '../api/use-admin-matches';
import { AdminMatchesFilter } from '../components/admin-matches-filter';
import { AdminMatchesTable } from '../components/admin-matches-table';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Pagination } from '@/components/common/pagination';
import { DataLoader } from '@/components/common/data-loader';
import { ErrorView } from '@/components/common/error-view';

export const AdminMatchesView = () => {
  const { filters, updateFilter, page, setPage, buildQueryString } = useTableFilters<
    Record<string, unknown>
  >(
    { status: 'scheduled', isChecked: false }, // Initial default filters driven by the frontend state!
  );

  const { data, mutate, isLoading, error } = useAdminMatches(buildQueryString());

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 duration-700 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-widest text-white/90 uppercase drop-shadow-md md:text-3xl">
          Zápasy - Administrácia
        </h1>
      </div>

      <IceGlassCard className="relative overflow-hidden border-white/10 p-6 shadow-2xl md:p-8">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <AdminMatchesFilter
          filters={filters as Record<string, unknown>}
          updateFilter={updateFilter}
        />
      </IceGlassCard>

      <DataLoader
        data={data}
        isLoading={isLoading}
        error={error}
        skeleton={
          <IceGlassCard className="relative border-white/10 p-8 shadow-2xl">
            <div className="flex h-40 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          </IceGlassCard>
        }
        notFound={<ErrorView />}
      >
        {(data) => (
          <>
            <IceGlassCard className="overflow-hidden border-white/10 p-0 shadow-2xl">
              <AdminMatchesTable matches={data.data} isLoading={false} onRefresh={() => mutate()} />
              <div className="mt-6 flex items-center justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={data.meta.totalPages}
                  onPageChange={setPage}
                />
                <div className="absolute right-8 hidden font-mono text-xs tracking-widest text-white/30 md:block">
                  SPOLU ZÁPASOV: {data.meta.totalItems}
                </div>
              </div>
            </IceGlassCard>
          </>
        )}
      </DataLoader>
    </div>
  );
};
