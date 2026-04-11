'use client';

import React, { useState } from 'react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/routing';
import dynamic from 'next/dynamic';

const JoinCompetitionModal = dynamic(
  () => import('./join-competition-modal').then((mod) => mod.JoinCompetitionModal),
  { ssr: false },
);

import { Competition } from '../competitions.types';

interface CompetitionCardProps {
  competition: Competition;
  compact?: boolean;
}

export function CompetitionCard({ competition, compact = false }: CompetitionCardProps) {
  const t = useTranslations('Arena');
  const router = useRouter();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);

  const isJoined = competition.isJoined;
  const isFinished = competition.status === 'finished' || competition.status === 'archived';
  const isRegistrationDisabled = !competition.isRegistrationOpen;
  const userRank = competition.leaderboardEntries?.currentRank ?? 0;

  const handleEnter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFinished || isJoined) {
      router.push(`${competition.slug}/dashboard`);
      return;
    }

    if (competition.isRegistrationOpen) {
      setIsJoinModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          'group block',
          isRegistrationDisabled && 'cursor-not-allowed opacity-60',
          compact ? 'h-[240px]' : 'h-[340px] md:h-[380px] lg:h-[400px]',
        )}
      >
        <IceGlassCard
          className={cn(
            'h-full overflow-hidden p-0 transition-all duration-300',
            !isRegistrationDisabled && 'group-hover:-translate-y-2',
            isJoined && !isFinished
              ? 'border-[#22c55e]/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
              : 'group-hover:border-[#eab308]/40',
            isFinished && 'opacity-80 group-hover:opacity-100',
          )}
          backdropBlur="xs"
          withGradient
        >
          <div
            className={cn(
              'relative flex h-full flex-col justify-end',
              compact ? 'p-5' : 'p-5 md:p-6 lg:p-8',
            )}
          >
            <div
              className={cn(
                'rounded-app absolute top-6 right-6 border px-4 py-1.5 text-[0.7rem] font-bold tracking-widest uppercase backdrop-blur-md',
                competition.status === 'active'
                  ? 'border-[#eab308] bg-[#eab308] text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                  : competition.status === 'finished'
                    ? 'border-white/10 bg-white/5 text-white/50'
                    : 'border-white/20 bg-white/10 text-white',
              )}
            >
              {t(`status.${competition.status}`)}
            </div>

            {isJoined && !isFinished && (
              <div className="rounded-app absolute top-6 left-6 flex items-center gap-1.5 bg-[#22c55e] px-3 py-1.5 text-[0.65rem] font-black tracking-widest text-white uppercase shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                {t('joined')}
              </div>
            )}

            <div className={cn('flex flex-col text-left', compact ? 'mb-4 gap-1' : 'mb-6 gap-2')}>
              <h2
                className={cn(
                  'line-clamp-1 font-bold text-white transition-colors group-hover:text-[#eab308]',
                  compact ? 'text-lg md:text-xl' : 'text-xl md:text-2xl',
                )}
              >
                {competition.name}
              </h2>
              <p className="line-clamp-2 text-sm leading-relaxed text-white/70">
                {competition.description}
              </p>

              <div className="mt-4 flex items-center justify-between gap-2">
                {isJoined && userRank !== 0 && (
                  <div className="flex items-center gap-2 rounded-sm border border-[#eab308]/30 bg-[#eab308]/10 px-2 py-1 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                    <span className="-my-1 text-xs">
                      {userRank === 1
                        ? '🥇'
                        : userRank === 2
                          ? '🥈'
                          : userRank === 3
                            ? '🥉'
                            : `#${userRank}`}
                    </span>
                    <span className="text-[9px] font-black tracking-wider text-[#eab308] uppercase">
                      {t('your_rank')}
                    </span>
                  </div>
                )}

                <div className="ml-auto flex items-center gap-1.5 rounded-sm border border-white/10 bg-white/5 px-2 py-1">
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="text-[9px] font-bold tracking-wider text-white/50 uppercase">
                    {t('participants', { count: competition.totalParticipants })}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={cn(
                'flex items-center justify-between border-t border-white/10',
                compact ? 'pt-3' : 'pt-4',
              )}
            >
              <div className="flex flex-col text-left">
                <span className="mb-0.5 text-[0.65rem] font-bold tracking-wider text-white/40 uppercase">
                  {t('start_date')}
                </span>
                <span className="text-sm font-semibold">
                  {new Date(competition.startDate).toLocaleDateString('sk-SK')}
                </span>
              </div>
              <Button
                onClick={handleEnter}
                color={isFinished ? 'secondary' : 'gold'}
                disabled={isRegistrationDisabled}
                className={cn(
                  'rounded-app shrink-0 font-black',
                  compact ? 'px-4 py-2 text-[10px]' : 'px-5 py-2.5 text-xs',
                  isRegistrationDisabled && 'cursor-not-allowed opacity-50 grayscale',
                )}
              >
                {isFinished
                  ? t('view_button')
                  : !isJoined
                    ? t('enter_button_guest')
                    : t('enter_button')}
              </Button>
            </div>

            {!isFinished && (
              <p className="mt-4 text-center text-[10px] leading-relaxed font-medium text-white/30 italic">
                {t('assurance')}
              </p>
            )}
          </div>
        </IceGlassCard>
      </div>

      {isJoinModalOpen && (
        <JoinCompetitionModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          competition={competition}
        />
      )}
    </>
  );
}
