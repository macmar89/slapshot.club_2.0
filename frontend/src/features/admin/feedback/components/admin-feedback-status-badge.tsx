import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { FeedbackStatus } from '../feedback.types';
import { cn } from '@/lib/utils';

interface AdminFeedbackStatusBadgeProps {
  status: FeedbackStatus;
  className?: string;
}

export const AdminFeedbackStatusBadge = ({ status, className }: AdminFeedbackStatusBadgeProps) => {
  const t = useTranslations('Admin.Feedback.status');

  const variants: Record<FeedbackStatus, string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    ignored: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <Badge
      variant="outline"
      className={cn('font-mono text-[10px] tracking-widest uppercase', variants[status], className)}
    >
      {t(status)}
    </Badge>
  );
};
