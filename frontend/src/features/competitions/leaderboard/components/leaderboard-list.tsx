import React, { useRef } from 'react';
import { Trophy } from 'lucide-react';
import { RankRow } from './rank-row';
import { LeaderboardEntry as UILeaderboardEntry } from '../types';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { User } from '@/features/users/users.types';
import { LeaderboardEntry as APILeaderboardEntry } from '@/features/competitions/competitions.types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface LeaderboardListProps {
  initialEntries: APILeaderboardEntry[];
  currentUser: User;
  competitionSlug: string;
}

export function LeaderboardList({
  initialEntries,
  currentUser,
  competitionSlug,
}: LeaderboardListProps) {
  const t = useTranslations('Dashboard.leaderboard');
  const router = useRouter();
  const userRowRef = useRef<HTMLDivElement>(null);

  // Map entries to the UI format
  const entries: UILeaderboardEntry[] = initialEntries.map((entry: any) => {
    const user = entry.user as any as User;
    return {
      id: entry.id,
      rank: entry.currentRank || 0,
      name: user.username || t('player'),
      avatarUrl: null,
      points: entry.totalPoints || 0,
      trend: (entry.rankChange || 0) > 0 ? 'up' : (entry.rankChange || 0) < 0 ? 'down' : 'same',
      isCurrentUser: user.id === currentUser.id,
      predictionsCount: entry.totalMatches || 0,
      exactScores: entry.exactGuesses || 0,
      correctDiffs: entry.correctDiffs || 0,
      winners: entry.correctTrends || 0,
      wrongGuesses:
        (entry.totalMatches || 0) -
        ((entry.exactGuesses || 0) + (entry.correctDiffs || 0) + (entry.correctTrends || 0)),
      username: user.username,
    };
  });

  const currentUserEntry = entries.find((e) => e.isCurrentUser);

  const scrollToUser = () => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <IceGlassCard
      backdropBlur="md"
      className="h-full w-full overflow-hidden rounded-none p-0"
      contentClassName="flex flex-col h-full"
    >
      {/* Table Header Row */}
      <RankRow isHeader entry={{} as UILeaderboardEntry} className="bg-white/[0.05]" />

      {/* Scrollable List */}
      <div className="flex-1 divide-y divide-white/[0.05] overflow-y-auto scroll-smooth pb-28 md:pb-24">
        {entries.map((entry, index) => {
          const isDuplicateRank = index > 0 && entry.rank === entries[index - 1].rank;
          return (
            <div key={entry.id} ref={entry.isCurrentUser ? userRowRef : null}>
              <RankRow
                entry={entry}
                hideRank={isDuplicateRank}
                onClick={() => {
                  if (entry.username) {
                    router.push(`/dashboard/${competitionSlug}/player/${entry.username}`);
                  }
                }}
              />
            </div>
          );
        })}

        {entries.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center py-20 text-white/20">
            <Trophy className="mb-4 h-12 w-12 opacity-10" />
            <p className="font-bold tracking-widest uppercase">{t('empty_state')}</p>
          </div>
        )}
      </div>

      {/* Sticky Footer for Current User */}
      {currentUserEntry && (
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
}
