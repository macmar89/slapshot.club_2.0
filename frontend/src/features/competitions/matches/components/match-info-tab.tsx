'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { cn } from '@/lib/utils';
import { Trophy, Users, PencilLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import type { Match } from '@/features/competitions/matches/matches.types';
import { useLocale } from 'next-intl';
import { MatchTeamDisplay } from '@/features/competitions/matches/components/match-team-display';
import { MatchPredictionsBar } from '@/features/competitions/matches/components/match-predictions-bar';
import { MatchPointsAnalysis } from './match-points-analysis';
import { usePredictionStore } from '../../predictions/store/use-prediction-store';
import { DataLoader } from '@/components/common/data-loader';
import { ErrorView } from '@/components/common/error-view';

export const MatchInfoTab = () => {
  const params = useParams();
  const id = params.id as string;

  const t = useTranslations('Dashboard.matches');
  const locale = useLocale();

  const openPrediction = usePredictionStore((state) => state.openPrediction);

  const { data, mutate, isLoading, error } = useSWR<{
    match: Match;
    scores: Record<string, number>;
  }>(API_ROUTES.MATCHES.DETAIL.INFO(id));

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={<div>LOADING TODO</div>}
      notFound={<ErrorView />}
    >
      {(data) => {
        const { match, scores } = data;

        const totalPredictions = match.homePredictedCount + match.awayPredictedCount;

        const matchDate = new Date(match.date);

        const statusStyles = {
          scheduled: 'text-white/40 border-white/10 bg-white/5',
          live: 'text-white border-red-500/30 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]',
          finished: 'text-white/60 border-white/20 bg-white/10',
          cancelled: 'text-red-400 border-red-400/20 bg-red-400/10',
        };

        const handleOpenPrediction = () => {
          openPrediction(
            {
              id: match.id,
              homeTeamName: match.homeTeamName,
              homeTeamShortName: match.homeTeamShortName,
              homeTeamLogoUrl: match.homeTeamLogo,
              awayTeamName: match.awayTeamName,
              awayTeamShortName: match.awayTeamShortName,
              awayTeamLogoUrl: match.awayTeamLogo,
              date: match.date,
            },
            match.userPrediction
              ? {
                  homeGoals: match.userPrediction.homeGoals,
                  awayGoals: match.userPrediction.awayGoals,
                }
              : undefined,
            mutate,
          );
        };

        return (
          <div className="space-y-6">
            <IceGlassCard className="overflow-hidden p-0" backdropBlur="lg">
              <div className="relative p-6 md:p-10">
                <div className="flex flex-col gap-8">
                  <div className="absolute top-4 right-4 md:top-6 md:right-6">
                    <div
                      className={cn(
                        'rounded-app flex items-center gap-2 border px-3 py-1 text-[0.6rem] font-black tracking-widest uppercase',
                        statusStyles[match.status as keyof typeof statusStyles] ||
                          statusStyles.scheduled,
                      )}
                    >
                      {match.status === 'live' && (
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                      )}
                      {t(match.status)}
                    </div>
                  </div>

                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-warning mb-1 text-[0.65rem] font-black tracking-[0.2em] uppercase">
                        {match.roundLabel || match.groupName}
                      </span>
                      <span className="text-xs font-bold text-white/80">
                        {matchDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} •{' '}
                        {matchDate.toLocaleTimeString(locale, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8 flex items-center justify-between gap-4">
                    <MatchTeamDisplay
                      name={match.homeTeamName}
                      shortName={match.homeTeamShortName}
                      logoUrl={match.homeTeamLogo}
                      size="large"
                    />
                    <div className="flex flex-1 flex-col items-center justify-center gap-2">
                      <div className="flex items-center gap-4 text-3xl font-black tracking-tighter italic md:text-5xl">
                        {match.status === 'scheduled' || match.status === 'cancelled' ? (
                          <span className="text-white/20">VS</span>
                        ) : (
                          <>
                            <span
                              className={cn(
                                match.status === 'live' ? 'text-warning' : 'text-white',
                              )}
                            >
                              {match.resultHomeScore}
                            </span>
                            <span
                              className={cn(
                                'text-white/40',
                                match.status === 'live' && 'text-warning/60 animate-pulse',
                              )}
                            >
                              :
                            </span>
                            <span
                              className={cn(
                                match.status === 'live' ? 'text-warning' : 'text-white',
                              )}
                            >
                              {match.resultAwayScore}
                            </span>
                          </>
                        )}
                      </div>
                      {match.status === 'live' &&
                        match.apiHockeyStatus &&
                        match.apiHockeyStatus !== 'NS' && (
                          <div className="rounded-app bg-warning/10 border-warning/20 flex items-center gap-1.5 border px-2 py-0.5 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                            <div className="bg-warning h-1 w-1 animate-pulse rounded-full" />
                            <span className="text-warning/90 hidden text-[0.6rem] font-bold tracking-widest uppercase sm:block">
                              {t(`api_status.${match.apiHockeyStatus}`)}
                            </span>
                            <span className="text-warning/90 text-[0.6rem] font-bold tracking-widest uppercase sm:hidden">
                              {t.raw(`api_status_short.${match.apiHockeyStatus}`)
                                ? t(`api_status_short.${match.apiHockeyStatus}`)
                                : t(`api_status.${match.apiHockeyStatus}`)}
                            </span>
                          </div>
                        )}
                      {match.status === 'finished' && match.resultEndingType !== 'regular' && (
                        <span className="rounded-app bg-white/10 px-2 py-0.5 text-[0.6rem] font-bold tracking-widest text-white/60 uppercase">
                          {match.resultEndingType === 'overtime'
                            ? t('overtime_short')
                            : t('shootout_short')}
                        </span>
                      )}
                    </div>
                    <MatchTeamDisplay
                      name={match.awayTeamName}
                      shortName={match.awayTeamShortName}
                      logoUrl={match.awayTeamLogo}
                      size="large"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10 px-6 pb-10 lg:grid-cols-2">
                <div className="space-y-6 sm:space-y-10">
                  {/* My Prediction */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                      {t('my_prediction')}
                    </h3>
                    <div className="rounded-app relative max-w-full overflow-hidden border border-white/10 bg-white/5 p-6 lg:max-w-md">
                      {match?.userPrediction ? (
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-warning text-[10px] font-black tracking-widest uppercase">
                              {t('dialog.title')}
                            </span>
                            <div className="flex items-center gap-4">
                              <div className="text-4xl font-black tracking-tighter text-white italic">
                                {match?.userPrediction.homeGoals} :{' '}
                                {match?.userPrediction.awayGoals}
                              </div>
                              {match.status === 'scheduled' && (
                                <Button
                                  onClick={handleOpenPrediction}
                                  color="warning"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg p-1.5 shadow-[0_4px_15px_rgba(234,179,8,0.2)] transition-all hover:scale-110"
                                >
                                  <PencilLine className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {match?.userPrediction.points !== null && (
                            <div
                              className={cn(
                                'flex min-w-[80px] flex-col items-center rounded-xl p-3',
                                match.status === 'live'
                                  ? 'border border-white/10 bg-white/5 opacity-60'
                                  : 'bg-warning/10 border-warning/20 border',
                              )}
                            >
                              <Trophy
                                className={cn(
                                  'mb-1 h-4 w-4',
                                  match.status === 'live' ? 'text-white/40' : 'text-warning',
                                )}
                              />
                              <span
                                className={cn(
                                  'text-lg leading-none font-black',
                                  match.status === 'live' ? 'text-white/60' : 'text-warning',
                                )}
                              >
                                +{match?.userPrediction.points}
                              </span>
                              <span
                                className={cn(
                                  'text-[8px] font-black tracking-widest uppercase',
                                  match.status === 'live'
                                    ? 'text-white/20'
                                    : 'text-warning opacity-60',
                                )}
                              >
                                {match.status === 'live' ? t('potential_points') : t('point_label')}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-4 text-center">
                          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
                            {t('no_prediction')}
                          </p>
                          {match.status === 'scheduled' && (
                            <Button
                              onClick={handleOpenPrediction}
                              color="warning"
                              className="rounded-app h-auto gap-2 px-8 py-3 text-[10px] font-black tracking-[0.1em] uppercase shadow-[0_4px_15px_rgba(234,179,8,0.2)] transition-all hover:scale-105"
                            >
                              {t('predict_button')}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                      {t('global_stats')}
                    </h3>

                    <div className="rounded-app max-w-full space-y-6 border border-white/10 bg-white/5 p-6 lg:max-w-md">
                      <MatchPredictionsBar
                        homePredictedCount={match.homePredictedCount}
                        awayPredictedCount={match.awayPredictedCount}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex max-w-xl items-center justify-between">
                    <h3 className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                      {t('detailed_stats')}
                    </h3>
                    <div className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/5 px-2 py-1">
                      <div className="h-3 w-3 text-white/40">
                        <Users className="h-full w-full" />
                      </div>
                      <span className="text-[10px] font-black text-white">
                        {t('predictions_count', { count: totalPredictions })}
                      </span>
                    </div>
                  </div>
                  <div className="flex max-w-xl flex-col gap-3">
                    <MatchPointsAnalysis
                      currentScore={{
                        homeScore: match.resultHomeScore,
                        awayScore: match.resultAwayScore,
                      }}
                      scores={scores}
                      totalPredictions={totalPredictions}
                      userPrediction={
                        match?.userPrediction
                          ? {
                              homeGoals: match.userPrediction.homeGoals,
                              awayGoals: match.userPrediction.awayGoals,
                            }
                          : null
                      }
                      isStarted={match.status === 'live' || match.status === 'finished'}
                    />
                  </div>
                </div>
              </div>
            </IceGlassCard>
          </div>
        );
      }}
    </DataLoader>
  );
};
