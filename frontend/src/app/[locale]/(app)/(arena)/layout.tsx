import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/container';
import { Sidebar } from '@/components/layout/sidebar';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { ArenaNavItems } from '@/features/arena/components/arena-nav-items';
import { BottomNav } from '@/components/layout/mobile/bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      <Header />

      <aside className="fixed top-20 bottom-4 left-4 z-40 hidden w-64 lg:block">
        <IceGlassCard className="h-full w-full" backdropBlur="md">
          <div className="flex h-full flex-col p-4">
            <Sidebar>
              <ArenaNavItems />
            </Sidebar>
          </div>
        </IceGlassCard>
      </aside>

      <main className="pt-[calc(var(--app-header-h)+var(--app-safe-top)+1rem)] pb-[calc(var(--app-bottom-nav-h)+var(--app-safe-bottom)+1.5rem)] lg:pt-24 lg:pb-10 lg:pl-72">
        <Container>{children}</Container>
      </main>

      <BottomNav context="arena" />
    </div>
  );
}
