import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShieldAlert } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';

export function AccessDenied() {
  const t = useTranslations('AccessDenied');

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <IceGlassCard className="flex w-full max-w-md flex-col items-center justify-center px-6 py-16 text-center shadow-2xl">
        <ShieldAlert className="mb-6 h-20 w-20 text-destructive opacity-90" />
        <h1 className="mb-3 text-3xl md:text-4xl font-bold font-sora text-white">{t('title')}</h1>
        <p className="mb-8 text-lg text-white/70">{t('description')}</p>
        <Button asChild size="lg">
          <Link href="/">{t('button')}</Link>
        </Button>
      </IceGlassCard>
    </div>
  );
}
