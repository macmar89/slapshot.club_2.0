'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, Link } from '@/i18n/routing';
import { useForm, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';

import { useTranslations, useLocale } from 'next-intl';
import { AvailabilityInput } from './availability-input';
import { PasswordInput } from '@/features/auth/components/password-input';
import dynamic from 'next/dynamic';
import { Turnstile } from '@/components/common/turnstile';
import { type TurnstileInstance } from '@marsidev/react-turnstile';
import { getRegisterSchema, type RegisterInput } from '@/features/auth/auth.schema';
import { handlePostRegister } from '@/features/auth/auth.api';

const GdprModalContent = dynamic(() => import('./gdpr-content-dialog'), { ssr: false });

interface RegisterFormProps {
  referralCode?: string;
}

export const RegisterForm = ({ referralCode }: RegisterFormProps) => {
  const router = useRouter();
  const t = useTranslations('Auth');

  const locale = useLocale();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
  const [gdprOpen, setGdprOpen] = useState<boolean>(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    // } = useForm<RegisterFormData>({
    resolver: zodResolver(getRegisterSchema(t)),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      turnstileToken: '',
      gdprConsent: false,
      marketingConsent: false,
      referralCode: referralCode || '',
    },
  });

  const isRegistrationOpen = process.env.NEXT_PUBLIC_REGISTRATION_OPEN !== 'false';

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await handlePostRegister({
        ...data,
        preferredLanguage: locale,
      });

      if (res.success) {
        router.push('/arena');
      } else {
        setError(t(`errors.${res.message}`) || t('errors.registration_failed'));
        turnstileRef.current?.reset();
        setValue('turnstileToken', '');
      }
    } catch {
      setError(t('errors.unexpected_error'));
      turnstileRef.current?.reset();
      setValue('turnstileToken', '');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-6 pb-2">
      <div className="mb-4 flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">
          {t('register_title')}
        </h2>
        <p className="text-sm font-medium text-white/40">{t('register_subtitle')}</p>
      </div>

      {!isRegistrationOpen && (
        <div className="rounded-app animate-in fade-in slide-in-from-top-2 border border-red-600 px-4 py-3 text-center transition-all duration-300">
          <p className="text-sm leading-tight font-bold tracking-tight text-red-500 uppercase">
            {t('registration_closed_title')}
          </p>
          <p className="mt-1 text-xs leading-snug font-medium text-white">
            {t('registration_closed_desc')}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {error && (
          <div className="rounded-app border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        <AvailabilityInput
          id="username"
          type="username"
          label={t('username')}
          hint={t('username_hint')}
          placeholder={t('username_placeholder')}
          disabled={isLoading || !isRegistrationOpen}
          error={errors.username?.message}
          register={register('username')}
          onAvailabilityChange={setIsUsernameAvailable}
        />

        <AvailabilityInput
          id="email"
          type="email"
          label={t('email')}
          placeholder={t('email_placeholder')}
          disabled={isLoading || !isRegistrationOpen}
          error={errors.email?.message}
          register={register('email')}
          onAvailabilityChange={setIsEmailAvailable}
        />

        <PasswordInput
          id="password"
          label={t('password')}
          placeholder={t('password_placeholder')}
          disabled={isLoading || !isRegistrationOpen}
          error={errors.password?.message}
          hint={!errors.password?.message ? t('password_hint') : undefined}
          register={register('password')}
        />

        {!isLoading && isRegistrationOpen && (
          <Turnstile
            ref={turnstileRef}
            onSuccess={(token) => setValue('turnstileToken', token)}
            onError={() => setError(t('errors.turnstile_error'))}
            onExpire={() => setValue('turnstileToken', '')}
          />
        )}
        {errors.turnstileToken && (
          <p className="text-center text-xs text-red-500">{errors.turnstileToken.message}</p>
        )}

        <div className="relative flex flex-row items-start gap-2 pt-1 text-left">
          <Controller
            name="gdprConsent"
            control={control}
            render={({ field }) => (
              <div className="relative mt-0.5 flex shrink-0 items-center justify-center">
                <Checkbox
                  id="gdpr"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading || !isRegistrationOpen}
                  className="cursor-pointer border-white/30 data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:bg-transparent data-[state=checked]:text-[hsl(var(--primary))]"
                />
              </div>
            )}
          />
          <div className="grid gap-1 leading-none">
            <label
              htmlFor="gdpr"
              className={cn(
                'text-xs leading-tight font-medium text-white/80 select-none peer-disabled:opacity-70',
                !isRegistrationOpen ? 'cursor-not-allowed' : 'cursor-pointer',
              )}
            >
              {t('gdpr_label_prefix')}{' '}
              <span
                className={cn(
                  'text-gold',
                  !isRegistrationOpen ? 'cursor-not-allowed' : 'cursor-pointer hover:underline',
                )}
                onClick={(e) => {
                  if (!isRegistrationOpen) return;
                  e.preventDefault();
                  e.stopPropagation();
                  setGdprOpen(true);
                }}
              >
                {t('gdpr_label_link')}
              </span>
            </label>
            {errors.gdprConsent && (
              <p className="text-xs text-red-500">{errors.gdprConsent.message}</p>
            )}
          </div>
        </div>

        <div className="relative flex flex-row items-start gap-2 text-left">
          <Controller
            name="marketingConsent"
            control={control}
            render={({ field }) => (
              <div className="relative mt-0.5 flex shrink-0 items-center justify-center">
                <Checkbox
                  id="marketing"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading || !isRegistrationOpen}
                  className="cursor-pointer border-white/30 data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:bg-transparent data-[state=checked]:text-[hsl(var(--primary))]"
                />
              </div>
            )}
          />
          <label
            htmlFor="marketing"
            className={cn(
              'text-xs leading-snug font-medium text-white/60 select-none peer-disabled:opacity-70',
              !isRegistrationOpen ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {t('marketing_label')}
          </label>
        </div>
      </div>

      <Button
        type="submit"
        color="gold"
        className="w-full py-4 text-base font-bold tracking-wide"
        disabled={isLoading || !isUsernameAvailable || !isEmailAvailable || !isRegistrationOpen}
      >
        {isLoading ? t('registering') : t('register_button')}
      </Button>

      <div className="mt-2 text-center text-sm text-white/50">
        {t('already_have_account')}{' '}
        <Link href="/" className="font-semibold text-white hover:underline">
          {t('login')}
        </Link>
      </div>

      {gdprOpen && <GdprModalContent open={gdprOpen} onOpenChange={setGdprOpen} />}
    </form>
  );
};
