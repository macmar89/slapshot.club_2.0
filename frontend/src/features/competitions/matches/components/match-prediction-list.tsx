'use client';

import { Search, Trophy, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Prediction } from '../../predictions/prediction.types';
import { PaginationInfo } from '@/lib/types';
import { SearchInput } from '@/components/ui/search-input';
import { useQueryFilters } from '@/hooks/use-query-filter';
import { Pagination } from '@/components/common/pagination';

interface MatchPredictionsListProps {
  predictions: Prediction[];
  pagination: PaginationInfo;
  isFinished: boolean;
}

export function MatchPredictionsList({
  predictions,
  pagination,
  isFinished,
}: MatchPredictionsListProps) {
  const t = useTranslations('Dashboard.matches');

  const { search, handleSearch, page, handlePageChange } = useQueryFilters();

  return (
    <div className="w-full">
      <IceGlassCard className="flex w-full flex-col overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-white/5 p-4 md:flex-row md:items-center md:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-warning h-4 w-1 rounded-full shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
            <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase">
              {t('player_tips')} <span className="text-warning ml-1">({pagination.total})</span>
            </h3>
          </div>

          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder={t('search_by_username')}
          />
        </div>

        {predictions.length > 0 ? (
          <div className="divide-y divide-white/5">
            {predictions.map((prediction) => {
              const username = prediction.username;
              const isExact = prediction.points === 5;

              return (
                <div
                  key={prediction.id}
                  className="group flex items-center justify-between p-4 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-row items-center gap-2">
                      <span className="group-hover:text-warning text-xs font-bold text-white transition-colors md:text-lg">
                        {username}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/60">
                          {new Date(prediction.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'text-xl font-black tracking-tighter italic md:text-2xl',
                          isExact ? 'text-green-400' : 'text-white',
                        )}
                      >
                        {prediction.homeGoals}:{prediction.awayGoals}
                      </span>
                    </div>

                    <div className="text-right">
                      {isFinished ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <>
                            <span
                              className={cn(
                                'text-sm font-black md:text-base',
                                (prediction.points || 0) > 0 ? 'text-warning' : 'text-white/20',
                              )}
                            >
                              +{prediction.points}
                            </span>
                            <Trophy
                              className={cn(
                                'h-3 w-3 md:h-4 md:w-4',
                                prediction.points > 0 ? 'text-warning' : 'text-white/20',
                              )}
                            />
                          </>
                        </div>
                      ) : (
                        <Timer className="animate-spin-slow h-5 w-5 text-white/40" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-white/20">
            <Search className="mb-2 h-8 w-8 opacity-50" />
            <p className="text-xs font-bold tracking-widest uppercase">
              {search ? t('no_search_results') : t('no_predictions_yet')}
            </p>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </IceGlassCard>
    </div>
  );
}
