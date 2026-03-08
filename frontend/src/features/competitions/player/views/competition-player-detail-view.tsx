'use client';

import useSWR from 'swr';
import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { BackLink } from '@/components/common/back-link';
import { PlayerStatsGrid } from '@/features/player/components/player-stats-grid';
import { API_ROUTES } from '@/lib/api-routes';
import { useAppParams } from '@/hooks/use-app-params';
import { PlayerStats } from '@/features/player/player.types';

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

  // const { data: predictionsData, isLoading: predictionsLoading } = useSWR(
  //   `${API_ROUTES.COMPETITIONS.PLAYER.PREDICTIONS(slug, username)}?page=${page}&q=${q}`,
  // );

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
          {/* <PlayerPredictionHistory
              userId={user.id}
              currentUserId={currentUser?.id}
              currentUserPlan={
                (currentUser?.subscriptionPlan as 'free' | 'starter' | 'pro' | 'vip') || 'free'
              }
              profileOwnerPlan={
                (user.subscriptionPlan as 'free' | 'starter' | 'pro' | 'vip') || 'free'
              }
              competitionId={statsData.competitionId}
              initialData={predictionsData?.docs || []}
              initialSearch={q}
              initialHasMore={predictionsData?.hasNextPage}
              initialTotalCount={predictionsData?.totalDocs}
              initialTotalLeagueCount={predictionsData?.totalDocs}
              pageSize={predictionsData?.limit || 50}
              loading={predictionsLoading}
              onPageChange={handlePageChange}
              onSearchChange={handleSearchChange}
            /> */}
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
