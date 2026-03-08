'use client';

import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { BackLink } from '@/components/common/back-link';
import { PlayerStatsGrid } from '@/features/player/components/player-stats-grid';
import { API_ROUTES } from '@/lib/api-routes';
import { useAppParams } from '@/hooks/use-app-params';
import { PlayerStats } from '@/features/player/player.types';
import useSWRInfinite from 'swr/infinite';
import {
  PlayerPredictionHistory,
  type CompetitionTeam,
} from '@/features/player/components/player-prediction-history';
import { PlayerHeader } from '@/features/player/components/player-header';

const getKey =
  (slug: string, username: string, q: string) => (pageIndex: number, previousPageData: any) => {
    // SWR fetcher unwraps outer envelope; previousPageData = { data: [], nextCursor, hasNextPage, ... }
    if (previousPageData && !previousPageData.nextCursor) return null;

    const baseUrl = API_ROUTES.COMPETITIONS.PLAYER.PREDICTIONS(slug, username);
    const searchPart = q ? `&search=${encodeURIComponent(q)}` : '';

    if (pageIndex === 0) return `${baseUrl}?limit=6${searchPart}`;

    const cursor = encodeURIComponent(previousPageData.nextCursor);
    return `${baseUrl}?limit=6&cursorDate=${cursor}${searchPart}`;
  };

export const CompetitionPlayerDetailView = () => {
  const t = useTranslations('PlayerDetail');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { slug, username } = useAppParams(['slug', 'username']);

  const [isPending, startTransition] = useTransition();

  const activeTab = searchParams.get('tab') || 'current_season';

  const { data: playerStats, isLoading: playerStatsLoading } = useSWR<PlayerStats>(
    API_ROUTES.COMPETITIONS.PLAYER.STATS(slug, username),
  );

  const { data: teamsData } = useSWR<CompetitionTeam[]>(API_ROUTES.COMPETITIONS.TEAMS(slug));

  const [q, setQ] = useState(searchParams.get('q') || '');

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey(slug, username, q));

  // SWR fetcher unwraps outer envelope; page = { data: [], nextCursor, hasNextPage, totalPredictions, isLocked, meta }
  const predictions = data ? data.flatMap((page) => page.data ?? []) : [];
  const totalCount = data?.[0]?.totalPredictions ?? 0;
  const hasNextPage = data ? !!data[data.length - 1]?.nextCursor : false;

  const isLoadingMore = isValidating || (size > 0 && data && typeof data[size - 1] === 'undefined');

  const handleSearchChange = (value: string) => {
    setQ(value);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleTabChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('tab', value);

      if (value !== 'predictions') {
        params.delete('page');
        params.delete('q');
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  if (playerStatsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      <BackLink href={`/${slug}/leaderboard`} label={t('back_to_leaderboard')} />

      {playerStats && <PlayerHeader playerStats={playerStats} />}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="mb-8 flex justify-start">
          <TabsList>
            <TabsTrigger value="current_season">{t('current_season')}</TabsTrigger>
            <TabsTrigger value="predictions">{t('predictions')}</TabsTrigger>
            <TabsTrigger value="other_leagues">{t('other_leagues')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current_season" className="space-y-6">
          {playerStats ? <PlayerStatsGrid playerStats={playerStats} /> : null}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <PlayerPredictionHistory
            predictions={predictions}
            teams={teamsData ?? []}
            isLocked={data?.[0]?.isLocked ?? false}
            playerSubscriptionPlan={data?.[0]?.meta?.playerSubscriptionPlan}
            totalCount={totalCount}
            hasMore={hasNextPage}
            search={q}
            loading={isValidating && !data}
            loadingMore={isLoadingMore}
            onPageChange={() => setSize((s) => s + 1)}
            onSearchChange={handleSearchChange}
          />
        </TabsContent>

        <TabsContent value="other_leagues" className="space-y-6">
          <IceGlassCard className="p-8 text-center text-white/40 italic">
            Funkcia iné ligy nie je momentálne implementovaná pre tento view.
          </IceGlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
