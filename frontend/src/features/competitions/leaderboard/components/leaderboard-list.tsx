import { useRef } from 'react';
import { Trophy } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { CompetitionLeaderboardEntry } from '@/features/competitions/leaderboard/leaderboard.types';
import { RankRow } from '@/features/competitions/leaderboard/components/rank-row';
import { GroupLeaderboardEntry } from '@/features/competitions/groups/group.types';
import { cn } from '@/lib/utils';

interface LeaderboardListProps {
  entries: CompetitionLeaderboardEntry[] | GroupLeaderboardEntry[];
  isCurrentUserRowVisible?: boolean;
}

export const LeaderboardList = ({
  entries,
  isCurrentUserRowVisible = true,
}: LeaderboardListProps) => {
  const t = useTranslations('Dashboard.leaderboard');
  const router = useRouter();

  const params = useParams();
  const slug = params.slug as string;
  const userRowRef = useRef<HTMLDivElement>(null);

  const scrollToUser = () => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentUserEntry = entries?.find((e) => e.isCurrentUser);

  return (
    <IceGlassCard
      backdropBlur="md"
      className="h-full w-full overflow-hidden rounded-none p-0"
      contentClassName="flex flex-col h-full"
    >
      <RankRow isHeader entry={{} as CompetitionLeaderboardEntry} className="bg-white/[0.05]" />

      <div
        className={cn(
          'flex-1 divide-y divide-white/[0.05] overflow-y-auto scroll-smooth',
          isCurrentUserRowVisible ? 'pb-28 md:pb-24' : 'pb-0',
        )}
      >
        {entries?.map((entry, index) => {
          const isDuplicateRank = index > 0 && entry.currentRank === entries[index - 1].currentRank;
          return (
            <div key={entry.id} ref={entry.isCurrentUser ? userRowRef : null}>
              <RankRow
                entry={entry}
                hideRank={isDuplicateRank}
                onClick={() => {
                  if (entry.username) {
                    router.push(`/${slug}/player/${entry.username}`);
                  }
                }}
              />
            </div>
          );
        })}

        {entries?.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center py-20 text-white/20">
            <Trophy className="mb-4 h-12 w-12 opacity-10" />
            <p className="font-bold tracking-widest uppercase">{t('empty_state')}</p>
          </div>
        )}
      </div>

      {isCurrentUserRowVisible && currentUserEntry && (
        <div className="absolute right-0 bottom-0 left-0 z-20 block shrink-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-8 md:p-4 md:pt-12">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 md:top-6">
            <span className="animate-pulse text-[7px] font-black tracking-[0.3em] text-[#eab308] uppercase md:text-[8px]">
              {t('click_to_go_to_your_position')}
            </span>
          </div>
          <RankRow
            entry={currentUserEntry}
            onClick={scrollToUser}
            className="origin-bottom scale-90 border border-[#eab308]/40 bg-[#eab308]/20 shadow-[0_0_50px_rgba(234,179,8,0.2)] backdrop-blur-xl md:scale-100"
          />
        </div>
      )}
    </IceGlassCard>
  );
};
