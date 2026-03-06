'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter, Link } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handlePostLogin } from '@/features/auth/auth.api';
import { getLoginSchema, type LoginInput } from '@/features/auth/auth.schema';
import { useTranslations } from 'next-intl';
import { Turnstile } from '@/components/common/turnstile';
import { PasswordInput } from './password-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export const LoginForm = () => {
  const t = useTranslations('Auth');

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(getLoginSchema(t)),
    defaultValues: {
      identifier: '',
      password: '',
      turnstileToken: '',
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await handlePostLogin(data);

      if (res.success) {
        router.refresh();
        router.push('/arena');
      } else {
        setError(res.message || 'Prihlásenie zlyhalo');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Nastala neočakávaná chyba');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-6">
        <div className="mb-4 flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">
            {t('welcome_back')}
          </h2>
          <p className="text-sm font-medium text-white/40">{t('continue_journey')}</p>
        </div>

        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left">
                <FormLabel className="ml-1 text-xs font-medium tracking-wider text-white/80 uppercase">
                  {t('email_or_username')}
                </FormLabel>
                <FormControl>
                  <input
                    {...field}
                    id="identifier"
                    type="text"
                    placeholder={t('email_placeholder')}
                    disabled={isLoading}
                    className={cn(
                      'rounded-app w-full px-4 py-3 transition-all duration-200 outline-none',
                      'border border-white/10 bg-white/5 text-white placeholder:text-white/30',
                      'focus:border-white/30 focus:bg-white/10 focus:ring-1 focus:ring-white/30',
                      'hover:border-white/20 hover:bg-white/10',
                      isLoading && 'cursor-not-allowed opacity-50',
                      errors.identifier && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    )}
                  />
                </FormControl>
                <FormMessage className="ml-1 text-xs text-red-500" />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="turnstileToken"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Turnstile
                    onSuccess={field.onChange}
                    onError={() =>
                      form.setError('turnstileToken', { message: t('turnstile_error') })
                    }
                    onExpire={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage className="text-center text-xs text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="rounded-app border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm font-medium text-red-500">
            {t(`errors.${error}`)}
          </div>
        )}

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
    </Form>
  );
};
