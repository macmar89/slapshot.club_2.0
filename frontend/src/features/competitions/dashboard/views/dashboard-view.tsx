'use client';

import { DashboardHeader } from '@/features/competitions/dashboard/components/dashboard-header';
import { UserHeroCard } from '@/features/competitions/dashboard/components/user-hero-card';
import { UpcomingMatches } from '@/features/competitions/matches/components/upcoming-matches';

export function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <DashboardHeader />
        <UserHeroCard />
      </div>

      <UpcomingMatches />
    </div>
  );
}
