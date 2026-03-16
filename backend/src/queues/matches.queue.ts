import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';
import { logger } from '../utils/logger.js';

export const matchesQueue = new Queue('matches-queue', {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: 1000,
  },
});

export const scheduleMatchesSyncMasterJob = async () => {
  try {
    // Clean up previous repeatable jobs to avoid duplicates during testing
    const repeatableJobs = await matchesQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      await matchesQueue.removeRepeatableByKey(job.key);
    }

    await matchesQueue.add(
      'masterScheduleSync',
      {},
      {
        repeat: {
          pattern: '15 08 * * *', // Run at 08:15 SEČ
          tz: 'Europe/Bratislava',
        },
      },
    );
    logger.info('[SCHEDULE] Master matches sync job scheduled for 08:15 (Europe/Bratislava).');
  } catch (error: any) {
    logger.error(`[SCHEDULE ERROR] Failed to schedule master matches sync: ${error.message}`);
  }
};
