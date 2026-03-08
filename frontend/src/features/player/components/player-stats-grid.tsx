import {
  Calculator,
  Target,
  Trophy,
  TrendingUp,
  User as UserIcon,
  ClipboardCheck,
  Zap,
} from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { PlanBadge } from '@/components/ui/plan-badge';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { SubscriptionPlan } from '@/features/users/users.types';
import { PlayerStats } from '../player.types';
import { PlayerDotsFormLegend, PlayerFormDots } from './player-form-dots';

interface PlayerStatsGridProps {
  playerStats: PlayerStats;
  className?: string;
}

export function PlayerStatsGrid({ playerStats, className }: PlayerStatsGridProps) {
  const t = useTranslations('PlayerDetail');
  const locale = useLocale();

  const isLocked = false;

  const memberSinceDate = playerStats.createdAt
    ? new Date(playerStats.createdAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '?';

  const plan = playerStats.subscriptionPlan || 'free';

  const remainingItems = [
    {
      label: t('tips_count'),
      value: playerStats?.totalMatches.toString() || '0',
      icon: ClipboardCheck,
      color: 'text-blue-400',
      desc: t('desc_tips'),
    },
    {
      label: t('avgPoints'),
      value: playerStats?.averagePoints.toFixed(2) || '0.00',
      icon: Calculator,
      color: 'text-purple-400',
      desc: t('desc_avg'),
    },
    {
      label: t('sniperRate'),
      value: playerStats?.exactGuesses.toString() || '0',
      icon: Target,
      color: 'text-red-500',
      desc: t('desc_sniper_new'),
    },
    {
      label: t('success_rate'),
      value: playerStats ? `${playerStats.successRate.toFixed(1)}%` : '0.0%',
      icon: TrendingUp,
      color: 'text-emerald-400',
      desc: t('success_rate_desc'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Merged Info & Key Stats Card */}
      <IceGlassCard className="overflow-hidden p-6">
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

        {/* Legend for Form */}
        <div className="relative">
          <div className={cn(isLocked && 'opacity-40 blur-sm grayscale select-none')}>
            <PlayerDotsFormLegend />
          </div>
        </div>
      </IceGlassCard>

      {/* Remaining Stats Grid */}
      <div className="relative">
        <div
          className={cn(
            'grid grid-cols-2 gap-4 transition-all duration-500 lg:grid-cols-4',
            isLocked && 'opacity-40 blur-md grayscale select-none',
            className,
          )}
        >
          {remainingItems.map((item, i) => (
            <IceGlassCard
              key={i}
              className="group p-4 transition-all hover:bg-white/5"
              contentClassName="flex flex-col items-center justify-center text-center"
            >
              <div
                className={cn(
                  'mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-transform group-hover:scale-110',
                  item.color,
                )}
              >
                <item.icon size={20} />
              </div>
              <span className="mb-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {item.label}
              </span>
              <span className="text-xl leading-none font-black tracking-tighter text-white/80 italic">
                {item.value}
              </span>
              {item.desc && (
                <span className="mt-1 text-[9px] font-medium text-white/30 uppercase">
                  {item.desc}
                </span>
              )}
            </IceGlassCard>
          ))}
        </div>

        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-warning/20 border-warning/30 mb-3 flex h-12 w-12 items-center justify-center rounded-full border shadow-[0_0_20px_rgba(255,191,0,0.2)]">
              <Zap size={20} className="text-warning animate-pulse" />
            </div>
            <p className="text-warning text-sm leading-tight font-black tracking-[0.2em] uppercase italic">
              PRO feature
            </p>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
              {t('upgrade_to_see_stats')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
