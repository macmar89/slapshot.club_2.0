'use client';

import React from 'react';
import { SlapshotLogo } from '@/components/common/slapshot-logo';

import { useLocale, useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { usePathname, useRouter, useSearchParams, useParams } from 'next/navigation';

// Sub-components
import { InitializationOverlay } from './header/InitializationOverlay';
import { UserProfileDrawer } from './header/user-profile-drawer';
import { MobileMenu } from './header/mobile-menu';
import { useAuthStore } from '@/store/use-auth-store';

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
  const t = useTranslations('Header');

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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

      <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <Container className="max-w-auto flex h-full items-center justify-between gap-4">
          <div className="group relative mt-6 mr-8 flex h-16 w-60 items-center sm:-mt-4">
            <div className="pointer-events-none absolute left-0 flex h-32 items-center transition-all duration-300 md:-top-2 md:top-0">
              <SlapshotLogo
                width={128}
                height={128}
                className="h-auto w-20 drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)] md:h-24 md:w-24"
                sizes="(max-width: 768px) 80px, 240px"
              />
              <span className="bg-primary absolute top-8 -right-4 rotate-12 rounded-md px-2 py-0.5 text-[10px] font-black tracking-normal text-black normal-case shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-transform duration-300">
                BETA
              </span>
            </div>
          </div>

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
              slug={slug}
              locale={locale}
              effectiveLeagueId={effectiveLeagueId}
            />
          </div>

          {/* Mobile View */}
          <div className="flex items-center gap-2 md:hidden">
            {/* <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="bg-primary absolute top-2 right-2 flex h-2 w-2 rounded-full"></span>
            </Button> */}

            <MobileMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} user={user} slug={slug} />
          </div>
        </Container>
      </header>
    </>
  );
}
