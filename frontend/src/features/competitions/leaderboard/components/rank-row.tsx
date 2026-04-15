'use client';

import { User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompetitionLeaderboardEntry } from '@/features/competitions/leaderboard/leaderboard.types';
import { useTranslations } from 'next-intl';
import { GroupLeaderboardEntry } from '@/features/competitions/groups/group.types';

const getRankDisplay = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <div className="relative flex h-8 w-8 items-center justify-center md:h-10 md:w-10">
          <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-500/20 blur-md" />
          <span className="relative z-10 text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] md:text-3xl">
            🥇
          </span>
        </div>
      );
    case 2:
      return (
        <div className="relative flex h-8 w-8 items-center justify-center md:h-10 md:w-10">
          <div className="absolute inset-0 rounded-full bg-slate-400/20 blur-md" />
          <span className="relative z-10 text-2xl drop-shadow-[0_0_8px_rgba(148,163,184,0.5)] md:text-3xl">
            🥈
          </span>
        </div>
      );
    case 3:
      return (
        <div className="relative flex h-8 w-8 items-center justify-center md:h-10 md:w-10">
          <div className="absolute inset-0 rounded-full bg-amber-700/20 blur-md" />
          <span className="relative z-10 text-2xl drop-shadow-[0_0_8px_rgba(180,83,9,0.5)] md:text-3xl">
            🥉
          </span>
        </div>
      );
    default:
      return !rank ? (
        <span className="text-sm font-black text-white/40 italic md:text-base">-</span>
      ) : (
        <span className="text-sm font-black text-white italic md:text-base">#{rank}</span>
      );
  }
};

interface RankRowProps {
  entry: CompetitionLeaderboardEntry | GroupLeaderboardEntry;
  className?: string;
  onClick?: () => void;
  isHeader?: boolean;
  hideRank?: boolean;
}

export const GRID_LAYOUT =
  'grid grid-cols-[40px_1fr_60px] md:grid-cols-[40px_1fr_60px_60px_60px_60px_60px_90px] items-center gap-2 md:gap-4';

export const RankRow = ({ entry, className, onClick, isHeader, hideRank }: RankRowProps) => {
  const t = useTranslations('Dashboard.leaderboard');

  if (isHeader) {
    return (
      <div
        className={cn(GRID_LAYOUT, 'border-b border-white/10 bg-white/[0.03] px-4 py-3', className)}
      >
        <span className="text-[10px] font-black tracking-widest text-[#eab308] uppercase">#</span>
        <span className="text-left text-[10px] font-black tracking-widest text-white/30 uppercase">
          {t('name')}
        </span>
        <span className="hidden text-right text-[10px] font-black tracking-widest text-white/30 uppercase md:block">
          {t('predictions')}
        </span>
        <span className="hidden text-right text-[10px] font-black tracking-widest text-white/30 uppercase md:block">
          {t('exact')}
        </span>
        <span className="hidden text-right text-[10px] font-black tracking-widest text-white/30 uppercase md:block">
          {t('diff')}
        </span>
        <span className="hidden text-right text-[10px] font-black tracking-widest text-white/30 uppercase md:block">
          {t('winners')}
        </span>
        <span className="hidden text-right text-[10px] font-black tracking-widest text-white/30 uppercase md:block">
          {t('wrong')}
        </span>
        <span className="ml-2 flex h-full items-center justify-center border-l border-white/20 bg-white/10 px-3 text-center text-[10px] font-black tracking-[0.2em] text-[#eab308] uppercase md:ml-4">
          {t('points')}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        GRID_LAYOUT,
        'relative border-b border-white/[0.05] px-4 py-1.5 transition-all duration-300 md:py-4',
        entry.isCurrentUser
          ? 'bg-[#eab308]/10 before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:bg-[#eab308]'
          : 'bg-transparent hover:bg-white/[0.02]',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className,
      )}
    >
      <div className="flex min-h-[32px] items-center justify-center md:min-h-[40px]">
        {!hideRank && getRankDisplay(entry.currentRank)}
      </div>

      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <div className="relative hidden shrink-0 md:block">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 md:h-10 md:w-10">
            <span className="text-[10px] font-black text-white/40 md:text-xs">
              {entry.username?.slice(0, 2).toUpperCase() || (
                <UserIcon className="h-3 w-3 text-white/10 md:h-4 md:w-4" />
              )}
            </span>
          </div>

          {'memberRole' in entry && entry.memberRole && entry.memberRole !== 'member' && (
            <div
              className={cn(
                'absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border border-black text-[8px] font-black md:h-5 md:w-5 md:text-[10px]',
                entry.memberRole === 'owner' ? 'bg-[#eab308] text-black' : 'bg-blue-500 text-white',
              )}
            >
              {entry.memberRole === 'owner' ? 'C' : 'A'}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            {'memberRole' in entry && entry.memberRole && entry.memberRole !== 'member' && (
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-black md:hidden',
                  entry.memberRole === 'owner'
                    ? 'bg-[#eab308] text-black'
                    : 'bg-blue-500 text-white',
                )}
              >
                {entry.memberRole === 'owner' ? 'C' : 'A'}
              </span>
            )}
            <span
              className={cn(
                'truncate text-[12px] font-black tracking-tight uppercase md:text-sm',
                entry.isCurrentUser ? 'text-[#eab308]' : 'text-white',
              )}
            >
              {entry.username}
            </span>
            {'globalCurrentRank' in entry && !!entry.globalCurrentRank && (
              <span className="text-[10px] font-medium text-white/30 lowercase md:text-[11px]">
                (#{entry.globalCurrentRank})
              </span>
            )}
          </div>

          <div className="mt-1.5 flex w-fit items-center gap-3 rounded-sm border border-white/[0.05] bg-white/5 px-2 py-1 md:hidden">
            <div className="flex flex-col items-center leading-none">
              <span className="mb-0.5 text-[6px] font-bold tracking-tighter text-white/30 uppercase">
                {t('predictions')}
              </span>
              <span className="text-[9px] font-black text-white/60">{entry.totalPredictions}</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-2 leading-none">
              <span className="mb-0.5 text-[6px] font-bold tracking-tighter text-white/30 uppercase">
                {t('exact')}
              </span>
              <span className="text-[9px] font-black text-[#eab308]">{entry.exactGuesses}</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-2 leading-none">
              <span className="mb-0.5 text-[6px] font-bold tracking-tighter text-white/30 uppercase">
                {t('diff')}
              </span>
              <span className="text-[9px] font-black text-blue-400/80">{entry.correctDiffs}</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-2 leading-none">
              <span className="mb-0.5 text-[6px] font-bold tracking-tighter text-white/30 uppercase">
                {t('winners')}
              </span>
              <span className="text-[9px] font-black text-emerald-500/80">
                {entry.correctTrends}
              </span>
            </div>
          </div>
        </div>
      </div>

      <span className="hidden text-right text-xs font-black text-white/60 md:block">
        {entry.totalPredictions}
      </span>
      <span className="hidden text-right text-xs font-black text-[#eab308] md:block">
        {entry.exactGuesses}
      </span>
      <span className="hidden text-right text-xs font-black text-blue-400/80 md:block">
        {entry.correctDiffs}
      </span>
      <span className="hidden text-right text-xs font-black text-emerald-500/80 md:block">
        {entry.correctTrends}
      </span>
      <span className="hidden text-right text-xs font-black text-rose-500/80 md:block">
        {entry.wrongGuesses}
      </span>

      <div className="group/points relative ml-2 flex h-full items-center justify-center border-l border-white/10 bg-gradient-to-l from-[#eab308]/10 to-transparent px-3 md:ml-4">
        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity md:group-hover:opacity-100" />
        <span className="text-base font-black tracking-tighter text-[#eab308] italic drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-transform duration-300 md:text-xl md:group-hover:scale-110">
          {entry.totalPoints}
        </span>
      </div>
    </div>
  );
};
