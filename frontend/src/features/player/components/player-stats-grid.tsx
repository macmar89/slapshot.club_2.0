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
import { User } from '@/features/users/users.types';

interface PlayerStats {
  totalMatches: number;
  averagePoints: number;
  exactGuesses: number;
  successRate: number;
  rank: number;
  points: number;
  lastPredictions: Array<{
    points: number | null;
  }>;
}

interface PlayerStatsGridProps {
  stats: PlayerStats | null;
  user: PlayerStats;
  isLocked?: boolean;
  className?: string;
}

export function PlayerStatsGrid({ stats, user, isLocked, className }: PlayerStatsGridProps) {
  const t = useTranslations('PlayerDetail');
  const locale = useLocale();

  const memberSinceDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '?';

  const plan = user.subscriptionPlan || 'free';

  const remainingItems = [
    {
      label: t('tips_count'),
      value: stats?.totalMatches.toString() || '0',
      icon: ClipboardCheck,
      color: 'text-blue-400',
      desc: t('desc_tips'),
    },
    {
      label: t('avgPoints'),
      value: stats?.averagePoints.toFixed(2) || '0.00',
      icon: Calculator,
      color: 'text-purple-400',
      desc: t('desc_avg'),
    },
    {
      label: t('sniperRate'),
      value: stats?.exactGuesses.toString() || '0',
      icon: Target,
      color: 'text-red-500',
      desc: t('desc_sniper_new'),
    },
    {
      label: t('success_rate'),
      value: stats ? `${stats.successRate.toFixed(1)}%` : '0.0%',
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
                  {user.username}
                </h3>
                <PlanBadge plan={plan as any} />
              </div>
              <p className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">
                {t('member_since')}: <span className="text-white/70">{memberSinceDate}</span>
              </p>

              {/* Form Dots */}
              <div className="relative">
                <div className={cn(isLocked && 'opacity-40 blur-sm grayscale select-none')}>
                  {stats?.lastPredictions && stats.lastPredictions.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-black tracking-wider text-white/40 uppercase italic">
                        {t('form')}:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {stats.lastPredictions.map((p, i) => {
                          const points = p.points ?? 0;
                          let color = 'bg-white/10';
                          if (points === 5)
                            color =
                              'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] border border-emerald-300/30';
                          if (points === 3) color = 'bg-blue-400';
                          if (points === 2) color = 'bg-orange-400';
                          if (points === 0) color = 'bg-red-500/50';

                          return (
                            <div
                              key={i}
                              className={cn(
                                'h-2.5 w-2.5 rounded-full transition-all hover:scale-125',
                                color,
                              )}
                              title={`${points} pts`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Key Stats */}
          <div className="flex items-center gap-8 md:gap-12 md:pr-4">
            <div className="flex flex-col items-center md:items-end">
              <span className="mb-1 text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {t('rank')}
              </span>
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-warning" />
                <span className="text-3xl leading-none font-black tracking-tighter text-white italic">
                  {stats ? `#${stats.rank}` : '-'}
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
                    {stats?.points.toString() || '0'}
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
            {stats?.lastPredictions && stats.lastPredictions.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-[9px] font-black tracking-tight text-white/40 uppercase italic">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  {t('exact_tip')}
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black tracking-tight text-white/40 uppercase italic">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  {t('winner_diff')}
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black tracking-tight text-white/40 uppercase italic">
                  <div className="h-2 w-2 rounded-full bg-orange-400" />
                  {t('winner')}
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black tracking-tight text-white/40 uppercase italic">
                  <div className="h-2 w-2 rounded-full bg-red-500/50" />
                  {t('miss')}
                </div>
              </div>
            )}
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
