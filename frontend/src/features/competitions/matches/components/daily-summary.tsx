'use client';

import React, { useMemo } from 'react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DailySummaryProps {
  matches: any[];
  predictions: any[];
}

export function DailySummary({ matches, predictions }: DailySummaryProps) {
  const t = useTranslations('Dashboard.matches');

  const { dailyPoints, allMatchesFinished, hasMatches, predictedCount, totalCount } =
    useMemo(() => {
      let points = 0;
      let allFinished = true;
      let predictedCount = 0;
      const totalCount = matches.length;
      const hasMatches = totalCount > 0;

      matches.forEach((match) => {
        const prediction = predictions.find(
          (p) => (typeof p.match === 'string' ? p.match : p.match.id) === match.id,
        );

        if (prediction) {
          predictedCount++;
        }

        if (match.status === 'finished') {
          points += prediction?.points || 0;
        } else if (match.status !== 'cancelled') {
          allFinished = false;
        }
      });

      return {
        dailyPoints: points,
        allMatchesFinished: allFinished,
        hasMatches,
        predictedCount,
        totalCount,
      };
    }, [matches, predictions]);

  if (!hasMatches) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 mb-4 duration-500 sm:mb-6">
      <IceGlassCard className="p-2 sm:p-4" backdropBlur="md">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'rounded-app shrink-0 p-2.5 transition-colors duration-500',
                allMatchesFinished ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning',
              )}
            >
              {allMatchesFinished ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Clock className="h-6 w-6 animate-pulse" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div>
                <h3 className="mb-1.5 text-[0.65rem] leading-none font-black tracking-[0.2em] text-white/40 uppercase md:text-[0.7rem]">
                  {t('daily_summary_title')}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg leading-none font-black tracking-tight text-white md:text-2xl">
                    {t('daily_points', { count: dailyPoints })}
                  </span>
                  <div
                    className={cn(
                      'rounded-lg border px-2.5 py-1 text-[0.5rem] leading-none font-black tracking-widest uppercase md:text-[0.65rem]',
                      allMatchesFinished
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-warning/10 text-warning border-warning/20',
                    )}
                  >
                    {allMatchesFinished ? t('status_complete') : t('status_in_progress')}
                  </div>
                </div>
              </div>

              {/* Prediction Tracker - Mobile version inside the stack */}
              <div className="flex items-center gap-2 sm:hidden">
                <span
                  className={cn(
                    'text-sm font-black tracking-tighter',
                    predictedCount === totalCount ? 'text-success' : 'text-warning',
                  )}
                >
                  {predictedCount} / {totalCount}
                </span>
                <span className="text-[0.6rem] font-black tracking-widest text-white/50 uppercase">
                  {t('predicted_label')}
                </span>
              </div>
            </div>
          </div>

          {/* Prediction Tracker - Desktop version on the right */}
          <div className="hidden flex-col items-end sm:flex">
            <div className="mb- flex items-center gap-2">
              <span className="text-[0.65rem] font-black tracking-widest text-white/40 uppercase">
                {t('predicted_label')}
              </span>
              <span
                className={cn(
                  'text-sm font-black tracking-tighter',
                  predictedCount === totalCount ? 'text-success' : 'text-warning',
                )}
              >
                {predictedCount} / {totalCount}
              </span>
            </div>
          </div>
        </div>
      </IceGlassCard>
    </div>
  );
}
