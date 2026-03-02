'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUser } from '@/features/auth/actions';
import { loginSchema, type LoginFormData } from '@/features/auth/schema';
import { useTranslations } from 'next-intl';
import { Turnstile } from '@/components/auth/Turnstile';
import { Link } from '@/i18n/routing';
import { PasswordInput } from './PasswordInput';

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/arena';
  const t = useTranslations('Auth');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      turnstileToken: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await loginUser(data);

      if (res.ok) {
        router.refresh();
        router.push(redirectUrl);
      } else {
        setError(res.data.errors?.[0]?.message || 'Prihlásenie zlyhalo');
      }
    } catch (_err) {
      setError('Nastala neočakávaná chyba');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-6">
      <div className="mb-4 flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">
          {t('welcome_back')}
        </h2>
        <p className="text-sm font-medium text-white/40">{t('continue_journey')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-app border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-2 text-left">
          <label
            htmlFor="identifier"
            className="ml-1 text-xs font-medium tracking-wider text-white/80 uppercase"
          >
            {t('email_or_username')}
          </label>
          <input
            id="identifier"
            type="text"
            placeholder={t('email_placeholder')}
            disabled={isLoading}
            {...register('identifier')}
            className={cn(
              'rounded-app w-full px-4 py-3 transition-all duration-200 outline-none',
              'border border-white/10 bg-white/5 text-white placeholder:text-white/30',
              'focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/30',
              'hover:border-white/20 hover:bg-white/10',
              isLoading && 'cursor-not-allowed opacity-50',
              errors.identifier && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
          />
          {errors.identifier && (
            <p className="ml-1 text-xs text-red-500">{errors.identifier.message}</p>
          )}
        </div>

        <PasswordInput
          id="password"
          label={t('password')}
          placeholder={t('password_placeholder')}
          disabled={isLoading}
          error={errors.password?.message}
          register={register('password')}
        />

        <div className="-mt-2 flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-white/50 transition-colors hover:text-white"
          >
            {t('forgot_password')}
          </Link>
        </div>

        <Turnstile
          onSuccess={(token) => setValue('turnstileToken', token)}
          onError={() => setError(t('turnstile_error'))}
          onExpire={() => setValue('turnstileToken', '')}
        />
        {errors.turnstileToken && (
          <p className="text-center text-xs text-red-500">{errors.turnstileToken.message}</p>
        )}
      </div>

      <Button type="submit" color="gold" className="w-full py-6 text-lg" disabled={isLoading}>
        {isLoading ? t('logging_in') : t('login_button')}
      </Button>

      <div className="mt-2 text-center text-sm text-white/50">
        {t('no_account')}{' '}
        <Link href="/register" className="font-semibold text-white hover:underline">
          {t('register')}
        </Link>
      </div>
    </form>
  );
};
