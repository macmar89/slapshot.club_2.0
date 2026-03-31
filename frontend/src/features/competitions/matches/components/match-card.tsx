'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { PencilLine, Trophy, Eye } from 'lucide-react';
import { Match } from '@/features/competitions/matches/matches.types';
import { usePredictionStore } from '@/features/competitions/predictions/store/use-prediction-store';
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from '@/i18n/routing';
import { MatchTeamDisplay } from '@/features/competitions/matches/components/match-team-display';
import { MatchPredictionsBar } from '@/features/competitions/matches/components/match-predictions-bar';
import { translateRound } from '@/features/competitions/matches/matches.utils';

interface MatchCardProps {
  match: Match;
  refresh: () => void;
}

export function MatchCard({ match, refresh }: MatchCardProps) {
  const t = useTranslations('Dashboard.matches');
  const tm = useTranslations('Matches.apiHockeyRound');
  const router = useRouter();
  const { slug } = useParams();

  const locale = useLocale();

  const user = useAuthStore((state) => state.user);
  const openPrediction = usePredictionStore((state) => state.openPrediction);

  const matchDate = new Date(match.date);
  const isStarted = new Date() >= matchDate || match.status !== 'scheduled';
  const isUrgent =
    !match.userPrediction &&
    !isStarted &&
    match.status === 'scheduled' &&
    matchDate.getTime() - new Date().getTime() < 60 * 60 * 1000;

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

  const activeSlug = (slug as string) || match.competition?.slug;
  const competitionName = match.competitionName || match.competition?.locales?.find((l) => l.locale === locale)?.name;

  return (
    <IceGlassCard
      backdropBlur="md"
      className={cn(
        'group relative flex h-full flex-col p-3 transition-all duration-300 md:p-6',
        'hover:border-warning/40',
        match.status === 'cancelled' && 'opacity-40 grayscale-[0.5]',
        isUrgent && 'border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] animate-pulse-subtle',
      )}
    >
      <div className="mb-6 flex flex-col gap-1">
        {competitionName && (
          <div className="mb-1 flex items-center gap-1.5 opacity-60">
            <Trophy className="text-warning h-3 w-3" />
            <span className="text-[0.65rem] font-black tracking-widest text-white uppercase italic">
              {competitionName}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-white">
            {matchDate.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} •{' '}
            {matchDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
          </p>
          <div
            className={cn(
              'rounded-app flex items-center gap-2 border px-3 py-1 text-[0.6rem] font-black tracking-widest uppercase',
              isUrgent
                ? 'border-primary/50 bg-primary/20 text-primary animate-pulse'
                : statusStyles[match.status as keyof typeof statusStyles] || statusStyles.scheduled,
            )}
          >
            {match.status === 'live' && (
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            )}
            {isUrgent ? (
              <>
                <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                {t('last_chance')}
              </>
            ) : (
              t(match.status)
            )}
          </div>
        </div>

        {match.roundLabel && (
          <p className="text-xs font-bold tracking-[0.2em] text-white/80 uppercase">
            {translateRound(match.roundLabel, tm)}
          </p>
        )}
      </div>

      <div className="flex-1 mb-8 flex items-center justify-between gap-4">
        <MatchTeamDisplay
          name={match.homeTeamName}
          shortName={match.homeTeamShortName}
          logoUrl={match.homeTeamLogo}
        />
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
        <MatchTeamDisplay
          name={match.awayTeamName}
          shortName={match.awayTeamShortName}
          logoUrl={match.awayTeamLogo}
        />
      </div>

      <MatchPredictionsBar
        homePredictedCount={match.homePredictedCount}
        awayPredictedCount={match.awayPredictedCount}
        className="space-y-6 border-t border-white/5 pt-6"
      />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        <div className="flex-1">
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
                  <Button
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      if (!user?.isVerified) {
                        router.push('/account');
                        return;
                      }

                      handleOpenPredictionModal();
                    }}
                  >
                    {user?.isVerified ? t('predict_button') : t('verify_to_predict')}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSlug && (
            <Link href={`/${activeSlug}/matches/${match.id}?tab=info`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                <Eye className="h-4 w-4 text-white" />
                {t('view_detail')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </IceGlassCard>
  );
}
