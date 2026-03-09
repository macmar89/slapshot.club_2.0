import { LayoutDashboard, Calendar, Users, Trophy, FileText, User } from 'lucide-react';

export interface DashboardItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
      labelKey: 'rules',
      href: '/rules',
      icon: FileText,
    },
    {
      labelKey: 'profile',
      href: '/account',
      icon: User,
    },
  ] as DashboardItem[],
};
