import { z } from 'zod';

const isTurnstileEnabled =
  process.env.NEXT_PUBLIC_ENABLE_TURNSTILE !== 'false' &&
  process.env.NEXT_PUBLIC_DISABLE_TURNSTILE !== 'true';

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    identifier: z.string().min(2, t('errors.username_too_short')),
    password: z.string().min(8, t('errors.password_too_short')),
    turnstileToken: isTurnstileEnabled
      ? z.string().min(1, t('turnstile_error'))
      : z.string().optional(),
  });

export type LoginInput = z.infer<ReturnType<typeof getLoginSchema>>;
