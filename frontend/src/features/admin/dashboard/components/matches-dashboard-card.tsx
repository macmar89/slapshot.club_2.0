'use client';

import { useTranslations } from 'next-intl';
import { Trophy, ShieldCheck, FileCheck } from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import { StatItem } from './stat-item';
import { type DashboardStats } from '../types';

interface MatchesDashboardCardProps {
  stats: DashboardStats['matches'];
}

export const MatchesDashboardCard = ({ stats }: MatchesDashboardCardProps) => {
  const t = useTranslations('Admin.Dashboard');

  return (
    <DashboardCard title={t('matches_card_title')} icon={Trophy}>
      <div className="flex flex-col gap-4">
        <StatItem
          label={t('unverified_72h')}
          value={stats.unverified72h}
          icon={ShieldCheck}
          color="amber"
        />
        <StatItem
          label={t('unranked_finished')}
          value={stats.unrankedFinished}
          icon={FileCheck}
          color="red"
        />
      </div>
    </DashboardCard>
  );
};
