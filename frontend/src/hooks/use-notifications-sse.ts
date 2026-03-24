import { useEffect } from 'react';
import { useSWRConfig } from 'swr';
import { useAuthStore } from '@/store/use-auth-store';
import { API_ROUTES } from '@/lib/api-routes';

export function useNotificationsSSE() {
  const { mutate } = useSWRConfig();
  const { user } = useAuthStore();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) return;

    // Use full url path for EventSource (/api prefix is needed here unless overwritten by Next rewrites)
    const eventSource = new EventSource(`/api${API_ROUTES.NOTIFICATIONS.STREAM}`);

    eventSource.onopen = () => {
      console.log('[SSE] Notifications stream connected');
    };

    eventSource.addEventListener('new-notification', () => {
      // Invalidate both lists immediately to trigger automatic background refetch
      mutate(API_ROUTES.NOTIFICATIONS.UNREAD_COUNT('ALL'));
      mutate(API_ROUTES.NOTIFICATIONS.ALL(10, 'ALL')); // Assumes matching SWR limits
    });

    eventSource.addEventListener('connected', (event) => {
      console.log('[SSE] confirmed connection', event.data);
    });

    eventSource.onerror = (err) => {
      console.error('[SSE] Error occurred', err);
      // EventSource tries to reconnect automatically
    };

    return () => {
      console.log('[SSE] Cleaning up stream');
      eventSource.close();
    };
  }, [user, mutate]);
}
