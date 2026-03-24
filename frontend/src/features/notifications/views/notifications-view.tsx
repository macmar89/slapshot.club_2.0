'use client';

import React from 'react';
import useSWR from 'swr';
import { Bell, Check, Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Container } from '@/components/ui/container';
import { DataLoader } from '@/components/common/data-loader';
import { NotificationItem } from '../components/notification-item';
import { useNotificationsSSE } from '@/hooks/use-notifications-sse';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import type { AppNotification } from '../components/notification-bell';

export function NotificationsView() {
  const t = useTranslations('AppNotifications');
  
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
  } = useSWR<AppNotification[]>(API_ROUTES.NOTIFICATIONS.ALL(50, 'ALL')); // Load more for full page

  const unreadCount = unreadData?.count || 0;

  const handleMarkAllRead = async () => {
    try {
      await api.patch(API_ROUTES.NOTIFICATIONS.READ_ALL);
      mutateUnread();
      mutateNotifications();
      toast.success(t('markAllReadSuccess') || 'All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error(t('markAllAsReadError') || 'Failed to mark all as read');
    }
  };

  return (
    <div className="py-8 md:py-12">
      <Container className="max-w-4xl">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter text-white uppercase italic md:text-5xl">
                <Bell className="text-primary h-8 w-8 md:h-12 md:w-12" />
                {t('title')}
              </h1>
              <p className="text-sm text-white/50 md:text-base">
                {unreadCount > 0 
                  ? t('unreadCount', { count: unreadCount })
                  : t('allRead') || 'You are all caught up!'}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <Check className="h-4 w-4 text-primary" />
                {t('markAllAsRead')}
              </button>
            )}
          </div>

          {/* List Wrapper */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <DataLoader
              data={notificationsData}
              isLoading={isLoading}
              error={error}
              skeleton={
                <div className="flex flex-col divide-y divide-white/5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 w-full animate-pulse bg-white/[0.02]" />
                  ))}
                </div>
              }
              notFound={
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <Inbox className="mb-4 h-12 w-12" />
                  <p className="text-lg font-medium italic uppercase">{t('empty')}</p>
                </div>
              }
            >
              {(notifications) => (
                <div className="flex flex-col divide-y divide-white/5">
                  {notifications.map((notif) => (
                    <NotificationItem 
                      key={notif.id} 
                      notification={notif}
                      className="hover:bg-white/[0.03] transition-colors"
                    />
                  ))}
                </div>
              )}
            </DataLoader>
          </div>
        </div>
      </Container>
    </div>
  );
}
