'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Lock, Eye, Trophy, X, Loader2, Crown } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { PlanBadge } from '@/components/common/plan-badge';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getLogoUrl } from '@/lib/utils/logo';
import { Button } from '@/components/ui/button';

export interface PredictionHistoryItem {
  id: string;
  matchId: string;
  matchStatus: string;
  predictionStatus: string;
  points: number | null;
  homeTeamName: string;
  homeTeamShortName: string;
  homeTeamLogoUrl: string;
  resultHomeScore: number | null;
  predictionHomeGoals: number | null;
  awayTeamName: string;
  awayTeamShortName: string;
  awayTeamLogoUrl: string;
  resultAwayScore: number | null;
  predictionAwayGoals: number | null;
  createdAt: string;
}

export interface CompetitionTeam {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string | null;
}

interface PlayerPredictionHistoryProps {
  predictions: PredictionHistoryItem[];
  teams: CompetitionTeam[];
  isLocked: boolean;
  playerSubscriptionPlan?: 'free' | 'starter' | 'pro' | 'vip';
  totalCount: number;
  hasMore: boolean;
  search: string;
  loading?: boolean;
  loadingMore?: boolean;
  onPageChange?: () => void;
  onSearchChange?: (search: string) => void;
  className?: string;
}

export function PlayerPredictionHistory({
  predictions,
  teams,
  isLocked,
  playerSubscriptionPlan,
  totalCount,
  hasMore,
  search: externalSearch = '',
  loading,
  loadingMore,
  onPageChange,
  onSearchChange,
  className,
}: PlayerPredictionHistoryProps) {
  const t = useTranslations('PlayerDetail');
  const { slug } = useParams();

  const [inputValue, setInputValue] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<CompetitionTeam | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [prevExternalSearch, setPrevExternalSearch] = useState(externalSearch);

  // Sync external clear (e.g. when parent resets search) — done during render
  // to avoid a cascading setState-in-effect render cycle.
  if (prevExternalSearch !== externalSearch) {
    setPrevExternalSearch(externalSearch);
    if (!externalSearch) {
      setInputValue('');
      setSelectedTeam(null);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredTeams = useMemo(() => {
    const term = inputValue.trim().toLowerCase();
    if (!term || teams.length === 0) return [];
    return teams
      .filter(
        (team) =>
          team.name.toLowerCase().includes(term) || team.shortName.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [inputValue, teams]);

  const handleSelectTeam = (team: CompetitionTeam) => {
    setSelectedTeam(team);
    setInputValue('');
    setShowDropdown(false);
    onSearchChange?.(team.name);
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedTeam(null);
    setShowDropdown(false);
    onSearchChange?.('');
  };
  console.log(isLocked);

  if (playerSubscriptionPlan === 'vip') {
    return (
      <IceGlassCard className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-warning/10 border-warning/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
          <Crown className="text-warning" size={32} />
        </div>
        <h4 className="mb-2 text-xl font-black text-white uppercase italic">
          {t('vip_privacy_title')}
        </h4>
        <p className="max-w-xs text-sm font-bold tracking-tight text-white/60 uppercase italic">
          {t('vip_privacy_desc')}
        </p>
      </IceGlassCard>
    );
  }

  if (isLocked) {
    console.log('som tuuu???');
    return (
      <IceGlassCard className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-primary/10 border-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
          <Lock className="text-primary" size={32} />
        </div>
        <h4 className="mb-2 text-xl font-black text-white uppercase italic">
          {t('historyLocked')}
        </h4>
        <p className="mb-5 max-w-xs text-sm font-bold tracking-tight text-white/60 uppercase italic">
          {t('historyLockedDesc')}
        </p>
        <Link href={`/${slug}/account`}>
          <Button size="sm" className="font-black tracking-wider uppercase italic">
            {t('becomeMember')}
          </Button>
        </Link>
      </IceGlassCard>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Autocomplete Search Bar */}
      <div className="relative lg:w-1/3" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-white/30" size={16} />

          {/* Selected team pill */}
          {selectedTeam ? (
            <div className="flex min-h-[42px] w-full items-center gap-2 rounded-lg border border-[#5d626d]/30 bg-black/40 py-2 pr-10 pl-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-lg">
              {selectedTeam.logoUrl && (
                <Image
                  src={getLogoUrl(selectedTeam.logoUrl)}
                  alt={selectedTeam.name}
                  width={20}
                  height={14}
                  className="h-4 w-auto flex-shrink-0 object-contain"
                />
              )}
              <span className="truncate text-sm font-bold text-white">{selectedTeam.name}</span>
              <span className="flex-shrink-0 text-[10px] font-black tracking-wider text-white/40 uppercase">
                {selectedTeam.shortName}
              </span>
            </div>
          ) : (
            <input
              type="text"
              placeholder={t('searchTeam')}
              className={cn(
                'w-full rounded-lg border border-[#5d626d]/30 bg-black/40 py-2.5 pr-12 pl-10 text-sm text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-lg transition-all placeholder:text-white/40 focus:border-white/30 focus:ring-1 focus:ring-white/20 focus:outline-none',
                isLocked && 'cursor-not-allowed',
              )}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => inputValue && setShowDropdown(true)}
              disabled={isLocked}
            />
          )}

          {/* Clear button */}
          {(inputValue || selectedTeam) && !isLocked && (
            <button
              onClick={handleClear}
              className="group absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/60 text-white/40 transition-all hover:bg-white/20 hover:text-white"
              title={t('clear_filter')}
            >
              <X size={14} className="text-white transition-transform group-hover:scale-110" />
            </button>
          )}

          {isLocked && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <PlanBadge />
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && filteredTeams.length > 0 && !isLocked && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]/95 shadow-2xl backdrop-blur-2xl duration-200">
            <div className="space-y-0.5 p-1.5">
              {filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam(team)}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/10"
                >
                  <div className="flex h-6 w-8 flex-shrink-0 items-center justify-center">
                    {team.logoUrl ? (
                      <Image
                        src={getLogoUrl(team.logoUrl)}
                        alt={team.name}
                        width={32}
                        height={24}
                        className="h-full w-auto object-contain transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-6 w-8 items-center justify-center rounded bg-white/10">
                        <span className="text-[9px] font-black text-white/40">
                          {team.shortName}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm leading-tight font-bold text-white">
                      {team.name}
                    </span>
                    <span className="text-[10px] font-black tracking-tighter text-white/40 uppercase">
                      {team.shortName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Locked state banner */}
      {isLocked && (
        <IceGlassCard className="relative mb-6 flex flex-col items-center justify-center overflow-hidden p-10 text-center">
          <div className="relative z-10">
            <div className="bg-warning/10 border-warning/20 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border">
              <Lock className="text-warning" size={32} />
            </div>
            <h4 className="mb-3 text-2xl font-black tracking-tight text-white uppercase italic">
              {t('history_locked_title')}
            </h4>
            <p className="mb-2 text-sm font-black tracking-tight text-white/60 uppercase italic">
              {t('history_locked_desc')} <span className="text-warning">PRO</span>.
            </p>
          </div>
        </IceGlassCard>
      )}

      {/* Prediction Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLocked ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="group pointer-events-none relative h-[160px] overflow-hidden rounded-2xl border border-white/5 bg-white/5 opacity-40 blur-[10px] filter"
            />
          ))
        ) : (
          <>
            {predictions.length === 0 && !loading ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-sm font-black tracking-widest text-white/40 uppercase italic">
                  {t('no_predictions_found')}
                </p>
              </div>
            ) : (
              predictions.map((p) => (
                <IceGlassCard key={p.id} className="group flex h-full flex-col justify-between p-4">
                  <div className="space-y-4">
                    {/* Teams & Score */}
                    <div className="flex items-center justify-between gap-2">
                      {/* Home team */}
                      <div className="flex w-2/5 flex-col items-center gap-1">
                        <div className="relative flex h-8 w-12 items-center justify-center">
                          {p.homeTeamLogoUrl ? (
                            <Image
                              src={getLogoUrl(p.homeTeamLogoUrl)}
                              alt={p.homeTeamName}
                              width={48}
                              height={32}
                              className="h-full w-auto object-contain drop-shadow-md"
                            />
                          ) : (
                            <span className="text-[10px] font-black text-white/20">
                              {p.homeTeamShortName}
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-1 text-[10px] font-bold tracking-tight text-white uppercase">
                          {p.homeTeamShortName}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="flex flex-1 flex-col items-center justify-center">
                        <span className="text-xl font-black tracking-tighter text-white italic">
                          {p.resultHomeScore ?? '-'} : {p.resultAwayScore ?? '-'}
                        </span>
                      </div>

                      {/* Away team */}
                      <div className="flex w-2/5 flex-col items-center gap-1">
                        <div className="relative flex h-8 w-12 items-center justify-center">
                          {p.awayTeamLogoUrl ? (
                            <Image
                              src={getLogoUrl(p.awayTeamLogoUrl)}
                              alt={p.awayTeamName}
                              width={48}
                              height={32}
                              className="h-full w-auto object-contain drop-shadow-md"
                            />
                          ) : (
                            <span className="text-[10px] font-black text-white/20">
                              {p.awayTeamShortName}
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-1 text-[10px] font-bold tracking-tight text-white uppercase">
                          {p.awayTeamShortName}
                        </span>
                      </div>
                    </div>

                    {/* My prediction */}
                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/10 p-2.5">
                      <div className="flex flex-col">
                        <span className="mb-1 text-[8px] leading-none font-black tracking-widest text-white/40 uppercase">
                          {t('prediction')}
                        </span>
                        <span className="text-sm font-black text-white italic">
                          {p.predictionHomeGoals ?? '-'} : {p.predictionAwayGoals ?? '-'}
                        </span>
                      </div>
                      {p.points !== null && p.points !== undefined && (
                        <div className="bg-warning/10 border-warning/20 flex items-center gap-1.5 rounded-lg border px-2 py-1">
                          <Trophy size={10} className="text-warning" />
                          <span className="text-warning text-xs font-black">+{p.points}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end">
                    <Link href={`/${slug}/matches/${p.matchId}`}>
                      <Button
                        size="sm"
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-black tracking-wider text-white/60 uppercase italic transition-all hover:bg-white/10 hover:text-white"
                      >
                        <Eye size={12} />
                        {t('match_detail')}
                      </Button>
                    </Link>
                  </div>
                </IceGlassCard>
              ))
            )}

            {hasMore && (
              <div className="col-span-full flex flex-col items-center gap-4 pt-8">
                <button
                  onClick={onPageChange}
                  className="group flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-4 text-xs font-black tracking-widest text-white/80 uppercase italic shadow-xl backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-white/60" />
                      <span className="text-white/60">{t('load_more')}</span>
                    </div>
                  ) : (
                    <>
                      <span>{t('load_more')}</span>
                      {totalCount > 0 && (
                        <span className="text-[10px] font-medium opacity-60">
                          ({predictions.length} / {totalCount})
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
