export const mapMatchToPreview = (match: any, userId?: string) => {
  const prediction = match.predictions?.[0] || null;

  return {
    id: match.id,
    date: match.date,
    displayTitle: match.displayTitle,
    status: match.status,
    competitionName: match.competition?.locales[0]?.name,
    homeTeamName: match.homeTeam?.locales[0]?.name,
    homeTeamShortName: match.homeTeam?.locales[0]?.shortName,
    homeTeamLogo: match.homeTeam?.logo?.url,
    awayTeamName: match.awayTeam?.locales[0]?.name,
    awayTeamShortName: match.awayTeam?.locales[0]?.shortName,
    awayTeamLogo: match.awayTeam?.logo?.url,
    apiHockeyStatus: match.apiHockeyStatus,
    homePredictedCount: match.homePredictedCount,
    awayPredictedCount: match.awayPredictedCount,
    stageType: match.stageType,
    resultHomeScore: match.resultHomeScore,
    resultAwayScore: match.resultAwayScore,
    resultEndingType: match.resultEndingType,
    roundLabel: match.roundLabel,
    roundOrder: match.roundOrder,
    groupName: match.groupName,
    seriesGameNumber: match.seriesGameNumber,
    seriesState: match.seriesState,
    rankedAt: match.rankedAt,
    userPrediction: prediction
      ? {
          id: prediction.id,
          homeGoals: prediction.homeGoals,
          awayGoals: prediction.awayGoals,
          status: prediction.status,
          points: prediction.points,
        }
      : null,
  };
};
