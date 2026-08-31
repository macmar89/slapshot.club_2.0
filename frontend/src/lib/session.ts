import { APP_CONFIG } from '@/config/app';
import { routing } from '@/i18n/routing';
import { clearPwaCaches } from '@/lib/pwa';
import { useAuthStore } from '@/store/use-auth-store';

const SESSION_EXPIRED_KEY = 'slapshot:session-expired';

let isHandlingExpiredSession = false;

export const isPublicPath = (pathname: string) =>
  APP_CONFIG.PUBLIC_PATHS.some((path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path),
  );

const resolveLocale = () => {
  const segment = window.location.pathname.split('/')[1];
  return (routing.locales as readonly string[]).includes(segment) ? segment : routing.defaultLocale;
};

const flagSessionExpired = () => {
  try {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, '1');
  } catch {
    return;
  }
};

export const consumeSessionExpiredFlag = () => {
  if (typeof window === 'undefined') return false;

  try {
    if (sessionStorage.getItem(SESSION_EXPIRED_KEY) === null) return false;
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);
    return true;
  } catch {
    return false;
  }
};

export const handleSessionExpired = async () => {
  if (typeof window === 'undefined' || isHandlingExpiredSession) return;

  isHandlingExpiredSession = true;

  const hadUser = useAuthStore.getState().user !== null;

  useAuthStore.getState().logout();
  await clearPwaCaches();

  const locale = resolveLocale();
  const localeRoot = `/${locale}`;
  const isOnLocaleRoot =
    window.location.pathname === localeRoot || window.location.pathname === `${localeRoot}/`;

  if (!hadUser || isOnLocaleRoot) {
    isHandlingExpiredSession = false;
    return;
  }

  flagSessionExpired();

  window.location.replace(`${localeRoot}/`);
};
