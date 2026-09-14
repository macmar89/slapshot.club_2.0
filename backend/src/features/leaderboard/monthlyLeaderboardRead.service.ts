import { groupMembersRepository } from '../../repositories/groupMembers.repository.js';
import { groupRepository } from '../../repositories/groups.repository.js';
import {
  mapGroupMonthlyEntries,
  mapMonthlyEntries,
  mapMonthlyPeriod,
  mapMonthlyPeriodsHistory,
  type GroupMemberInfo,
} from './monthlyLeaderboard.mapper.js';
import { resolveCompetitionIdBySlug } from './leaderboardRead.service.js';
import { getCurrentPeriod } from './monthlyLeaderboard.period.js';
import * as monthlyLeaderboardRepository from './monthlyLeaderboard.repository.js';
import type { MonthlyPeriod } from './monthlyLeaderboard.types.js';

export const MONTHLY_PERIODS_HISTORY_LIMIT = 24;

export const getMonthlyLeaderboard = async (
  slug: string,
  userId: string,
  requestedPeriod?: MonthlyPeriod,
) => {
  const competitionId = await resolveCompetitionIdBySlug(slug);
  const period = requestedPeriod ?? getCurrentPeriod();

  const [periodRow, entries] = await Promise.all([
    monthlyLeaderboardRepository.findPeriod(competitionId, period),
    monthlyLeaderboardRepository.findEntriesForPeriod(competitionId, period),
  ]);

  return {
    period: mapMonthlyPeriod(period, periodRow),
    entries: mapMonthlyEntries(entries, userId),
  };
};

export const getMonthlyPeriodsHistory = async (
  slug: string,
  limit: number = MONTHLY_PERIODS_HISTORY_LIMIT,
) => {
  const competitionId = await resolveCompetitionIdBySlug(slug);

  const periods = await monthlyLeaderboardRepository.findPeriodsHistory(competitionId, limit);

  return mapMonthlyPeriodsHistory(periods);
};

export const getGroupMonthlyLeaderboard = async (
  groupId: string,
  userId: string,
  requestedPeriod?: MonthlyPeriod,
) => {
  const period = requestedPeriod ?? getCurrentPeriod();

  const [competitionId, members] = await Promise.all([
    groupRepository.getCompetitionIdByGroupId(groupId),
    groupMembersRepository.getMembersByGroupId(groupId, ['active']),
  ]);

  if (!competitionId || members.length === 0) {
    return { period: mapMonthlyPeriod(period, null), entries: [] };
  }

  const membersById = new Map<string, GroupMemberInfo>(
    members.map((member) => [member.userId, { role: member.role, alias: member.alias }]),
  );

  const [periodRow, entries] = await Promise.all([
    monthlyLeaderboardRepository.findPeriod(competitionId, period),
    monthlyLeaderboardRepository.findEntriesForPeriod(
      competitionId,
      period,
      members.map((member) => member.userId),
    ),
  ]);

  return {
    period: mapMonthlyPeriod(period, periodRow),
    entries: mapGroupMonthlyEntries(entries, membersById, userId),
  };
};
