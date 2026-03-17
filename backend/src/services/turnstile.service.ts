import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verifies a Cloudflare Turnstile token.
 * @param token The token received from the frontend.
 * @param ip Optional remote IP address of the user.
 * @returns boolean indicating if the verification was successful.
 */
export const verifyTurnstileToken = async (token: string, ip?: string): Promise<boolean> => {
  if (!env.NEXT_PUBLIC_ENABLE_TURNSTILE) {
    return true;
  }

  if (!token) {
    return false;
  }

  const secretKey = env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    logger.error('TURNSTILE_SECRET_KEY is not defined in environment variables');
    return false;
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as TurnstileResponse;

    if (!data.success) {
      logger.warn({ turnstileError: data['error-codes'] }, 'Turnstile verification failed');
    }

    return data.success;
  } catch (error) {
    logger.error({ error }, 'Error verifying Turnstile token');
    return false;
  }
};
