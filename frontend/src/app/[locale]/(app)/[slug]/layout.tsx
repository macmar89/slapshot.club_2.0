import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/container';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Sidebar } from '@/components/layout/sidebar';
import { getPublicCompetition } from '@/features/competitions/competitions.server';
import { CompetitionNav } from '@/features/competitions/components/competition-nav';

import { notFound } from 'next/navigation';
import { CompetitionStoreSync } from '@/providers/competition-store-sync';

import { BottomNav } from '@/components/layout/mobile/bottom-nav';
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

      <main className="pt-[calc(var(--app-header-h)+var(--app-safe-top)+1rem)] pb-[calc(var(--app-bottom-nav-h)+var(--app-safe-bottom)+1.5rem)] lg:pt-24 lg:pb-10 lg:pl-72">
        <Container>{children}</Container>
      </main>

      {!data.isJoined && <ProtectionModal competition={data} />}

      <CompetitionStoreSync name={data.name} />
      <BottomNav context="competition" slug={slug} />
    </div>
  );
}
