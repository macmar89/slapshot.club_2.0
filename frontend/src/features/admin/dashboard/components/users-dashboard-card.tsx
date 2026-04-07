'use client';

import { useTranslations } from 'next-intl';
import { Users, UserX, ShieldCheck, Trophy, Clock, Timer, FileCheck } from 'lucide-react';
import { DashboardCard } from './dashboard-card';
import { StatItem } from './stat-item';
import { type DashboardStats } from '../types';

interface UsersDashboardCardProps {
  stats: DashboardStats['users'];
}

export const UsersDashboardCard = ({ stats }: UsersDashboardCardProps) => {
  const t = useTranslations('Admin.Dashboard');

  return (
    <DashboardCard title={t('users_card_title')} icon={Users}>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatItem
            label={t('total_users')}
            value={stats.total}
            icon={Users}
            color="primary"
          />
          <StatItem
            label={t('unverified_users')}
            value={stats.unverified}
            icon={UserX}
            color="red"
          />
        </div>

        <div className="mt-2 flex items-center gap-2 border-t border-white/5 px-1 pt-4">
          <ShieldCheck className="h-3 w-3 text-white/20" />
          <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">
            {t('roles_title')}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatItem
            label={t('role_admin')}
            value={stats.roles.admin || 0}
            icon={ShieldCheck}
            color="primary"
          />
          <StatItem
            label={t('role_editor')}
            value={stats.roles.editor || 0}
            icon={FileCheck}
            color="emerald"
          />
        </div>

        <div className="mt-2 flex items-center gap-2 border-t border-white/5 px-1 pt-4">
          <Trophy className="h-3 w-3 text-white/20" />
          <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">
            {t('plans_title')}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatItem
            label={t('plan_free')}
            value={stats.plans.free || 0}
            icon={Users}
            color="primary"
          />
          <StatItem
            label={t('plan_pro')}
            value={stats.plans.pro || 0}
            icon={Trophy}
            color="amber"
          />
          <StatItem
            label={t('plan_vip')}
            value={stats.plans.vip || 0}
            icon={Trophy}
            color="emerald"
          />
        </div>

        <div className="mt-2 flex items-center gap-2 border-t border-white/5 px-1 pt-4">
          <Clock className="h-3 w-3 text-white/20" />
          <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">
            {t('inactivity_title')}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatItem
            label={t('inactive_1w')}
            value={stats.inactive1w}
            icon={Timer}
            color="amber"
          />
          <StatItem
            label={t('inactive_2w')}
            value={stats.inactive2w}
            icon={Timer}
            color="orange"
          />
          <StatItem
            label={t('inactive_1m')}
            value={stats.inactive1m}
            icon={Timer}
            color="red"
          />
        </div>
      </div>
    </DashboardCard>
  );
};
