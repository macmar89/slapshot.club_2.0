'use client';

import { useState, useEffect, useMemo, useRef } from 'react';

import { Search, Lock, Eye, Trophy, X } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { PlanBadge } from '@/components/common/plan-badge';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useParams, useSearchParams } from 'next/navigation';

import Image from 'next/image';

interface PlayerPredictionHistoryProps {
  userId: string;
  currentUserId?: string;
  currentUserPlan: 'free' | 'starter' | 'pro' | 'vip';
  profileOwnerPlan: 'free' | 'starter' | 'pro' | 'vip';
  competitionId: string;
  initialData?: any[];
  initialSearch?: string;
  initialHasMore?: boolean;
  initialTotalCount?: number;
  initialTotalLeagueCount?: number;
  pageSize?: number;
  className?: string;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSearchChange?: (search: string) => void;
}

export function PlayerPredictionHistory({
  userId,
  currentUserId,
  currentUserPlan,
  profileOwnerPlan,
  competitionId,
  initialData = [],
  initialSearch = '',
  initialHasMore = false,
  initialTotalCount,
  onPageChange,
  onSearchChange,
  loading,
  className,
}: PlayerPredictionHistoryProps) {
  const t = useTranslations('PlayerDetail');
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);

  // Autocomplete State
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMe = userId === currentUserId;
  const isFreeViewer = currentUserPlan === 'free' && !isMe;
  const isVipOwner = profileOwnerPlan === 'vip' && !isMe;

  const predictions = initialData;
  const hasMore = initialHasMore;
  const totalCount = initialTotalCount ?? null;

  useEffect(() => {
    if (onSearchChange && debouncedSearch !== initialSearch) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, initialSearch, onSearchChange]);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teams = await getCompetitionTeams(competitionId);
        setAllTeams(teams);
      } catch (err) {
        console.error('Failed to load teams', err);
      }
    };
    loadTeams();
  }, [competitionId]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple filtering for suggestions
  const filteredTeams = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term || allTeams.length === 0) return [];

    return allTeams
      .filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.shortName.toLowerCase().includes(term) ||
          (t.country && t.country.toLowerCase().includes(term)),
      )
      .slice(0, 8); // Limit suggestions
  }, [search, allTeams]);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setSearch(''); // Clear search text when a team is selected or keep it?
    // User often wants to see what they selected.
    // If we clear search, we should probably show the selected team in the UI.
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearch('');
    setSelectedTeam(null);
  };

  if (isVipOwner) {
    return (
      <IceGlassCard className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-warning/10 border-warning/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
          <Lock className="text-warning" size={32} />
        </div>
        <h4 className="mb-2 text-xl font-black text-white uppercase italic">
          {t('vip_privacy_title', { fallback: 'Súkromný VIP Profil' })}
        </h4>
        <p className="max-w-xs text-sm font-bold tracking-tight text-white/60 uppercase italic">
          {t('vip_privacy_desc', { fallback: 'Tento užívateľ má skrytú históriu tipov.' })}
        </p>
      </IceGlassCard>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search Bar & Autocomplete */}
      <div className="relative lg:w-1/3" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            placeholder={
              selectedTeam
                ? selectedTeam.name
                : t('search_matches', { fallback: 'Hľadať zápas...' })
            }
            className={cn(
              'w-full rounded-lg border border-white/10 bg-white/10 py-2.5 pr-12 pl-10 text-sm text-white backdrop-blur-xl transition-all placeholder:text-white/40 focus:ring-1 focus:ring-white/20 focus:outline-none',
              isFreeViewer && 'cursor-not-allowed',
              selectedTeam && 'border-warning/30 bg-warning/5 ring-warning/20 ring-1',
            )}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            disabled={isFreeViewer}
          />

          {(search || selectedTeam) && !isFreeViewer && (
            <button
              onClick={handleClear}
              className="group absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/40 transition-all hover:bg-white/20 hover:text-white"
              title={t('clear_filter', { fallback: 'Zrušiť filter' })}
            >
              <X size={14} className="transition-transform group-hover:scale-110" />
            </button>
          )}

          {isFreeViewer && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              <PlanBadge plan="pro" />
            </div>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredTeams.length > 0 && !isFreeViewer && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]/90 shadow-2xl backdrop-blur-2xl duration-200">
            <div className="space-y-0.5 p-1.5">
              {filteredTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleSelectTeam(team)}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/10"
                >
                  <div className="flex h-6 w-8 items-center justify-center">
                    {team.logo && (
                      <Image
                        src={(team.logo as Media).url || ''}
                        alt={team.name}
                        width={24}
                        height={16}
                        className="h-full w-auto object-contain transition-transform group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm leading-tight font-bold text-white">{team.name}</span>
                    <span className="text-[10px] font-bold tracking-tighter text-white/40 uppercase">
                      {team.shortName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isFreeViewer && (
        <IceGlassCard className="relative mb-6 flex flex-col items-center justify-center overflow-hidden p-10 text-center">
          <div className="relative z-10">
            <div className="bg-warning/10 border-warning/20 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border">
              <Lock className="text-warning" size={32} />
            </div>
            <h4 className="mb-3 text-2xl font-black tracking-tight text-white uppercase italic">
              {t('history_locked_title', { fallback: 'História je prémiová funkcia' })}
            </h4>
            <p className="mb-2 text-sm font-black tracking-tight text-white/60 uppercase italic">
              {t('history_locked_desc', {
                fallback: 'Pre prístup k celej histórii tipov si aktivuj',
              })}{' '}
              <span className="text-warning">PRO</span>.
            </p>
            {/* 
            <button className="mt-6 px-8 py-3 bg-warning text-black font-black uppercase italic text-sm rounded-lg hover:bg-warning/90 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              {t('get_pro_now', { fallback: 'Aktivovať PRO' })}
            </button>
            */}
          </div>
        </IceGlassCard>
      )}

      {/* Prediction Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isFreeViewer ? (
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
                  {t('no_predictions_found', { fallback: 'Žiadne tipy nenájdené' })}
                </p>
              </div>
            ) : (
              predictions.map((p) => {
                const match = p.match as Match;
                const homeTeam = match.homeTeam as Team;
                const awayTeam = match.awayTeam as Team;

                return (
                  <IceGlassCard
                    key={p.id}
                    className="group flex h-full flex-col justify-between p-4"
                  >
                    <div className="space-y-4">
                      {/* Teams & Logo */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex w-2/5 flex-col items-center gap-1">
                          <div className="relative flex h-8 w-12 items-center justify-center">
                            {homeTeam.logo ? (
                              <Image
                                src={(homeTeam.logo as Media).url || ''}
                                alt={homeTeam.name}
                                width={48}
                                height={32}
                                className="h-full w-auto object-contain drop-shadow-md"
                              />
                            ) : (
                              <span className="text-[10px] font-black text-white/20">
                                {homeTeam.shortName}
                              </span>
                            )}
                          </div>
                          <span className="line-clamp-1 text-[10px] font-bold tracking-tight text-white uppercase">
                            {homeTeam.shortName}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col items-center justify-center">
                          <span className="text-xl font-black tracking-tighter text-white italic">
                            {match.result?.homeScore ?? 0} : {match.result?.awayScore ?? 0}
                          </span>
                        </div>

                        <div className="flex w-2/5 flex-col items-center gap-1">
                          <div className="relative flex h-8 w-12 items-center justify-center">
                            {awayTeam.logo ? (
                              <Image
                                src={(awayTeam.logo as Media).url || ''}
                                alt={awayTeam.name}
                                width={48}
                                height={32}
                                className="h-full w-auto object-contain drop-shadow-md"
                              />
                            ) : (
                              <span className="text-[10px] font-black text-white/20">
                                {awayTeam.shortName}
                              </span>
                            )}
                          </div>
                          <span className="line-clamp-1 text-[10px] font-bold tracking-tight text-white uppercase">
                            {awayTeam.shortName}
                          </span>
                        </div>
                      </div>

                      {/* User Prediction */}
                      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/10 p-2.5">
                        <div className="flex flex-col">
                          <span className="mb-1 text-[8px] leading-none font-black tracking-widest text-white/40 uppercase">
                            {t('my_tip', { fallback: 'Môj Tip' })}
                          </span>
                          <span className="text-sm font-black text-white italic">
                            {p.homeGoals} : {p.awayGoals}
                          </span>
                        </div>
                        {p.points !== null && (
                          <div className="bg-warning/10 border-warning/20 flex items-center gap-1.5 rounded-lg border px-2 py-1">
                            <Trophy size={10} className="text-warning" />
                            <span className="text-warning text-xs font-black">+{p.points}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                      <Link href={`/dashboard/${slug}/matches/${match.id}`}>
                        <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-black tracking-wider text-white/60 uppercase italic transition-all hover:bg-white/10 hover:text-white">
                          <Eye size={12} />
                          {t('match_detail', { fallback: 'Detail Zápasu' })}
                        </button>
                      </Link>
                    </div>
                  </IceGlassCard>
                );
              })
            )}

            {hasMore && (
              <div className="col-span-full flex flex-col items-center gap-4 pt-8">
                <button
                  onClick={() => onPageChange?.(initialPage + 1)}
                  className="group flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-4 text-xs font-black tracking-widest text-white/80 uppercase italic shadow-xl backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
                  ) : (
                    <>
                      <span>{t('load_more', { fallback: 'Načítať viac' })}</span>
                      {totalCount !== null && (
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
