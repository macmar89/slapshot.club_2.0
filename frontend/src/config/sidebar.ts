import {
  LayoutDashboard,
  Calendar,
  Users,
  Trophy,
  Bell,
  FileText,
  User,
  History,
  Megaphone,
  MessageSquare,
} from 'lucide-react';

export interface DashboardItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  showBadge?: boolean;
  badgeType?: 'notifications' | 'missing_tips';
  disabled?: boolean;
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

  arenaMobileNav: [
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
      labelKey: 'announcements',
      href: '/announcements',
      icon: Megaphone,
    },
    {
      labelKey: 'manual',
      href: '/user-manual',
      icon: FileText,
    },
    {
      labelKey: 'profile',
      href: '/account',
      icon: User,
    },
  ] as DashboardItem[],

  adminNav: [
    {
      labelKey: 'dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      labelKey: 'competitions',
      href: '/admin/competitions',
      icon: Trophy,
      disabled: true,
    },
    {
      labelKey: 'matches',
      href: '/admin/matches',
      icon: Calendar,
    },
    {
      labelKey: 'teams',
      href: '/admin/teams',
      icon: Users,
      disabled: true,
    },
    {
      labelKey: 'users',
      href: '/admin/users',
      icon: Users,
      disabled: true,
    },
    {
      labelKey: 'announcements',
      href: '/admin/announcements',
      icon: Megaphone,
    },
    {
      labelKey: 'feedback',
      href: '/admin/feedback',
      icon: MessageSquare,
    },
    {
      labelKey: 'logs',
      href: '/admin/logs',
      icon: History,
      disabled: true,
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
