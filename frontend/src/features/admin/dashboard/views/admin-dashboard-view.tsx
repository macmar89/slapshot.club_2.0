'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { DataLoader } from '@/components/common/data-loader';
import { UsersDashboardCard } from '../components/users-dashboard-card';
import { MatchesDashboardCard } from '../components/matches-dashboard-card';
import { type DashboardStats } from '../types';

export const AdminDashboardView = () => {
  const t = useTranslations('Admin.Dashboard');
  const { data, isLoading, error } = useSWR<DashboardStats>(API_ROUTES.ADMIN.DASHBOARD.STATS);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 duration-1000 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1 px-2 text-left">
        <h1 className="text-3xl font-black tracking-widest text-white/90 uppercase italic drop-shadow-md md:text-4xl">
          {t('title')}
        </h1>
        <div className="flex items-center gap-2">
          <div className="bg-primary h-1 w-12 rounded-full" />
          <span className="text-primary/60 text-[10px] font-black tracking-widest uppercase">
            {t('subtitle')}
          </span>
        </div>
      </div>

      <DataLoader
        data={data}
        isLoading={isLoading}
        error={error}
        notFound={
          <div className="flex flex-col items-center justify-center p-24 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Search className="h-8 w-8 text-white/20" />
            </div>
            <div className="text-xl font-black tracking-widest text-white/30 uppercase italic">
              {t('not_found')}
            </div>
          </div>
        }
        skeleton={
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-[600px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />
            <div className="h-[300px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          </div>
        }
      >
        {(data) => (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <UsersDashboardCard stats={data.users} />
            <MatchesDashboardCard stats={data.matches} />
          </div>
        )}
      </DataLoader>
    </div>
  );
};
