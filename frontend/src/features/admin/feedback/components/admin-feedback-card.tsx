import { mutate } from 'swr';
import { API_ROUTES } from '@/lib/api-routes';
import { AdminFeedbackDto } from '../feedback.types';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { AdminFeedbackStatusBadge } from './admin-feedback-status-badge';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from '@/i18n/routing';

interface AdminFeedbackCardProps {
  feedback: AdminFeedbackDto;
}

export const AdminFeedbackCard = ({ feedback }: AdminFeedbackCardProps) => {
  const t = useTranslations('Admin.Feedback');
  const tType = useTranslations('Admin.Feedback.type');
  const router = useRouter();

  const handleClick = () => {
    mutate((key) => typeof key === 'string' && key.startsWith(API_ROUTES.ADMIN.FEEDBACK.LIST));
    mutate(API_ROUTES.ADMIN.FEEDBACK.UNREAD_COUNT);
    router.push(`/admin/feedback/${feedback.id}`);
  };

  return (
    <IceGlassCard
      onClick={handleClick}
      className="flex flex-col gap-4 border-white/10 p-5 active:scale-[0.98] transition-all cursor-pointer overflow-hidden relative"
    >
      {!feedback.read && (
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-blue-500/20 blur-xl" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="font-mono text-[9px] tracking-widest uppercase border-white/10 text-white/50">
          {tType(feedback.type)}
        </Badge>
        <span className="text-[10px] font-mono text-white/30 italic">
          {format(new Date(feedback.createdAt), 'dd.MM.yyyy')}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate lowercase italic tracking-tight">
            @{feedback.username || t('anonymous')}
          </span>
          <span className="text-[10px] text-white/40 font-mono truncate">
            {feedback.userEmail || '—'}
          </span>
        </div>
        <AdminFeedbackStatusBadge status={feedback.status} />
      </div>

      <p className="text-xs text-white/60 line-clamp-2 italic leading-relaxed">
        {feedback.message}
      </p>
    </IceGlassCard>
  );
};
