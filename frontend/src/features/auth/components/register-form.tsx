'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';

import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { AvailabilityInput } from './availability-input';
import { PasswordInput } from '@/features/auth/components/password-input';
import dynamic from 'next/dynamic';
import { Turnstile } from '@/components/common/turnstile';
import { getRegisterSchema } from '../auth.schema';

const GdprModalContent = dynamic(() => import('./gdpr-content-dialog'), { ssr: false });

interface RegisterFormProps {
  referralCode?: string;
}

export const RegisterForm = ({ referralCode }: RegisterFormProps) => {
  const router = useRouter();
  const t = useTranslations('Auth');

  const locale = useLocale();

  console.log(referralCode);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [gdprOpen, setGdprOpen] = useState(false);

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

  const onSubmit = async (data: any) => {
    console.log(data);
  };
  // const onSubmit = async (data: RegisterFormData) => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const res = await registerUser({
  //       ...data,
  //       preferredLanguage: locale,
  //     });

  //     if (res.ok) {
  //       setIsSuccess(true);
  //     } else {
  //       setError(res.data.errors?.[0]?.message || 'Registrácia zlyhala');
  //     }
  //   } catch (_err) {
  //     setError('Nastala neočakávaná chyba');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  if (isSuccess) {
    return (
      <div className="animate-in fade-in zoom-in flex w-full max-w-sm flex-col items-center gap-6 text-center duration-500">
        <div className="bg-gold/10 border-gold/20 mb-2 flex h-20 w-20 items-center justify-center rounded-full border">
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
            {t('register_success_title')}
          </h2>
          <p className="font-medium text-white/60">{t('register_success_description')}</p>
        </div>
        <Button color="gold" className="mt-4 w-full" onClick={() => router.push('/login')}>
          {t('login')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-6 pb-2">
      <div className="mb-4 flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold tracking-tighter text-white uppercase">
          {t('register_title')}
        </h2>
        <p className="text-sm font-medium text-white/40">{t('register_subtitle')}</p>
      </div>

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
          disabled={isLoading}
          error={errors.username?.message}
          register={register('username')}
          onAvailabilityChange={setIsUsernameAvailable}
        />

        {/* 
        <AvailabilityInput
          id="email"
          type="email"
          label={t('email')}
          placeholder={t('email_placeholder')}
          disabled={isLoading}
          error={errors.email?.message}
          register={register('email')}
          onAvailabilityChange={setIsEmailAvailable}
        />

        <PasswordInput
          id="password"
          label={t('password')}
          placeholder={t('password_placeholder')}
          disabled={isLoading}
          error={errors.password?.message}
          hint={!errors.password?.message ? t('password_hint') : undefined}
          register={register('password')}
        /> */}

        {/* <Turnstile
          onSuccess={(token) => setValue('turnstileToken', token)}
          onError={() => setError(t('turnstile_error'))}
          onExpire={() => setValue('turnstileToken', '')}
        />
        {errors.turnstileToken && (
          <p className="text-center text-xs text-red-500">{errors.turnstileToken.message}</p>
        )} */}

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
                  className="cursor-pointer border-white/30 data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:bg-transparent data-[state=checked]:text-[hsl(var(--primary))]"
                />
              </div>
            )}
          />
          <div className="grid gap-1 leading-none">
            <label
              htmlFor="gdpr"
              className="cursor-pointer text-xs leading-tight font-medium text-white/80 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('gdpr_label_prefix')}{' '}
              <span
                className="text-gold cursor-pointer hover:underline"
                onClick={(e) => {
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
                  className="cursor-pointer border-white/30 data-[state=checked]:border-[hsl(var(--primary))] data-[state=checked]:bg-transparent data-[state=checked]:text-[hsl(var(--primary))]"
                />
              </div>
            )}
          />
          <label
            htmlFor="marketing"
            className="cursor-pointer text-xs leading-snug font-medium text-white/60 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('marketing_label')}
          </label>
        </div>
      </div>

      <Button
        type="submit"
        color="gold"
        className="w-full py-4 text-base font-bold tracking-wide"
        disabled={isLoading || !isUsernameAvailable || !isEmailAvailable}
      >
        {isLoading ? t('registering') : t('register_button')}
      </Button>

      <div className="mt-2 text-center text-sm text-white/50">
        {t('already_have_account')}{' '}
        <Link href="/login" className="font-semibold text-white hover:underline">
          {t('login')}
        </Link>
      </div>

      {gdprOpen && <GdprModalContent open={gdprOpen} onOpenChange={setGdprOpen} />}
    </form>
  );
};
