import { eq, and, or, asc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { matches, playoffSeries, competitions } from '../../db/schema/index.js';
import { logger } from '../../utils/logger.js';

export const updatePlayoffSeries = async (matchId: string) => {
  try {
    const match = await db.query.matches.findFirst({
      where: eq(matches.id, matchId),
    });

    if (!match) {
      logger.error(`[PLAYOFF] Match not found: ${matchId}`);
      return;
    }

    if (match.stageType !== 'playoffs') {
      return;
    }

    const { competitionId, homeTeamId, awayTeamId } = match;

    const competition = await db.query.competitions.findFirst({
      where: eq(competitions.id, competitionId),
    });

    if (!competition || competition.phase !== 'playoff') {
      return;
    }

    // Find all finished playoff matches between these two teams in this competition
    const seriesMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.competitionId, competitionId),
        eq(matches.stageType, 'playoffs'),
        or(
          and(eq(matches.homeTeamId, homeTeamId), eq(matches.awayTeamId, awayTeamId)),
          and(eq(matches.homeTeamId, awayTeamId), eq(matches.awayTeamId, homeTeamId)),
        ),
        eq(matches.status, 'finished'),
      ),
      orderBy: asc(matches.date),
    });

    // Calculate score
    let team1Wins = 0;
    let team2Wins = 0;
    // Let's consistently map team1 to homeTeamId and team2 to awayTeamId based on the first match
    const team1Id = homeTeamId;
    const team2Id = awayTeamId;

    for (const m of seriesMatches) {
      const homeWon = (m.resultHomeScore ?? 0) > (m.resultAwayScore ?? 0);
      const awayWon = (m.resultAwayScore ?? 0) > (m.resultHomeScore ?? 0);

      if (m.homeTeamId === team1Id && homeWon) team1Wins++;
      else if (m.homeTeamId === team1Id && awayWon) team2Wins++;
      else if (m.awayTeamId === team1Id && awayWon) team1Wins++;
      else if (m.awayTeamId === team1Id && homeWon) team2Wins++;
    }

    // Find existing series
    const existingSeries = await db.query.playoffSeries.findFirst({
      where: and(
        eq(playoffSeries.competitionId, competitionId),
        or(
          and(eq(playoffSeries.team1Id, team1Id), eq(playoffSeries.team2Id, team2Id)),
          and(eq(playoffSeries.team1Id, team2Id), eq(playoffSeries.team2Id, team1Id)),
        ),
      ),
    });

    const isFinished = team1Wins >= 4 || team2Wins >= 4; // Assuming best-of-7, can be adjusted later or dynamic

    let t1Wins = team1Wins;
    let t2Wins = team2Wins;

    if (existingSeries) {
      // Keep existing team1 and team2 assignment
      t1Wins = existingSeries.team1Id === team1Id ? team1Wins : team2Wins;
      t2Wins = existingSeries.team2Id === team1Id ? team1Wins : team2Wins;

      await db
        .update(playoffSeries)
        .set({
          score1: t1Wins,
          score2: t2Wins,
          isFinished,
        })
        .where(eq(playoffSeries.id, existingSeries.id));
    } else {
      await db.insert(playoffSeries).values({
        competitionId,
        team1Id,
        team2Id,
        score1: t1Wins,
        score2: t2Wins,
        stage: match.roundLabel ?? 'Playoffs',
        isFinished,
      });
    }

    // Update match with series status
    // Get all matches for this series (including scheduled) to assign game numbers
    const allSeriesMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.competitionId, competitionId),
        eq(matches.stageType, 'playoffs'),
        or(
          and(eq(matches.homeTeamId, team1Id), eq(matches.awayTeamId, team2Id)),
          and(eq(matches.homeTeamId, team2Id), eq(matches.awayTeamId, team1Id)),
        ),
      ),
      orderBy: asc(matches.date),
    });

    let homeCurrentWins = 0;
    let awayCurrentWins = 0;

    for (let i = 0; i < allSeriesMatches.length; i++) {
      const currentM = allSeriesMatches[i]!;
      const gameNumber = i + 1;

      // Assign the state before this match started, or after?
      // Usually "Series tied 1-1" or similar
      const hTeamId = currentM.homeTeamId;
      const aTeamId = currentM.awayTeamId;

      const hWins = hTeamId === team1Id ? t1Wins : t2Wins;
      const aWins = aTeamId === team1Id ? t1Wins : t2Wins;

      const seriesState = `${hWins}:${aWins}`;

      await db
        .update(matches)
        .set({
          seriesGameNumber: gameNumber,
          seriesState,
        })
        .where(eq(matches.id, currentM.id));
    }

    logger.info(`[PLAYOFF] Updated series state for ${competitionId}: ${t1Wins}:${t2Wins}`);
  } catch (error: any) {
    logger.error(`[PLAYOFF] Error updating series state: ${error.message}`);
  }
};

export const recalculateAllPlayoffSeries = async (apiHockeyId: string, seasonYear: number) => {
  try {
    const competition = await db.query.competitions.findFirst({
      where: and(
        eq(competitions.apiHockeyId, apiHockeyId),
        eq(competitions.apiHockeySeason, seasonYear) // assuming apiHockeySeason holds the year, alternatively use seasonYear
      ),
    });

    if (!competition) {
      return { success: false, message: 'Competition not found' };
    }

    if (competition.phase !== 'playoff') {
      return { success: false, message: 'Competition is not in playoff phase' };
    }

    // Get all finished playoff matches for this competition
    const allPlayoffMatches = await db.query.matches.findMany({
      where: and(
        eq(matches.competitionId, competition.id),
        eq(matches.stageType, 'playoffs'),
        eq(matches.status, 'finished')
      ),
      orderBy: asc(matches.date),
    });

    // To prevent redundant calculations, we can just find unique series and call updatePlayoffSeries with one matchId per series.
    const processedSeries = new Set<string>();
    let updatedCount = 0;

    for (const match of allPlayoffMatches) {
      // Sort IDs so team A and team B forms a unique key regardless of home/away
      const teams = [match.homeTeamId, match.awayTeamId].sort();
      const seriesKey = `${teams[0]}-${teams[1]}`;

      if (!processedSeries.has(seriesKey)) {
        await updatePlayoffSeries(match.id);
        processedSeries.add(seriesKey);
        updatedCount++;
      }
    }

    return { success: true, message: `Recalculated ${updatedCount} playoff series.` };
  } catch (error: any) {
    logger.error(`[PLAYOFF] Error recalculating all series: ${error.message}`);
    return { success: false, message: error.message };
  }
};
