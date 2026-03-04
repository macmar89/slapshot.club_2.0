import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface MatchPredictionsBarProps {
  homePredictedCount: number;
  awayPredictedCount: number;
  className?: string;
}

export function MatchPredictionsBar({
  homePredictedCount,
  awayPredictedCount,
  className,
}: MatchPredictionsBarProps) {
  const t = useTranslations('Dashboard.matches');

  const totalPredictions = homePredictedCount + awayPredictedCount;
  const homeWinPct =
    totalPredictions > 0 ? Math.round((homePredictedCount / totalPredictions) * 100) : 0;
  const awayWinPct = totalPredictions > 0 ? 100 - homeWinPct : 0;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="relative w-full">
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          {totalPredictions > 0 ? (
            <>
              <div
                className={cn(
                  'h-full transition-all duration-1000',
                  homeWinPct > awayWinPct ? 'bg-primary' : 'bg-white/80',
                )}
                style={{ width: `${homeWinPct}%` }}
              />
              <div
                className={cn(
                  'h-full transition-all duration-1000',
                  awayWinPct > homeWinPct ? 'bg-primary' : 'bg-white/80',
                )}
                style={{ width: `${awayWinPct}%` }}
              />
            </>
          ) : (
            <div className="h-full w-full bg-white/10" />
          )}
        </div>

        <div className="relative mt-2 flex justify-between px-1">
          <div
            className={cn(
              'text-left text-[0.8rem] leading-none font-black tracking-wider',
              homeWinPct > awayWinPct ? 'text-primary' : 'text-white/80',
            )}
          >
            {homeWinPct}%
          </div>

          <div className="absolute top-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
              {t('predictions_count', { count: totalPredictions })}
            </span>
          </div>

          <div
            className={cn(
              'text-right text-[0.8rem] leading-none font-black tracking-wider',
              awayWinPct > homeWinPct ? 'text-primary' : 'text-white/80',
            )}
          >
            {awayWinPct}%
          </div>
        </div>
      </div>
    </div>
  );
}
