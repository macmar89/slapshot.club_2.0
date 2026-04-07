'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/use-auth-store';
import { handlePostCompleteOnboarding } from '../auth.api';
import { Trophy, Rocket, ChevronRight } from 'lucide-react';

export const OnboardingModal = () => {
  const t = useTranslations('Onboarding');
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !user.hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 4000); // 4 seconds delay

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = async () => {
    setIsSubmitting(true);
    try {
      await handlePostCompleteOnboarding();
      setIsOpen(false);
    } catch {
      // Even if API fails, we close the modal to not block the user
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && setIsOpen(open)}>
      <DialogContent className="max-w-md border-white/10" showCloseButton={false}>
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <div className="bg-primary/20 text-primary rounded-full p-3">
              <Rocket size={32} />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-black tracking-tighter uppercase italic">
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* PRO Account Info */}
          <div className="rounded-app border-primary/20 bg-primary/5 border p-4 text-center">
            <h3 className="text-primary flex items-center justify-center gap-2 font-bold uppercase italic">
              <Trophy size={18} />
              {t('pro_account_title')}
            </h3>
            <p className="mt-1 text-sm text-white/80">
              {t.rich('pro_account_desc', {
                r: (chunks) => <span className="text-primary font-bold">{chunks}</span>,
              })}
            </p>
          </div>

          {/* Rules Summary */}
          <div>
            <h3 className="mb-3 text-xs font-black tracking-widest text-white/40 uppercase">
              {t('rules_title')}
            </h3>
            <div className="grid gap-2">
              <div className="rounded-app flex items-center gap-3 bg-white/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-500">
                  5b
                </div>
                <span className="text-sm">{t('rules_exact')}</span>
              </div>
              <div className="rounded-app flex items-center gap-3 bg-white/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-500">
                  3b
                </div>
                <span className="text-sm">{t('rules_diff')}</span>
              </div>
              <div className="rounded-app flex items-center gap-3 bg-white/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-xs font-bold text-yellow-500">
                  2b
                </div>
                <span className="text-sm">{t('rules_winner')}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            size="lg"
            className="w-full font-black tracking-tighter uppercase italic"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('finish')}
            <ChevronRight className="ml-2" size={18} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
