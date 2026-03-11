import { BackLink } from '@/components/common/back-link';
import { useTranslations } from 'next-intl';
import { useAppParams } from '@/hooks/use-app-params';
import { Crown, Users } from 'lucide-react';
import type { GroupDetail } from '@/features/competitions/groups/group.types';

interface GroupDetailHeaderProps {
  group: GroupDetail;
}

export const GroupDetailHeader = ({ group }: GroupDetailHeaderProps) => {
  const t = useTranslations('Groups');
  const { slug: competitionSlug } = useAppParams(['slug']);

  return (
    <div className="mb-4 flex shrink-0 flex-col gap-4 px-1">
      <div className="flex items-center justify-between">
        <BackLink href={`/dashboard/${competitionSlug}/leagues`} label={t('back_to_list')} />
      </div>

      <div className="mt-2 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <div className="from-primary/20 border-primary/30 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-gradient-to-br to-black shadow-[0_0_20px_rgba(250,204,21,0.15)]">
            <Crown className="text-primary h-7 w-7 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
          </div>
          <div>
            <h1 className="text-primary text-3xl leading-none font-black tracking-tight uppercase italic drop-shadow-xl md:text-5xl">
              {group.name}
            </h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pr-3 pl-2">
                <Users className="text-primary h-3.5 w-3.5" />
                <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                  {t('header_members', { count: group.statsMembersCount, max: group.maxMembers })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
