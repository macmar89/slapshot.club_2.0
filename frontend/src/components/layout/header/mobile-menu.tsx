'use client';

import React from 'react';
import {
  Menu as MenuIcon,
  User as UserIcon,
  MessageSquarePlus,
  LayoutDashboard,
  Calendar,
  Trophy,
  Users,
  FileText,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { LogoutButton } from '@/features/auth/components/logout-button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import { FeedbackModal } from '@/components/common/feedback-modal';
import { useCompetitionStore } from '@/store/use-competition-store';

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  slug: string;
}

export function MobileMenu({ isOpen, onOpenChange, user, slug }: MobileMenuProps) {
  const t = useTranslations('Header');
  const dt = useTranslations('Dashboard.nav');
  const competition = useCompetitionStore((state) => state.competition);

  return (
    <div className="ml-auto md:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-full flex-col bg-black/10 p-0 backdrop-blur-sm">
          <SheetHeader className="sr-only">
            <SheetTitle>{t('mobile_menu')}</SheetTitle>
            <SheetDescription>{t('mobile_menu_desc')}</SheetDescription>
          </SheetHeader>
          {/* Header Section */}
          <div className="from-primary/10 border-b border-white/5 bg-gradient-to-b to-transparent p-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 border-primary/30 flex h-10 w-10 items-center justify-center rounded-full border">
                  <UserIcon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tighter text-white uppercase italic">
                    {user?.username || t('host')}
                  </h3>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="mt-auto p-6">
            <div className="border-primary/20 rounded-app bg-primary/5 mb-2 flex items-center justify-center border py-2 text-[10px] font-black tracking-[0.2em] text-white uppercase italic">
              {competition?.name}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <Link
                href="/arena"
                onClick={() => onOpenChange(false)}
                className="rounded-app flex flex-col items-center justify-center gap-2 border border-white/20 bg-gray-800 p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {dt('arena')}
                </span>
              </Link>

              {slug && (
                <>
                  <Link
                    href={`/${slug}/dashboard` as any}
                    onClick={() => onOpenChange(false)}
                    className="rounded-app flex flex-col items-center justify-center gap-2 border border-white/20 bg-gray-800 p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      {dt('overview')}
                    </span>
                  </Link>
                  <Link
                    href={`/${slug}/matches` as any}
                    onClick={() => onOpenChange(false)}
                    className="rounded-app flex flex-col items-center justify-center gap-2 border border-white/20 bg-gray-800 p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Calendar className="h-5 w-5" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      {dt('matches')}
                    </span>
                  </Link>
                  <Link
                    href={`/${slug}/leaderboard` as any}
                    onClick={() => onOpenChange(false)}
                    className="rounded-app flex flex-col items-center justify-center gap-2 border border-white/20 bg-gray-800 p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Trophy className="h-5 w-5" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      {dt('leaderboard')}
                    </span>
                  </Link>
                  <Link
                    href={`/${slug}/groups` as any}
                    onClick={() => onOpenChange(false)}
                    className="rounded-app flex flex-col items-center justify-center gap-2 border border-white/20 bg-gray-800 p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">
                      {dt('groups')}
                    </span>
                  </Link>
                </>
              )}

              <Link
                href="/user-manual"
                onClick={() => onOpenChange(false)}
                className="rounded-app border-primary/20 flex flex-col items-center justify-center gap-2 border bg-gray-800 p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <FileText className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {dt('manual')}
                </span>
              </Link>

              <Link
                href="/account"
                onClick={() => onOpenChange(false)}
                className="rounded-app border-primary/20 flex flex-col items-center justify-center gap-2 border bg-gray-800 p-4 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {t('my_account')}
                </span>
              </Link>
            </div>

            <div className="mt-4 pb-4">
              <FeedbackModal triggerClassName="w-full">
                <div className="rounded-app bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 flex cursor-pointer items-center justify-center gap-2 border p-3 transition-all">
                  <MessageSquarePlus className="h-4 w-4" />
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    {t('feedback')}
                  </span>
                </div>
              </FeedbackModal>
            </div>

            <LogoutButton />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
