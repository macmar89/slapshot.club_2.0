import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { getSEO } from '@/config/seo';
import { RegisterView } from '@/features/auth/views/register-view';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = getSEO('register', locale);
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  };
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return <RegisterView referralCode={ref} />;
}
