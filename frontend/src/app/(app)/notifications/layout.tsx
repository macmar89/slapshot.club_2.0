import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oznámenia | Slapshot Club',
  description: 'Tvoje posledné aktivity a dôležité upozornenia na jednom mieste.',
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
