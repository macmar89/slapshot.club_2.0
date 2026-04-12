import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Sora, Space_Grotesk } from 'next/font/google';

import '@/app/globals.css';
import BackgroundImage from '@/components/common/background-image';
import { Providers } from '@/providers/providers';
import { PredictionDialog } from '@/features/competitions/predictions/components/prediction-dialog';
import { getSEO } from '@/config/seo';

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
    title: { template: '%s | slapshot.club', default: seo.title },
    description: seo.description,
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
          </Providers>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
