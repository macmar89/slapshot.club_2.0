'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerStatsGrid } from '@/features/player/components/player-stats-grid';
import { PlayerPredictionHistory } from '@/features/player/components/player-prediction-history';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { useTransition } from 'react';

import { useTranslations } from 'next-intl';
import { BackLink } from '@/components/common/back-link';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import { User } from '@/features/users/users.types';

const fetcher = (url: string) => api.get(url).then((res) => res.data.data);

interface PlayerDetailViewProps {
  username: string;
  competitionSlug: string;
  currentUser?: User | null;
}

export function CompetitionPlayerDetailView({
  username,
  competitionSlug,
  currentUser,
}: PlayerDetailViewProps) {
  const t = useTranslations('PlayerDetail');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeTab = searchParams.get('tab') || 'current_season';
  const page = Number(searchParams.get('page')) || 1;
  const q = searchParams.get('q') || '';

  const { data: statsData, isLoading: statsLoading } = useSWR(
    API_ROUTES.COMPETITIONS.PLAYER.STATS(competitionSlug, username),
    fetcher,
  );

  const { data: predictionsData, isLoading: predictionsLoading } = useSWR(
    `${API_ROUTES.COMPETITIONS.PLAYER.PREDICTIONS(competitionSlug, username)}?page=${page}&q=${q}`,
    fetcher,
  );

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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (newSearch: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', newSearch);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  const user = statsData?.user;
  const isLocked = statsData?.isLocked ?? false;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      <BackLink
        href={`/dashboard/${competitionSlug}/leaderboard`}
        label={t('back_to_leaderboard')}
      />

      {user && (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="mb-8 flex justify-start">
            <TabsList className="inline-flex flex-wrap gap-1 rounded-full">
              <TabsTrigger value="current_season">{t('current_season')}</TabsTrigger>
              <TabsTrigger value="predictions">{t('predictions')}</TabsTrigger>
              <TabsTrigger value="other_leagues">{t('other_leagues')}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="current_season" className="space-y-6">
            <PlayerStatsGrid stats={statsData} user={user} isLocked={isLocked} />
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
      )}
    </div>
  );
}
