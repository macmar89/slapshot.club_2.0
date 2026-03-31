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

export const scheduleLiveMatchesTicker = async () => {
  try {
    // Clean up previous repeatable jobs
    const repeatableJobs = await matchesQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.name === 'checkLiveMatches') {
        await matchesQueue.removeRepeatableByKey(job.key);
      }
    }

    await matchesQueue.add(
      'checkLiveMatches',
      {},
      {
        repeat: {
          every: 2 * 60 * 1000, // Every 2 minutes
        },
      },
    );
    logger.info('[SCHEDULE] Live matches ticker job scheduled every 2 minutes.');
  } catch (error: any) {
    logger.error(`[SCHEDULE ERROR] Failed to schedule live matches ticker: ${error.message}`);
  }
};

export const scheduleMissingTipsReminder = async () => {
  try {
    // Clean up previous repeatable jobs
    const repeatableJobs = await matchesQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.name === 'checkMissingTips') {
        await matchesQueue.removeRepeatableByKey(job.key);
      }
    }

    await matchesQueue.add(
      'checkMissingTips',
      {},
      {
        repeat: {
          every: 10 * 60 * 1000, // Every 10 minutes
        },
      },
    );
    logger.info('[SCHEDULE] Missing tips reminder job scheduled every 10 minutes.');
  } catch (error: any) {
    logger.error(`[SCHEDULE ERROR] Failed to schedule missing tips reminder: ${error.message}`);
  }
};

export const scheduleDailyMissingTipsReminder = async () => {
  try {
    const repeatableJobs = await matchesQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.name === 'checkDailyMissingTips') {
        await matchesQueue.removeRepeatableByKey(job.key);
      }
    }

    await matchesQueue.add(
      'checkDailyMissingTips',
      {},
      {
        repeat: {
          pattern: '15 10 * * *', // Run at 10:15 (for testing)
          tz: 'Europe/Bratislava',
        },
      },
    );
    logger.info('[SCHEDULE] Daily missing tips reminder scheduled for 10:15 (Europe/Bratislava).');
  } catch (error: any) {
    logger.error(
      `[SCHEDULE ERROR] Failed to schedule daily missing tips reminder: ${error.message}`,
    );
  }
};
