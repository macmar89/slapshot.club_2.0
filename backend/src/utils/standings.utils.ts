export const createTeamLookupMap = (teams: { id: string; apiHockeyId: string | null }[]) => {
  return teams.reduce(
    (acc, team) => {
      if (team.apiHockeyId) acc[Number(team.apiHockeyId)] = team.id;
      return acc;
    },
    {} as Record<number, string>,
  );
};
