'use client';

import { useAppParams } from '@/hooks/use-app-params';
import { API_ROUTES } from '@/lib/api-routes';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { GroupDetail } from '@/features/competitions/groups/group.types';

import { GroupDetailSkeleton } from '../components/group-detail-skeleton';
import { GroupDetailHeader } from '../components/group-detail-header';
import { GroupNotFound } from '../components/group-not-found';
import { CustomTabs, type TabItem } from '@/components/common/custom-tabs';
import { MessageCircle } from 'lucide-react';
import { GroupDetailOfficeTab } from '@/features/competitions/groups/components/group-detail-office-tab';
import { TabsContent } from '@/components/ui/tabs';
import { GroupDetailCabinTab } from '../components/group-detail-cabin-tab';
import { GroupDetailLeaderboardTab } from '../components/group-detail-leaderboard-tab';

export const GroupDetailView = () => {
  const t = useTranslations('Groups');
  const { slug: competitionSlug, groupSlug } = useAppParams(['slug', 'groupSlug']);

  const { data, isLoading, error } = useSWR<GroupDetail>(API_ROUTES.GROUPS.DETAIL.INFO(groupSlug));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GroupDetailSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return <GroupNotFound competitionSlug={competitionSlug} />;
  }

  const isAdmin = data.currentUserRole === 'owner' || data.currentUserRole === 'admin';

  const tabItems: TabItem[] = [
    {
      value: 'members',
      label: t('tabs.ranking'),
      href: `/${competitionSlug}/groups/${groupSlug}?tab=members`,
    },
    {
      value: 'cabin',
      label: t('tabs.cabin'),
      icon: <MessageCircle className="h-4 w-4" />,
      href: `/${competitionSlug}/groups/${groupSlug}?tab=cabin`,
    },
    {
      value: 'office',
      label: t('tabs.office'),
      show: isAdmin,
      href: `/${competitionSlug}/groups/${groupSlug}?tab=office`,
      badge: data?.statsPendingMembersCount > 0 && (
        <span className="bg-destructive hover:bg-destructive/90 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] text-white transition-colors">
          {data?.statsPendingMembersCount}
        </span>
      ),
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GroupDetailHeader group={data} />

      <CustomTabs items={tabItems} defaultValue="members">
        <TabsContent value="members" className="mt-0">
          <GroupDetailLeaderboardTab />
        </TabsContent>
        <TabsContent value="cabin" className="mt-0">
          <GroupDetailCabinTab />
        </TabsContent>
        <TabsContent value="office" className="mt-0">
          <GroupDetailOfficeTab />
        </TabsContent>
      </CustomTabs>
    </div>
  );
};
