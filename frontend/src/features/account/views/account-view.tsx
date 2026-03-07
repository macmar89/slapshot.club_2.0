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
import { UserCog } from 'lucide-react';

export function AccountView() {
  const t = useTranslations('Account');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, setUser } = useAuthStore();
  const activeTab = searchParams.get('tab') || 'profile';
  const isAdmin = user?.role === 'admin';

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

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="py-8 md:py-24">
      <Container className="max-w-4xl">
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

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TabsContent value="profile">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  <ProfileOverview />

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
