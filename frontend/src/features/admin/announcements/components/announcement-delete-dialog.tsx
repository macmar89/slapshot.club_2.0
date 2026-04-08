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
import { AlertTriangle } from 'lucide-react';

interface AnnouncementDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const AnnouncementDeleteDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
}: AnnouncementDeleteDialogProps) => {
  const t = useTranslations('Admin.Announcements');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-slate-950/90 backdrop-blur-2xl">
        <DialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-black tracking-widest text-white uppercase italic">
            {t('delete_title') || 'Delete Announcement'}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {t('delete_confirm_desc') || 'This action cannot be undone. This announcement will be permanently removed from all language versions.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="font-bold tracking-widest uppercase italic"
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="font-bold tracking-widest uppercase italic shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            {isLoading ? t('deleting') || 'Deleting...' : t('delete_action') || 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
