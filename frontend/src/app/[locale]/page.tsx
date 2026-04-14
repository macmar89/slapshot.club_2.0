import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { getSEO } from '@/config/seo';
import { LoginView } from '@/features/auth/views/login-view';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = getSEO('home', locale);
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default function Home() {
  return <LoginView />;
}
