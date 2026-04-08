import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface AnnouncementFormActionsProps {
  isEdit?: boolean;
  isLoading?: boolean;
  onDelete?: () => void;
  onPublish: () => void;
  isDirty?: boolean;
  isDisabled?: boolean;
}

export const AnnouncementFormActions = ({
  isEdit,
  isLoading,
  onDelete,
  onPublish,
  isDirty,
  isDisabled,
}: AnnouncementFormActionsProps) => {
  const t = useTranslations('Admin.Announcements.form');

  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-6">
      <div className="flex items-center gap-4">
        <Button 
          type="submit" 
          disabled={isLoading || !isDirty || isDisabled} 
          variant="secondary"
          className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {t('save')}
        </Button>
        <Button
          type="button"
          onClick={onPublish}
          disabled={isLoading || isDirty || isDisabled}
          className={cn(
            "bg-primary hover:bg-primary/90 text-white",
            (isDirty || isDisabled) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isEdit ? t('publish_edit') : t('publish')}
        </Button>
      </div>

      {isEdit && onDelete && (
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onDelete} 
          disabled={isLoading || isDisabled}
          className={isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {t('delete')}
        </Button>
      )}
    </div>
  );
};
