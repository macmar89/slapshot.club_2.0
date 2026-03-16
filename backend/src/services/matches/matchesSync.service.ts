import { API_HOCKEY_CONFIG } from '../../config/apiHockey.js';
import type { ApiHockeyResponse, ApiHockeyMatch } from '../../types/hockeyApiResponse.types.js';
import { db } from '../../db/index.js';
import { matches, competitions, teams } from '../../db/schema/index.js';
import { and, eq, lte, inArray, sql } from 'drizzle-orm';
import { logger } from '../../utils/logger.js';

// export async function syncMatchesFromHockeyApi() {
// const now = new Date();
// const apiKey = process.env.SPORT_API_KEY;

// if (!apiKey) {
//   logger.error('[HOCKEY SYNC] SPORT_API_KEY is missing in environment variables.');
//   return;
// }

// try {
//   // 1. Find all matches that need synchronization:
//   // - Currently LIVE
//   // - SCHEDULED and should have started already (or starting in next 10 mins)
//   const checkWindow = new Date(now.getTime() + 10 * 60 * 1000);

//   const matchesToSync = await db.query.matches.findMany({
//     where: (m, { or, and, eq, lte }) =>
//       or(
//         eq(m.status, 'live'),
//         and(eq(m.status, 'scheduled'), lte(m.date, checkWindow.toISOString())),
//       ),
//     with: {
//       competition: true,
//     },
//     limit: 200,
//   });

//   if (matchesToSync.length === 0) {
//     return;
//   }

//   // 2. Group required API calls by (competitionId + date)
//   // We only want ONE api call per league/date combination.
//   const syncGroups = new Map<string, { competition: any; date: string }>();

//   for (const match of matchesToSync) {
//     const competition = match.competition as any;

//     // Skip if competition is not set up for API or not active
//     if (
//       !competition ||
//       competition.status !== 'active' ||
//       !competition.apiHockeyId ||
//       !competition.apiHockeySeason
//     ) {
//       continue;
//     }

//     // Hockey API uses YYYY-MM-DD for date-based queries.
//     // We use the match's official date to find it in the API response.
//     const matchDate = new Date(match.date);
//     const dateStr = matchDate.toISOString().split('T')[0] as string;
//     const groupKey = `${competition.id}|${dateStr}`;

//     if (!syncGroups.has(groupKey)) {
//       syncGroups.set(groupKey, { competition, date: dateStr });
//     }
//   }

//   if (syncGroups.size === 0) {
//     return;
//   }

//   // 3. Execute grouped API calls
//   for (const { competition, date } of syncGroups.values()) {
//     logger.info(
//       `[HOCKEY SYNC] Processing ${competition.slug} for ${date} (Matches: ${matchesToSync.length} found)`,
//     );

//     const url = new URL(`${API_HOCKEY_CONFIG.BASE_URL}${API_HOCKEY_CONFIG.ENDPOINTS.GAMES}`);
//     url.searchParams.append('league', String(competition.apiHockeyId));
//     url.searchParams.append('season', String(competition.apiHockeySeason));
//     url.searchParams.append('date', date);

//     const response = await fetch(url.toString(), {
//       headers: {
//         'x-apisports-key': apiKey,
//       },
//     });

//     if (!response.ok) {
//       logger.error(
//         `[HOCKEY SYNC] API Request failed for ${competition.slug}: ${response.statusText}`,
//       );
//       continue;
//     }

//     const data: ApiHockeyResponse = await response.json();

//     if (data.errors && Object.keys(data.errors).length > 0) {
//       logger.error(
//         `[HOCKEY SYNC] API returned errors for ${competition.slug}: ${JSON.stringify(data.errors)}`,
//       );
//       continue;
//     }

//     const apiMatches = data.response;

//     if (!apiMatches || apiMatches.length === 0) {
//       logger.info(`[HOCKEY SYNC] No matches found in API for ${competition.slug} on ${date}`);
//       continue;
//     }

//     // 4. Update local matches with API data
//     for (const apiMatch of apiMatches) {
//       await processApiMatch(apiMatch, competition.id);
//     }
//   }
// } catch (error: any) {
//   logger.error(`[HOCKEY SYNC ERROR] ${error.message}`);
// }
// // }

// async function processApiMatch(apiMatch: ApiHockeyMatch, competitionId: string) {
//   const apiId = String(apiMatch.id);
//   const apiStatusShort = apiMatch.status.short;

//   // Find local match by apiHockeyId
//   const localMatch = await db.query.matches.findFirst({
//     where: (m, { eq }) => eq(m.apiHockeyId, apiId),
//   });

//   if (!localMatch) {
//     // We could potentially auto-create matches here, but the user didn't ask for it yet.
//     // For now, only sync existing ones.
//     return;
//   }

//   const internalStatus =
//     (API_HOCKEY_CONFIG.GAME_STATUSES as any)[apiStatusShort] || localMatch.status;

//   // Prepare updates
//   const updateData: Partial<typeof matches.$inferInsert> = {
//     apiHockeyStatus: apiStatusShort,
//     status: internalStatus,
//   };

//   const currentHomeScore = localMatch.resultHomeScore ?? 0;
//   const currentAwayScore = localMatch.resultAwayScore ?? 0;

//   let newHomeScore = currentHomeScore;
//   let newAwayScore = currentAwayScore;
//   let newEndingType = localMatch.resultEndingType ?? 'regular';

//   // Update scores and ending type if match is live or finished
//   if (internalStatus !== 'scheduled') {
//     newHomeScore = apiMatch.scores.home ?? currentHomeScore;
//     newAwayScore = apiMatch.scores.away ?? currentAwayScore;
//     newEndingType = detectEndingType(apiMatch);

//     updateData.resultHomeScore = newHomeScore;
//     updateData.resultAwayScore = newAwayScore;
//     updateData.resultEndingType = newEndingType;
//   }

//   // Only update if something changed (to avoid unnecessary hooks)
//   const hasChanges =
//     localMatch.status !== updateData.status ||
//     localMatch.apiHockeyStatus !== updateData.apiHockeyStatus ||
//     localMatch.resultHomeScore !== updateData.resultHomeScore ||
//     localMatch.resultAwayScore !== updateData.resultAwayScore ||
//     localMatch.resultEndingType !== updateData.resultEndingType;

//   if (hasChanges) {
//     const scoreInfo =
//       updateData.resultHomeScore !== undefined
//         ? ` | Score: ${updateData.resultHomeScore}:${updateData.resultAwayScore}`
//         : '';

//     logger.info(
//       `[HOCKEY SYNC] Updating match ${localMatch.displayTitle} (API ID: ${apiId}, Status: ${apiStatusShort}${scoreInfo})`,
//     );
//     try {
//       await db.update(matches).set(updateData).where(eq(matches.id, localMatch.id));
//     } catch (err: any) {
//       logger.error(
//         `[HOCKEY SYNC ERROR] Failed to update match ${localMatch.displayTitle} (${apiId}): ${err.message}`,
//       );
//     }
//   }
// }

// function detectEndingType(apiMatch: ApiHockeyMatch): 'regular' | 'ot' | 'so' {
//   if (apiMatch.periods.penalties !== null) return 'so';
//   if (apiMatch.periods.overtime !== null) return 'ot';
//   return 'regular';
// }

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
  let roundLabel = '';
  if (apiMatch.week) {
    const weekClean = apiMatch.week.replace(/[^0-9]/g, '');
    if (weekClean) {
      roundLabel = `${weekClean}. kolo`;
    } else {
      roundLabel = apiMatch.week;
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
