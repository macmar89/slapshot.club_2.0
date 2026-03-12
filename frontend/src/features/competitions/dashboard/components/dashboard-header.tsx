'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { CompetitionPublicInfo } from '../../competitions.types';
import { Skeleton } from '@/components/ui/skeleton';
import { ReferralLink } from '@/components/common/referral-link';
import { DataLoader } from '@/components/common/data-loader';
import { ErrorView } from '@/components/common/error-view';
import { useAppParams } from '@/hooks/use-app-params';

export function DashboardHeader() {
  const { slug } = useAppParams(['slug']);

  const { data, isLoading, error } = useSWR<CompetitionPublicInfo>(
    API_ROUTES.COMPETITIONS.PUBLIC.INFO(slug),
  );

  return (
    <DataLoader
      data={data}
      isLoading={isLoading}
      error={error}
      skeleton={
        <Skeleton className="flex h-[160px] animate-pulse flex-col justify-center p-4 md:p-8 lg:col-span-8" />
      }
      notFound={<ErrorView />}
    >
      {(competition) => (
        <IceGlassCard className="flex min-h-[220px] flex-col justify-between p-4 md:p-8 lg:col-span-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl leading-none font-black tracking-tight text-white uppercase md:text-4xl">
              {competition.name}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/60">
              {competition.description}
            </p>
          </div>

          <div className="mt-6">
            <ReferralLink align="left" className="w-full md:w-1/2" />
          </div>
        </IceGlassCard>
      )}
    </DataLoader>
  );
}
