'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { IceGlassCard } from '@/components/ui/IceGlassCard';
import { markAnnouncementAsSeen } from '@/features/auth/actions';
import { X, Bell } from 'lucide-react';
import Image from 'next/image';

interface AnnouncementModalProps {
  id: string;
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  buttonText?: string;
  image?: any;
}

export const AnnouncementModal = ({
  id,
  title,
  description,
  isOpen,
  onClose,
  icon,
  buttonText = 'OK',
  image,
}: AnnouncementModalProps) => {
  const handleClose = async () => {
    await markAnnouncementAsSeen(id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="z-[100] max-w-md border-none bg-transparent p-0 shadow-none">
        <IceGlassCard className="animate-welcome p-1 sm:p-2" backdropBlur="xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-6 text-center sm:p-8">
            <div className="bg-gold/5 absolute top-0 left-0 h-24 w-24 -translate-x-8 -translate-y-8 rounded-full blur-2xl filter" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              {image && typeof image === 'object' && (
                <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                  <Image src={image.url} alt={image.alt || title} fill className="object-cover" />
                </div>
              )}

              {!image && (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  {icon || <Bell className="text-gold h-8 w-8" />}
                </div>
              )}

              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tighter text-white uppercase italic">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-2 text-base leading-relaxed text-white/60">
                  {description}
                </DialogDescription>
              </DialogHeader>

              <Button
                color="gold"
                className="w-full py-5 text-sm font-black tracking-wide uppercase italic"
                onClick={handleClose}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </IceGlassCard>
      </DialogContent>
    </Dialog>
  );
};
