import React, { useState, useRef, useEffect } from 'react';
import { Check, Crown, X, MoreVertical, LogOut, Shield } from 'lucide-react';
import type {
  GroupMember,
  GroupMemberRole,
  GroupMemberStatus,
} from '@/features/competitions/groups/group.types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PlanBadge } from '@/components/ui/plan-badge';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import {
  patchGroupMemberStatus,
  postTransferOwnership,
  patchGroupMemberRole,
  deleteGroupMember,
} from '@/features/competitions/groups/groups.api';
import { API_ROUTES } from '@/lib/api-routes';
import {
  canActorManageTarget,
  isPlanEligibleForOwnership,
} from '@/features/competitions/groups/groups.util';

interface GroupDetailMembersListProps {
  groupSlug: string;
  title: string;
  data: GroupMember[];
  myMemberRole: GroupMemberRole;
  hideHeader?: boolean;
}

export const GroupDetailMembersList = ({
  groupSlug,
  title,
  data,
  myMemberRole,
  hideHeader = false,
}: GroupDetailMembersListProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (data.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-4 px-4', !hideHeader && 'mt-4')}>
      {!hideHeader && title && (
        <div className="flex items-center justify-between py-2">
          <h3 className="text-md font-black tracking-widest text-white/50 uppercase italic">
            {title} <span className="ml-1 text-white/20">({data.length})</span>
          </h3>
        </div>
      )}

      <div className="rounded-app divide-y divide-white/5 bg-white/[0.02]">
        {data.map((member) => (
          <MemberRow
            key={member.id}
            groupSlug={groupSlug}
            member={member}
            myMemberRole={myMemberRole}
            isOpen={openMenuId === member.id}
            onToggle={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface MemberAction {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'success' | 'primary';
  disabled?: boolean;
}

interface MemberActionDropdownProps {
  actions: MemberAction[];
  isOpen: boolean;
  onToggle: () => void;
  isUpdating?: boolean;
}

const MemberActionDropdown = ({
  actions,
  isOpen,
  onToggle,
  isUpdating,
}: MemberActionDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  if (actions.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          'h-9 w-9 text-white/40 transition-all hover:bg-white/5 hover:text-white',
          isOpen && 'bg-white/10 text-white',
        )}
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-48 origin-top-right">
          <div className="rounded-app border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-xl">
            <div className="py-1.5">
              {actions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      action.onClick();
                      onToggle();
                    }}
                    disabled={action.disabled || isUpdating}
                    className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 text-white/30 transition-colors',
                        action.variant === 'destructive' && 'group-hover:text-destructive',
                        action.variant === 'success' && 'group-hover:text-success',
                        (action.variant === 'primary' || action.variant === 'default') &&
                          'group-hover:text-primary',
                      )}
                    />
                    <span className="text-xs font-bold tracking-tight text-white/60 uppercase group-hover:text-white">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MemberRowProps {
  groupSlug: string;
  member: GroupMember;
  myMemberRole: GroupMemberRole;
  isOpen: boolean;
  onToggle: () => void;
}

const MemberRow = ({ groupSlug, member, myMemberRole, isOpen, onToggle }: MemberRowProps) => {
  const t = useTranslations('Groups');
  const { mutate } = useSWRConfig();
  const [isUpdating, setIsUpdating] = useState(false);

  const isCaptain = member.memberRole === 'owner';
  const isAssistant = member.memberRole === 'admin';
  const isTransferDisabled =
    isUpdating ||
    myMemberRole !== 'owner' ||
    !isPlanEligibleForOwnership(member.subscriptionPlan) ||
    member.memberRole === 'owner';

  const handleChangeStatus = async (status: GroupMemberStatus) => {
    setIsUpdating(true);
    try {
      const res = await patchGroupMemberStatus(groupSlug, member.id, status);
      if (res.success) {
        toast.success(t(`status_updated_${status}`));
        await mutate(API_ROUTES.GROUPS.DETAIL.MEMBERS.LIST(groupSlug));
        await mutate(API_ROUTES.GROUPS.DETAIL.INFO(groupSlug));
      } else {
        toast.error(res.error ? t(`errors.${res.error}`) : t('errors.unexpected'));
      }
    } catch {
      toast.error(t('errors.unexpected'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeMemberRole = async (role: GroupMemberRole) => {
    setIsUpdating(true);
    try {
      if (role === 'owner') {
        const res = await postTransferOwnership(groupSlug, member.id);
        if (res.success) {
          toast.success(t('status_updated_owner'));
          await mutate(API_ROUTES.GROUPS.DETAIL.MEMBERS.LIST(groupSlug));
          await mutate(API_ROUTES.GROUPS.DETAIL.INFO(groupSlug));
        } else {
          toast.error(res.error ? t(`errors.${res.error}`) : t('errors.unexpected'));
        }
      } else {
        const res = await patchGroupMemberRole(groupSlug, member.id, role);
        if (res.success) {
          toast.success(t('role_updated_success'));
          await mutate(API_ROUTES.GROUPS.DETAIL.MEMBERS.LIST(groupSlug));
          await mutate(API_ROUTES.GROUPS.DETAIL.INFO(groupSlug));
        } else {
          toast.error(res.error ? t(`errors.${res.error}`) : t('errors.unexpected'));
        }
      }
    } catch {
      toast.error(t('errors.unexpected'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMember = async () => {
    setIsUpdating(true);
    try {
      const res = await deleteGroupMember(groupSlug, member.id);
      if (res.success) {
        toast.success(t('status_updated_removed'));
        await mutate(API_ROUTES.GROUPS.DETAIL.MEMBERS.LIST(groupSlug));
        await mutate(API_ROUTES.GROUPS.DETAIL.INFO(groupSlug));
      } else {
        toast.error(res.error ? t(`errors.${res.error}`) : t('errors.unexpected'));
      }
    } catch {
      toast.error(t('errors.unexpected'));
    } finally {
      setIsUpdating(false);
    }
  };

  const getActions = (): MemberAction[] => {
    if (member.isMe) return [];

    const actions: MemberAction[] = [];

    if (member.status === 'pending') {
      actions.push(
        {
          label: t('approve'),
          icon: Check,
          onClick: () => handleChangeStatus('active'),
          variant: 'success',
        },
        {
          label: t('reject'),
          icon: X,
          onClick: () => handleChangeStatus('rejected'),
          variant: 'destructive',
        },
      );
    }

    if (member.status === 'invited') {
      actions.push({
        label: t('kick_tooltip'),
        icon: X,
        onClick: handleDeleteMember,
        variant: 'destructive',
      });
    }

    if (member.status === 'rejected' || member.status === 'banned') {
      actions.push(
        {
          label: t('approve'),
          icon: Check,
          onClick: () => handleChangeStatus('active'),
          variant: 'success',
        },
        {
          label: t('kick_tooltip'),
          icon: X,
          onClick: handleDeleteMember,
          variant: 'destructive',
        },
      );
    }

    if (member.status === 'active') {
      if (myMemberRole === 'owner') {
        actions.push(
          {
            label: t('make_captain_tooltip'),
            icon: Shield,
            onClick: () => handleChangeMemberRole('owner'),
            disabled: isTransferDisabled,
            variant: 'primary',
          },
          {
            label: isAssistant ? t('remove_assistant_tooltip') : t('make_assistant_tooltip'),
            icon: Shield,
            onClick: () => handleChangeMemberRole(isAssistant ? 'member' : 'admin'),
            variant: 'primary',
          },
        );
      }

      if (canActorManageTarget(myMemberRole, member.memberRole)) {
        actions.push({
          label: t('kick_tooltip'),
          icon: LogOut,
          onClick: handleDeleteMember,
          variant: 'destructive',
        });
      }
    }

    return actions;
  };

  return (
    <div className="group first:rounded-t-app last:rounded-b-app flex flex-row items-center justify-between p-4 transition-all duration-300 hover:bg-white/[0.04]">
      <div className="flex items-center gap-4">
        <div className="relative aspect-square h-11 w-11 shrink-0">
          <div
            className={cn(
              'flex aspect-square h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ring-1 transition-transform group-hover:scale-105',
              member.status === 'pending'
                ? 'bg-primary/20 ring-primary/30'
                : 'bg-white/5 ring-white/10',
            )}
          >
            {member.memberName.slice(0, 2).toUpperCase()}
          </div>
          {isCaptain && (
            <div className="text-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-black shadow-lg">
              <Crown className="h-3 w-3 fill-current" />
            </div>
          )}
          {member.status === 'pending' && (
            <div className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full border border-black text-[10px] font-black text-black">
              !
            </div>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-bold tracking-tight',
                member.isMe ? 'text-primary' : 'text-white',
              )}
            >
              {member.memberName}
            </span>
            {(isCaptain || isAssistant) && (
              <span
                className={cn(
                  'rounded-app self-center px-1.5 py-0.5 text-[10px] font-black tracking-tighter uppercase italic',
                  isCaptain ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400',
                )}
              >
                {isCaptain ? t('captain') : t('assistant')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {member.status === 'pending' && (
              <span className="text-primary text-[10px] font-bold tracking-wider uppercase italic">
                {t('pending_status')}
              </span>
            )}
            <PlanBadge plan={member.subscriptionPlan} className="origin-left scale-90" />
          </div>
        </div>
      </div>

      <MemberActionDropdown
        actions={getActions()}
        isOpen={isOpen}
        onToggle={onToggle}
        isUpdating={isUpdating}
      />
    </div>
  );
};
