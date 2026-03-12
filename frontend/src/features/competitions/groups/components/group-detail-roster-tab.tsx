'use client';

import { API_ROUTES } from '@/lib/api-routes';
import useSWR from 'swr';
import { GroupMember, GroupMembersResponse } from '@/features/competitions/groups/group.types';
import { DataLoader } from '@/components/common/data-loader';
import { ListSkeleton } from '@/components/common/skeletons';
import { GroupDetailMembersList } from './group-detail-members-list';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useTranslations } from 'next-intl';

interface GroupDetailRosterTabProps {
  groupSlug: string;
}

export const GroupDetailRosterTab = ({ groupSlug }: GroupDetailRosterTabProps) => {
  const t = useTranslations('Groups');
  const { data, isLoading, error } = useSWR<GroupMembersResponse>(
    API_ROUTES.GROUPS.DETAIL.MEMBERS.LIST(groupSlug),
  );

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<ListSkeleton rows={8} />}
      notFound={<div>No members found</div>}
    >
      {(members: GroupMembersResponse) => {
        const { active, pending, banned, rejected, invited } = members;

        return (
          <div className="flex flex-col gap-4">
            <IceGlassCard
              className="space-y-0 overflow-hidden border-white/10 p-0 shadow-xl"
              backdropBlur="lg"
            >
              <GroupDetailMembersList groupSlug={groupSlug} title={t('status_active')} data={active} />
              <GroupDetailMembersList groupSlug={groupSlug} title={t('status_pending')} data={pending} />
              <GroupDetailMembersList groupSlug={groupSlug} title={t('status_invited')} data={invited} />
              <GroupDetailMembersList groupSlug={groupSlug} title={t('status_rejected')} data={rejected} />
              <GroupDetailMembersList groupSlug={groupSlug} title={t('status_banned')} data={banned} />
            </IceGlassCard>
          </div>
        );
      }}
    </DataLoader>
  );
};
