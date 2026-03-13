'use client';

import { useState, useEffect } from 'react';
import { API_ROUTES } from '@/lib/api-routes';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useSWR from 'swr';
import { GroupMember, GroupMembersResponse } from '@/features/competitions/groups/group.types';
import { DataLoader } from '@/components/common/data-loader';
import { ListSkeleton } from '@/components/common/skeletons';
import { GroupDetailMembersList } from './group-detail-members-list';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface GroupDetailRosterTabProps {
  groupSlug: string;
}

interface RosterAccordionSectionProps {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  hasBorderTop?: boolean;
}

const RosterAccordionSection = ({
  title,
  count,
  isOpen,
  onToggle,
  children,
  className,
  hasBorderTop = true,
}: RosterAccordionSectionProps) => {
  return (
    <div className={cn(hasBorderTop && 'border-t border-white/5', className)}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-white/5"
      >
        <span className="text-xs font-black tracking-widest text-white uppercase italic">
          {title}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white/80">({count})</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-white/60" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/60" />
          )}
        </div>
      </button>

      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isOpen
            ? 'max-h-[2000px] overflow-visible opacity-100'
            : 'max-h-0 overflow-hidden opacity-0',
        )}
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
};

export const GroupDetailRosterTab = ({ groupSlug }: GroupDetailRosterTabProps) => {
  const t = useTranslations('Groups');
  const { data, isLoading, error } = useSWR<GroupMembersResponse>(
    API_ROUTES.GROUPS.DETAIL.MEMBERS.LIST(groupSlug),
  );

  // States for each section
  const [activeOpen, setActiveOpen] = useState(true);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [invitedOpen, setInvitedOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);

  // Initialize states when data loads
  useEffect(() => {
    if (data) {
      setPendingOpen(data.pending.length > 0);
      setInvitedOpen(data.invited.length > 0);
    }
  }, [data]);

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<ListSkeleton rows={8} />}
      notFound={<div>No members found</div>}
    >
      {(members: GroupMembersResponse) => {
        const {
          active,
          pending,
          banned,
          rejected,
          invited,
          metadata: { myMemberRole },
        } = members;

        const hasOthers = rejected.length > 0 || banned.length > 0;

        return (
          <div className="flex flex-col gap-4">
            <IceGlassCard
              className="space-y-0 border-white/10 p-0 shadow-xl"
              backdropBlur="lg"
              allowOverflow={true}
            >
              <RosterAccordionSection
                title={t('status_active')}
                count={active.length}
                isOpen={activeOpen}
                onToggle={() => setActiveOpen(!activeOpen)}
                hasBorderTop={false}
              >
                <GroupDetailMembersList
                  groupSlug={groupSlug}
                  title="" // Hide internal title
                  data={active}
                  myMemberRole={myMemberRole}
                  hideHeader
                />
              </RosterAccordionSection>

              <RosterAccordionSection
                title={t('status_pending')}
                count={pending.length}
                isOpen={pendingOpen}
                onToggle={() => setPendingOpen(!pendingOpen)}
              >
                <GroupDetailMembersList
                  groupSlug={groupSlug}
                  title=""
                  data={pending}
                  myMemberRole={myMemberRole}
                  hideHeader
                />
              </RosterAccordionSection>

              <RosterAccordionSection
                title={t('status_invited')}
                count={invited.length}
                isOpen={invitedOpen}
                onToggle={() => setInvitedOpen(!invitedOpen)}
              >
                <GroupDetailMembersList
                  groupSlug={groupSlug}
                  title=""
                  data={invited}
                  myMemberRole={myMemberRole}
                  hideHeader
                />
              </RosterAccordionSection>

              {hasOthers && (
                <RosterAccordionSection
                  title={t('status_others') || 'Ostatné'}
                  count={rejected.length + banned.length}
                  isOpen={othersOpen}
                  onToggle={() => setOthersOpen(!othersOpen)}
                >
                  <GroupDetailMembersList
                    groupSlug={groupSlug}
                    title={t('status_rejected')}
                    data={rejected}
                    myMemberRole={myMemberRole}
                  />
                  <GroupDetailMembersList
                    groupSlug={groupSlug}
                    title={t('status_banned')}
                    data={banned}
                    myMemberRole={myMemberRole}
                  />
                </RosterAccordionSection>
              )}
            </IceGlassCard>
          </div>
        );
      }}
    </DataLoader>
  );
};
