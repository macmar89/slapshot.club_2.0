'use client';

import { format } from 'date-fns';
import { sk, enUS, cs } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { AdminAnnouncementDto } from '../../admin/announcements/announcements.types';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { AnnouncementTypeBadge } from './announcement-type-badge';

interface AnnouncementCardProps {
  announcement: AdminAnnouncementDto;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const locale = useLocale();

  const dateLocale = locale === 'sk' ? sk : locale === 'cs' ? cs : enUS;
  const publishedDate = announcement.publishedAt
    ? format(new Date(announcement.publishedAt), 'd. MMMM yyyy HH:mm', { locale: dateLocale })
    : '';

  return (
    <Link href={`/announcements/${announcement.slug}`} className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <IceGlassCard
      className={cn(
        'overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]',
      )}
    >
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <AnnouncementTypeBadge type={announcement.type} />

          <time className="text-xs font-medium tracking-widest text-white/60 uppercase">
            {publishedDate}
          </time>
        </div>

        <div>
          <h2 className="text-md font-bold text-white md:text-lg lg:text-xl">
            {announcement.title}
          </h2>
        </div>
      </div>
    </IceGlassCard>
    </Link>
  );
}
