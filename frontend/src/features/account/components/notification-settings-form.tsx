'use client';

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Switch } from '@/components/ui/switch';
import { API_ROUTES } from '@/lib/api-routes';
import { updateNotificationSettingsAction } from '@/features/account/account.api';

interface NotificationSettings {
  dailyTipsReminder: { email: boolean };
}

export function NotificationSettingsForm() {
  const t = useTranslations('Account');
  const commonT = useTranslations('Common');

  const { data, isLoading, mutate } = useSWR<NotificationSettings>(
    API_ROUTES.USER.NOTIFICATION_SETTINGS,
  );

  const handleToggle = async (checked: boolean) => {
    const previous = data;
    mutate({ ...data, dailyTipsReminder: { email: checked } } as NotificationSettings, false);

    const res = await updateNotificationSettingsAction({ dailyTipsReminder: { email: checked } });
    if (res.ok) {
      toast.success(t('notifications.status_updated'));
      mutate(res.data);
    } else {
      toast.error(res.error || commonT('error_generic'));
      mutate(previous, false);
    }
  };

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-white uppercase italic md:text-xl">
            <Mail className="text-primary h-4 w-4 md:h-5 md:w-5" />
            {t('notifications.dailyTipsEmail.title')}
          </h3>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
            {t('notifications.dailyTipsEmail.description')}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-white md:text-base">
            {t('notifications.dailyTipsEmail.toggle_label')}
          </span>
          <Switch
            checked={data?.dailyTipsReminder.email ?? false}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>
      </div>
    </IceGlassCard>
  );
}
