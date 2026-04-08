import { AdminAnnouncementDto } from '../announcements.types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calendar, Megaphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { IceGlassCard } from '@/components/ui/ice-glass-card';

interface AdminAnnouncementCardProps {
  announcement: AdminAnnouncementDto;
}

export const AdminAnnouncementCard = ({ announcement }: AdminAnnouncementCardProps) => {
  const t = useTranslations('Admin.Announcements.table');
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/admin/announcements/${announcement.slug}`);
  };

  return (
    <IceGlassCard 
      onClick={handleCardClick}
      className="p-5 flex flex-col gap-4 border-white/10 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98] font-sans"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Megaphone className="h-3.5 w-3.5 text-primary/60" />
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-white/10 text-white/40 h-5 px-2">
              {announcement.type}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-3 w-3 text-white/30" />
            <span className="text-[11px] font-mono text-white/40">
              {format(new Date(announcement.createdAt), 'dd.MM.yyyy')}
            </span>
          </div>
        </div>
        
        {announcement.isPublished ? (
          <Badge className="bg-primary/20 text-primary border-primary/20 uppercase text-[9px] font-black h-6 px-3">
            {t('published')}
          </Badge>
        ) : (
          <Badge className="bg-white/5 text-white/30 border-white/10 uppercase text-[9px] font-black h-6 px-3">
            {t('draft')}
          </Badge>
        )}
      </div>

      <div className="text-lg font-bold text-white/90 leading-snug line-clamp-2">
        {announcement.title || <span className="text-white/20 italic">No title</span>}
      </div>

      {announcement.isPublished && announcement.publishedAt && (
        <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('published_at')}</span>
          <span className="text-[11px] font-mono text-white/60">{format(new Date(announcement.publishedAt), 'dd.MM.yyyy')}</span>
        </div>
      )}
    </IceGlassCard>
  );
};
