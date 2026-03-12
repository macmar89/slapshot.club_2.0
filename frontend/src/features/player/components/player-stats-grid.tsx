import { Calculator, Target, TrendingUp, ClipboardCheck, Zap } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { PlayerStats } from '../player.types';
import { PlayerHeader } from './player-header';

interface PlayerStatsGridProps {
  playerStats: PlayerStats;
  className?: string;
}

export function PlayerStatsGrid({ playerStats, className }: PlayerStatsGridProps) {
  const t = useTranslations('PlayerDetail');

  const isLocked = false;

  const remainingItems = [
    {
      label: t('tips_count'),
      value: playerStats?.totalPredictions.toString() || '0',
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
