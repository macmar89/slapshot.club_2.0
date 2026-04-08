'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handlePostResetPassword } from '@/features/auth/auth.api';
import { getResetPasswordSchema, type ResetPasswordInput } from '@/features/auth/auth.schema';
import { useTranslations } from 'next-intl';
import { PasswordInput } from './password-input';
import { toast } from 'sonner';

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('Auth');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const schema = getResetPasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token || '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setError(t('verify_error'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await handlePostResetPassword(data);

      if (res.success) {
        setIsSuccess(true);
        toast.success(t('reset_password_success'));
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(t(`errors.${res.message}`));
      }
    } catch {
      setError(t('error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-6 text-center">
        <div className="bg-gold/10 border-gold/20 mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border">
          <svg
            className="text-gold h-10 w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl leading-tight font-bold tracking-tighter text-white uppercase">
            {t('success_title')}
          </h2>
          <p className="font-medium text-white/60">{t('reset_password_success')}</p>
          <p className="text-sm text-white/40 italic">{t('redirect_to_app')}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-6">
      <div className="mb-4 flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">
          {t('reset_password_title')}
        </h2>
        <p className="text-sm font-medium text-white/40">{t('reset_password_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-app border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        <PasswordInput
          id="password"
          label={t('password')}
          placeholder={t('password_placeholder')}
          disabled={isLoading}
          error={errors.password?.message as string}
          hint={!errors.password?.message ? t('password_hint') : undefined}
          register={register('password')}
        />

        <PasswordInput
          id="confirmPassword"
          label={t('confirm_password') || 'Potvrdiť heslo'}
          placeholder={t('password_placeholder')}
          disabled={isLoading}
          error={errors.confirmPassword?.message as string}
          register={register('confirmPassword')}
        />
      </div>

      <Button
        type="submit"
        color="gold"
        className="w-full py-6 text-lg"
        disabled={isLoading || !token}
      >
        {isLoading ? t('loading') : t('reset_password_button')}
      </Button>

      {!token && <p className="text-center text-xs text-red-500">{t('verify_error')}</p>}
    </form>
  );
};
