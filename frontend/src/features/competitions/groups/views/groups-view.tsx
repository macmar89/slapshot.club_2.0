'use client';

import { PageHeader } from '@/components/layout/page-header';
import { useTranslations } from 'next-intl';
import { CreateGroupForm } from '../components/create-group';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { UserGroupsResponse } from '../group.types';
import { useAppParams } from '@/hooks/use-app-params';
import { GroupList } from '../components/group-list';
import { GroupJoinCard } from '../components/group-join-card';

export const GroupsView = () => {
  const t = useTranslations('Groups');

  const { slug } = useAppParams(['slug']);

  const { data, isLoading } = useSWR<UserGroupsResponse>(
    API_ROUTES.GROUPS.USER_GROUPS_BY_COMPETITION_SLUG(slug),
  );

  return (
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
  );
};
