'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Trophy, Calendar, Save, RefreshCw, Undo2 } from 'lucide-react';
import { ScoreInput } from '@/features/competitions/predictions/components/score-input';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface ScoreEditorProps {
  homeScore: string;
  awayScore: string;
  onHomeScoreChange: (val: string) => void;
  onAwayScoreChange: (val: string) => void;
  homeTeam: string;
  homeLogoUrl?: string | null;
  awayTeam: string;
  awayLogoUrl?: string | null;
  competitionName: string;
  matchDate: string;
  status: string;
  onSave: () => void;
  onMatchDateChange?: (date: string) => void;
  onRecalculate?: () => void;
  onUndoScoring?: () => void;
  isHomeDirty?: boolean;
  isAwayDirty?: boolean;
  isDateDirty?: boolean;
  isDirty?: boolean;
  isRanked?: boolean;
  rankedAt?: string | null;
}

export const ScoreEditor = ({
  homeScore,
  awayScore,
  onHomeScoreChange,
  onAwayScoreChange,
  homeTeam,
  homeLogoUrl,
  awayTeam,
  awayLogoUrl,
  competitionName,
  matchDate,
  onMatchDateChange,
  status,
  onSave,
  onRecalculate,
  onUndoScoring,
  isHomeDirty = false,
  isAwayDirty = false,
  isDateDirty = false,
  isDirty = false,
  isRanked = false,
  rankedAt,
}: ScoreEditorProps) => {
  const t = useTranslations('Admin.Matches.detail');

  const isLiveOrScheduled = status === 'live' || status === 'scheduled';
  const isFinished = status === 'finished';

  const homeScoreNum = parseInt(homeScore) || 0;
  const awayScoreNum = parseInt(awayScore) || 0;

  return (
    <IceGlassCard
      className={`p-4 transition-all duration-300 md:p-6 ${
        isDirty ? 'border-primary/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/10'
      }`}
    >
      <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="text-primary h-3 w-3" />
          <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
            {competitionName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className={cn("h-3 w-3", isDateDirty ? "text-primary" : "text-white/30")} />
          <input
            type="datetime-local"
            value={format(new Date(matchDate), "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => {
              if (onMatchDateChange) {
                const newDate = new Date(e.target.value);
                if (!isNaN(newDate.getTime())) {
                  onMatchDateChange(newDate.toISOString());
                }
              }
            }}
            className={cn(
              "bg-transparent border-none text-[10px] font-mono text-white/60 focus:ring-0 p-0 cursor-pointer transition-colors",
              isDateDirty && "text-primary font-bold"
            )}
          />
        </div>
      </div>

      <div className="flex flex-row items-start justify-center gap-2 py-4 md:gap-8 md:py-6">
        <ScoreInput
          value={homeScoreNum}
          onChange={(v) => onHomeScoreChange(v.toString())}
          team={{ name: homeTeam, logoUrl: homeLogoUrl || null }}
          isDirty={isHomeDirty}
        />

        <div className="flex h-32 items-center justify-center self-center pt-8">
          <span className="text-2xl font-black text-white/10 italic select-none md:text-4xl">
            :
          </span>
        </div>

        <ScoreInput
          value={awayScoreNum}
          onChange={(v) => onAwayScoreChange(v.toString())}
          team={{ name: awayTeam, logoUrl: awayLogoUrl || null }}
          isDirty={isAwayDirty}
        />
      </div>

      {/* Ranked Status */}
      <div className="mb-1 flex justify-center">
        {isRanked && rankedAt ? (
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">
              {t('already_ranked')} ({format(new Date(rankedAt), 'dd.MM.yyyy HH:mm')})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">
              {t('not_ranked_yet')}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-white/5 pt-4">
        <Button size="sm" onClick={onSave} disabled={!isDirty}>
          <Save className="h-4 w-4 transition-transform group-hover:rotate-12" />
          {t('save_changes')}
        </Button>

        {isLiveOrScheduled && onRecalculate && (
          <Button size="sm" variant="outline" onClick={onRecalculate}>
            <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
            {t('recalculate_points')}
          </Button>
        )}

        {isFinished && onUndoScoring && (
          <Button size="sm" variant="outline" onClick={onUndoScoring}>
            <Undo2 className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t('undo_scoring')}
          </Button>
        )}
      </div>
    </IceGlassCard>
  );
};
