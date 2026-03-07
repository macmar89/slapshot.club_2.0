import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['sk', 'en', 'cs'],

  defaultLocale: 'sk',

  localePrefix: 'never',

  pathnames: {
    '/': '/',
    '/dashboard': '/dashboard',
    '/login': '/login',
    '/register': '/register',
    '/register/[referralCode]': '/register/[referralCode]',
    '/forgot-password': '/forgot-password',
    '/account': '/account',
    '/dashboard/rules': '/dashboard/rules',
    '/dashboard/profile': '/dashboard/profile',
    '/dashboard/settings': '/dashboard/settings',
    '/settings': '/settings',
    '/[slug]/dashboard': '/[slug]/dashboard',
    '/[slug]/dashboard/leagues': '/[slug]/dashboard/leagues',
    '/[slug]/dashboard/leagues/[leagueId]': '/[slug]/dashboard/leagues/[leagueId]',
    '/[slug]/dashboard/matches': '/[slug]/dashboard/matches',
    '/[slug]/dashboard/leaderboard': '/[slug]/dashboard/leaderboard',
    '/arena': '/arena',
    '/arena/rules': '/arena/rules',
    '/arena/[slug]': '/arena/[slug]',
    '/ranking': '/ranking',
  } as Record<string, string>,
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
