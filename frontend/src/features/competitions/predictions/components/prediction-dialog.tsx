'use client';

import React, { useState, startTransition, useEffect } from 'react';
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
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Trophy, Plus, Minus } from 'lucide-react';

interface PredictionDialogProps {
  match: any | null;
  existingPrediction?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onOptimisticSave?: (prediction: any) => void;
}

export function PredictionDialog({
  match,
  existingPrediction,
  isOpen,
  onClose,
  onSuccess,
  onOptimisticSave,
}: PredictionDialogProps) {
  const t = useTranslations('Dashboard.matches.dialog');
  const [homeGoals, setHomeGoals] = useState<number>(existingPrediction?.homeGoals ?? 0);
  const [awayGoals, setAwayGoals] = useState<number>(existingPrediction?.awayGoals ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHomeGoals(existingPrediction?.homeGoals ?? 0);
      setAwayGoals(existingPrediction?.awayGoals ?? 0);
    }
  }, [isOpen, existingPrediction]);

  if (!match) return null;

  const homeTeam = match.homeTeam as any;
  const awayTeam = match.awayTeam as any;

  const isDraw = homeGoals === awayGoals;
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isLocked = isLive || isFinished;

  const handleSave = async () => {
    if (isDraw || isLocked) return;

    setIsSubmitting(true);

    const optimisticPrediction = {
      ...existingPrediction,
      id: existingPrediction?.id || `temp-${Date.now()}`,
      match: match.id,
      homeGoals,
      awayGoals,
      updatedAt: new Date().toISOString(),
      createdAt: existingPrediction?.createdAt || new Date().toISOString(),
    } as any;

    startTransition(() => {
      onOptimisticSave?.(optimisticPrediction);
      onClose();
    });

    try {
      //  @TODO save prediction
      //   const result = await savePredictionAction({
      //     matchId: match.id,
      //     homeGoals,
      //     awayGoals,
      //   })
      //   if (result?.success) {
      //     onSuccess()
      //   } else {
      //     // Rollback optimistic save if needed (Success handles it via onSuccess -> revalidate)
      //     console.error('Failed to save prediction:', result?.error)
      //     toast.error(result?.error || 'Chyba pri ukladaní tipu. Skús to znova.')
      //     // V prípade chyby musíme dialog nechať otvorený alebo ho znova zobraziť
      //     // ale pre jednoduchosť teraz aspoň ukážeme toast.
      //   }
    } catch (error) {
      console.error('Failed to save prediction (unexpected):', error);
      toast.error('Chyba pri komunikácii so serverom. Skúste to prosím neskôr.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLogo = (team: Team) => (
    <div className="flex h-10 w-20 items-center justify-center md:h-12 md:w-24">
      {team.logo && typeof team.logo === 'object' ? (
        <Image
          src={(team.logo as Media).url || ''}
          alt={team.name}
          width={80}
          height={60}
          className="rounded-app h-full w-auto object-contain"
        />
      ) : (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/10 shadow-lg md:h-12 md:w-12"
          style={{ backgroundColor: team.colors.primary }}
        >
          <span className="text-[0.6rem] font-black text-white">{team.shortName}</span>
        </div>
      )}
    </div>
  );

  const ScoreInput = ({
    value,
    onChange,
    team,
    disabled = false,
  }: {
    value: number;
    onChange: (v: number) => void;
    team: Team;
    disabled?: boolean;
  }) => (
    <div className="flex flex-1 flex-col items-center gap-4">
      {renderLogo(team)}
      <span className="text-[0.6rem] font-black tracking-widest text-white/40 uppercase">
        {team.name}
      </span>
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => !disabled && onChange(Math.max(0, value - 1))}
          disabled={disabled}
          className="rounded-full border-white/20 bg-white/10 text-white shadow-sm hover:bg-white/20 disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="rounded-app flex h-14 w-12 items-center justify-center border border-white/20 bg-white/10 text-2xl font-black tracking-tighter md:h-16 md:w-14 md:text-3xl">
          {value}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => !disabled && onChange(value + 1)}
          disabled={disabled}
          className="rounded-full border-white/20 bg-white/10 text-white shadow-sm hover:bg-white/20 disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-app w-[calc(100vw-16px)] overflow-hidden border-white/10 bg-[#0c0f14]/95 p-4 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl sm:max-w-[425px] md:p-8">
        {/* Abstract Background Decoration */}
        <div className="bg-warning/10 pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl" />
        <div className="bg-warning/5 pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full blur-3xl" />

        <DialogHeader className="mb-8">
          <DialogTitle className="text-center text-2xl leading-tight font-black tracking-widest uppercase">
            {t('title')} <Trophy className="text-warning ml-2 inline-block h-6 w-6" />
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-xs font-bold tracking-widest text-white/40 uppercase">
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-8 flex flex-col gap-8">
          <div className="relative z-10 flex items-center gap-4">
            <ScoreInput
              value={homeGoals}
              onChange={setHomeGoals}
              team={homeTeam}
              disabled={isLocked}
            />

            <div className="items-center pt-8 text-4xl font-black text-white/20 italic">:</div>

            <ScoreInput
              value={awayGoals}
              onChange={setAwayGoals}
              team={awayTeam}
              disabled={isLocked}
            />
          </div>

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
          )}
        </div>

        <DialogFooter className="relative z-10 sm:justify-center">
          {!isLocked && (
            <Button
              onClick={handleSave}
              disabled={isSubmitting || isDraw}
              variant="solid"
              color="gold"
              className="rounded-app w-full py-6 text-sm font-black tracking-[0.2em] uppercase shadow-[0_10px_30px_rgba(234,179,8,0.2)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {isSubmitting ? t('loading') : existingPrediction ? t('update') : t('submit')}
            </Button>
          )}
          {isLocked && (
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-app w-full border-white/10 py-6 text-sm font-black tracking-[0.2em] uppercase transition-all hover:bg-white/5"
            >
              {t('close')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
