import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';

export const notificationsQueue = new Queue('notifications-queue', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const scheduleAnnouncementNotification = async (data: {
  announcementSlug: string;
  announcementType: string;
}) => {
  await notificationsQueue.add('sendAnnouncementNotification', data);
};
