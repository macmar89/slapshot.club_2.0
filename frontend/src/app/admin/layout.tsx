import { Header } from '@/components/layout/Header';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Sidebar } from '@/components/layout/sidebar';
import { Container } from '@/components/ui/container';
import { AdminNavItems } from '@/features/admin/components/admin-nav-items';
import { AdminGuard } from '@/features/auth/components/admin-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="relative min-h-screen w-full">
        <Header />

        <aside className="fixed top-20 bottom-4 left-4 z-40 hidden w-64 lg:block">
          <IceGlassCard className="h-full w-full" backdropBlur="md">
            <div className="flex h-full flex-col p-4">
              <Sidebar>
                <AdminNavItems />
              </Sidebar>
            </div>
          </IceGlassCard>
        </aside>

        <main className="min-h-screen pt-20 pb-32 md:pb-0 lg:pl-72">
          <Container>{children}</Container>
        </main>
      </div>
    </AdminGuard>
  );
}
