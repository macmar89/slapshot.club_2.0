'use client';

import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { DataLoader } from '@/components/common/data-loader';
import { PageHeader } from '@/components/layout/page-header';
import { AnnouncementCard } from '../components/announcement-card';
import { AdminAnnouncementDto } from '../../admin/announcements/announcements.types';
import { Pagination } from '@/components/common/pagination';
import { useTableFiltersUrl } from '@/hooks/use-table-filters-url';

export function AnnouncementsView() {
  const t = useTranslations('Announcements');
  const { page, setPage } = useTableFiltersUrl<Record<string, unknown>>({});
  const limit = 10;
  const offset = (page - 1) * limit;

  const { data, error, isLoading } = useSWR(API_ROUTES.ANNOUNCEMENTS.LIST(limit, offset));

  const announcements = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.05),transparent),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.02),transparent)] pb-24 text-white md:pb-8">
      <div>
        <PageHeader title={t('title')} description={t('description')} className="mb-6" />

        <DataLoader
          data={announcements}
          isLoading={isLoading}
          error={error}
          skeleton={
            <div className="flex flex-col gap-6 md:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 w-full animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          }
          notFound={<div className="py-20 text-center text-white/40">{t('empty')}</div>}
        >
          {(items: AdminAnnouncementDto[]) => (
            <>
              <div className="flex flex-col gap-4 md:gap-8">
                {items.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </DataLoader>
      </div>
    </div>
  );
}
