import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';
import { Label } from '@/components/ui/label';
import { feedbackStatuses } from '../feedback.types';

interface AdminFeedbackFilterProps {
  filters: Record<string, string | boolean | undefined>;
  updateFilter: (key: string, value: unknown) => void;
}

export const AdminFeedbackFilter = ({ filters, updateFilter }: AdminFeedbackFilterProps) => {
  const t = useTranslations('Admin.Feedback.filter');
  const tStatus = useTranslations('Admin.Feedback.status');

  const statusOptions = [
    { value: 'all', label: t('all_statuses') },
    ...feedbackStatuses.map((s) => ({ value: s, label: tStatus(s) })),
  ];

  const readOptions = [
    { value: 'all', label: t('all_read') },
    { value: 'true', label: t('only_read') },
    { value: 'false', label: t('only_unread') },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
          {t('status')}
        </Label>
        <IceGlassSelect
          value={(filters.status as string) || 'all'}
          onChange={(val) => updateFilter('status', val === 'all' ? undefined : val)}
          options={statusOptions}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
          {t('read')}
        </Label>
        <IceGlassSelect
          value={filters.read === undefined ? 'all' : String(filters.read)}
          onChange={(val) => updateFilter('read', val === 'all' ? undefined : val)}
          options={readOptions}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
          {t('date_from')}
        </Label>
        <Input
          type="date"
          value={(filters.dateFrom as string) || ''}
          onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
          className="bg-white/5 border-white/10 h-12 px-4 shadow-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
          {t('date_to')}
        </Label>
        <Input
          type="date"
          value={(filters.dateTo as string) || ''}
          onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
          className="bg-white/5 border-white/10 h-12 px-4 shadow-none"
        />
      </div>
    </div>
  );
};
