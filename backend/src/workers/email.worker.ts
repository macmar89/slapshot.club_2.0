import { Worker, type Job } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';
import { renderVerificationEmail } from '../templates/emails/renderVerifyUserEmail.js';
import { renderForgotPasswordEmail } from '../templates/emails/renderResetPasswordEmail.js';
import { logger } from '../utils/logger.js';
import { emailService } from '../services/email.service.js';

import skTranslations from '../locates/sk.json' with { type: 'json' };
import enTranslations from '../locates/en.json' with { type: 'json' };
import csTranslations from '../locates/cs.json' with { type: 'json' };

const getTranslations = (lang?: string) => {
  if (lang === 'en') return enTranslations;
  if (lang === 'cs') return csTranslations;
  return skTranslations;
};

export const emailWorker = new Worker(
  'email-queue',
  async (job: Job) => {
    const { type, data } = job.data;

    if (type === 'verification-email') {
      const { user, token, locale } = data;
      const htmlContent = renderVerificationEmail({ token, user });

      const translations = getTranslations(locale);
      const subject = translations.Email.verification.subject;

      await emailService.sendEmail({
        to: user.email,
        subject,
        htmlContent,
      });
    }

    if (type === 'forgot-password-email') {
      const { user, token, locale } = data;
      const htmlContent = renderForgotPasswordEmail({ token, user });

      const translations = getTranslations(locale);
      const subject = translations.Email.forgotPassword.subject;

      await emailService.sendEmail({
        to: user.email,
        subject,
        htmlContent,
      });
    }
  },
  {
    connection: redisConfig,
    concurrency: 5,
    removeOnComplete: {
      age: 24 * 60 * 60,
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60,
    },
  },
);

emailWorker.on('completed', (job: Job) => {
  logger.info({ jobId: job.id }, 'Email job completed successfully');
});

emailWorker.on('failed', (job: Job | undefined, err: Error) => {
  logger.error({ jobId: job?.id, error: err.message }, 'Email job failed');
});
