'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DashboardHeader } from '@/features/competitions/dashboard/components/dashboard-header';
import { UserHeroCard } from '@/features/competitions/dashboard/components/user-hero-card';
import { UpcomingMatches } from '@/features/competitions/dashboard/components/upcoming-matches';
import { useAuthStore } from '@/store/useAuthStore';
import { ReferralLink } from '@/components/common/referral-link';
import { IceGlassCard } from '@/components/ui/ice-glass-card';

export function DashboardView() {
  const t = useTranslations('Account');

  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Row 1: Header and Hero Card */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <DashboardHeader />
        <UserHeroCard />
      </div>

      {/* Row 2: Upcoming Matches Section */}
      {/* <UpcomingMatches
        upcomingMatches={upcomingMatches}
        allMatchesPredicted={allMatchesPredicted}
        competition={competition}
        locale={locale}
      /> */}

      {/* Row 3: Results, Stats, Mini Leaderboard */}
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecentResults recentPredictions={recentPredictions} />
        <UserStats leaderboardEntry={leaderboardEntry} />
        <IceGlassCard className="flex flex-col justify-center p-4 md:p-6">
          {user?.referralData?.referralCode ? (
            <ReferralLink code={user.referralData.referralCode} align="center" className="w-full" />
          ) : (
            <div className="py-6 text-center text-xs font-bold tracking-[0.2em] text-white/20 uppercase">
              {t('referral_not_available')}
            </div>
          )}
        </IceGlassCard>
      </div> */}

      {/* Row 4: Competition Info */}
      {/* <CompetitionSummary competition={competition} locale={locale} /> */}
    </div>
  );
}
