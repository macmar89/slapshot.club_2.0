import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Explicitly check the NEXT_LOCALE cookie as a fallback in case middleware strips headers
  if (!locale) {
    const cookieStore = await cookies();
    locale = cookieStore.get('NEXT_LOCALE')?.value;
  }

  if (!locale || !routing.locales.includes(locale as 'sk' | 'en' | 'cs')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
