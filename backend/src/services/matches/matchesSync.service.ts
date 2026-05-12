import { API_HOCKEY_CONFIG } from '../../config/apiHockey.js';
import type { ApiHockeyResponse, ApiHockeyMatch } from '../../types/hockeyApiResponse.types.js';
import { db } from '../../db/index.js';
import { matches } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { logger } from '../../utils/logger.js';
import { slugifyRoundLabel } from '../../utils/slug.js';
import { updatePlayoffSeries } from './playoff.service.js';

export async function syncFutureMatches(apiSportId: number, daysAhead: number, seasonYear?: number) {
  const apiKey = process.env.SPORT_API_KEY;
  if (!apiKey) {
    logger.error('[FUTURE SYNC] SPORT_API_KEY missing.');
    return { success: false, message: 'SPORT_API_KEY is missing' };
  }

  try {
    const competition = await db.query.competitions.findFirst({
      where: (c, { eq, and }) => {
        if (seasonYear) {
          return and(eq(c.apiHockeyId, String(apiSportId)), eq(c.apiHockeySeason, seasonYear));
        }
        return eq(c.apiHockeyId, String(apiSportId));
      },
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
    let matchesSkipped = 0;

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

      console.log(response);

      if (!response.ok) {
        logger.error(
          `[FUTURE SYNC][${competition.slug}] API error for ${dateStr}: ${response.statusText}`,
        );
        continue;
      }

      const data: ApiHockeyResponse = await response.json();
      console.log(data);
      const apiMatchesList = data.response;

      if (!apiMatchesList || apiMatchesList.length === 0) {
        continue;
      }

      for (const apiMatch of apiMatchesList) {
        const result = await createOrUpdateMatch(apiMatch, currentCompId);
        if (result === 'created') matchesCreated++;
        if (result === 'updated') matchesUpdated++;
        if (result === 'skipped') matchesSkipped++;
      }
    }
    logger.info(
      `[FUTURE SYNC] Finished sync for ${competition.slug}. Created: ${matchesCreated}, Updated: ${matchesUpdated}, Skipped: ${matchesSkipped}`,
    );

    return {
      success: true,
      message: `Sync completed. Created ${matchesCreated}, Updated ${matchesUpdated}, Skipped ${matchesSkipped} (usually missing teams).`,
      data: {
        created: matchesCreated,
        updated: matchesUpdated,
        skipped: matchesSkipped,
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

  logger.info(
    `[FUTURE SYNC DEBUG] Processing apiMatch ID: ${apiId}, Date: ${apiMatch.date}, Teams: ${apiMatch.teams.home.name} vs ${apiMatch.teams.away.name}`,
  );

  const existingMatch = await db.query.matches.findFirst({
    where: (m, { eq }) => eq(m.apiHockeyId, apiId),
  });

  logger.info(`[FUTURE SYNC DEBUG] existingMatch found in DB? ${!!existingMatch}`);

  const internalStatus =
    (API_HOCKEY_CONFIG.GAME_STATUSES as any)[apiMatch.status.short] ||
    existingMatch?.status ||
    'scheduled';

  // Format round label (e.g., "39. kolo")
  let roundLabel: string | null = null;
  let stageType:
    | 'regular_season'
    | 'playoffs'
    | 'group_phase'
    | 'pre_season'
    | 'relegation'
    | 'promotion' = 'regular_season';

  if (apiMatch.week) {
    const weekStr = String(apiMatch.week);
    roundLabel = slugifyRoundLabel(weekStr);
    if (
      weekStr.toLowerCase().includes('playoff') ||
      weekStr.toLowerCase().includes('final') ||
      weekStr.toLowerCase().includes('quarter') ||
      weekStr.toLowerCase().includes('semi') ||
      weekStr.toLowerCase().includes('1/8') ||
      weekStr.toLowerCase().includes('1/4') ||
      weekStr.toLowerCase().includes('1/2')
    ) {
      stageType = 'playoffs';
    }
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

    if (existingMatch.stageType !== stageType) {
      updateData.stageType = stageType as any;
      hasChanges = true;
    }

    if (hasChanges) {
      try {
        await db.update(matches).set(updateData).where(eq(matches.id, existingMatch.id));

        if (internalStatus === 'finished' && existingMatch.status !== 'finished') {
          await updatePlayoffSeries(existingMatch.id);
        }

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

  logger.info(
    `[FUTURE SYNC DEBUG] DB Search for Teams: Home(API ID ${apiMatch.teams.home.id}) => ${!!homeTeam}, Away(API ID ${apiMatch.teams.away.id}) => ${!!awayTeam}`,
  );

  if (!homeTeam || !awayTeam) {
    logger.warn(
      `[FUTURE SYNC] Skipping match ${apiId}: Teams not found in local DB (Home API ID: ${apiMatch.teams.home.id}, Away API ID: ${apiMatch.teams.away.id})`,
    );
    return 'skipped';
  }

  try {
    const [inserted] = await db
      .insert(matches)
      .values({
        competitionId,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        date: matchDate,
        status: internalStatus,
        apiHockeyId: apiId,
        apiHockeyStatus: apiMatch.status.short,
        displayTitle: `${homeTeam.slug} vs ${awayTeam.slug}`,
        stageType: stageType as any,
        resultEndingType: 'regular',
        roundLabel,
      })
      .returning({ id: matches.id });

    if (internalStatus === 'finished' && inserted) {
      await updatePlayoffSeries(inserted.id);
    }

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
