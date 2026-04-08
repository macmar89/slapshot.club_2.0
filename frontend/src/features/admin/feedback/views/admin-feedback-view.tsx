'use client';

import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useTableFiltersUrl } from '@/hooks/use-table-filters-url';
import { AdminFeedbackFilter } from '../components/admin-feedback-filter';
import { AdminFeedbackTable } from '../components/admin-feedback-table';
import { AdminFeedbackCard } from '../components/admin-feedback-card';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Pagination } from '@/components/common/pagination';
import { DataLoader } from '@/components/common/data-loader';
import { useTranslations } from 'next-intl';
import { FeedbackListResponse } from '../feedback.types';
import { PageHeader } from '@/components/layout/page-header';

export const AdminFeedbackView = () => {
  const t = useTranslations('Admin.Feedback');
  const { filters, updateFilter, page, setPage, buildQueryString } = useTableFiltersUrl<
    Record<string, unknown>
  >({ status: undefined, read: undefined }, { by: 'createdAt', order: 'desc' });

  const { data, isLoading, error } = useSWR<FeedbackListResponse>(
    `${API_ROUTES.ADMIN.FEEDBACK.LIST}?${buildQueryString()}`,
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 font-sans">
      <PageHeader title={t('title')} hideDescriptionOnMobile />

      <IceGlassCard className="relative overflow-hidden border-white/10 p-6 shadow-2xl md:p-8">
        <AdminFeedbackFilter
          filters={filters as Record<string, string | boolean | undefined>}
          updateFilter={updateFilter}
        />
      </IceGlassCard>

      <DataLoader
        data={data}
        isLoading={isLoading}
        error={error}
        notFound={
          <div className="p-12 text-center font-bold tracking-widest text-white/30 uppercase italic">
            {t('no_feedback_found')}
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
                <AdminFeedbackTable feedback={data.data} />

                {/* Pagination inside Card on Desktop */}
                <div className="flex flex-col items-center justify-center gap-4 border-t border-white/5 bg-white/[0.02] py-6">
                  <Pagination
                    currentPage={page}
                    totalPages={data.meta.totalPages}
                    onPageChange={setPage}
                  />
                  <div className="font-mono text-[10px] tracking-tighter text-white/20 uppercase">
                    {t('total_items')}: {data.meta.totalItems} | {t('page')}:{' '}
                    {data.meta.currentPage} / {data.meta.totalPages}
                  </div>
                </div>
              </IceGlassCard>
            </div>

            {/* Mobile Cards View */}
            <div className="flex flex-col gap-4 md:hidden">
              {data.data.map((item) => (
                <AdminFeedbackCard key={item.id} feedback={item} />
              ))}

              {/* Pagination in its own Card on Mobile */}
              <IceGlassCard className="flex flex-col items-center justify-center gap-4 border-white/10 p-6">
                <Pagination
                  currentPage={page}
                  totalPages={data.meta.totalPages}
                  onPageChange={setPage}
                />
                <div className="text-center font-mono text-[10px] tracking-tighter text-white/20 uppercase">
                  {t('total_items')}: {data.meta.totalItems} <br />
                  {t('page')}: {data.meta.currentPage} / {data.meta.totalPages}
                </div>
              </IceGlassCard>
            </div>
          </>
        )}
      </DataLoader>
    </div>
  );
};
