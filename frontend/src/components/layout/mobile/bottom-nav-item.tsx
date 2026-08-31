'use client';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export const bottomNavItemClass =
  'relative flex min-h-14 flex-1 basis-0 flex-col items-center justify-center gap-1 px-1 transition-colors duration-200 select-none';

interface BottomNavLabelProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  badge?: number;
}

export const BottomNavContent = ({ icon: Icon, label, isActive, badge }: BottomNavLabelProps) => (
  <>
    {isActive && (
      <span className="bg-primary absolute inset-x-3 top-0 h-0.5 rounded-full shadow-[0_2px_10px_rgba(var(--primary-rgb),0.7)]" />
    )}
    <span className="relative">
      <Icon
        className={cn(
          'h-5 w-5 transition-colors',
          isActive ? 'text-primary' : 'text-white/60 group-active:text-white',
        )}
      />
      {badge !== undefined && (
        <span className="bg-primary absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] leading-none font-black text-black">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </span>
    <span
      className={cn(
        'max-w-full truncate text-[10px] leading-none font-bold tracking-wide uppercase transition-colors',
        isActive ? 'text-primary' : 'text-white/60',
      )}
    >
      {label}
    </span>
  </>
);

interface BottomNavItemProps extends BottomNavLabelProps {
  href: string;
}

export const BottomNavItem = ({ href, icon, label, isActive, badge }: BottomNavItemProps) => (
  <Link
    href={href as Parameters<typeof Link>[0]['href']}
    aria-current={isActive ? 'page' : undefined}
    className={cn('group', bottomNavItemClass)}
  >
    <BottomNavContent icon={icon} label={label} isActive={isActive} badge={badge} />
  </Link>
);
