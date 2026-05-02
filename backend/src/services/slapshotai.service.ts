import {
  getActiveCompetitions,
  getRecentFinishedMatches,
  getPredictionsForMatches,
  getNewVerifiedAppUsers,
  getNewVerifiedCompetitionUsers,
  getTotalVerifiedAppUsers,
} from '../repositories/slapshotai.repository.js';
import type {
  SlapshotAiStatsResponse,
  SlapshotAiCompetitionData,
  SlapshotAiMatchData,
} from '../types/slapshotai.types.js';

export const getStatsForSlapshotAi = async (
  startDate: string,
  endDate: string,
): Promise<SlapshotAiStatsResponse> => {
  const activeCompetitions = await getActiveCompetitions();

  if (activeCompetitions.length === 0) {
    const totalAppUsersRes = await getTotalVerifiedAppUsers();
    return { 
      summary: { totalTips: 0 }, 
      metadata: { newAppUsers: [], newAppUsersCount: 0, totalAppUsersCount: totalAppUsersRes }, 
      competitions: [] 
    };
  }

  const competitionIds = activeCompetitions.map((c) => c.id);

  const recentMatches = await getRecentFinishedMatches(competitionIds, startDate, endDate);

  const newAppUsersReq = getNewVerifiedAppUsers(startDate, endDate);
  const newCompUsersReq = getNewVerifiedCompetitionUsers(startDate, endDate);
  const totalAppUsersReq = getTotalVerifiedAppUsers();

  const [newAppUsersRes, newCompUsersRes, totalAppUsersRes] = await Promise.all([
    newAppUsersReq, 
    newCompUsersReq,
    totalAppUsersReq,
  ]);

  const newAppUsersList = newAppUsersRes.map((u) => u.username);
  const metadata = {
    newAppUsers: newAppUsersList,
    newAppUsersCount: newAppUsersList.length,
    totalAppUsersCount: totalAppUsersRes,
  };

  if (recentMatches.length === 0) {
    return { summary: { totalTips: 0 }, metadata, competitions: [] };
  }

  const matchIds = recentMatches.map((m) => m.id);
  const matchPredictions = await getPredictionsForMatches(matchIds);

  const competitionsMap = new Map<string, SlapshotAiCompetitionData>();
  
  for (const comp of activeCompetitions) {
    competitionsMap.set(comp.id, {
      name: comp.name || 'Neznáma súťaž',
      status: comp.status,
      isRegistrationOpen: comp.isRegistrationOpen || false,
      totalTips: 0,
      totalUsersCount: comp.totalParticipants || 0,
      newUsersCount: 0,
      newCompetitionUsers: [],
      matches: [],
      topTippers: [],
      bottomTippers: [],
    });
  }

  for (const user of newCompUsersRes) {
    const compData = competitionsMap.get(user.competitionId);
    if (compData) {
      compData.newCompetitionUsers.push(user.username);
      compData.newUsersCount++;
    }
  }

  let totalTips = 0;
  const userPointsByCompetition = new Map<string, Map<string, number>>();

  for (const match of recentMatches) {
    const matchName = `${match.homeTeamName || 'Domáci'} vs ${match.awayTeamName || 'Hostia'}`;
    const score = `${match.resultHomeScore}:${match.resultAwayScore}`;
    const date = match.date;

    const matchPreds = matchPredictions.filter((p) => p.matchId === match.id);

    const stats = {
      exactScore: 0,
      goalDifference: 0,
      winnerOnly: 0,
      missed: 0,
    };
    const perfectHits: string[] = [];

    const compPoints = userPointsByCompetition.get(match.competitionId) || new Map<string, number>();

    for (const pred of matchPreds) {
      let points = 0;
      if (pred.isExact) {
        stats.exactScore++;
        perfectHits.push(pred.username);
        points = 5;
      } else if (pred.isDiff) {
        stats.goalDifference++;
        points = 3;
      } else if (pred.isTrend) {
        stats.winnerOnly++;
        points = 2;
      } else if (pred.isWrong) {
        stats.missed++;
        points = 0;
      }

      const currentPoints = compPoints.get(pred.username) || 0;
      compPoints.set(pred.username, currentPoints + points);
    }
    
    userPointsByCompetition.set(match.competitionId, compPoints);

    const total12 = match.homePredictedCount + match.awayPredictedCount;
    totalTips += total12;

    const percentages: Record<string, number> = {};

    if (total12 > 0) {
      if (match.homePredictedCount > 0) {
        percentages['1'] = Math.round((match.homePredictedCount / total12) * 100);
      }
      if (match.awayPredictedCount > 0) {
        percentages['2'] = Math.round((match.awayPredictedCount / total12) * 100);
      }
    }

    const topPredictions: { score: string; count: number }[] = [];
    if (match.predictionStats?.scores) {
      const scoresObj = match.predictionStats.scores;
      // Convert to array of { score, count }
      const sortedScores = Object.entries(scoresObj)
        .map(([score, count]) => ({ score, count }))
        .sort((a, b) => b.count - a.count);

      if (sortedScores.length > 0) {
        // Find the count threshold for the 3rd place
        const thresholdIndex = Math.min(2, sortedScores.length - 1);
        const thresholdCount = sortedScores[thresholdIndex]?.count ?? 0;

        // Include all that have at least the threshold count
        for (const item of sortedScores) {
          if (item.count >= thresholdCount) {
            topPredictions.push(item);
          } else {
            break;
          }
        }
      }
    }

    const matchData: SlapshotAiMatchData = {
      matchName,
      score,
      date,
      stats,
      percentages,
      perfectHitUsernames: perfectHits,
      totalTips: total12,
      topPredictions,
    };

    const compData = competitionsMap.get(match.competitionId);
    if (compData) {
      compData.matches.push(matchData);
      compData.totalTips += total12;
    }
  }

  for (const [compId, compData] of competitionsMap.entries()) {
    const compPoints = userPointsByCompetition.get(compId);
    if (compPoints && compPoints.size > 0) {
      const sortedUsers = Array.from(compPoints.entries())
        .map(([username, points]) => ({ username, points }))
        .sort((a, b) => b.points - a.points);
      
      compData.topTippers = sortedUsers.slice(0, 3);
      compData.bottomTippers = sortedUsers.slice(-3).reverse();
    }
  }

  const filteredCompetitions = Array.from(competitionsMap.values()).filter(
    (c) => c.matches.length > 0 || c.isRegistrationOpen === true,
  );

  return {
    summary: { totalTips },
    metadata,
    competitions: filteredCompetitions,
  };
};
