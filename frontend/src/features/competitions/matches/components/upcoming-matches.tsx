'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { CompetitionDashboardMatchesResponse } from '../../dashboard/dashboard.types';
import { Skeleton } from '@/components/ui/skeleton';
import { MatchCardCompact } from './match-card-compact';

export function UpcomingMatches() {
  const params = useParams();
  const slug = params.slug as string;

  const t = useTranslations('Dashboard');

  const { data, isLoading } = useSWR<CompetitionDashboardMatchesResponse>(
    API_ROUTES.COMPETITIONS.MATCHES.UPCOMING(slug),
  );

  if (isLoading || !data) {
    return (
      <Skeleton className="flex h-[160px] animate-pulse flex-col justify-center p-4 md:p-8 lg:col-span-8" />
    );
  }

  const { upcomingMatches = [], unpredictedCount = 0 } = data || {};

  return (
    <>
      <IceGlassCard className="relative overflow-hidden p-4 md:p-8" withGradient>
        <div className="pointer-events-none absolute -top-4 -right-4 opacity-5">
          <Zap className="h-64 w-64" />
        </div>

        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            <h2 className="text-sm font-black tracking-[0.2em] text-yellow-500 uppercase">
              {t('upcoming_matches_label', { count: unpredictedCount })}
            </h2>
          </div>

          {upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches?.map((match) => (
                <MatchCardCompact
                  key={match.id}
                  matchId={match.id}
                  homeTeamName={match.homeTeamName}
                  homeTeamShortName={match.homeTeamShortName}
                  homeTeamLogoUrl={match.homeTeamLogoUrl}
                  awayTeamName={match.awayTeamName}
                  awayTeamShortName={match.awayTeamShortName}
                  awayTeamLogoUrl={match.awayTeamLogoUrl}
                  matchDate={match.date}
                />
              ))}
            </div>
          ) : unpredictedCount > 0 ? (
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium text-white italic opacity-80">
                {t('all_predicted_message')}
              </p>
              <div className="rounded-app border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-bold tracking-widest text-green-500 uppercase">
                {t('all_done_status')}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm font-medium tracking-wide text-white/40 italic">
              {t('matches.empty_state')}
            </div>
          )}
        </div>
      </IceGlassCard>
    </>
  );
}
