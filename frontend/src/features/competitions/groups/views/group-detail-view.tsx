'use client';

import { useAppParams } from '@/hooks/use-app-params';
import { API_ROUTES } from '@/lib/api-routes';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';
import type { GroupDetail } from '@/features/competitions/groups/group.types';
import { GroupDetailHeader } from '../components/group-detail-header';
import { CustomTabs, type TabItem } from '@/components/common/custom-tabs';
import { MessageCircle, Settings, Trophy } from 'lucide-react';
import { GroupDetailRosterTab } from '@/features/competitions/groups/components/group-detail-roster-tab';
import { TabsContent } from '@/components/ui/tabs';
import { GroupDetailCabinTab } from '../components/group-detail-cabin-tab';
import { GroupDetailLeaderboardTab } from '../components/group-detail-leaderboard-tab';
import { GroupDetailDataLoader } from '../components/group-detail-data-loader';
import { GroupDetailSettingsTab } from '../components/group-detail-settings-tab';

export const GroupDetailView = () => {
  const t = useTranslations('Groups');
  const { slug: competitionSlug, groupSlug } = useAppParams(['slug', 'groupSlug']);

  const { data, isLoading, error } = useSWR<GroupDetail>(API_ROUTES.GROUPS.DETAIL.INFO(groupSlug));

  return (
    <GroupDetailDataLoader data={data} isLoading={isLoading} error={error}>
      {(data) => {
        const isOwner = data.currentUserRole === 'owner';
        const isAdmin = data.currentUserRole === 'owner' || data.currentUserRole === 'admin';

        const tabItems: TabItem[] = [
          {
            value: 'members',
            label: t('tabs.ranking'),
            href: `/${competitionSlug}/groups/${groupSlug}?tab=members`,
            icon: <Trophy className="h-4 w-4" />,
          },
          {
            value: 'cabin',
            label: t('tabs.cabin'),
            disabled: true,
            icon: <MessageCircle className="h-4 w-4" />,
            href: `/${competitionSlug}/groups/${groupSlug}?tab=cabin`,
          },
          {
            value: 'roster',
            label: t('tabs.roster'),
            show: isAdmin,
            href: `/${competitionSlug}/groups/${groupSlug}?tab=roster`,
            badge: data?.statsPendingMembersCount > 0 && (
              <span className="bg-destructive hover:bg-destructive/90 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] text-white transition-colors">
                {data?.statsPendingMembersCount}
              </span>
            ),
          },
          {
            value: 'settings',
            label: t('tabs.settings'),
            show: isOwner,
            icon: <Settings className="h-4 w-4" />,
            href: `/${competitionSlug}/groups/${groupSlug}?tab=settings`,
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
              {isAdmin && (
                <TabsContent value="roster" className="mt-0">
                  <GroupDetailRosterTab groupSlug={groupSlug} />
                </TabsContent>
              )}
              {isOwner && (
                <TabsContent value="settings" className="mt-0">
                  <GroupDetailSettingsTab groupSlug={groupSlug} />
                </TabsContent>
              )}
            </CustomTabs>
          </div>
        );
      }}
    </GroupDetailDataLoader>
  );
};
