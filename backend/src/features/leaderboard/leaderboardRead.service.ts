import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { competitions } from '../../db/schema/index.js';
import { groupMembersRepository } from '../../repositories/groupMembers.repository.js';
import { groupRepository } from '../../repositories/groups.repository.js';
import { CompetitionErrors } from '../../shared/constants/errors/competition.errors.js';
import { AppError } from '../../utils/appError.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { calculateRate, roundTo } from '../../utils/math.js';
import { mapGroupLeaderboardEntries, mapLeaderboardEntries } from './leaderboard.mapper.js';
import { leaderboardRepository } from './leaderboard.repository.js';

export const resolveCompetitionIdBySlug = async (slug: string): Promise<string> => {
  const competition = await db.query.competitions.findFirst({
    columns: { id: true },
    where: eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  return competition.id;
};

export const getLeaderboard = async (slug: string, userId: string) => {
  const competitionId = await resolveCompetitionIdBySlug(slug);

  const entries = await leaderboardRepository.findEntriesByCompetitionId(competitionId);

  return mapLeaderboardEntries(entries, userId);
};

export const getMemberStatsBySlug = async (userId: string, slug: string) => {
  const competitionId = await resolveCompetitionIdBySlug(slug);

  const leaderboardEntry = await leaderboardRepository.findEntryByUser(userId, competitionId);

  if (!leaderboardEntry) {
    throw new AppError(CompetitionErrors.USER_NOT_MEMBER_OF_COMPETITION, HttpStatusCode.NOT_FOUND);
  }

  const points = leaderboardEntry.totalPoints || 0;
  const games = leaderboardEntry.totalPredictions || 0;

  const totalCorrect =
    (leaderboardEntry.exactGuesses || 0) +
    (leaderboardEntry.correctTrends || 0) +
    (leaderboardEntry.correctDiffs || 0);

  return {
    ...leaderboardEntry,
    winRate: calculateRate(totalCorrect, games),
    pointsPerGame: roundTo(points / (games || 1), 2),
    totalCorrect,
  };
};

export const getGroupLeaderboard = async (groupId: string, userId: string) => {
  const [competitionId, membersIds] = await Promise.all([
    groupRepository.getCompetitionIdByGroupId(groupId),
    groupMembersRepository.getUserIdsByGroupId(groupId, ['active']),
  ]);

  if (!membersIds.length || !competitionId) return [];

  const rawEntries = await leaderboardRepository.getGroupStatsByUserIds(
    membersIds,
    competitionId,
    groupId,
  );

  let currentRank = 1;
  const entriesWithGroupRank = rawEntries.map((entry, index, array) => {
    if (index > 0 && entry.currentRank === array[index - 1]!.currentRank) {
    } else {
      currentRank = index + 1;
    }

    return {
      ...entry,
      groupRank: currentRank,
    };
  });

  return mapGroupLeaderboardEntries(entriesWithGroupRank, userId);
};
