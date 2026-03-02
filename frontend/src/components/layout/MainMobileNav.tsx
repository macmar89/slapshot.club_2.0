'use client';

import React from 'react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import {
  MoreHorizontal,
  FileText,
  User as UserIcon,
  Settings,
  LogOut,
  MessageSquarePlus,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { FeedbackModal } from '@/components/common/feedback-modal';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { ReferralLink } from '@/features/auth/components/ReferralLink';
import Image from 'next/image';
import logo from '@/assets/images/logo/ssc_logo_2.png';

export function MainMobileNav({ user }: { user: any }) {
  const t = useTranslations('Dashboard.nav');
  const th = useTranslations('Header');
  const ta = useTranslations('Auth');
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 md:hidden">
      <IceGlassCard
        className="rounded-t-app h-20 w-full overflow-visible rounded-b-none border-x-0 border-b-0"
        backdropBlur="lg"
        allowOverflow
      >
        <div className="flex h-full items-center justify-between px-1">
          {/* Left items */}
          <div className="flex flex-1 items-center justify-around">
            {/* Manažment (Disabled) */}
            <div className="flex cursor-not-allowed flex-col items-center gap-1.5 text-white/20">
              <Settings className="h-5 w-5" />
              <span className="text-[10px] font-bold tracking-tight uppercase">
                {t('management')}
              </span>
            </div>

            {/* Pravidlá */}
            <Link
              href="/arena/rules"
              className="flex flex-col items-center gap-1.5 text-white/50 transition-colors hover:text-white"
            >
              <FileText className="h-5 w-5" />
              <span className="text-[10px] font-bold tracking-tight uppercase">{t('rules')}</span>
            </Link>
          </div>

          {/* Logo in the center */}
          <div className="relative z-50 -mt-10 flex items-center justify-center px-2">
            <Link
              href="/arena"
              className="animate-in fade-in zoom-in group relative z-10 flex h-24 w-24 rotate-3 items-center justify-center duration-500"
            >
              <Image
                src={logo}
                alt="Slapshot Club"
                width={80}
                height={80}
                className="h-full w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
                priority
              />
              <span className="bg-primary pointer-events-none absolute top-4 -right-2 rotate-12 rounded-sm px-1.5 py-0.5 text-[8px] font-black tracking-normal text-black normal-case shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-transform duration-300">
                BETA
              </span>
            </Link>
          </div>

          {/* Right items */}
          <div className="flex flex-1 items-center justify-around">
            {/* Účet */}
            <Link
              href="/account"
              className="flex flex-col items-center gap-1.5 text-white/50 transition-colors hover:text-white"
            >
              <UserIcon className="h-5 w-5" />
              <span className="text-[10px] font-bold tracking-tight uppercase">{t('profile')}</span>
            </Link>

            {/* Viac */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-auto flex-col items-center gap-1.5 p-0 text-white/50 transition-colors hover:bg-transparent hover:text-white"
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="text-[10px] font-bold tracking-tight uppercase">
                    {t('more')}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-app flex h-[50vh] flex-col border-white/10 bg-slate-950/95 p-0 backdrop-blur-2xl"
              >
                <SheetHeader className="from-primary/10 flex flex-row items-center justify-between border-b border-white/5 bg-gradient-to-b to-transparent p-8 pb-4">
                  <SheetTitle className="text-xl font-bold tracking-[0.2em] text-white uppercase">
                    {t('menu')}
                  </SheetTitle>
                  <LanguageSwitcher />
                </SheetHeader>

                <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
                  <div className="flex flex-col gap-6">
                    {user?.referralData?.referralCode && (
                      <ReferralLink
                        code={user.referralData.referralCode}
                        align="left"
                        title={t('share_app')}
                        className="rounded-app bg-primary/5 border-primary/10 border px-4 py-4"
                      />
                    )}

                    <FeedbackModal triggerClassName="w-full">
                      <div className="rounded-app flex cursor-pointer items-center gap-4 border border-white/5 bg-white/5 p-4 text-white transition-all hover:border-white/10 hover:bg-white/10">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                          <MessageSquarePlus className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-black tracking-widest uppercase">
                          {t('feedback')}
                        </span>
                      </div>
                    </FeedbackModal>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 bg-black/40 p-8">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black tracking-widest text-white uppercase">
                      v1.0.0
                    </span>
                    <span className="bg-primary rounded-sm px-1.5 py-0.5 text-[8px] font-black tracking-normal text-black normal-case">
                      BETA
                    </span>
                  </div>
                  <LogoutButton className="hover:text-danger group flex h-auto min-w-0 items-center gap-3 border-0 bg-transparent p-0 text-white/40 transition-colors hover:bg-transparent">
                    <div className="group-hover:bg-danger/10 rounded-xl p-2 transition-all">
                      <LogOut className="text-danger h-5 w-5" />
                    </div>
                    <span className="text-sm font-black tracking-widest text-white/60 uppercase group-hover:text-white">
                      {ta('logout')}
                    </span>
                  </LogoutButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </IceGlassCard>
    </div>
  );
}
