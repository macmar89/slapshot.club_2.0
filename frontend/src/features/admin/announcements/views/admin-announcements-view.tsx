'use client';

import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useTableFiltersUrl } from '@/hooks/use-table-filters-url';
import { AdminAnnouncementsFilter } from '../components/admin-announcements-filter';
import { AdminAnnouncementsTable } from '../components/admin-announcements-table';
import { AdminAnnouncementCard } from '../components/admin-announcement-card';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Pagination } from '@/components/common/pagination';
import { DataLoader } from '@/components/common/data-loader';
import { useTranslations } from 'next-intl';
import { AnnouncementsListResponse } from '../announcements.types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/layout/page-header';

export const AdminAnnouncementsView = () => {
  const t = useTranslations('Admin.Announcements');
  const { filters, updateFilter, page, setPage, buildQueryString } = useTableFiltersUrl<
    Record<string, unknown>
  >({ isPublished: undefined, type: undefined }, { by: 'createdAt', order: 'desc' });

  const { data, isLoading, error } = useSWR<AnnouncementsListResponse>(
    `${API_ROUTES.ADMIN.ANNOUNCEMENTS.LIST}?${buildQueryString()}`,
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title={t('title')} hideDescriptionOnMobile />
        <Link href="/admin/announcements/create">
          <Button className="font-bold tracking-widest uppercase italic shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            <Plus className="mr-2 h-5 w-5" />
            {t('create_button')}
          </Button>
        </Link>
      </div>

      <IceGlassCard className="relative overflow-hidden border-white/10 p-6 shadow-2xl md:p-8">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <AdminAnnouncementsFilter
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
            {t('no_announcements_found')}
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
                <AdminAnnouncementsTable announcements={data.data} isLoading={false} />

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
              {data.data.map((announcement) => (
                <AdminAnnouncementCard key={announcement.id} announcement={announcement} />
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
