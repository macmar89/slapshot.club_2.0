import { z } from 'zod';
import { AuthErrors } from '../errors/auth.errors.js';
import { AuthMessages } from '../messages/auth.messages.js';

const { VALIDATION } = AuthMessages.ERRORS;

export const basePasswordSchema = z
  .string()
  .min(8, VALIDATION.PASSWORD_TOO_SHORT)
  .regex(/[A-Z]/, VALIDATION.PASSWORD_NO_UPPERCASE)
  .regex(/[a-z]/, VALIDATION.PASSWORD_NO_LOWERCASE)
  .regex(/[0-9]/, VALIDATION.PASSWORD_NO_NUMBER)
  .regex(/[@$!%*?&#^()._+\-=\[\]{};:,.]/, VALIDATION.PASSWORD_NO_SPECIAL);

const turnstileField = z.string().optional();

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(4, VALIDATION.USERNAME_TOO_SHORT)
    .max(20, VALIDATION.USERNAME_TOO_LONG)
    .regex(/^[a-zA-Z0-9_.]+$/, VALIDATION.USERNAME_INVALID_CHARACTERS),
  email: z.email(VALIDATION.INVALID_EMAIL),
  password: basePasswordSchema,
  turnstileToken: turnstileField,
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: VALIDATION.GDPR_REQUIRED,
  }),
  marketingConsent: z.boolean(),
  referralCode: z.string().optional(),
  preferredLanguage: z.string().optional(),
});

export const RegisterHandlerSchema = z.object({
  body: RegisterSchema,
});

export const LoginSchema = z.object({
  identifier: z.string().min(2, AuthErrors.VALIDATION.USERNAME_TOO_SHORT),
  password: z.string().min(8, AuthErrors.VALIDATION.PASSWORD_TOO_SHORT),
  turnstileToken: turnstileField,
});

export const CheckAvailabilitySchema = z.object({
  query: z.object({
    type: z.enum(['username', 'email'] as const),
    value: z.string().min(1),
  }),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, VALIDATION.REQUIRED),
});

export const VerifyEmailHandlerSchema = z.object({
  body: VerifyEmailSchema,
});

export const ResendVerificationSchema = z.object({
  email: z.email(VALIDATION.INVALID_EMAIL),
  turnstileToken: turnstileField,
});

export const ResendVerificationHandlerSchema = z.object({
  body: ResendVerificationSchema,
});

export const ForgotPasswordSchema = z.object({
  email: z.email(VALIDATION.INVALID_EMAIL),
  turnstileToken: turnstileField,
});

export const ForgotPasswordHandlerSchema = z.object({
  body: ForgotPasswordSchema,
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, VALIDATION.REQUIRED),
    password: basePasswordSchema,
    confirmPassword: z.string().min(1, VALIDATION.REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

export const ResetPasswordHandlerSchema = z.object({
  body: ResetPasswordSchema,
});
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
