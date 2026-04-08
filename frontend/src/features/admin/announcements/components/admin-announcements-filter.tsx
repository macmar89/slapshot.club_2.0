import { useTranslations } from 'next-intl';
import { IceGlassSelect } from '@/components/ui/ice-glass-select';
import { announcementTypes } from '../announcements.types';

interface AdminAnnouncementsFilterProps {
  filters: {
    isPublished?: boolean;
    type?: string;
  };
  updateFilter: (key: string, value: unknown) => void;
}

export const AdminAnnouncementsFilter = ({ filters, updateFilter }: AdminAnnouncementsFilterProps) => {
  const t = useTranslations('Admin.Announcements.filter');

  const statusOptions = [
    { value: 'all', label: t('all_statuses') },
    { value: 'true', label: t('published') },
    { value: 'false', label: t('draft') },
  ];

  const typeOptions = [
    { value: 'all', label: t('all_types') },
    ...announcementTypes.map((type) => ({
      value: type,
      label: type,
    })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <IceGlassSelect
        label={t('status')}
        placeholder={t('all_statuses')}
        value={filters.isPublished === undefined ? 'all' : String(filters.isPublished)}
        options={statusOptions}
        onChange={(val: string | undefined) => {
          if (val === 'all') {
            updateFilter('isPublished', undefined);
          } else {
            updateFilter('isPublished', val === 'true');
          }
        }}
      />

      <IceGlassSelect
        label={t('type')}
        placeholder={t('all_types')}
        value={filters.type || 'all'}
        options={typeOptions}
        onChange={(val: string | undefined) => {
          updateFilter('type', val === 'all' ? undefined : val);
        }}
      />
    </div>
  );
};
