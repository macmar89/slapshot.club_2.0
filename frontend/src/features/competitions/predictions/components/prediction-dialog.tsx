'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Trophy } from 'lucide-react';
import { usePredictionStore } from '../store/use-prediction-store';
import { ScoreInput } from './score-input';
import { postCreatePrediction } from '../prediction.api';
import { mutate } from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { useParams } from 'next/navigation';

export function PredictionDialog() {
  const params = useParams();
  const slug = params.slug as string;

  const t = useTranslations('Dashboard.matches.dialog');
  const { isOpen, selectedMatch, closePrediction, initialPrediction } = usePredictionStore();

  const [homeGoals, setHomeGoals] = useState<number>(0);
  const [awayGoals, setAwayGoals] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && selectedMatch) {
      setHomeGoals(initialPrediction?.homeGoals ?? 0);
      setAwayGoals(initialPrediction?.awayGoals ?? 0);
    }
  }, [isOpen, selectedMatch, initialPrediction]);

  if (!selectedMatch) return null;

  const handleSave = async () => {
    if (!selectedMatch) return;

    setIsSubmitting(true);
    try {
      await postCreatePrediction({
        matchId: selectedMatch.id,
        homeGoals,
        awayGoals,
      });

      await mutate(API_ROUTES.COMPETITIONS.MATCHES.UPCOMING(slug));

      toast.success(t('prediction_saved_success'));
      closePrediction();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'UNEXPECTED_ERROR';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDraw = homeGoals === awayGoals;
  // const isLive = match.status === 'live';
  // const isFinished = match.status === 'finished';
  // const isLocked = isLive || isFinished;
  const isLocked = new Date(selectedMatch.date) <= new Date();
  // const isLocked = new Date() <= new Date();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePrediction()}>
      <DialogContent className="rounded-app w-[calc(100vw-16px)] overflow-hidden border-white/10 bg-[#0c0f14]/95 p-4 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl sm:max-w-[550px] md:p-8">
        {/* Abstract Background Decoration */}
        <div className="bg-warning/10 pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl" />
        <div className="bg-warning/5 pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full blur-3xl" />

        <DialogHeader className="mb-8">
          <DialogTitle className="text-center text-2xl leading-tight font-black tracking-widest uppercase">
            {t('title')} <Trophy className="text-warning ml-2 inline-block h-6 w-6" />
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-xs font-bold tracking-widest text-white/40 uppercase">
            {t('description')}
            <br />
            <span
              className={`transition-colors duration-300 ${isDraw ? 'text-red-500' : 'text-white/40'}`}
            >
              {t('no_draws')}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mb-8 flex flex-col">
          <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4">
            <ScoreInput
              value={homeGoals}
              onChange={setHomeGoals}
              team={{ name: selectedMatch.homeTeamName, logoUrl: selectedMatch.homeTeamLogoUrl }}
              disabled={isLocked}
            />

            <div className="items-center pt-8 text-4xl font-black text-white/20 italic">VS</div>

            <ScoreInput
              value={awayGoals}
              onChange={setAwayGoals}
              team={{ name: selectedMatch.awayTeamName, logoUrl: selectedMatch.awayTeamLogoUrl }}
              disabled={isLocked}
            />
          </div>

          {/* 
          {isDraw && !isLocked && (
            <div className="animate-pulse text-center text-[0.6rem] font-black tracking-widest text-red-500 uppercase">
              {t('no_draws')}
            </div>
          )}

          {isLive && (
            <div className="text-warning animate-pulse text-center text-[0.6rem] font-black tracking-widest uppercase">
              {t('match_live')}
            </div>
          )}

          {isFinished && (
            <div className="text-center text-[0.6rem] font-black tracking-widest text-white/40 uppercase">
              {t('match_finished')}
            </div>
          )} */}
        </div>

        <DialogFooter className="relative z-10 sm:justify-center">
          {!isLocked && (
            <Button
              onClick={handleSave}
              disabled={isSubmitting || isDraw}
              className="rounded-app w-full py-6 text-sm font-black tracking-[0.2em] uppercase shadow-[0_10px_30px_rgba(234,179,8,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {isSubmitting ? t('loading') : initialPrediction ? t('update') : t('submit')}
            </Button>
          )}
          {isLocked && (
            <Button
              onClick={closePrediction}
              variant="secondary"
              className="rounded-app w-full py-6 text-sm font-black tracking-[0.2em] uppercase transition-all hover:bg-white/5"
            >
              {t('close')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
