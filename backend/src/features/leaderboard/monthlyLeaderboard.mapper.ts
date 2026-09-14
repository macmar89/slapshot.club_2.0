import type { GroupRole } from '../../types/group.types.js';
import { formatPeriodKey } from './monthlyLeaderboard.period.js';
import * as monthlyLeaderboardRepository from './monthlyLeaderboard.repository.js';
import type { MonthlyPeriod } from './monthlyLeaderboard.types.js';

type MonthlyEntryRow = Awaited<
  ReturnType<typeof monthlyLeaderboardRepository.findEntriesForPeriod>
>[number];

type MonthlyPeriodRow = Awaited<ReturnType<typeof monthlyLeaderboardRepository.findPeriod>>;

type MonthlyPeriodHistoryRow = Awaited<
  ReturnType<typeof monthlyLeaderboardRepository.findPeriodsHistory>
>[number];

export type GroupMemberInfo = {
  role: GroupRole | null;
  alias: string | null;
};

const mapMonthlyEntry = (entry: MonthlyEntryRow, userId: string) => ({
  id: entry.id,
  userId: entry.userId,
  username: entry.user?.username ?? null,
  isCurrentUser: entry.userId === userId,
  currentRank: entry.currentRank,
  previousRank: entry.previousRank,
  rankChange: entry.rankChange,
  totalPoints: entry.totalPoints,
  totalPredictions: entry.totalPredictions,
  exactGuesses: entry.exactGuesses,
  correctTrends: entry.correctTrends,
  correctDiffs: entry.correctDiffs,
  wrongGuesses: entry.wrongGuesses,
});

export const mapMonthlyEntries = (entries: MonthlyEntryRow[], userId: string) =>
  entries.map((entry) => mapMonthlyEntry(entry, userId));

export const mapGroupMonthlyEntries = (
  entries: MonthlyEntryRow[],
  members: Map<string, GroupMemberInfo>,
  userId: string,
) =>
  entries.map((entry, index) => {
    const member = members.get(entry.userId);
    const mapped = mapMonthlyEntry(entry, userId);

    return {
      ...mapped,
      username: member?.alias?.length ? member.alias : mapped.username,
      memberRole: member?.role ?? null,
      currentRank: index + 1,
      globalCurrentRank: entry.currentRank,
    };
  });

export const mapMonthlyPeriod = (period: MonthlyPeriod, row: MonthlyPeriodRow) => ({
  key: formatPeriodKey(period),
  periodYear: period.periodYear,
  periodMonth: period.periodMonth,
  status: row?.status ?? 'open',
  totalParticipants: row?.totalParticipants ?? 0,
  totalPlayedMatches: row?.totalPlayedMatches ?? 0,
  totalPossiblePoints: row?.totalPossiblePoints ?? 0,
  lastRecalculatedAt: row?.lastRecalculatedAt ?? null,
  closedAt: row?.closedAt ?? null,
});

export const mapMonthlyPeriodsHistory = (periods: MonthlyPeriodHistoryRow[]) =>
  periods.map((period) => ({
    id: period.id,
    key: formatPeriodKey(period),
    periodYear: period.periodYear,
    periodMonth: period.periodMonth,
    status: period.status,
    totalParticipants: period.totalParticipants,
    totalPlayedMatches: period.totalPlayedMatches,
    totalPossiblePoints: period.totalPossiblePoints,
    winner: period.winnerUserId
      ? { userId: period.winnerUserId, username: period.winner?.username ?? null }
      : null,
    lastRecalculatedAt: period.lastRecalculatedAt,
    closedAt: period.closedAt,
  }));
