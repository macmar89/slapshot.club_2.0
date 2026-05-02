import { db } from '../db/index.js';
import {
  competitions,
  competitionsLocales,
  matches,
  teamsLocales,
  predictions,
  users,
  leaderboardEntries,
} from '../db/schema/index.js';
import { eq, and, or, gt, lte, inArray, aliasedTable, isNotNull } from 'drizzle-orm';

export const getActiveCompetitions = async () => {
  return db
    .select({
      id: competitions.id,
      name: competitionsLocales.name,
      status: competitions.status,
      isRegistrationOpen: competitions.isRegistrationOpen,
      totalParticipants: competitions.totalParticipants,
    })
    .from(competitions)
    .leftJoin(
      competitionsLocales,
      and(eq(competitions.id, competitionsLocales.competitionId), eq(competitionsLocales.locale, 'sk')),
    )
    .where(
      or(
        eq(competitions.status, 'active'),
        eq(competitions.isRegistrationOpen, true),
      ),
    );
};

export const getRecentFinishedMatches = async (
  competitionIds: string[],
  since: string,
  until: string,
) => {
  const awayTeamsLocales = aliasedTable(teamsLocales, 'away_teams_locales');

  return db
    .select({
      id: matches.id,
      competitionId: matches.competitionId,
      date: matches.date,
      homePredictedCount: matches.homePredictedCount,
      awayPredictedCount: matches.awayPredictedCount,
      resultHomeScore: matches.resultHomeScore,
      resultAwayScore: matches.resultAwayScore,
      homeTeamName: teamsLocales.name,
      awayTeamName: awayTeamsLocales.name,
      predictionStats: matches.predictionStats,
    })
    .from(matches)
    .leftJoin(
      teamsLocales,
      and(eq(matches.homeTeamId, teamsLocales.parentId), eq(teamsLocales.locale, 'sk')),
    )
    .leftJoin(
      awayTeamsLocales,
      and(eq(matches.awayTeamId, awayTeamsLocales.parentId), eq(awayTeamsLocales.locale, 'sk')),
    )
    .where(
      and(
        inArray(matches.competitionId, competitionIds),
        eq(matches.status, 'finished'),
        gt(matches.date, since),
        lte(matches.date, until),
      ),
    );
};

export const getPredictionsForMatches = async (matchIds: string[]) => {
  return db
    .select({
      matchId: predictions.matchId,
      isExact: predictions.isExact,
      isDiff: predictions.isDiff,
      isTrend: predictions.isTrend,
      isWrong: predictions.isWrong,
      username: users.username,
    })
    .from(predictions)
    .innerJoin(users, eq(predictions.userId, users.id))
    .where(inArray(predictions.matchId, matchIds));
};

export const getNewVerifiedAppUsers = async (since: string) => {
  return db
    .select({
      username: users.username,
    })
    .from(users)
    .where(
      and(
        gt(users.createdAt, since),
        isNotNull(users.verifiedAt),
      ),
    );
};

export const getNewVerifiedCompetitionUsers = async (since: string) => {
  return db
    .select({
      username: users.username,
      competitionId: leaderboardEntries.competitionId,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(leaderboardEntries.userId, users.id))
    .where(
      and(
        gt(leaderboardEntries.createdAt, since),
        isNotNull(users.verifiedAt),
      ),
    )
    .groupBy(users.username, leaderboardEntries.competitionId);
};
