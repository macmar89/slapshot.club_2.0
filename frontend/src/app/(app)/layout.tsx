import { Header } from '@/components/layout/Header';
import { MobileTabNav } from '@/components/layout/MobileTabNav';
import { Container } from '@/components/ui/container';
import { Sidebar } from '@/components/layout/sidebar';
import { IceGlassCard } from '@/components/ui/ice-glass-card';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      <Header />

      <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 h-64 bg-gradient-to-t from-slate-950 via-slate-950/40 via-slate-950/80 to-transparent lg:hidden" />

      <MobileTabNav />

      <aside className="fixed top-20 bottom-4 left-4 z-40 hidden w-64 lg:block">
        <IceGlassCard className="h-full w-full" backdropBlur="md">
          <div className="flex h-full flex-col p-4">
            <Sidebar></Sidebar>
          </div>
        </IceGlassCard>
      </aside>

      <main className="min-h-screen pt-4 pb-32 md:pt-20 md:pb-0 lg:pl-72">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
