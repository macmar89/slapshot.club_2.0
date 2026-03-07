import { z } from 'zod';
import { AuthMessages } from '../messages/auth.messages.js';

const { VALIDATION } = AuthMessages.ERRORS;

export const UpdatePreferredLanguageSchema = z.object({
  preferredLanguage: z.enum(['sk', 'en', 'cs'] as const),
});

export const UpdatePreferredLanguageHandlerSchema = z.object({
  body: UpdatePreferredLanguageSchema,
});

export const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(4, VALIDATION.USERNAME_TOO_SHORT)
    .max(20, VALIDATION.USERNAME_TOO_LONG)
    .regex(/^[a-zA-Z0-9_.]+$/, VALIDATION.USERNAME_INVALID_CHARACTERS),
});

export const UpdateUsernameHandlerSchema = z.object({
  body: UpdateUsernameSchema,
});

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, VALIDATION.REQUIRED),
    newPassword: z
      .string()
      .min(8, VALIDATION.PASSWORD_TOO_SHORT)
      .regex(/[A-Z]/, VALIDATION.PASSWORD_NO_UPPERCASE)
      .regex(/[a-z]/, VALIDATION.PASSWORD_NO_LOWERCASE)
      .regex(/[0-9]/, VALIDATION.PASSWORD_NO_NUMBER)
      .regex(/[@$!%*?&#^()._+\-=\[\]{};:,.]/, VALIDATION.PASSWORD_NO_SPECIAL),
    confirmPassword: z.string().min(1, VALIDATION.REQUIRED),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

export const ChangePasswordHandlerSchema = z.object({
  body: ChangePasswordSchema,
});

export const EmailChangeRequestSchema = z.object({
  message: z.string().min(1, VALIDATION.REQUIRED),
});

export const EmailChangeRequestHandlerSchema = z.object({
  body: EmailChangeRequestSchema,
});

export type UpdatePreferredLanguageInput = z.infer<typeof UpdatePreferredLanguageSchema>;
export type UpdateUsernameInput = z.infer<typeof UpdateUsernameSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type EmailChangeRequestInput = z.infer<typeof EmailChangeRequestSchema>;
