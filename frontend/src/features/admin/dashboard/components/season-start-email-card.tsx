'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Mail, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminSeasonStartEmail } from '../api/use-admin-season-start-email';

export const SeasonStartEmailCard = () => {
  const t = useTranslations('Admin.Dashboard.season_start_email');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sendSeasonStartEmails, isSending } = useAdminSeasonStartEmail();

  const handleConfirm = async () => {
    const result = await sendSeasonStartEmails();

    if (result) {
      toast.success(t('success', { count: result.recipientCount }));
      setIsDialogOpen(false);
    } else {
      toast.error(t('error'));
    }
  };

  return (
    <IceGlassCard className="relative overflow-hidden border-white/10 p-6 shadow-2xl">
      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <Mail className="text-primary h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-black tracking-widest text-white uppercase italic">
              {t('title')}
            </h3>
            <p className="text-xs text-white/50">{t('description')}</p>
          </div>
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="h-11 shrink-0 rounded-xl px-6 font-black tracking-widest uppercase italic"
        >
          <Send className="mr-2 h-4 w-4" />
          {t('trigger')}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-white/10 bg-slate-950/90 backdrop-blur-2xl">
          <DialogHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <DialogTitle className="text-xl font-black tracking-widest text-white uppercase italic">
              {t('confirm_title')}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {t('confirm_desc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSending}
              className="font-bold tracking-widest uppercase italic"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSending}
              className="font-bold tracking-widest uppercase italic"
            >
              {isSending ? t('sending') : t('confirm_action')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IceGlassCard>
  );
};
