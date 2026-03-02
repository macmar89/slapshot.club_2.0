'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { IceGlassCard } from '@/components/ui/IceGlassCard';
import { useTranslations } from 'next-intl';
import { completeOnboarding } from '@/features/auth/actions';
import { Trophy, ShieldCheck, Users as UsersIcon, ChevronRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const t = useTranslations('Onboarding');
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  const steps = [
    {
      title: t('step1_title'),
      description: t('step1_description'),
      icon: <Trophy className="text-gold h-12 w-12" />,
    },
    {
      title: t('step2_title'),
      description: t('step2_description'),
      icon: <ShieldCheck className="text-gold h-12 w-12" />,
    },
    {
      title: t('step3_title'),
      description: t('step3_description'),
      icon: <UsersIcon className="text-gold h-12 w-12" />,
    },
  ];

  const handleNext = async () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      try {
        setIsClosing(true);
        const result = await completeOnboarding();

        if (result.ok) {
          onClose();
        } else {
          console.error('[OnboardingModal] Failed to complete onboarding:', result.error);
          // Allow closing anyway to not block the user, or show error
          onClose();
        }
      } catch (err) {
        console.error('[OnboardingModal] Unexpected error:', err);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="z-[100] max-w-lg overflow-visible border-none bg-transparent p-0 shadow-none data-[state=closed]:animate-none data-[state=open]:animate-none"
        onPointerDownOutside={(e) => e.preventDefault()} // Don't close on outside click for onboarding
      >
        <IceGlassCard
          className="animate-welcome origin-center p-1 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] sm:p-2"
          backdropBlur="xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 p-8 sm:p-10">
            {/* Background Decorations - Subtler */}
            <div className="bg-gold/5 absolute top-0 right-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full blur-3xl filter" />
            <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full bg-blue-500/5 blur-3xl filter" />

            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <DialogHeader className="w-full">
                <div className="mb-4 flex justify-center">
                  <div className="bg-gold/10 border-gold/20 animate-in zoom-in flex h-20 w-20 items-center justify-center rounded-full border shadow-[0_0_30px_rgba(212,175,55,0.15)] duration-700">
                    {steps[step - 1].icon}
                  </div>
                </div>
                <DialogTitle className="mb-2 text-3xl font-black tracking-tighter text-white uppercase italic">
                  {step === 1 ? t('title') : steps[step - 1].title}
                </DialogTitle>
                <DialogDescription className="text-lg leading-relaxed font-medium text-white/60">
                  {steps[step - 1].description}
                </DialogDescription>
              </DialogHeader>

              <div className="mb-2 flex gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i + 1 === step ? 'bg-gold w-8' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <Button
                color="gold"
                className="group w-full py-6 text-lg font-black tracking-wide uppercase italic transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleNext}
              >
                {step === steps.length ? (
                  <>
                    {t('finish')}
                    <Check className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    {t('next')}
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </IceGlassCard>
      </DialogContent>
    </Dialog>
  );
};
