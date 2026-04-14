import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Sora, Space_Grotesk } from 'next/font/google';

import '@/app/globals.css';
import BackgroundImage from '@/components/common/background-image';
import { Providers } from '@/providers/providers';
import { PredictionDialog } from '@/features/competitions/predictions/components/prediction-dialog';
import { getSEO, APP_URL } from '@/config/seo';
import { Analytics } from '@/components/common/analytics';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const seo = getSEO('default', locale);
  return {
    metadataBase: new URL(APP_URL),
    title: { template: '%s | slapshot.club', default: seo.title },
    description: seo.description,
    icons: {
      icon: '/icon.webp',
      apple: '/icon.webp',
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: APP_URL,
      siteName: 'slapshot.club',
      images: [
        {
          url: '/og-image.webp',
          width: 800,
          height: 600,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/og-image.webp'],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${sora.variable} ${spaceGrotesk.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_API_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
        )}
      </head>
      <NextIntlClientProvider messages={messages}>
        <body className="bg-background text-foreground relative min-h-screen font-sans antialiased">
          <Providers>
            <BackgroundImage />
            <PredictionDialog />
            {children}
            <Analytics />
          </Providers>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
