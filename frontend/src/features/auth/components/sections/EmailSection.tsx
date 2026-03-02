'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Mail, ChevronRight, Send } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { emailChangeRequestSchema, type EmailChangeRequestFormData } from '@/features/auth/schema';
import { requestEmailChangeAction } from '@/features/auth/account-actions';

interface EmailSectionProps {
  email: string;
}

export function EmailSection({ email }: EmailSectionProps) {
  const t = useTranslations('Account');
  const authT = useTranslations('Auth');
  const commonT = useTranslations('Common');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    reset: resetEmail,
  } = useForm<EmailChangeRequestFormData>({
    resolver: zodResolver(emailChangeRequestSchema),
  });

  const onEmailRequestSubmit = async (data: EmailChangeRequestFormData) => {
    const res = await requestEmailChangeAction(data.newEmail, data.message);
    if (res.ok) {
      toast.success(commonT('success_title'));
      setIsEmailModalOpen(false);
      resetEmail();
    } else {
      toast.error(res.error || commonT('error_generic'));
    }
  };

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8">
      <div className="flex h-full flex-col justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-white uppercase italic md:text-xl">
            <Mail className="text-primary h-4 w-4 md:h-5 md:w-5" />
            {t('email_section')}
          </h3>
          <p className="mt-2 truncate rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/60 md:text-sm">
            {email}
          </p>
          <p className="mt-2 text-[10px] font-bold tracking-tighter text-white/20 uppercase italic">
            {t('email_hint')}
          </p>
        </div>

        <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10 border-primary/20 gap-2 border text-[10px] font-black tracking-widest uppercase italic md:text-xs"
            >
              {t('request_change')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md border-white/10 bg-slate-950/95 text-white backdrop-blur-3xl">
            <DialogHeader>
              <DialogTitle className="text-primary text-2xl font-black tracking-tighter uppercase italic">
                {t('email_modal.title')}
              </DialogTitle>
              <DialogDescription className="font-medium text-white/40">
                {t('email_modal.description')}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleEmailSubmit(onEmailRequestSubmit)}
              className="flex flex-col gap-4 py-4"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                  {t('email_modal.new_email')}
                </label>
                <input
                  {...registerEmail('newEmail')}
                  type="email"
                  className={cn(
                    'rounded-app focus:border-primary/50 w-full border border-white/10 bg-white/5 px-4 py-3 font-bold text-white transition-all outline-none',
                    emailErrors.newEmail && 'border-red-500',
                  )}
                  placeholder={authT('email_placeholder')}
                />
                {emailErrors.newEmail && (
                  <span className="text-[10px] font-black text-red-500 uppercase">
                    {emailErrors.newEmail.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                  {t('email_modal.reason')}
                </label>
                <textarea
                  {...registerEmail('message')}
                  className={cn(
                    'rounded-app focus:border-primary/50 min-h-[100px] w-full border border-white/10 bg-white/5 px-4 py-3 font-bold text-white transition-all outline-none',
                    emailErrors.message && 'border-red-500',
                  )}
                  placeholder={t('email_modal.reason_placeholder')}
                />
                {emailErrors.message && (
                  <span className="text-[10px] font-black text-red-500 uppercase">
                    {emailErrors.message.message}
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 text-xs font-black uppercase"
                  onClick={() => setIsEmailModalOpen(false)}
                >
                  {t('email_modal.cancel')}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="bg-primary flex-1 gap-2 text-xs font-black tracking-widest text-black uppercase italic"
                  disabled={isEmailSubmitting}
                >
                  {isEmailSubmitting ? (
                    commonT('loading')
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t('email_modal.submit')}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </IceGlassCard>
  );
}
