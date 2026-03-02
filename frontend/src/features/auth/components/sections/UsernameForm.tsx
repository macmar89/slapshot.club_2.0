'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { User, AlertCircle } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usernameUpdateSchema, type UsernameUpdateFormData } from '@/features/auth/schema';
import { updateUsernameAction } from '@/features/auth/account-actions';

interface UsernameFormProps {
  initialUsername: string;
  onUsernameUpdated: (newUsername: string) => void;
}

export function UsernameForm({ initialUsername, onUsernameUpdated }: UsernameFormProps) {
  const t = useTranslations('Account');
  const authT = useTranslations('Auth');
  const commonT = useTranslations('Common');

  const {
    register: registerUsername,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: usernameErrors, isSubmitting: isUsernameSubmitting },
  } = useForm<UsernameUpdateFormData>({
    resolver: zodResolver(usernameUpdateSchema),
    defaultValues: { username: initialUsername },
  });

  const onUsernameSubmit = async (data: UsernameUpdateFormData) => {
    const res = await updateUsernameAction(data.username);
    if (res.ok) {
      toast.success(commonT('success_title'));
      onUsernameUpdated(data.username);
    } else {
      toast.error(res.error || commonT('error_generic'));
    }
  };

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:p-8">
      <form
        onSubmit={handleUsernameSubmit(onUsernameSubmit)}
        className="flex h-full flex-col gap-4 md:gap-6"
      >
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-white uppercase italic md:text-xl">
            <User className="text-primary h-4 w-4 md:h-5 md:w-5" />
            {t('username_section')}
          </h3>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
            {t('username_description')}
          </p>
        </div>

        <div className="flex flex-grow flex-col gap-2">
          <input
            {...registerUsername('username')}
            className={cn(
              'rounded-app focus:border-primary/50 w-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition-all outline-none md:py-3 md:text-base',
              usernameErrors.username && 'border-red-500',
            )}
            placeholder={authT('username_placeholder')}
          />
          {usernameErrors.username && (
            <span className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase">
              <AlertCircle className="h-3 w-3" />
              {usernameErrors.username.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          color="primary"
          className="bg-primary h-10 w-full px-8 text-xs font-black tracking-widest text-black uppercase italic md:h-12 md:text-sm"
          disabled={isUsernameSubmitting}
        >
          {isUsernameSubmitting ? commonT('loading') : t('save_button')}
        </Button>
      </form>
    </IceGlassCard>
  );
}
