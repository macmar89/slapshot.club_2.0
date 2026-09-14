'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GroupJoinForm } from '@/features/competitions/groups/components/group-join-form';

export function JoinLeagueModal() {
  const t = useTranslations('Groups');
  const tArena = useTranslations('Arena');
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full gap-1.5 sm:gap-2">
          <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sm:hidden">{tArena('join_modal.confirm')}</span>
          <span className="hidden sm:inline">{t('join_section')}</span>
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton className="overflow-hidden p-0 sm:max-w-md">
        <div className="relative flex min-h-[320px] flex-col p-8 sm:p-10">
          <DialogHeader className="relative z-30 mb-8 text-center sm:text-left">
            <DialogTitle className="font-display text-primary text-2xl font-black tracking-tight uppercase italic drop-shadow-sm">
              {t('join_title') || 'Máš pozvánku?'}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed font-bold tracking-[0.1em] text-white/60 uppercase">
              {t('join_description') || 'Zadaj kód od kamoša a pridaj sa do partie.'}
            </DialogDescription>
          </DialogHeader>

          <div className="group/form relative z-10 flex flex-1 flex-col justify-center">
            <div className="bg-primary/5 pointer-events-none absolute -inset-4 rounded-full opacity-0 blur-2xl transition-opacity group-hover/form:opacity-100" />
            <GroupJoinForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
