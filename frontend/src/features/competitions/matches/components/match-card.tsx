'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { PencilLine, Trophy, Eye } from 'lucide-react';
import Image from 'next/image';
import { Match } from '../matches.types';
import { getLogoUrl } from '@/lib/logo';
import { usePredictionStore } from '../../predictions/store/use-prediction-store';

interface Team {
  name: string;
  shortName: string;
  logoUrl: string | null;
}

const renderTeam = (team: Team) => (
  <div className={cn('flex w-1/3 flex-col items-center gap-3')}>
    <div
      className={cn(
        'group relative flex h-10 w-20 items-center justify-center md:h-14 md:w-28',
        !team.logoUrl && 'rounded-app overflow-hidden border border-white/10 bg-white/5 p-2',
      )}
    >
      {!team.logoUrl && (
        <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" />
      )}
      {team.logoUrl && (
        <Image
          src={getLogoUrl(team.logoUrl)}
          alt={team.name}
          width={120}
          height={80}
          className="rounded-app relative z-10 h-full w-auto object-contain drop-shadow-2xl"
        />
      )}
    </div>
    <div className="text-center">
      <div className="line-clamp-1 hidden text-sm font-bold text-white md:block">{team.name}</div>
      <div className="line-clamp-1 text-[0.65rem] font-bold tracking-wider text-white uppercase md:hidden">
        {team.shortName}
      </div>
    </div>
  </div>
);

interface MatchCardProps {
  match: Match;
  refresh: () => void;
}

export function MatchCard({ match, refresh }: MatchCardProps) {
  const t = useTranslations('Dashboard.matches');
  const { slug } = useParams();

  const locale = useLocale();

  const openPrediction = usePredictionStore((state) => state.openPrediction);

  const matchDate = new Date(match.date);
  const isStarted = new Date() >= matchDate || match.status !== 'scheduled';

  const totalPredictions = match.homePredictedCount + match.awayPredictedCount;
  const homeWinPct =
    totalPredictions > 0 ? Math.round((match.homePredictedCount / totalPredictions) * 100) : 0;
  const awayWinPct = totalPredictions > 0 ? 100 - homeWinPct : 0;

  const statusStyles = {
    scheduled: 'text-white/40 border-white/10 bg-white/5',
    live: 'text-white border-red-500/30 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]',
    finished: 'text-white/60 border-white/20 bg-white/10',
    cancelled: 'text-red-400 border-red-400/20 bg-red-400/10',
  };

  const handleOpenPredictionModal = () => {
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
      refresh,
    );
  };

  return (
    <IceGlassCard
      backdropBlur="md"
      className={cn(
        'hover:border-warning/40 group relative p-3 transition-all duration-300 md:p-6',
        match.status === 'cancelled' && 'opacity-40 grayscale-[0.5]',
      )}
    >
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <div
          className={cn(
            'rounded-app flex items-center gap-2 border px-3 py-1 text-[0.6rem] font-black tracking-widest uppercase',
            statusStyles[match.status as keyof typeof statusStyles] || statusStyles.scheduled,
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
            {matchDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between gap-4">
        {renderTeam({
          name: match.homeTeamName,
          shortName: match.homeTeamShortName,
          logoUrl: match.homeTeamLogo,
        })}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4 text-3xl font-black tracking-tighter italic md:text-5xl">
            {match.status === 'scheduled' || match.status === 'cancelled' ? (
              <span className="text-white/20">VS</span>
            ) : (
              <>
                <span className={cn(match.status === 'live' ? 'text-warning' : 'text-white')}>
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
                <span className={cn(match.status === 'live' ? 'text-warning' : 'text-white')}>
                  {match.resultAwayScore}
                </span>
              </>
            )}
          </div>
          {match.status === 'live' && match.apiHockeyStatus && match.apiHockeyStatus !== 'NS' && (
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
              {match.resultEndingType === 'overtime' ? t('overtime_short') : t('shootout_short')}
            </span>
          )}
        </div>
        {renderTeam({
          name: match.awayTeamName,
          shortName: match.awayTeamShortName,
          logoUrl: match.awayTeamLogo,
        })}
      </div>

      <div className="space-y-6 border-t border-white/5 pt-6">
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

      <div className="mt-4 flex items-center justify-between gap-2">
        <div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              {match.userPrediction ? (
                <>
                  <div className="rounded-app flex h-11 items-center gap-4 border border-white/20 bg-white/10 px-4 shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all">
                    <div className="flex flex-col">
                      <span className="text-[0.5rem] font-black tracking-[0.2em] text-white/40 uppercase">
                        {t('my_prediction')}
                      </span>
                      <span className="text-sm leading-none font-black text-white italic">
                        {match.userPrediction.homeGoals} : {match.userPrediction.awayGoals}
                      </span>
                    </div>
                    {!isStarted && match.status === 'scheduled' && (
                      <Button
                        color="warning"
                        size="icon"
                        className="-mr-1 h-8 w-8 rounded-lg p-1.5"
                        onClick={handleOpenPredictionModal}
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {match.userPrediction.points !== null && (
                    <div className="rounded-app bg-warning/10 border-warning/20 flex h-11 items-center gap-2 border px-4 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
                      <Trophy className="text-warning h-4 w-4" />
                      <span className="text-warning text-sm font-black">
                        +{match.userPrediction.points}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                !isStarted &&
                match.status === 'scheduled' && (
                  <Button size="lg" onClick={handleOpenPredictionModal}>
                    {t('predict_button')}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/${slug}/matches/${match.id}`}>
            <Button variant="outline">
              <Eye className="h-4 w-4 text-white" />
              {t('view_detail')}
            </Button>
          </Link>
        </div>
      </div>
    </IceGlassCard>
  );
}
