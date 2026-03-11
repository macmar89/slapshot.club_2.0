'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useAppParams } from '@/hooks/use-app-params';

import { DataLoader } from '@/components/common/data-loader';
import { GroupNotFound } from '@/features/competitions/groups/components/group-not-found';
import { CreateGroupForm } from '@/features/competitions/groups/components/create-group';
import { GroupList } from '@/features/competitions/groups/components/group-list';
import { GroupJoinCard } from '@/features/competitions/groups/components/group-join-card';
import type { UserGroupsResponse } from '@/features/competitions/groups/group.types';
import { GroupsSkeleton } from '../components/groups-skeleton';

export const GroupsView = () => {
  const t = useTranslations('Groups');

  const { slug } = useAppParams(['slug']);

  const { data, isLoading, error } = useSWR<UserGroupsResponse>(
    API_ROUTES.GROUPS.USER_GROUPS_BY_COMPETITION_SLUG(slug),
  );

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<GroupsSkeleton />}
      notFound={<GroupNotFound />}
    >
      {(data) => (
        <div>
          <PageHeader
            title={
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2">{t('title')}</span>
              </div>
            }
            className="mb-8"
            description={t('description')}
            hideDescriptionOnMobile
          >
            <div className="flex w-full flex-col items-start gap-4 sm:flex-row md:w-auto">
              <div className="flex w-full items-center gap-4 sm:w-auto">
                <CreateGroupForm />
                {/* <div className="md:hidden">
              <JoinLeagueModal />
            </div> */}
              </div>
            </div>
          </PageHeader>

          <div className="flex flex-col gap-8 overflow-hidden lg:grid lg:grid-cols-12 lg:items-stretch">
            <GroupList data={data?.data} isLoading={isLoading} metadata={data?.metadata} />
            <div className="order-2 hidden min-w-0 lg:col-span-4 lg:flex lg:flex-col">
              <GroupJoinCard className="h-full" />
            </div>
          </div>
        </div>
      )}
    </DataLoader>
  );
};
