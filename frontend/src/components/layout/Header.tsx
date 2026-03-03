'use client';

import React from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo/ssc_logo_2.png';

import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Container } from '@/components/ui/container';
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation';

// Sub-components
import { InitializationOverlay } from './header/InitializationOverlay';
import { UserProfileDrawer } from './header/UserProfileDrawer';
import { useAuthStore } from '@/store/useAuthStore';

interface HeaderProps {
  title?: React.ReactNode;
}

export function Header({ title }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params?.slug as string;
  const locale = useLocale();

  const { user } = useAuthStore();

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const [leagues, setLeagues] = React.useState<any[]>([]);
  const [savedActiveLeagueId, setSavedActiveLeagueId] = React.useState<string | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [selectedLeague, setSelectedLeague] = React.useState<any>(null);

  // Initialization
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Restore active league when navigating (if URL param is dropped)
  React.useEffect(() => {
    const currentLeagueParam = searchParams.get('leagueId');
    if (!isInitializing && !currentLeagueParam && savedActiveLeagueId) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('leagueId', savedActiveLeagueId);
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [pathname, savedActiveLeagueId, searchParams, router, isInitializing]);

  // Calculate the league ID to display: URL param takes precedence, fallback to saved state
  const effectiveLeagueId = searchParams.get('leagueId') || savedActiveLeagueId;

  return (
    <>
      <InitializationOverlay isVisible={!!(slug && isInitializing)} />

      <header className="fixed top-0 right-0 left-0 z-50 hidden h-16 border-b border-white/10 bg-black/20 backdrop-blur-lg md:block">
        <Container className="max-w-auto flex h-full items-center gap-4">
          {pathname === '/arena' ? (
            <div className="group relative mr-8 flex h-16 w-60 items-center">
              <div className="pointer-events-none absolute top-0 left-0 flex h-32 items-center transition-all duration-300">
                <Image
                  src={logo}
                  alt="Slapshot Club"
                  width={240}
                  height={128}
                  className="h-full w-auto object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
                  priority
                />
                <span className="bg-primary absolute top-8 -right-4 rotate-12 rounded-md px-2 py-0.5 text-[10px] font-black tracking-normal text-black normal-case shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-transform duration-300">
                  BETA
                </span>
              </div>
            </div>
          ) : (
            <Link
              href={slug ? `/${slug}/dashboard` : ('/arena' as any)}
              className="group relative mr-8 flex h-16 w-60 items-center"
            >
              <div className="pointer-events-none absolute top-0 left-0 flex h-32 items-center transition-all duration-300 group-hover:-translate-y-1">
                <Image
                  src={logo}
                  alt="Slapshot Club"
                  width={240}
                  height={128}
                  className="h-full w-auto object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_15px_25px_rgba(var(--primary-rgb),0.25)]"
                  priority
                />
                <span className="bg-primary absolute top-8 -right-4 rotate-12 rounded-md px-2 py-0.5 text-[10px] font-black tracking-normal text-black normal-case shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-transform duration-300 group-hover:rotate-0">
                  BETA
                </span>
              </div>
            </Link>
          )}
          {/* Desktop View */}
          <div className="ml-auto hidden items-center gap-4 md:flex">
            {/* <LeagueSwitcher
              slug={slug}
              effectiveLeagueId={effectiveLeagueId}
              selectedLeague={selectedLeague}
              leagues={leagues}
              onLeagueChange={handleLeagueChange}
            /> */}

            <UserProfileDrawer
              user={user}
              isOpen={isProfileOpen}
              onOpenChange={setIsProfileOpen}
              // upcomingMatches={upcomingMatches}
              slug={slug}
              locale={locale}
              effectiveLeagueId={effectiveLeagueId}
            />
          </div>

          {/* Mobile View */}
          {/* <MobileMenu
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            user={user}
            slug={slug}
            effectiveLeagueId={effectiveLeagueId}
            leagues={leagues}
            upcomingMatches={upcomingMatches}
          /> */}
        </Container>
      </header>
    </>
  );
}
