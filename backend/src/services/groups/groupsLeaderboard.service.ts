import { groupRepository } from '../../repositories/groups.repository.js';
import { groupMembersRepository } from '../../repositories/groupMembers.repository.js';
import { leaderboardEntriesRepository } from '../../repositories/leaderboardEntries.repository.js';
import { mapGroupLeaderboardEntries } from '../../utils/mappers/group.mappers.js';

export const getGroupLeaderboard = async (groupId: string, userId: string) => {
  const competitionId = await groupRepository.getCompetitionIdByGroupId(groupId);

  const membersIds = await groupMembersRepository.getUserIdsByGroupId(groupId, ['active']);

  if (!membersIds.length || !competitionId) return [];

  const rawEntries = await leaderboardEntriesRepository.getGroupStatsByUserIds(
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
