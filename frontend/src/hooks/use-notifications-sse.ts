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
    const eventSource = new EventSource(`/api/v1${API_ROUTES.NOTIFICATIONS.STREAM}`);

    eventSource.onopen = () => {
      console.log('[SSE] Notifications stream connected');
    };

    eventSource.addEventListener('new-notification', () => {
      // Invalidate all unread count variants and the main notification list
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/notifications/unread-count'),
        undefined,
        { revalidate: true }
      );
      mutate(API_ROUTES.NOTIFICATIONS.ALL(10, 'ALL'));
    });

    eventSource.addEventListener('connected', (event) => {
      console.log('[SSE] confirmed connection', event.data);
    });

    eventSource.onerror = (err) => {
      // readyState === 2 means CLOSED (it won't retry)
      // readyState === 0 means CONNECTING (it is retrying)
      if (eventSource.readyState === 2) {
        console.error('[SSE] Connection failed or closed by server', err);
      } else {
        // Just a transient error, EventSource will retry
        console.warn('[SSE] Connection lost, retrying...');
      }
    };

    return () => {
      console.log('[SSE] Cleaning up stream');
      eventSource.close();
    };
  }, [user, mutate]);
}
