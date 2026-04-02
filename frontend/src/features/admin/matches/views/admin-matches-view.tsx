'use client';

import { useAdminMatches } from '../api/use-admin-matches';
import { useTableFiltersUrl } from '@/hooks/use-table-filters-url';
import { AdminMatchesFilter } from '../components/admin-matches-filter';
import { AdminMatchesTable } from '../components/admin-matches-table';
import { AdminMatchCard } from '../components/admin-match-card';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Pagination } from '@/components/common/pagination';
import { DataLoader } from '@/components/common/data-loader';
import { useTranslations } from 'next-intl';

export const AdminMatchesView = () => {
  const t = useTranslations('Admin.Matches');
  const { filters, updateFilter, page, setPage, buildQueryString } = useTableFiltersUrl<
    Record<string, unknown>
  >({ status: 'scheduled', isChecked: false });

  const { data, mutate, isLoading, error } = useAdminMatches(buildQueryString());

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 duration-700 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-widest text-white/90 uppercase italic drop-shadow-md md:text-4xl">
          {t('title')}
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
        notFound={
          <div className="p-12 text-center font-bold tracking-widest text-white/30 uppercase italic">
            {t('no_matches_found')}
          </div>
        }
        skeleton={
          <IceGlassCard className="relative border-white/10 p-8 shadow-2xl">
            <div className="flex h-40 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          </IceGlassCard>
        }
      >
        {(data) => (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <IceGlassCard className="overflow-hidden border-white/10 p-0 shadow-2xl">
                <AdminMatchesTable
                  matches={data.data}
                  isLoading={false}
                  onRefresh={() => mutate()}
                />

                {/* Pagination inside Card on Desktop */}
                <div className="flex flex-col items-center justify-center gap-4 border-t border-white/5 bg-white/[0.02] py-6">
                  <Pagination
                    currentPage={page}
                    totalPages={data.meta.totalPages}
                    onPageChange={setPage}
                  />
                  <div className="font-mono text-[10px] tracking-tighter text-white/20 uppercase">
                    SPOLU ZÁPASOV: {data.meta.totalItems} | STRANA: {data.meta.currentPage} /{' '}
                    {data.meta.totalPages}
                  </div>
                </div>
              </IceGlassCard>
            </div>

            {/* Mobile Cards View */}
            <div className="flex flex-col gap-4 md:hidden">
              {data.data.map((match) => (
                <AdminMatchCard key={match.id} match={match} />
              ))}

              {/* Pagination in its own Card on Mobile */}
              <IceGlassCard className="flex flex-col items-center justify-center gap-4 border-white/10 p-6">
                <Pagination
                  currentPage={page}
                  totalPages={data.meta.totalPages}
                  onPageChange={setPage}
                />
                <div className="text-center font-mono text-[10px] tracking-tighter text-white/20 uppercase">
                  SPOLU ZÁPASOV: {data.meta.totalItems} <br />
                  STRANA: {data.meta.currentPage} / {data.meta.totalPages}
                </div>
              </IceGlassCard>
            </div>
          </>
        )}
      </DataLoader>
    </div>
  );
};
