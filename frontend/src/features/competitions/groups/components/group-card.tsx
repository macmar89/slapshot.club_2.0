'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Users, Copy, Crown, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Link, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { UserGroup } from '../group.types';

interface GroupCardProps {
  data: UserGroup;
}

export function GroupCard({ data }: GroupCardProps) {
  const t = useTranslations('Groups');
  const pathname = usePathname();

  const copyToClipboard = async (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('copied'));
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const isOwner = data?.role === 'owner';
  const memberCount = data?.memberCount ?? 0;
  const waitingCount = data?.pendingMembersCount ?? 0;
  const maxMembers = data.maxMembers ?? 0;
  const isPending = data?.groupMemberStatus === 'pending';

  return (
    <div className="rounded-app hover:border-primary/30 group relative flex h-full flex-col border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:bg-white/[0.08]">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="group-hover:text-primary font-display truncate text-lg leading-tight font-black tracking-tight text-white uppercase transition-colors">
          {data.name}
        </h3>
        {isOwner && (
          <div className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px]">
            <Crown className="h-2.5 w-2.5" />
            <span className="font-bold tracking-wider uppercase">{t('owner')}</span>
          </div>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
          <span className="text-white/30">{t('members_label')}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-white/70">
              <Users className="h-3 w-3" />
              <span className="font-mono">{memberCount}</span>
            </div>
            {waitingCount > 0 && !isPending && (
              <div className="text-primary flex items-center gap-1">
                <span className="bg-primary h-1 w-1 animate-pulse rounded-full" />

                <span className="font-mono">{t('waiting_label', { count: waitingCount })}</span>
              </div>
            )}
          </div>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="bg-primary/50 h-full rounded-full"
            style={{ width: `${Math.min((memberCount / maxMembers) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        {isPending ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5 rounded border border-white/5 bg-white/[0.03] px-4 py-3">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="bg-primary/60 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                <span className="bg-primary/50 relative inline-flex h-2 w-2 rounded-full" />
              </span>
              <span className="text-[11px] font-bold tracking-widest text-white/40 uppercase">
                {t('pending_status')}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="group-hover:border-primary/20 flex items-center justify-between rounded border border-white/5 bg-black/40 px-3 py-2 transition-colors">
              <span className="text-primary font-mono text-xs tracking-widest">{data.code}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => copyToClipboard(e, data.code || '')}
                className="h-5 w-5 text-white/30 hover:text-white"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <Link href={`${pathname}/groups/${data.slug}`} className="w-full">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 text-white" />
                {t('detail') || 'Detail'}
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
