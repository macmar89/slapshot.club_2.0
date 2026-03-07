import { Header } from '@/components/layout/Header';

export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
