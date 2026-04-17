import { API_HOCKEY_CONFIG } from '../../config/apiHockey.js';
import type { ApiHockeyResponse, ApiHockeyMatch } from '../../types/hockeyApiResponse.types.js';
import { db } from '../../db/index.js';
import { matches } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { logger } from '../../utils/logger.js';
import { slugifyRoundLabel } from '../../utils/slug.js';

export async function syncFutureMatches(apiSportId: number, daysAhead: number) {
  const apiKey = process.env.SPORT_API_KEY;
  if (!apiKey) {
    logger.error('[FUTURE SYNC] SPORT_API_KEY missing.');
    return { success: false, message: 'SPORT_API_KEY is missing' };
  }

  try {
    const competition = await db.query.competitions.findFirst({
      where: (c, { eq }) => eq(c.apiHockeyId, String(apiSportId)),
    });

    if (!competition) {
      logger.error(`[FUTURE SYNC] No competition found with apiHockeyId ${apiSportId}.`);
      return { success: false, message: `No competition found with apiSportId: ${apiSportId}` };
    }

    if (!competition.apiHockeySeason) {
      logger.error(`[FUTURE SYNC] Competition ${competition.slug} missing apiHockeySeason.`);
      return { success: false, message: `Competition missing apiHockeySeason.` };
    }

    const season = competition.apiHockeySeason;
    const currentCompId = competition.id;

    logger.info(
      `[FUTURE SYNC] Starting sync for ${competition.slug} for the next ${daysAhead} days...`,
    );

    const today = new Date();
    let matchesCreated = 0;
    let matchesUpdated = 0;

    for (let i = 0; i < daysAhead; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0] as string;

      logger.info(`[FUTURE SYNC][${competition.slug}] Checking matches for ${dateStr}...`);

      // Fetch from API
      const url = new URL(`${API_HOCKEY_CONFIG.BASE_URL}${API_HOCKEY_CONFIG.ENDPOINTS.GAMES}`);
      url.searchParams.append('league', String(apiSportId));
      url.searchParams.append('season', String(season));
      url.searchParams.append('date', dateStr);

      const response = await fetch(url.toString(), {
        headers: {
          'x-apisports-key': apiKey,
        },
      });

      if (!response.ok) {
        logger.error(
          `[FUTURE SYNC][${competition.slug}] API error for ${dateStr}: ${response.statusText}`,
        );
        continue;
      }

      const data: ApiHockeyResponse = await response.json();
      const apiMatchesList = data.response;

      if (!apiMatchesList || apiMatchesList.length === 0) {
        continue;
      }

      for (const apiMatch of apiMatchesList) {
        const result = await createOrUpdateMatch(apiMatch, currentCompId);
        if (result === 'created') matchesCreated++;
        if (result === 'updated') matchesUpdated++;
      }
    }
    logger.info(
      `[FUTURE SYNC] Finished sync for ${competition.slug}. Created: ${matchesCreated}, Updated: ${matchesUpdated}`,
    );

    return {
      success: true,
      message: `Sync completed. Created ${matchesCreated}, Updated ${matchesUpdated}.`,
      data: {
        created: matchesCreated,
        updated: matchesUpdated,
      },
    };
  } catch (error: any) {
    logger.error(`[FUTURE SYNC ERROR] ${error.message}`);
    return { success: false, message: error.message };
  }
}

async function createOrUpdateMatch(
  apiMatch: ApiHockeyMatch,
  competitionId: string,
): Promise<'created' | 'updated' | 'skipped'> {
  const apiId = String(apiMatch.id);

  const existingMatch = await db.query.matches.findFirst({
    where: (m, { eq }) => eq(m.apiHockeyId, apiId),
  });

  const internalStatus =
    (API_HOCKEY_CONFIG.GAME_STATUSES as any)[apiMatch.status.short] ||
    existingMatch?.status ||
    'scheduled';

  // Format round label (e.g., "39. kolo")
  let roundLabel: string | null = null;
  if (apiMatch.week) {
    roundLabel = slugifyRoundLabel(apiMatch.week);
    //   const weekClean = apiMatch.week.replace(/[^0-9]/g, '');
    //   if (weekClean) {
    //     roundLabel = `${weekClean}. kolo`;
    //   } else {
    //     roundLabel = apiMatch.week;
    //   }
  }

  // Get date in proper ISO format (timezone aware)
  const matchDate = apiMatch.date;

  if (existingMatch) {
    const updateData: Partial<typeof matches.$inferInsert> = {};
    let hasChanges = false;

    if (new Date(existingMatch.date).getTime() !== new Date(matchDate).getTime()) {
      updateData.date = matchDate;
      hasChanges = true;
    }

    if (existingMatch.status !== internalStatus) {
      updateData.status = internalStatus;
      hasChanges = true;
    }

    if (existingMatch.apiHockeyStatus !== apiMatch.status.short) {
      updateData.apiHockeyStatus = apiMatch.status.short;
      hasChanges = true;
    }

    if (hasChanges) {
      try {
        await db.update(matches).set(updateData).where(eq(matches.id, existingMatch.id));

        logger.info(
          `[FUTURE SYNC] Updated match time/status for ${existingMatch.displayTitle} (${apiId})`,
        );
        return 'updated';
      } catch (err: any) {
        logger.error(`[FUTURE SYNC] Failed to update match ${apiId}: ${err.message}`);
        return 'skipped';
      }
    }

    return 'skipped';
  }

  // Find Teams
  const homeTeam = await findTeamByApiId(apiMatch.teams.home.id);
  const awayTeam = await findTeamByApiId(apiMatch.teams.away.id);

  if (!homeTeam || !awayTeam) {
    logger.warn(
      `[FUTURE SYNC] Skipping match ${apiId}: Teams not found (Home: ${apiMatch.teams.home.name}, Away: ${apiMatch.teams.away.name})`,
    );
    return 'skipped';
  }

  try {
    await db.insert(matches).values({
      competitionId,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      date: matchDate,
      status: internalStatus,
      apiHockeyId: apiId,
      apiHockeyStatus: apiMatch.status.short,
      displayTitle: `${homeTeam.slug} vs ${awayTeam.slug}`,
      stageType: 'regular_season',
      resultEndingType: 'regular',
      roundLabel,
    });

    logger.info(`[FUTURE SYNC] Created match: ${homeTeam.slug} vs ${awayTeam.slug} (${matchDate})`);
    return 'created';
  } catch (err: any) {
    logger.error(`[FUTURE SYNC] Failed to create match ${apiId}: ${err.message}`);
    return 'skipped';
  }
}

async function findTeamByApiId(apiId: number) {
  return await db.query.teams.findFirst({
    where: (t, { eq }) => eq(t.apiHockeyId, String(apiId)),
  });
}
