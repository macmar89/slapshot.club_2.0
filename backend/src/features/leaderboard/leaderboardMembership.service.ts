import { leaderboardRepository } from './leaderboard.repository.js';

export const isCompetitionMember = async (competitionId: string, userId: string) =>
  await leaderboardRepository.isMember(competitionId, userId);

export const getCompetitionGroupStats = async (userId: string, competitionId: string) =>
  await leaderboardRepository.getStatsByUser(userId, competitionId);

export const incrementJoinedPrivateGroupsCount = async (
  competitionId: string,
  userId: string,
  tx?: any,
) => await leaderboardRepository.incrementJoinedPrivateGroupsCount(competitionId, userId, tx);

export const decrementJoinedPrivateGroupsCount = async (
  competitionId: string,
  userId: string,
  tx?: any,
) => await leaderboardRepository.decrementJoinedPrivateGroupsCount(competitionId, userId, tx);

export const incrementOwnedPrivateGroupsCount = async (
  competitionId: string,
  userId: string,
  tx?: any,
) => await leaderboardRepository.incrementOwnedPrivateGroupsCount(competitionId, userId, tx);

export const decrementOwnedPrivateGroupsCount = async (
  competitionId: string,
  userId: string,
  tx?: any,
) => await leaderboardRepository.decrementOwnedPrivateGroupsCount(competitionId, userId, tx);
