import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/container';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Sidebar } from '@/components/layout/sidebar';
import { getPublicCompetition } from '@/features/competitions/competitions.server';
import { CompetitionNav } from '@/features/competitions/components/competition-nav';

import { notFound } from 'next/navigation';
import { CompetitionStoreSync } from '@/providers/competition-store-sync';

import { CompetitionMobileNav } from '@/features/competitions/components/competition-mobile-nav';
import { ProtectionModal } from '@/features/competitions/components/protection-modal';

export default async function CompetitionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPublicCompetition(slug);

  if (!result.success) {
    notFound();
  }

  const { data } = result;

  return (
    <div className="relative min-h-screen w-full">
      <Header />

      <aside className="fixed top-20 bottom-4 left-4 z-40 hidden w-64 lg:block">
        <IceGlassCard className="h-full w-full" backdropBlur="md">
          <div className="flex h-full flex-col p-4">
            <Sidebar>
              <CompetitionNav slug={slug} competition={data as any} />
            </Sidebar>
          </div>
        </IceGlassCard>
      </aside>

      <main className="pt-24 pb-32 md:pb-0 lg:pl-72">
        <Container>{children}</Container>
      </main>

      {!data.isJoined && <ProtectionModal competition={data} />}

      <CompetitionStoreSync name={data.name} />
      <CompetitionMobileNav slug={slug} />
    </div>
  );
}
