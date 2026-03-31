import { Worker, type Job } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';
import { logger } from '../utils/logger.js';
import { competitionRepository } from '../repositories/competitions.repository.js';
import { matchesQueue } from '../queues/matches.queue.js';
import { syncFutureMatches } from '../services/matches/matchesSync.service.js';
import { handleLiveUpdates } from '../services/matches/matchesLive.service.js';
import { evaluateMatch } from '../services/predictions/predictionsLogic.service.js';
import { sendMissingTipReminders } from '../services/matches/matchesReminder.service.js';

export const matchesWorker = new Worker(
  'matches-queue',
  async (job: Job) => {
    const { name, data } = job;

    if (name === 'masterScheduleSync') {
      logger.info('[MATCHES WORKER] Starting master schedule sync for active competitions.');

      const activeCompetitions = await competitionRepository.getActive();

      if (!activeCompetitions || activeCompetitions.length === 0) {
        logger.info('[MATCHES WORKER] No active competitions found to sync.');
        return;
      }

      for (const comp of activeCompetitions) {
        await matchesQueue.add('syncCompetitionMatches', {
          competitionId: comp.id,
          apiSportId: comp.apiHockeyId,
          slug: comp.slug,
        });
      }

      logger.info(
        `[MATCHES WORKER] Queued syncs for ${activeCompetitions.length} active competitions.`,
      );
    }

    if (name === 'syncCompetitionMatches') {
      const { competitionId, apiSportId, slug } = data;

      logger.info(
        `[MATCHES WORKER] Starting sync routine for competition ${slug} (${competitionId})`,
      );

      // We know apiSportId is set because of getActive() filter
      const result = await syncFutureMatches(Number(apiSportId), 14);

      if (result.success) {
        logger.info(`[MATCHES WORKER] Finished sync for ${slug}: ${result.message}`);
      } else {
        throw new Error(`Sync failed for ${slug}: ${result.message}`);
      }
    }

    if (name === 'checkLiveMatches') {
      await handleLiveUpdates();
    }

    if (name === 'checkMissingTips') {
      await sendMissingTipReminders();
    }

    if (name === 'evaluatePredictions') {
      const { matchId } = data;
      logger.info(`[MATCHES WORKER] Evaluating predictions for match ${matchId}`);
      await evaluateMatch(matchId);
    }
  },
  {
    connection: redisConfig,
    concurrency: 2,
    removeOnComplete: {
      age: 24 * 60 * 60,
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60,
    },
  },
);

matchesWorker.on('failed', (job: Job | undefined, err: Error) => {
  logger.error({ jobId: job?.id, name: job?.name, error: err.message }, 'Matches queue job failed');
});
