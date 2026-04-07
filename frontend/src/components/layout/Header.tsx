'use client';

import React from 'react';
import { SlapshotLogo } from '@/components/common/slapshot-logo';

import { useLocale } from 'next-intl';
import { Container } from '@/components/ui/container';
import { useSearchParams, useParams } from 'next/navigation';

// Sub-components
import { InitializationOverlay } from './header/InitializationOverlay';
import { UserProfileDrawer } from './header/user-profile-drawer';
import { MobileMenu } from './header/mobile-menu';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { useAuthStore } from '@/store/use-auth-store';
import { useStandalone } from '@/hooks/use-standalone';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: React.ReactNode;
}

export function Header({ title }: HeaderProps) {
  const searchParams = useSearchParams();
  const params = useParams();
  const slug = params?.slug as string;
  const locale = useLocale();

  const { user } = useAuthStore();

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isStandalone = useStandalone();

  const [isInitializing, setIsInitializing] = React.useState(true);

  // Initialization
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate the league ID to display: URL param takes precedence
  const effectiveLeagueId = searchParams.get('leagueId');

  return (
    <>
      <InitializationOverlay isVisible={!!(slug && isInitializing)} />

      <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <Container className="max-w-auto flex h-full items-center justify-between gap-4">
          <div
            className={cn(
              'group relative mt-6 mr-8 flex h-16 w-60 items-center sm:-mt-4',
              isStandalone && 'hidden md:flex',
            )}
          >
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
            <NotificationBell />
            <UserProfileDrawer user={user} isOpen={isProfileOpen} onOpenChange={setIsProfileOpen} />
          </div>

          {/* Mobile View */}
          <div
            className={cn(
              'flex items-center md:hidden',
              isStandalone ? 'w-full justify-between' : 'ml-auto justify-end gap-2',
            )}
          >
            {isStandalone ? (
              <>
                <MobileMenu
                  isOpen={isMenuOpen}
                  onOpenChange={setIsMenuOpen}
                  user={user}
                  slug={slug}
                />
                {title && (
                  <h1 className="text-sm font-bold tracking-widest text-white uppercase">
                    {title}
                  </h1>
                )}
                <NotificationBell />
              </>
            ) : (
              <>
                <NotificationBell />
                <MobileMenu
                  isOpen={isMenuOpen}
                  onOpenChange={setIsMenuOpen}
                  user={user}
                  slug={slug}
                />
              </>
            )}
          </div>
        </Container>
      </header>
    </>
  );
}
