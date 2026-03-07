import { z } from 'zod';
import { getBasePasswordSchema } from './auth.schema';

export const getUsernameUpdateSchema = (t: (key: string) => string) =>
  z.object({
    username: z
      .string()
      .min(4, t('errors.username_too_short'))
      .max(20, t('errors.username_too_long'))
      .regex(/^[a-zA-Z0-9_.]+$/, t('errors.username_invalid_characters')),
  });

export type UsernameUpdateFormData = z.infer<ReturnType<typeof getUsernameUpdateSchema>>;

export const getEmailChangeRequestSchema = (t: (key: string) => string) =>
  z.object({
    newEmail: z.string().email(t('errors.email_invalid')),
    message: z.string().min(10, 'Message must be at least 10 characters'),
  });

export type EmailChangeRequestFormData = z.infer<ReturnType<typeof getEmailChangeRequestSchema>>;

export const getPasswordUpdateSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z.string().min(1, t('errors.password_required') || 'Heslo je povinné'),
      newPassword: getBasePasswordSchema(t),
      confirmPassword: z.string().min(1, t('errors.confirm_password_required')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('errors.passwords_dont_match'),
      path: ['confirmPassword'],
    });

export type PasswordUpdateFormData = z.infer<ReturnType<typeof getPasswordUpdateSchema>>;
