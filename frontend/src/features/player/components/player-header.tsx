import { Trophy, User as UserIcon, Zap } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { PlanBadge } from '@/components/ui/plan-badge';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { SubscriptionPlan } from '@/features/users/users.types';
import { PlayerStats } from '../player.types';
import { PlayerDotsFormLegend, PlayerFormDots } from './player-form-dots';

interface PlayerHeaderProps {
  playerStats: PlayerStats;
  isLocked?: boolean;
  className?: string;
}

export function PlayerHeader({ playerStats, isLocked = false, className }: PlayerHeaderProps) {
  const t = useTranslations('PlayerDetail');
  const locale = useLocale();

  const memberSinceDate = playerStats.createdAt
    ? new Date(playerStats.createdAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '?';

  const plan = playerStats.subscriptionPlan || 'free';

  return (
    <IceGlassCard className={cn('overflow-hidden p-6', className)}>
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
        {/* Left Side: Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <UserIcon size={32} className="text-white/60" />
          </div>
          <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-2xl leading-none font-black tracking-tight text-white uppercase italic">
                {playerStats.username}
              </h3>
              <PlanBadge plan={plan as SubscriptionPlan} />
            </div>
            <p className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">
              {t('member_since')}: <span className="text-white/70">{memberSinceDate}</span>
            </p>
            <div className="relative mt-2">
              <PlayerFormDots form={playerStats.currentForm} />
            </div>
          </div>
        </div>

        {/* Right Side: Rank & Points */}
        <div className="flex items-center gap-8 md:gap-12 md:pr-4">
          <div className="flex flex-col items-center md:items-end">
            <span className="mb-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
              {t('rank')}
            </span>
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-warning" />
              <span className="text-3xl leading-none font-black tracking-tighter text-white italic">
                {playerStats ? `#${playerStats.currentRank}` : '-'}
              </span>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-white/10 md:block" />

          <div className="relative flex flex-col items-center md:items-end">
            <div className={cn(isLocked && 'opacity-40 blur-sm grayscale select-none')}>
              <span className="mb-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {t('points_count')}
              </span>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                <span className="text-3xl leading-none font-black tracking-tighter text-white italic">
                  {playerStats?.totalPoints.toString() || '0'}
                </span>
              </div>
            </div>
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap size={14} className="text-warning/40" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form legend */}
      <div className="relative mt-4">
        <div className={cn(isLocked && 'opacity-40 blur-sm grayscale select-none')}>
          <PlayerDotsFormLegend />
        </div>
      </div>
    </IceGlassCard>
  );
}
