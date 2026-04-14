'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserCog } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ProfileOverview } from '../../account/components/profile-overview';
import { UsernameForm } from '../../account/components/username-form';
import { EmailSection } from '../../account/components/email-section';
// import { LocationForm } from './sections/LocationForm';
import { SecurityForm } from '../../account/components/security-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { handlePostResendVerificationMe } from '@/features/auth/auth.api';
import { toast } from 'sonner';
// import { NotificationSection } from '@/features/notifications/components/NotificationSection';

interface AccountViewProps {
  user: {
    id: string;
    username: string;
    email: string;
    isVerified: boolean;
    location?: {
      country?: number | { id: number; name: string } | null;
      region?: number | { id: number; name: string } | null;
      customCountry?: string | null;
    };
    jersey?: {
      primaryColor?: string;
      secondaryColor?: string;
      pattern?: string;
      number?: string;
      style?: string;
    };
    referralData?: {
      referralCode?: string;
      stats?: {
        totalRegistered?: number;
        totalPaid?: number;
      };
    };
    notificationSettings?: {
      dailySummary: boolean;
      matchReminder: boolean;
      scoreChange: boolean;
      matchEnd: boolean;
      leaderboardUpdate: boolean;
    };
    role?: string;
  };
}

export function AccountView({ user: initialUser }: AccountViewProps) {
  const t = useTranslations('Account');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(initialUser);
  const [isResending, setIsResending] = useState(false);

  const activeTab = searchParams.get('tab') || 'profile';
  const isAdmin = user.role === 'admin';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleUsernameUpdated = (newUsername: string) => {
    setUser((prev) => ({ ...prev, username: newUsername }));
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await handlePostResendVerificationMe();
      if (res.success) {
        toast.success(t('verification_resent_success'));
      } else {
        const commonT = (key: string) => key; // Fallback or import Common translations
        toast.error(res.message || 'Error');
      }
    } catch (err) {
      toast.error('Error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="py-8 md:py-24">
      <Container className="max-w-4xl">
        <div className="flex flex-col gap-6 md:gap-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="mb-8 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
              <div className="flex flex-col gap-1.5 text-center md:text-left">
                <h1 className="flex items-center justify-center gap-3 text-2xl leading-none font-black tracking-tighter text-white uppercase italic md:justify-start md:gap-4 md:text-5xl">
                  <UserCog className="text-primary h-6 w-6 md:h-10 md:w-10" />
                  {t('title')}
                </h1>
              </div>
            </div>

            {isAdmin && (
              <div className="mb-8 px-1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">{t('tabs.profile')}</TabsTrigger>
                  <TabsTrigger value="notifications">{t('tabs.notifications')}</TabsTrigger>
                </TabsList>
              </div>
            )}

            <div>
              <TabsContent value="profile">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  <ProfileOverview />

                  {!user.isVerified && (
                    <div className="md:col-span-2">
                      <IceGlassCard
                        backdropBlur="md"
                        className="border-warning/20 bg-warning/5 p-4 md:p-6"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-warning/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-12 md:w-12">
                              <Send className="text-warning h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white md:text-base">
                                {t.rich('verification_notice', {
                                  email: user.email,
                                  r: (chunks) => <span className="text-warning">{chunks}</span>,
                                })}
                              </p>
                              <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
                                {t('verification_resend_hint')}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="border-warning/30 text-warning hover:bg-warning/10 h-10 shrink-0 px-6 text-xs font-black tracking-widest uppercase italic md:h-12 md:text-sm"
                            onClick={handleResend}
                            disabled={isResending}
                          >
                            {isResending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              t('resend_verification')
                            )}
                          </Button>
                        </div>
                      </IceGlassCard>
                    </div>
                  )}

                  <UsernameForm
                    initialUsername={user.username}
                    onUsernameUpdated={handleUsernameUpdated}
                  />

                  <EmailSection email={user.email} />

                  {/* <LocationForm
                    initialCountry={user.location?.country}
                    initialRegion={user.location?.region}
                    initialCustomCountry={user.location?.customCountry}
                    countries={countries}
                  /> */}

                  <SecurityForm />
                </div>
              </TabsContent>

              {/* {isAdmin && (
                <TabsContent value="notifications">
                  <div className="mx-auto w-full max-w-2xl">
                    <NotificationSection
                      userId={user.id}
                      initialSettings={user.notificationSettings}
                    />
                  </div>
                </TabsContent>
              )} */}
            </div>
          </Tabs>
        </div>
      </Container>
    </div>
  );
}
