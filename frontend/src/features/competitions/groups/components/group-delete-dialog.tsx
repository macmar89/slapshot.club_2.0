import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GroupDeleteDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const GroupDeleteDialog = ({
  isOpen,
  setIsOpen,
  onDelete,
  isDeleting,
}: GroupDeleteDialogProps) => {
  const t = useTranslations('Groups');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('delete_confirm_title') || 'Delete League?'}</DialogTitle>
          <DialogDescription>
            {t('delete_confirm_desc') ||
              'This action cannot be undone. All members will be removed and the league will cease to exist.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            {t('cancel') || 'Cancel'}
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? t('deleting') || 'Deleting...' : t('delete_confirm_action') || 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
