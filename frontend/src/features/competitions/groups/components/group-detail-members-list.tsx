import React, { useState, useRef, useEffect } from 'react';
import { Check, Crown, X, MoreVertical, LogOut, Shield } from 'lucide-react';
import type { GroupMember } from '../group.types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PlanBadge } from '@/components/ui/plan-badge';

interface GroupDetailMembersListProps {
  title: string;
  data: GroupMember[];
}

export const GroupDetailMembersList = ({ title, data }: GroupDetailMembersListProps) => {
  const t = useTranslations('Groups');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="mt-4 flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between py-2">
        <h3 className="text-sm font-black tracking-widest text-white/50 uppercase italic">
          {title}
        </h3>
        <div className="rounded-app flex h-6 min-w-6 items-center justify-center bg-white/5 px-1.5 text-[10px] font-bold text-white/40 ring-1 ring-white/10 ring-inset">
          {data.length}
        </div>
      </div>

      {data.length > 0 && (
        <div className="rounded-app divide-y divide-white/5 overflow-hidden bg-white/[0.02]">
          {data.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              t={t}
              isOpen={openMenuId === member.id}
              onToggle={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface MemberRowProps {
  member: GroupMember;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  isOpen: boolean;
  onToggle: () => void;
}

const MemberRow = ({ member, t, isOpen, onToggle }: MemberRowProps) => {
  const isPending = member.status === 'pending';
  const isCaptain = member.memberRole === 'owner';
  const isAssistant = member.memberRole === 'admin';
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

  return (
    <div
      className={cn(
        'group flex transition-all duration-300',
        isPending
          ? 'bg-primary/5 flex-col items-stretch gap-4 p-4 md:flex-row md:items-center md:justify-between'
          : 'flex-row items-center justify-between p-4 hover:bg-white/[0.04]',
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar Area */}
        <div className="relative aspect-square h-11 w-11 shrink-0">
          <div
            className={cn(
              'flex aspect-square h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ring-1 transition-transform group-hover:scale-105',
              isPending ? 'bg-primary/20 ring-primary/30' : 'bg-white/5 ring-white/10',
            )}
          >
            {member.memberName.slice(0, 2).toUpperCase()}
          </div>
          {isCaptain && (
            <div className="text-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-black shadow-lg">
              <Crown className="h-3 w-3 fill-current" />
            </div>
          )}
          {isPending && (
            <div className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full border border-black text-[10px] font-black text-black">
              !
            </div>
          )}
        </div>

        {/* Info Area */}
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
                {isCaptain ? 'KAPITÁN' : 'ASISTENT'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isPending && (
              <span className="text-primary text-[10px] font-bold tracking-wider uppercase italic">
                {t('pending_status')}
              </span>
            )}
            <PlanBadge plan={member.subscriptionPlan} className="origin-left scale-90" />
          </div>
        </div>
      </div>

      {/* Actions Area */}
      <div className="relative flex items-center" ref={dropdownRef}>
        {isPending ? (
          <div className="flex w-full items-center gap-2 md:w-auto">
            <Button
              size="sm"
              variant="ghost"
              className="h-9 flex-1 border border-emerald-500/20 bg-emerald-500/10 px-3 text-[10px] font-bold text-emerald-500 transition-colors hover:bg-emerald-500/20 md:flex-initial"
              title={t('approve')}
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              {t('approve')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 h-9 flex-1 border px-3 text-[10px] font-bold transition-colors md:flex-initial"
              title={t('reject')}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              {t('reject')}
            </Button>
          </div>
        ) : (
          !member.isMe && (
            <div className="relative">
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

              {/* Action Dropdown */}
              {isOpen && (
                <div className="animate-in fade-in zoom-in absolute right-0 z-50 mt-2 w-48 origin-top-right duration-200">
                  <div className="rounded-app border border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-xl">
                    <div className="py-1.5">
                      <button className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5">
                        <Shield className="group-hover:text-primary h-4 w-4 text-white/30 transition-colors" />
                        <span className="text-xs font-bold tracking-tight text-white/60 uppercase group-hover:text-white">
                          {t('make_captain_tooltip')}
                        </span>
                      </button>
                      <button className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5">
                        <LogOut className="group-hover:text-destructive h-4 w-4 text-white/30 transition-colors" />
                        <span className="text-xs font-bold tracking-tight text-white/60 uppercase group-hover:text-white">
                          {t('kick_tooltip')}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
