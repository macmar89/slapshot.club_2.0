import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { AlertCircle, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PredictionTeaserProps {
  totalPredictions: number;
}

export const PredictionTeaser = ({ totalPredictions }: PredictionTeaserProps) => {
  const t = useTranslations('Dashboard.matches');

  const total = totalPredictions > 10 ? 10 : totalPredictions;

  //  @TODO - free user can't see predictions

  return (
    <div className="relative min-h-[400px] w-full">
      <div className="w-full space-y-6">
        <IceGlassCard
          className="flex min-h-[400px] w-full flex-col overflow-hidden"
          backdropBlur="lg"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-white/5 p-4 md:flex-row md:items-center md:p-6">
            <div className="flex items-center gap-3">
              <div className="bg-warning h-4 w-1 rounded-full shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
              <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">
                {t('player_tips')} <span className="text-warning ml-1">({total})</span>
              </h3>
            </div>

            <div className="relative w-full md:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-3.5 w-3.5 text-white/40" />
              </div>
              <input
                type="text"
                disabled
                placeholder={t('search_by_username')}
                className="rounded-app focus:ring-warning/50 focus:border-warning/50 block w-full border border-white/10 bg-white/5 py-2 pr-3 pl-9 leading-5 font-medium text-white placeholder-white/20 transition-colors focus:bg-white/10 focus:ring-1 focus:outline-none sm:text-xs"
              />
            </div>
          </div>

          <div className="pointer-events-none divide-y divide-white/5 opacity-60 select-none">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar Skeleton */}
                  <div className="h-8 w-8 animate-pulse rounded-full border border-white/20 bg-white/30 blur-[2px] md:h-10 md:w-10" />

                  <div className="flex flex-col gap-2">
                    {/* Username Skeleton */}
                    <div className="h-3 w-24 animate-pulse rounded bg-white/30 blur-[3px]" />
                    {/* Date Skeleton */}
                    <div className="h-2 w-16 animate-pulse rounded bg-white/20 blur-[2px]" />
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Score Skeleton */}
                  <div className="h-6 w-12 animate-pulse rounded bg-white/30 text-lg font-black italic blur-[4px]" />
                  {/* Points Skeleton */}
                  <div className="h-5 w-10 animate-pulse rounded bg-white/20 blur-[3px]" />
                </div>
              </div>
            ))}
          </div>
          <div className="z-20 flex flex-1 items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <div className="bg-warning/20 border-warning/20 mb-1 flex h-10 w-10 items-center justify-center rounded-full border">
                <AlertCircle className="text-warning h-5 w-5" />
              </div>
              <span className="text-xs font-black tracking-[0.2em] text-white uppercase">
                {t('match_not_started_title')}
              </span>
              <p className="max-w-[180px] text-[9px] leading-relaxed font-bold tracking-widest text-white/40 uppercase">
                {t('match_not_started_desc')}
              </p>
            </div>
          </div>
        </IceGlassCard>
      </div>
    </div>
  );
};
