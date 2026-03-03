import { Header } from '@/components/layout/Header';
import { MobileTabNav } from '@/components/layout/MobileTabNav';
import { Container } from '@/components/ui/container';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Sidebar } from '@/components/layout/sidebar';
import { FeedbackModal } from '@/components/common/feedback-modal';
import { MessageSquarePlus } from 'lucide-react';
import { getPublicCompetition } from '@/features/competitions/competitions.server';

import { notFound } from 'next/navigation';

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

      <MobileTabNav />

      {/* Bottom Fade Gradient for Mobile - Taller and Smoother */}
      <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 h-64 bg-gradient-to-t from-slate-950 via-slate-950/40 via-slate-950/80 to-transparent lg:hidden" />

      <aside className="fixed top-20 bottom-4 left-4 z-40 hidden w-64 lg:block">
        <IceGlassCard className="h-full w-full" backdropBlur="md">
          <div className="flex h-full flex-col p-4">
            <Sidebar competition={data} />
            <div className="mt-auto border-t border-white/5 pt-6">
              <FeedbackModal triggerClassName="w-full">
                <div className="rounded-app bg-warning/5 border-warning/10 text-warning/60 hover:text-warning hover:bg-warning/10 hover:border-warning/20 group/feedback flex cursor-pointer items-center gap-3 border px-4 py-3 transition-all">
                  <MessageSquarePlus className="h-5 w-5 transition-transform group-hover/feedback:scale-110" />
                  <span className="text-[10px] font-black tracking-widest uppercase">Feedback</span>
                </div>
              </FeedbackModal>
            </div>
          </div>
        </IceGlassCard>
      </aside>

      <main className="min-h-screen pt-4 pb-32 md:pt-20 md:pb-0 lg:pl-72">
        <Container className="h-full">{children}</Container>
      </main>
    </div>
  );
}
