import { z } from 'zod';

export const getBasePasswordSchema = (t: (key: string) => string) =>
  z
    .string()
    .min(8, t('errors.password_too_short'))
    .regex(/[A-Z]/, t('errors.password_no_uppercase'))
    .regex(/[a-z]/, t('errors.password_no_lowercase'))
    .regex(/[0-9]/, t('errors.password_no_number'))
    .regex(/[@$!%*?&#^()._+\-=\[\]{};:,.]/, t('errors.password_no_special'));

const isTurnstileEnabled =
  process.env.NEXT_PUBLIC_ENABLE_TURNSTILE !== 'false' &&
  process.env.NEXT_PUBLIC_DISABLE_TURNSTILE !== 'true';

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    identifier: z.string().min(2, t('errors.username_too_short')),
    password: z.string().min(8, t('errors.password_too_short')),
    turnstileToken: isTurnstileEnabled
      ? z.string().min(1, t('errors.turnstile_error'))
      : z.string().optional(),
  });

export const getRegisterSchema = (t: (key: string) => string) =>
  z.object({
    username: z
      .string()
      .min(4, t('errors.username_too_short'))
      .max(20, t('errors.username_too_long'))
      .regex(/^[a-zA-Z0-9_.]+$/, t('errors.username_invalid_characters')),
    email: z.email(t('errors.email_invalid')),
    password: getBasePasswordSchema(t),
    turnstileToken: isTurnstileEnabled
      ? z.string().min(1, t('errors.turnstile_error'))
      : z.string().optional(),
    gdprConsent: z.boolean().refine((val) => val === true, {
      message: t('errors.gdpr_required'),
    }),
    marketingConsent: z.boolean(),
    referralCode: z.string().optional(),
    preferredLanguage: z.string().optional(),
  });

export const getForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email(t('errors.email_invalid')),
    turnstileToken: isTurnstileEnabled
      ? z.string().min(1, t('errors.turnstile_error'))
      : z.string().optional(),
  });

export const getResendVerificationSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email(t('errors.email_invalid')),
    turnstileToken: isTurnstileEnabled
      ? z.string().min(1, t('errors.turnstile_error'))
      : z.string().optional(),
  });

export const getResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: getBasePasswordSchema(t),
      confirmPassword: z.string().min(1, t('errors.confirm_password_required')),
      token: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('errors.passwords_dont_match'),
      path: ['confirmPassword'],
    });

export type LoginInput = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterInput = z.infer<ReturnType<typeof getRegisterSchema>>;
export type ForgotPasswordInput = z.infer<ReturnType<typeof getForgotPasswordSchema>>;
export type ResendVerificationInput = z.infer<ReturnType<typeof getResendVerificationSchema>>;
export type ResetPasswordInput = z.infer<ReturnType<typeof getResetPasswordSchema>>;
