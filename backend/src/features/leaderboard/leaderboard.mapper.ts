import type { leaderboardRepository } from './leaderboard.repository.js';

type LeaderboardEntryRow = Awaited<
  ReturnType<typeof leaderboardRepository.findEntriesByCompetitionId>
>[number];

type GroupLeaderboardEntryRow = Awaited<
  ReturnType<typeof leaderboardRepository.getGroupStatsByUserIds>
>[number] & { groupRank: number };

export const mapLeaderboardEntries = (entries: LeaderboardEntryRow[], userId: string) =>
  entries.map((entry) => ({
    id: entry.id,
    userId: entry.userId,
    username: entry.user.username,
    isCurrentUser: entry.userId === userId,
    currentRank: entry.currentRank,
    totalPoints: entry.totalPoints,
    totalPredictions: entry.totalPredictions,
    exactGuesses: entry.exactGuesses,
    correctTrends: entry.correctTrends,
    correctDiffs: entry.correctDiffs,
    wrongGuesses: entry.wrongGuesses,
  }));

export const mapGroupLeaderboardEntries = (entries: GroupLeaderboardEntryRow[], userId: string) =>
  entries.map((entry) => {
    const membership = entry.user?.memberships[0];

    return {
      id: entry.id,
      username: membership?.alias?.length ? membership.alias : entry.user.username,
      memberRole: membership?.role ?? null,
      userId: entry.userId,
      isCurrentUser: entry.userId === userId,
      currentRank: entry.groupRank,
      globalCurrentRank: entry.currentRank,
      totalPoints: entry.totalPoints,
      totalPredictions: entry.totalPredictions,
      exactGuesses: entry.exactGuesses,
      correctTrends: entry.correctTrends,
      correctDiffs: entry.correctDiffs,
      wrongGuesses: entry.wrongGuesses,
      currentForm: entry.currentForm,
    };
  });
