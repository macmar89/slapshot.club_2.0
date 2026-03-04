import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { AlertCircle, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Match } from '../matches.types';
import { MatchPredictionTeaserSkeleton } from './match-prediction-teaser-skeleton';
import { MatchPredictionsList } from './match-prediction-list';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useParams } from 'next/navigation';

export const MatchPredictionTab = () => {
  const params = useParams();
  const id = params.id as string;

  const t = useTranslations('Dashboard.matches');
  const [search, setSearch] = useState('');

  // const { data } = useSWR(API_ROUTES.MATCHES.DETAIL.PREDICTIONS(id));

  // console.log(data);

  //   const isScheduled = match.status === 'scheduled';
  //   const teaserCount = Math.min(totalTips, 10) || 3;

  const isScheduled = true;
  const totalTips = 15;
  const teaserCount = 3;

  return (
    <div className="relative min-h-[400px] w-full">
      {isScheduled ? (
        <div className="w-full space-y-6">
          <IceGlassCard className="flex w-full flex-col overflow-hidden" backdropBlur="lg">
            {/* Header Content inside the card */}
            <div className="flex flex-col justify-between gap-4 border-b border-white/5 p-4 md:flex-row md:items-center md:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-warning h-4 w-1 rounded-full shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
                <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">
                  {t('player_tips')} <span className="text-warning ml-1">({totalTips})</span>
                </h3>
              </div>

              {/* Search Input (Teaser version) */}
              <div className="relative w-full md:w-64">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-3.5 w-3.5 text-white/40" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('search_by_username')}
                  className="rounded-app focus:ring-warning/50 focus:border-warning/50 block w-full border border-white/10 bg-white/5 py-2 pr-3 pl-9 leading-5 font-medium text-white placeholder-white/20 transition-colors focus:bg-white/10 focus:ring-1 focus:outline-none sm:text-xs"
                />
              </div>
            </div>

            <MatchPredictionTeaserSkeleton count={teaserCount} />

            {/* Overlay Message inside the card */}
            <div className="absolute inset-0 z-20 flex items-center justify-center">
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
      ) : (
        <div className="w-full transition-all duration-700">
          <MatchPredictionsList matchId={'some id'} />
        </div>
      )}
    </div>
  );
};
