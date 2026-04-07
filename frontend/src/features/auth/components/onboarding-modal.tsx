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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/use-auth-store';
import { handlePostCompleteOnboarding } from '../auth.api';
import { Trophy, Smartphone, Rocket, ChevronRight } from 'lucide-react';

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
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20 text-primary">
              <Rocket size={32} />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-black italic uppercase tracking-tighter">
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* PRO Account Info */}
          <div className="rounded-app border border-primary/20 bg-primary/5 p-4 text-center">
            <h3 className="flex items-center justify-center gap-2 font-bold text-primary italic uppercase">
              <Trophy size={18} />
              {t('pro_account_title')}
            </h3>
            <p className="mt-1 text-sm text-white/80">
              {t.rich('pro_account_desc', {
                r: (chunks) => <span className="font-bold text-primary">{chunks}</span>,
              })}
            </p>
          </div>

          {/* Rules Summary */}
          <div>
            <h3 className="mb-3 text-xs font-black text-white/40 uppercase tracking-widest">
              {t('rules_title')}
            </h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-3 rounded-app bg-white/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500 font-bold text-xs">
                  5b
                </div>
                <span className="text-sm">{t('rules_exact')}</span>
              </div>
              <div className="flex items-center gap-3 rounded-app bg-white/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 font-bold text-xs">
                  3b
                </div>
                <span className="text-sm">{t('rules_diff')}</span>
              </div>
              <div className="flex items-center gap-3 rounded-app bg-white/5 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 font-bold text-xs">
                  2b
                </div>
                <span className="text-sm">{t('rules_winner')}</span>
              </div>
            </div>
          </div>

          {/* PWA Instructions */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-widest">
              <Smartphone size={14} />
              {t('pwa_title')}
            </h3>
            <Tabs defaultValue="android">
              <TabsList className="mb-3">
                <TabsTrigger value="android">{t('pwa_android')}</TabsTrigger>
                <TabsTrigger value="ios">{t('pwa_ios')}</TabsTrigger>
              </TabsList>
              <TabsContent value="android">
                <div className="rounded-app border border-white/5 bg-white/5 p-3 text-sm text-neutral-400 italic">
                  {t('pwa_android_desc')}
                </div>
              </TabsContent>
              <TabsContent value="ios">
                <div className="rounded-app border border-white/5 bg-white/5 p-3 text-sm text-neutral-400 italic">
                  {t('pwa_ios_desc')}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button
            size="lg"
            className="w-full font-black uppercase italic tracking-tighter"
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
