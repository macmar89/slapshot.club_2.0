'use client';

import { Users, Copy } from 'lucide-react';
import { CreateGroupForm } from '@/features/competitions/groups/components/create-group';
import { PageHeader } from '@/components/layout/page-header';
import { useTranslations } from 'next-intl';

const GroupCardSkeleton = () => {
  return (
    <div className="rounded-app relative flex h-full animate-pulse flex-col border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-6 w-32 rounded bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/5" />
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-white/5" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-white/10" />
              <div className="h-3 w-4 rounded bg-white/5" />
            </div>
          </div>
        </div>
        <div className="h-1 w-full rounded-full bg-white/5" />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <div className="flex items-center justify-between rounded border border-white/5 bg-black/40 px-3 py-2">
          <div className="h-4 w-24 rounded bg-white/5" />
          <Copy className="h-3 w-3 text-white/10" />
        </div>
        <div className="h-10 w-full rounded bg-white/10" />
      </div>
    </div>
  );
};

export const GroupsSkeleton = () => {
  const t = useTranslations('Groups');

  return (
    <>
      <PageHeader
        title={
          <div className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2">{t('title')}</span>
          </div>
        }
        className="mb-8"
        description={t('description')}
        hideDescriptionOnMobile
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
};
