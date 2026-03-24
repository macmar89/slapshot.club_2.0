'use client';

import React from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { Bell, Check, Inbox, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Container } from '@/components/ui/container';
import { DataLoader } from '@/components/common/data-loader';
import { NotificationItem } from '../components/notification-item';
import { useNotificationsSSE } from '@/hooks/use-notifications-sse';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';
import { APP_CONFIG } from '@/config/app';
import type { AppNotification } from '../components/notification-bell';

const PAGE_SIZE = APP_CONFIG.NOTIFICATIONS.PAGE_SIZE;

const getKey = (pageIndex: number, previousPageData: AppNotification[] | null) => {
  if (previousPageData && !previousPageData.length) return null;
  
  if (pageIndex === 0) return API_ROUTES.NOTIFICATIONS.ALL(PAGE_SIZE, 'ALL');
  
  const lastItem = previousPageData![previousPageData!.length - 1];
  return API_ROUTES.NOTIFICATIONS.ALL(PAGE_SIZE, 'ALL', lastItem.createdAt.toString());
};

export function NotificationsView() {
  const t = useTranslations('AppNotifications');
  const tCommon = useTranslations('Common');
  
  // Revalidates on SSE events automatically via the hook
  useNotificationsSSE();

  const { data: unreadData, mutate: mutateUnread } = useSWR<{ count: number }>(
    API_ROUTES.NOTIFICATIONS.UNREAD_COUNT,
  );
  
  const {
    data,
    error,
    isLoading,
    isValidating,
    size,
    setSize,
    mutate: mutateNotifications,
  } = useSWRInfinite<AppNotification[]>(getKey, {
    revalidateFirstPage: true,
  });

  const notifications = data ? data.flatMap((page) => page) : [];
  const unreadCount = unreadData?.count || 0;
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

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
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <DataLoader
                data={data}
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
                {() => (
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

            {/* Load More Button */}
            {!isReachingEnd && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setSize(size + 1)}
                  disabled={isLoadingMore || isValidating}
                  className="group flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-4 text-xs font-black tracking-widest text-white/80 uppercase italic shadow-xl backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20 disabled:opacity-50"
                >
                  {isLoadingMore || isValidating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-white/60" />
                      <span className="text-white/60">{tCommon('loading') || 'Loading...'}</span>
                    </div>
                  ) : (
                    <span>{t('load_more') || 'Load more'}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

