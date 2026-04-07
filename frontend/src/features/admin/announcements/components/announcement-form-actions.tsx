import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface AnnouncementFormActionsProps {
  isEdit?: boolean;
  isLoading?: boolean;
  onDelete?: () => void;
  onPublish: () => void;
}

export const AnnouncementFormActions = ({
  isEdit,
  isLoading,
  onDelete,
  onPublish,
}: AnnouncementFormActionsProps) => {
  const t = useTranslations('Admin.Announcements.form');

  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-6">
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading} variant="secondary">
          {t('save')}
        </Button>
        <Button
          type="button"
          onClick={onPublish}
          disabled={isLoading}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {isEdit ? t('publish_edit') : t('publish')}
        </Button>
      </div>

      {isEdit && onDelete && (
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={isLoading}
        >
          {t('delete')}
        </Button>
      )}
    </div>
  );
};
