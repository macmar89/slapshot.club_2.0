import { LayoutDashboard, Calendar, Users, Trophy, Bell } from 'lucide-react';

export interface DashboardItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  showBadge?: boolean;
  badgeType?: 'notifications' | 'missing_tips';
}

export const dashboardConfig = {
  sidebarNav: [
    {
      labelKey: 'overview',
      href: '/[slug]/dashboard',
      icon: LayoutDashboard,
    },

    {
      labelKey: 'matches',
      href: '/[slug]/matches',
      icon: Calendar,
    },
    {
      labelKey: 'leaderboard',
      href: '/[slug]/leaderboard',
      icon: Trophy,
    },
    {
      labelKey: 'groups',
      href: '/[slug]/groups',
      icon: Users,
    },
    {
      labelKey: 'notifications',
      href: '/notifications',
      icon: Bell,
      showBadge: false,
      badgeType: 'notifications',
    },
  ] as DashboardItem[],

  arenaNav: [
    {
      labelKey: 'arena',
      href: '/arena',
      icon: LayoutDashboard,
    },
    {
      labelKey: 'missing_tips',
      href: '/arena/missing-tips',
      icon: Trophy,
      showBadge: true,
      badgeType: 'missing_tips',
    },
    {
      labelKey: 'notifications',
      href: '/notifications',
      icon: Bell,
      showBadge: false,
      badgeType: 'notifications',
    },
  ] as DashboardItem[],

  adminNav: [
    {
      labelKey: 'dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      labelKey: 'matches',
      href: '/admin/matches',
      icon: Calendar,
    },
  ] as DashboardItem[],

  mobileNav: [
    {
      labelKey: 'arena',
      href: '/arena',
      icon: LayoutDashboard,
    },
    {
      labelKey: 'missing_tips',
      href: '/arena/missing-tips',
      icon: Trophy,
      showBadge: true,
      badgeType: 'missing_tips',
    },
  ] as DashboardItem[],
};
