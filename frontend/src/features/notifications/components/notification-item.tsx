'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { type Locale, enUS, sk, cs } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNotificationActions } from '@/hooks/use-notification-actions';
import { AppNotification } from './notification-bell';

const dateLocales: Record<string, Locale> = { en: enUS, sk, cs };

interface NotificationItemProps {
  notification: AppNotification;
  onAfterClick?: () => void;
  className?: string;
}

export function NotificationItem({ notification, onAfterClick, className }: NotificationItemProps) {
  const t = useTranslations('AppNotifications');
  const locale = useLocale();
  const { handleNotificationClick } = useNotificationActions();

  const getSubKey = (key: string) => key.replace(/^notifications\./, '');

  return (
    <Button
      variant="ghost"
      onClick={() => handleNotificationClick(notification, onAfterClick)}
      className={cn(
        'relative flex h-auto w-full flex-col items-start rounded-none pt-3 pr-4 pb-8 pl-8 text-left transition-colors hover:bg-white/5 hover:text-white whitespace-normal',
        !notification.isRead && 'bg-white/[0.02]',
        className
      )}
    >
      <div className="flex w-full flex-col">
        {notification.payload?.competitionName && (
          <span
            className={cn(
              'mb-1 text-xs font-bold tracking-wider uppercase transition-colors',
              notification.isRead ? 'text-white/20' : 'text-primary',
            )}
          >
            {notification.payload.competitionName}
          </span>
        )}
        <span
          className={cn(
            'text-sm transition-colors',
            notification.isRead ? 'text-white/40' : 'font-semibold text-white',
          )}
        >
          {t(
            getSubKey(notification.titleKey) as Parameters<typeof t>[0],
            { missingTipsCount: 'undefined', ...notification.payload } as Parameters<typeof t>[1],
          )}
        </span>
      </div>
      <span
        className={cn(
          'break-words text-xs transition-colors',
          notification.isRead ? 'text-white/30' : 'text-white/60',
        )}
      >
        {t(
          getSubKey(notification.messageKey) as Parameters<typeof t>[0],
          { missingTipsCount: 'undefined', ...notification.payload } as Parameters<typeof t>[1],
        )}
      </span>
      <span className="absolute right-4 bottom-2 text-[10px] text-white/40 transition-colors group-hover:text-white/40">
        {formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
          locale: dateLocales[locale] || dateLocales.en,
        })}
      </span>
      {!notification.isRead && (
        <span className="bg-primary absolute top-1/2 left-3 h-1.5 w-1.5 -translate-y-1/2 rounded-full" />
      )}
    </Button>
  );
}
