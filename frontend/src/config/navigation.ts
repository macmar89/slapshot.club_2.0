import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Users,
  Bell,
  FileText,
  User,
  Megaphone,
  Settings,
} from 'lucide-react';

export type NavBadgeType = 'notifications' | 'missing_tips' | 'announcements';

export type NavContext = 'arena' | 'competition';

export interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeType?: NavBadgeType;
  disabled?: boolean;
}

const arenaItem: NavItem = {
  labelKey: 'arena',
  href: '/arena',
  icon: LayoutDashboard,
};

const missingTipsItem: NavItem = {
  labelKey: 'missing_tips',
  href: '/arena/missing-tips',
  icon: Trophy,
  badgeType: 'missing_tips',
};

const announcementsItem: NavItem = {
  labelKey: 'announcements',
  href: '/announcements',
  icon: Megaphone,
  badgeType: 'announcements',
};

const notificationsItem: NavItem = {
  labelKey: 'notifications',
  href: '/notifications',
  icon: Bell,
  badgeType: 'notifications',
};

const manualItem: NavItem = {
  labelKey: 'manual',
  href: '/user-manual',
  icon: FileText,
};

const profileItem: NavItem = {
  labelKey: 'profile',
  href: '/account',
  icon: User,
};

export const adminNavItem: NavItem = {
  labelKey: 'admin',
  href: '/admin',
  icon: Settings,
};

export const navigationConfig: Record<NavContext, { bottom: NavItem[]; more: NavItem[] }> = {
  arena: {
    bottom: [arenaItem, missingTipsItem, announcementsItem, profileItem],
    more: [notificationsItem, manualItem],
  },
  competition: {
    bottom: [
      { labelKey: 'overview', href: '/[slug]/dashboard', icon: LayoutDashboard },
      { labelKey: 'matches', href: '/[slug]/matches', icon: Calendar },
      { labelKey: 'leaderboard', href: '/[slug]/leaderboard', icon: Trophy },
      { labelKey: 'groups', href: '/[slug]/groups', icon: Users },
    ],
    more: [
      arenaItem,
      missingTipsItem,
      announcementsItem,
      notificationsItem,
      manualItem,
      profileItem,
    ],
  },
};

export const resolveNavHref = (href: string, slug?: string) =>
  slug ? href.replace('[slug]', slug) : href;

export const resolveActiveHref = (pathname: string, hrefs: string[]) =>
  hrefs
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

export const arenaSectionLabels: Record<string, string> = {
  '/arena': 'arena',
  '/arena/missing-tips': 'missing_tips',
  '/announcements': 'announcements',
  '/notifications': 'notifications',
  '/user-manual': 'manual',
  '/account': 'profile',
  '/admin': 'admin',
};

export const competitionSectionLabels: Record<string, string> = {
  dashboard: 'overview',
  matches: 'matches',
  leaderboard: 'leaderboard',
  groups: 'groups',
};

export const arenaSectionPrefixes = [
  '/arena',
  '/announcements',
  '/notifications',
  '/user-manual',
  '/account',
  '/admin',
];
