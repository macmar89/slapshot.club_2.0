'use client';

import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/api-routes';

export async function submitFeedbackAction(
  type: 'bug' | 'idea' | 'other',
  message: string,
  pageUrl: string,
  turnstileToken?: string,
) {
  try {
    const response = await api.post(API_ROUTES.FEEDBACK, {
      type,
      message,
      pageUrl,
      turnstileToken,
    });

    return { ok: true, data: response.data };
  } catch (error: unknown) {
    console.error('Feedback submission failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback';
    return {
      ok: false,
      error: (error as any).response?.data?.message || errorMessage,
    };
  }
}
