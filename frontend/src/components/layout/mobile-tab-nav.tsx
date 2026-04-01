'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { SlapshotLogo } from '@/components/common/slapshot-logo';

interface MobileTabNavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  badge?: string | number;
}

export const MobileTabNavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
  badge,
}: MobileTabNavItemProps) => (
  <Link
    href={href}
    className={cn(
      'relative flex flex-col items-center gap-1.5 transition-colors',
      isActive ? 'text-white' : 'text-white/50 hover:text-white',
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="text-[10px] font-bold tracking-tight uppercase">{label}</span>
    {badge !== undefined && (
      <div className="bg-primary absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full px-1 text-[8px] font-black text-black">
        {badge}
      </div>
    )}
  </Link>
);

interface MobileTabNavProps {
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
}

export function MobileTabNav({ leftChildren, rightChildren }: MobileTabNavProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 lg:hidden">
      <IceGlassCard
        className="rounded-t-app h-16 w-full overflow-visible rounded-b-none border-x-0 border-b-0"
        backdropBlur="lg"
        allowOverflow
      >
        <div className="flex h-full items-center justify-between px-1">
          {/* Left items slot */}
          <div className="flex flex-1 items-center justify-around">{leftChildren}</div>

          <div className="relative z-50 -mt-10 flex items-center justify-center px-2">
            <Link
              href={'/arena'}
              className="animate-in fade-in zoom-in group relative z-10 flex h-20 w-20 rotate-3 items-center justify-center duration-500"
            >
              <SlapshotLogo
                width={80}
                height={80}
                className="h-full w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
              />
              <span className="bg-primary pointer-events-none absolute top-4 -right-2 rotate-12 rounded-sm px-1.5 py-0.5 text-[8px] font-black tracking-normal text-black normal-case shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-transform duration-300">
                BETA
              </span>
            </Link>
          </div>

          {/* Right items slot */}
          <div className="flex flex-1 items-center justify-around">{rightChildren}</div>
        </div>
      </IceGlassCard>
    </div>
  );
}
