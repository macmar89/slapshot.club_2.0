'use client';

import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PageHeader } from '@/components/layout/page-header';

export const AdminAnnouncementsView = () => {
  const t = useTranslations('Admin.Announcements');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 duration-700 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <PageHeader title={t('title')} hideDescriptionOnMobile />
        <Link href="/admin/announcements/create">
          <Button>
            <Plus className="h-5 w-5" />
            {t('create_button')}
          </Button>
        </Link>
      </div>

      <IceGlassCard className="relative overflow-hidden border-white/10 p-12 shadow-2xl">
        <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />
        <div className="relative text-center font-bold tracking-widest text-white/20 uppercase italic">
          Zoznam oznámení (čoskoro)
        </div>
      </IceGlassCard>
    </div>
  );
};
