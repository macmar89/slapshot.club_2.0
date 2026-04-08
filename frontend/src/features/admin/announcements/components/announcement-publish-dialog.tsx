'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';

interface AnnouncementPublishDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function AnnouncementPublishDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  isEdit,
}: AnnouncementPublishDialogProps) {
  const t = useTranslations('Admin.Announcements');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-app border-white/10 bg-slate-950/90 backdrop-blur-2xl">
        <DialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 ring-8 ring-primary/5">
            <AlertTriangle className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-black tracking-wider uppercase italic text-white font-mono">
            {t('publish_confirm_title')}
          </DialogTitle>
          <DialogDescription className="text-white/60 font-medium">
            {t('publish_confirm_irreversible')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-app border border-white/10 bg-white/5 font-bold tracking-widest uppercase italic transition-all hover:bg-white/10 hover:text-white"
          >
            {t('cancel')}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 rounded-app font-bold tracking-widest uppercase italic text-white shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all"
          >
            {isLoading ? (isEdit ? t('form.publish_edit') : t('form.publish')) + '...' : (isEdit ? t('form.publish_edit') : t('form.publish'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
