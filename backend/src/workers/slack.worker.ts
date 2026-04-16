import { Worker, type Job } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';
import { logger } from '../utils/logger.js';
import { slackService } from '../services/slack.service.js';

export const slackWorker = new Worker(
  'slack-queue',
  async (job: Job) => {
    const { name, data } = job;

    if (name === 'new-registration') {
      const { user, referralSource } = data;
      logger.info({ userId: user.id }, '[SLACK WORKER] Processing new registration notification');
      
      try {
        await slackService.notifyNewRegistration(user, referralSource);
      } catch (error: any) {
        logger.error({ error: error.message, userId: user.id }, '[SLACK WORKER] Failed to send registration notification');
        throw error;
      }
    }

    if (name === 'new-feedback') {
      logger.info({ feedbackId: data.feedbackId }, '[SLACK WORKER] Processing new feedback notification');
      try {
        await slackService.notifyNewFeedback(data);
      } catch (error: any) {
        logger.error({ error: error.message }, '[SLACK WORKER] Failed to send feedback notification');
        throw error;
      }
    }

    if (name === 'new-group') {
      logger.info({ groupName: data.name }, '[SLACK WORKER] Processing new group notification');
      try {
        await slackService.notifyNewGroup(data);
      } catch (error: any) {
        logger.error({ error: error.message }, '[SLACK WORKER] Failed to send group notification');
        throw error;
      }
    }

    if (name === 'new-competition-join') {
      logger.info({ username: data.username }, '[SLACK WORKER] Processing new competition join notification');
      try {
        await slackService.notifyCompetitionJoin(data);
      } catch (error: any) {
        logger.error({ error: error.message }, '[SLACK WORKER] Failed to send competition join notification');
        throw error;
      }
    }

    if (name === 'job-failure') {
      logger.info({ jobName: data.jobName }, '[SLACK WORKER] Processing job failure notification');
      try {
        await slackService.notifyJobFailure(data);
      } catch (error: any) {
        logger.error({ error: error.message }, '[SLACK WORKER] Failed to send job failure notification');
        throw error;
      }
    }

  },
  {
    connection: redisConfig,
    concurrency: 1,
    removeOnComplete: {
      age: 24 * 60 * 60,
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60,
    },
  },
);

slackWorker.on('completed', (job: Job) => {
  logger.info({ jobId: job.id, name: job.name }, 'Slack queue job completed successfully');
});

slackWorker.on('failed', (job: Job | undefined, err: Error) => {
  logger.error({ jobId: job?.id, name: job?.name, error: err.message }, 'Slack queue job failed');

  // If slack worker itself fails repeatedly, send DIRECTLY to Slack as a fallback
  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    slackService.notifyJobFailure({
      queueName: 'slack-queue',
      jobName: job.name,
      error: err.message,
      attempts: job.attemptsMade
    }).catch(slackErr => logger.error({ slackErr }, '[SLACK WORKER] Fallback direct notification failed'));
  }
});

