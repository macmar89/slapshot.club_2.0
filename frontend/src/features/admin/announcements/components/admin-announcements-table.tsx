import { AdminAnnouncementDto } from '../announcements.types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface AdminAnnouncementsTableProps {
  announcements: AdminAnnouncementDto[];
  isLoading: boolean;
}

export const AdminAnnouncementsTable = ({ announcements }: AdminAnnouncementsTableProps) => {
  const t = useTranslations('Admin.Announcements.table');
  const router = useRouter();

  if (!announcements || announcements.length === 0) {
    return (
      <div className="p-12 text-center font-medium tracking-widest text-white/30 uppercase italic">
        {t('no_announcements_found')}
      </div>
    );
  }

  const handleRowClick = (slug: string) => {
    router.push(`/admin/announcements/${slug}`);
  };

  return (
    <div className="relative hidden w-full overflow-x-auto rounded-b-xl font-sans md:block">
      <table className="w-full table-fixed text-left text-sm">
        <thead className="border-b border-white/10 bg-white/5 text-[10px] font-black tracking-widest text-white/40 uppercase">
          <tr>
            <th scope="col" className="w-[40%] px-6 py-4">
              {t('title')}
            </th>
            <th scope="col" className="w-[15%] px-6 py-4">
              {t('type')}
            </th>
            <th scope="col" className="w-[15%] px-6 py-4 text-center">
              {t('status')}
            </th>
            <th scope="col" className="w-[15%] px-6 py-4">
              {t('published_at')}
            </th>
            <th scope="col" className="w-[15%] px-6 py-4">
              {t('created_at')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {announcements.map((announcement) => (
            <tr
              key={announcement.id}
              onClick={() => handleRowClick(announcement.slug)}
              className="group cursor-pointer transition-all hover:bg-white/[0.04]"
            >
              <td className="truncate px-6 py-4 font-bold text-white/90">
                {announcement.title || <span className="text-white/20 italic">No title</span>}
              </td>
              <td className="px-6 py-4">
                <Badge
                  variant="outline"
                  className="border-white/10 text-[9px] font-black tracking-widest text-white/60 uppercase"
                >
                  {announcement.type}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {announcement.isPublished ? (
                    <div className="text-primary flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                      <Check className="h-4 w-4" />
                      <span className="text-[9px] font-black tracking-tighter uppercase">
                        {t('published')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-white/20">
                      <X className="h-3 w-3" />
                      <span className="text-[9px] font-black tracking-tighter uppercase">
                        {t('draft')}
                      </span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 font-mono text-[11px] whitespace-nowrap text-white/60">
                {announcement.publishedAt
                  ? format(new Date(announcement.publishedAt), 'dd.MM.yyyy')
                  : '-'}
              </td>
              <td className="px-6 py-4 font-mono text-[11px] whitespace-nowrap text-white/40">
                {format(new Date(announcement.createdAt), 'dd.MM.yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
