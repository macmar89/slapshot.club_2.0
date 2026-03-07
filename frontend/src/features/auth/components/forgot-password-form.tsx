'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handlePostForgotPassword } from '@/features/auth/auth.api';
import { getForgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/auth.schema';
import { useTranslations } from 'next-intl';
import { Turnstile } from '@/components/common/turnstile';
import { Link } from '@/i18n/routing';
import { toast } from 'sonner';

export const ForgotPasswordForm = () => {
  const t = useTranslations('Auth');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const schema = getForgotPasswordSchema(t);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      turnstileToken: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await handlePostForgotPassword(data);

      if (res.success) {
        setIsSent(true);
        toast.success(t('forgot_password_success') || 'Inštrukcie boli odoslané na váš email.');
      } else {
        setError(t(`errors.${res.message}`));
      }
    } catch {
      setError(t('error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-6 text-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">
            {t('forgot_password_title')}
          </h2>
          <p className="font-medium text-white/60">
            {t('forgot_password_success_desc') ||
              'Skontrolujte si svoju e-mailovú schránku pre ďalší postup.'}
          </p>
        </div>
        <Link href="/login" className="text-gold font-semibold hover:underline">
          {t('back_to_login')}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-6">
      <div className="mb-4 flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">
          {t('forgot_password_title')}
        </h2>
        <p className="text-sm font-medium text-white/40">{t('forgot_password_subtitle')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-app border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-2 text-left">
          <label
            htmlFor="email"
            className="ml-1 text-xs font-medium tracking-wider text-white/80 uppercase"
          >
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            placeholder={t('email_placeholder')}
            disabled={isLoading}
            {...register('email')}
            className={cn(
              'rounded-app w-full px-4 py-3 transition-all duration-200 outline-none',
              'border border-white/10 bg-white/5 text-white placeholder:text-white/30',
              'focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/30',
              'hover:border-white/20 hover:bg-white/10',
              isLoading && 'cursor-not-allowed opacity-50',
              errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
          />
          {errors.email && <p className="ml-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <Turnstile
          onSuccess={(token: string) => setValue('turnstileToken', token)}
          onError={() => setError(t('turnstile_error'))}
          onExpire={() => setValue('turnstileToken', '')}
        />
        {errors.turnstileToken && (
          <p className="text-center text-xs text-red-500">{errors.turnstileToken.message}</p>
        )}
      </div>

      <Button type="submit" color="gold" className="w-full py-6 text-lg" disabled={isLoading}>
        {isLoading ? t('sending') : t('send_instructions')}
      </Button>

      <div className="mt-2 text-center text-sm text-white/50">
        <Link href="/" className="font-semibold text-white hover:underline">
          {t('back_to_login')}
        </Link>
      </div>
    </form>
  );
};
