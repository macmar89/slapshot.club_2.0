import { Worker, type Job } from 'bullmq';
import { redisConfig } from '../config/redis.config.js';
import { logger } from '../utils/logger.js';
import { refreshCompetitionRankings } from '../services/leaderboard.service.js';
import { competitionRepository } from '../repositories/competitions.repository.js';
import { syncStandings } from '../services/admin/competitions.service.js';
import { API_HOCKEY_CONFIG } from '../config/apiHockey.js';

export const competitionsWorker = new Worker(
  'competitions-queue',
  async (job: Job) => {
    const { name, data } = job;

    if (name === 'recalculateCompetitionRanks') {
      const { competitionId } = data;
      logger.info(`[COMPETITIONS WORKER] Recalculating ranks for competition ${competitionId}`);

      try {
        await refreshCompetitionRankings(competitionId);
      } catch (error: any) {
        logger.error(`[COMPETITIONS WORKER] Failed for ${competitionId}: ${error.message}`);
        throw error;
      }
    }

    if (name === 'syncNhlStandings') {
      const activeCompetitions = await competitionRepository.getActive();
      const nhlCompetitions = activeCompetitions.filter(
        (c) => String(c.apiHockeyId) === String(API_HOCKEY_CONFIG.LEAGUES.NHL),
      );

      for (const comp of nhlCompetitions) {
        try {
          await syncStandings(comp.id);
        } catch (error: any) {
          logger.error(
            `[COMPETITIONS WORKER] Failed NHL sync for ${comp.id}: ${error.message}`,
          );
        }
      }
    }

    if (name === 'syncOtherStandings') {
      const activeCompetitions = await competitionRepository.getActive();
      const otherCompetitions = activeCompetitions.filter(
        (c) => String(c.apiHockeyId) !== String(API_HOCKEY_CONFIG.LEAGUES.NHL),
      );

      for (const comp of otherCompetitions) {
        try {
          await syncStandings(comp.id);
        } catch (error: any) {
          logger.error(
            `[COMPETITIONS WORKER] Failed sync for ${comp.id}: ${error.message}`,
          );
        }
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

competitionsWorker.on('completed', (job: Job) => {
  logger.info({ jobId: job.id, name: job.name }, 'Competitions queue job completed successfully');
});

competitionsWorker.on('failed', (job: Job | undefined, err: Error) => {
  logger.error({ jobId: job?.id, name: job?.name, error: err.message }, 'Competitions queue job failed');
});
