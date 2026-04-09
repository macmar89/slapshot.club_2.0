'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Lock, CheckCircle2 } from 'lucide-react';
import { IceGlassCard } from '@/components/ui/ice-glass-card';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/features/auth/components/password-input';
import { getPasswordUpdateSchema, type PasswordUpdateFormData } from '@/features/auth/schema';
import { updatePasswordAction } from '@/features/account/account.api';

export function SecurityForm() {
  const t = useTranslations('Account');
  const authT = useTranslations('Auth');
  const commonT = useTranslations('Common');

  const schema = React.useMemo(() => getPasswordUpdateSchema(authT), [authT]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(schema),
  });

  const onPasswordSubmit = async (data: PasswordUpdateFormData) => {
    const res = await updatePasswordAction(
      data.currentPassword,
      data.newPassword,
      data.confirmPassword,
    );
    if (res.ok) {
      toast.success(commonT('success_title'));
      resetPassword();
    } else {
      toast.error(res.error || commonT('error_generic'));
    }
  };

  return (
    <IceGlassCard backdropBlur="md" className="p-6 md:col-span-2 md:p-8">
      <form
        onSubmit={handlePasswordSubmit(onPasswordSubmit)}
        className="flex flex-col gap-4 md:gap-6"
      >
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-white uppercase italic md:text-xl">
            <Lock className="text-primary h-4 w-4 md:h-5 md:w-5" />
            {t('security_section')}
          </h3>
          <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
            {t('security_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <PasswordInput
            id="currentPassword"
            label={authT('password')}
            placeholder={authT('password_placeholder')}
            disabled={isPasswordSubmitting}
            error={passwordErrors.currentPassword?.message}
            register={registerPassword('currentPassword')}
            autoComplete="off"
          />
          <div className="hidden md:block" />
          <PasswordInput
            id="newPassword"
            label={commonT('new_password')}
            placeholder={authT('password_placeholder')}
            disabled={isPasswordSubmitting}
            error={passwordErrors.newPassword?.message}
            register={registerPassword('newPassword')}
            autoComplete="off"
          />
          <PasswordInput
            id="confirmPassword"
            label={commonT('confirm_password')}
            placeholder={authT('password_placeholder')}
            disabled={isPasswordSubmitting}
            error={passwordErrors.confirmPassword?.message}
            register={registerPassword('confirmPassword')}
            autoComplete="off"
          />
        </div>

        <Button
          type="submit"
          color="primary"
          className="bg-primary h-10 w-full self-end px-12 text-xs font-black tracking-widest text-black uppercase italic md:h-12 md:w-auto md:text-sm"
          disabled={isPasswordSubmitting}
        >
          {isPasswordSubmitting ? commonT('loading') : t('change_password')}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/5 py-6 text-white/10 md:mt-8 md:py-8">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-[10px] font-black tracking-[0.5em] uppercase italic">
          {t('encrypted_notice')}
        </span>
      </div>
    </IceGlassCard>
  );
}
