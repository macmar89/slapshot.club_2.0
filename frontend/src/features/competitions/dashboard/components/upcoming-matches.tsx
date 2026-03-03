'use client';

import React, { useState } from 'react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Zap, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MatchLockedDialog } from '@/features/competitions/matches/components/MatchLockedDialog';
import { PredictionDialog } from '@/features/competitions/predictions/components/prediction-dialog';

interface UpcomingMatchesProps {
  upcomingMatches: any[];
  competition: any;
  allMatchesPredicted?: boolean;
  locale: string;
}

export function UpcomingMatches({
  upcomingMatches,
  competition,
  locale,
  allMatchesPredicted,
}: UpcomingMatchesProps) {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  const handlePredict = (match: any) => {
    const matchDate = new Date(match.date);
    const isStarted = new Date() >= matchDate || match.status !== 'scheduled';

    if (isStarted) {
      setIsLockedModalOpen(true);
      router.refresh();
      return;
    }

    setSelectedMatch(match);
  };

  const handleSuccess = () => {
    setSelectedMatch(null);
    router.refresh();
  };

  const visibleMatches = upcomingMatches.slice(0, 3);

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
              {upcomingMatches.length > 0
                ? t('matches_remaining_count', { count: upcomingMatches.length })
                : t('upcoming_matches_label', { count: 0 })}
            </h2>
          </div>

          {visibleMatches.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleMatches.map((match) => {
                const homeTeam = match.homeTeam as any;
                const awayTeam = match.awayTeam as any;

                return (
                  <div
                    key={match.id}
                    className="rounded-app group/match flex flex-col gap-6 border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative flex h-16 w-16 items-center justify-center">
                          {homeTeam.logo?.url ? (
                            <Image
                              src={homeTeam.logo.url}
                              alt={homeTeam.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div
                              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/10 shadow-lg"
                              style={{ backgroundColor: homeTeam.colors?.primary || '#333' }}
                            >
                              <span className="text-sm font-black text-white">
                                {homeTeam.shortName}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold tracking-wider text-white uppercase">
                          {homeTeam.shortName}
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="text-xl font-black text-white/40 italic">VS</div>
                        <div className="text-[12px] font-bold tracking-widest text-yellow-500 uppercase italic">
                          {new Date(match.date).toLocaleTimeString(locale, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="text-[10px] font-bold text-white/50 uppercase">
                          {new Date(match.date).toLocaleDateString(locale)}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="relative flex h-16 w-16 items-center justify-center">
                          {awayTeam.logo?.url ? (
                            <Image
                              src={awayTeam.logo.url}
                              alt={awayTeam.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div
                              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/10 shadow-lg"
                              style={{ backgroundColor: awayTeam.colors?.primary || '#333' }}
                            >
                              <span className="text-sm font-black text-white">
                                {awayTeam.shortName}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold tracking-wider text-white uppercase">
                          {awayTeam.shortName}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePredict(match)}
                      variant="solid"
                      color="warning"
                      className="w-full gap-2 py-4 text-[10px] font-black tracking-[0.1em] uppercase shadow-[0_4px_15px_rgba(234,179,8,0.2)] transition-all hover:scale-[1.02]"
                    >
                      {t('place_prediction')}
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : allMatchesPredicted ? (
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

      <PredictionDialog
        match={selectedMatch}
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onSuccess={handleSuccess}
      />

      <MatchLockedDialog isOpen={isLockedModalOpen} onClose={() => setIsLockedModalOpen(false)} />
    </>
  );
}
