'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { ProfileOverview } from '../components/profile-overview';
import { UsernameForm } from '../components/username-form';
import { EmailSection } from '../components/email-section';
import { SecurityForm } from '../components/security-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/use-auth-store';
import { UserCog, Send, Loader2 } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { handlePostResendVerificationMe } from '@/features/auth/auth.api';
import { toast } from 'sonner';
import { useState } from 'react';

export function AccountView() {
  const t = useTranslations('Account');
  const commonT = useTranslations('Common');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, setUser } = useAuthStore();
  const activeTab = searchParams.get('tab') || 'profile';
  const isAdmin = user?.role === 'admin';

  const [isResending, setIsResending] = useState(false);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleUsernameUpdated = (newUsername: string) => {
    if (user) {
      setUser({ ...user, username: newUsername });
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await handlePostResendVerificationMe();
      if (res.success) {
        toast.success(t('verification_resent_success'));
      } else {
        toast.error(res.message || commonT('error_generic'));
      }
    } catch (err) {
      toast.error(commonT('error_generic'));
    } finally {
      setIsResending(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-0">
      <Container className="max-w-6xl">
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <h1 className="flex items-center justify-center gap-3 text-2xl leading-none font-black tracking-tighter text-white uppercase italic md:justify-start md:gap-4 md:text-5xl">
              <UserCog className="text-warning h-6 w-6 md:h-10 md:w-10" />
              {t('title')}
            </h1>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                      <IceGlassCard backdropBlur="md" className="p-4 md:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-warning/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:h-12 md:w-12">
                              <Send className="text-warning h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white md:text-base">
                                {t('verification_notice', {
                                  email: user.email,
                                })}
                              </p>
                              <p className="text-[10px] font-bold tracking-widest text-white uppercase">
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

                  <SecurityForm />
                </div>
              </TabsContent>

              {isAdmin && (
                <TabsContent value="notifications">
                  <div className="mx-auto w-full max-w-2xl text-white">
                    <p className="text-center text-white/60">{t('notifications.coming_soon')}</p>
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </Container>
    </div>
  );
}
