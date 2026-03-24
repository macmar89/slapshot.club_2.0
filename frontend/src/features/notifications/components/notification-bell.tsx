'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { DataLoader } from '@/components/common/data-loader';
import { NotificationItem } from './notification-item';
import { useNotificationsSSE } from '@/hooks/use-notifications-sse';
import { useDevice } from '@/hooks/use-device';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';

export interface AppNotification {
  id: string;
  type: string;
  titleKey: string;
  messageKey: string;
  payload?: Record<string, string | number>;
  isRead: boolean;
  createdAt: string | Date;
}

export function NotificationBell() {
  const t = useTranslations('AppNotifications');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useDevice();

  // Revalidates on SSE events automatically via the hook
  useNotificationsSSE();

  const { data: unreadData, mutate: mutateUnread } = useSWR<{ count: number }>(
    API_ROUTES.NOTIFICATIONS.UNREAD_COUNT,
  );
  const {
    data: notificationsData,
    error,
    isLoading,
    mutate: mutateNotifications,
  } = useSWR<AppNotification[]>(API_ROUTES.NOTIFICATIONS.ALL(10, 'ALL'));

  const unreadCount = unreadData?.count || 0;

  const handleMarkAllRead = async () => {
    try {
      await api.patch(API_ROUTES.NOTIFICATIONS.READ_ALL);
      mutateUnread();
      mutateNotifications();
    } catch {
      toast.error(t('markAllAsReadError') || 'Failed to mark all as read');
    }
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (isMobile && open) {
          router.push('/notifications');
          return;
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <button className="relative rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="mt-2 mr-4 w-80 border-white/10 bg-black/95 p-0 text-white backdrop-blur-xl"
        align="end"
      >
        <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{t('title')}</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                {t('unreadCount', { count: unreadCount })}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 self-end text-xs text-white/50 transition-colors hover:text-white"
            >
              <Check className="h-3 w-3" />
              {t('markAllAsRead')}
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          <DataLoader
            data={notificationsData}
            isLoading={isLoading}
            error={error}
            skeleton={
              <div className="flex items-center justify-center py-8 text-white/50">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            }
            notFound={
              <div className="px-4 py-8 text-center text-sm text-white/50">{t('empty')}</div>
            }
          >
            {(notifications) =>
              notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-white/50">{t('empty')}</div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <NotificationItem
                      key={notif.id}
                      notification={notif}
                      onAfterClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              )
            }
          </DataLoader>
        </div>

        <div className="border-t border-white/10 p-2">
          <button
            onClick={() => {
              setIsOpen(false);
              router.push(`/notifications`);
            }}
            className="w-full rounded-md px-3 py-2 text-center text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {t('viewAll')}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
