import { z } from 'zod';
import { AuthMessages } from '../messages/auth.messages.js';

const { VALIDATION } = AuthMessages.ERRORS;

export const FeedbackSchema = z.object({
  type: z.enum(['bug', 'idea', 'other', 'change_user_email_request', 'custom_country_request']),
  message: z.string().min(1, VALIDATION.REQUIRED),
  pageUrl: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export const FeedbackHandlerSchema = z.object({
  body: FeedbackSchema,
});

export type FeedbackInput = z.infer<typeof FeedbackSchema>;
