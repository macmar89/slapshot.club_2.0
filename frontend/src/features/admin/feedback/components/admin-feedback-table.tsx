import useSWR, { mutate } from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { AdminFeedbackDto } from '../feedback.types';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { AdminFeedbackStatusBadge } from './admin-feedback-status-badge';
import { Badge } from '@/components/ui/badge';
import { useRouter } from '@/i18n/routing';
import { Check } from 'lucide-react';

interface AdminFeedbackTableProps {
  feedback: AdminFeedbackDto[];
}

export const AdminFeedbackTable = ({ feedback }: AdminFeedbackTableProps) => {
  const t = useTranslations('Admin.Feedback');
  const tType = useTranslations('Admin.Feedback.type');
  const router = useRouter();

  const handleRowClick = (id: string) => {
    // Revalidate list and unread count immediately
    mutate((key) => typeof key === 'string' && key.startsWith(API_ROUTES.ADMIN.FEEDBACK.LIST));
    mutate(API_ROUTES.ADMIN.FEEDBACK.UNREAD_COUNT);
    router.push(`/admin/feedback/${id}`);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-6 py-4 font-mono text-[10px] tracking-widest text-white/40 uppercase">
              {t('table.date')}
            </th>
            <th className="px-6 py-4 font-mono text-[10px] tracking-widest text-white/40 uppercase">
              {t('table.type')}
            </th>
            <th className="px-6 py-4 font-mono text-[10px] tracking-widest text-white/40 uppercase">
              {t('table.from')}
            </th>
            <th className="px-6 py-4 font-mono text-[10px] tracking-widest text-white/40 uppercase">
              {t('table.status')}
            </th>
            <th className="px-6 py-4 font-mono text-[10px] tracking-widest text-white/40 uppercase text-center">
              {t('table.read')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {feedback.map((item) => (
            <tr
              key={item.id}
              onClick={() => handleRowClick(item.id)}
              className="hover:bg-white/[0.05] group cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 text-xs font-mono text-white/60">
                {format(new Date(item.createdAt), 'dd.MM.yyyy')}
              </td>
              <td className="px-6 py-4">
                <Badge variant="outline" className="font-mono text-[10px] tracking-wide uppercase border-white/10 text-white/70">
                  {tType(item.type)}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white/90">
                    {item.username || t('anonymous')}
                  </span>
                  {item.userEmail && (
                    <span className="text-white/40 text-[10px] font-mono">
                      {item.userEmail}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <AdminFeedbackStatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center">
                  {item.read ? (
                    <Check className="h-4 w-4 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
