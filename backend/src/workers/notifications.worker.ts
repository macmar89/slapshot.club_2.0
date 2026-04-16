import { Worker, type Job } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';
import { logger } from '../utils/logger.js';
import { userRepository } from '../repositories/user.repository.js';
import { announcementsRepository } from '../repositories/announcements.repository.js';
import { notify } from '../services/notifications.service.js';
import { enqueueSlackJobFailureNotification } from '../queues/slack.queue.js';


export const notificationsWorker = new Worker(
  'notifications-queue',
  async (job: Job) => {
    const { name, data } = job;

    if (name === 'sendAnnouncementNotification') {
      const { announcementSlug, announcementType } = data;
      logger.info(`[NOTIFICATIONS WORKER] Sending announcement notification: ${announcementSlug}`);

      try {
        const announcement = await announcementsRepository.getAnnouncementBySlug(announcementSlug);
        const titles = {
          title_sk: announcement.locales.sk.title,
          title_cz: announcement.locales.cz.title,
          title_en: announcement.locales.en.title,
        };

        const userIds = await userRepository.getAllActiveUserIds();
        
        // Chunk sizes to prevent memory/DB issues
        const CHUNK_SIZE = 1000;
        for (let i = 0; i < userIds.length; i += CHUNK_SIZE) {
          const chunk = userIds.slice(i, i + CHUNK_SIZE);
          await notify({
            userIds: chunk,
            type: 'NEW_ANNOUNCEMENT',
            payload: {
              announcementSlug,
              announcementType,
              ...titles,
            },
          });
        }
        
        logger.info(`[NOTIFICATIONS WORKER] Successfully sent notifications to ${userIds.length} users`);
      } catch (error: any) {
        logger.error(`[NOTIFICATIONS WORKER] Failed for ${announcementSlug}: ${error.message}`);
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

notificationsWorker.on('completed', (job: Job) => {
  logger.info({ jobId: job.id, name: job.name }, 'Notifications queue job completed successfully');
});

notificationsWorker.on('failed', (job: Job | undefined, err: Error) => {
  logger.error({ jobId: job?.id, name: job?.name, error: err.message }, 'Notifications queue job failed');

  if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
    enqueueSlackJobFailureNotification({
      queueName: 'notifications-queue',
      jobName: job.name,
      error: err.message,
      attempts: job.attemptsMade
    }).catch(slackErr => logger.error({ slackErr }, '[NOTIFICATIONS WORKER] Failed to enqueue Slack failure notification'));
  }
});

