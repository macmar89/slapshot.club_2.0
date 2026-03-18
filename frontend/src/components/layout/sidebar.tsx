'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/routing';
import { FileText, User, MessageSquarePlus, Settings } from 'lucide-react';
import { FeedbackModal } from '@/components/common/feedback-modal';
import { useAuthStore } from '@/store/use-auth-store';

interface SidebarItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
}

export const SidebarItem = ({ href, icon: Icon, label, isActive }: SidebarItemProps) => (
  <Link
    href={href as any}
    className={cn(
      'group relative flex gap-3 overflow-hidden px-4 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-200',
      isActive ? 'text-white' : 'text-white/70 hover:text-white',
    )}
  >
    {isActive && (
      <div className="via-primary absolute right-0 bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent to-transparent shadow-[0_-2px_10px_rgba(234,179,8,0.7)]" />
    )}
    <div className="via-primary animate-knight-rider pointer-events-none absolute right-0 bottom-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent to-transparent opacity-0 blur-[1px] group-hover:opacity-100" />
    <Icon className="relative z-10 h-5 w-5" />
    <span className="relative z-10 text-shadow-sm">{label}</span>
  </Link>
);

interface SidebarProps {
  children?: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  const t = useTranslations('Dashboard.nav');
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'editor';

  return (
    <nav className="flex h-full flex-col">
      <div className="mt-4 flex flex-col gap-2">{children}</div>

      <div className="mt-auto pt-4">
        <div className="mb-4 px-4">
          <div className="h-px w-full bg-white/10" />
        </div>

        <div className="flex flex-col gap-2">
          <SidebarItem
            href="/user-manual"
            icon={FileText}
            label={t('manual')}
            isActive={pathname === '/user-manual'}
          />
          <SidebarItem
            href="/account"
            icon={User}
            label={t('profile')}
            isActive={pathname === '/account'}
          />

          {isAdmin && (
            <SidebarItem
              href="/admin"
              icon={Settings}
              label={t('admin')}
              isActive={pathname === '/admin'}
            />
          )}

          <FeedbackModal triggerClassName="w-full">
            <div className="rounded-app bg-warning/5 border-warning/10 text-warning/60 hover:text-warning hover:bg-warning/10 hover:border-warning/20 group/feedback flex cursor-pointer items-center gap-3 border px-4 py-3 transition-all">
              <MessageSquarePlus className="h-5 w-5 transition-transform group-hover/feedback:scale-110" />
              <span className="text-[10px] font-black tracking-widest uppercase italic">
                Feedback
              </span>
            </div>
          </FeedbackModal>
        </div>
      </div>
    </nav>
  );
};
