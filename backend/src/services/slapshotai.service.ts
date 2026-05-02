import {
  getActiveCompetitions,
  getRecentFinishedMatches,
  getPredictionsForMatches,
  getNewVerifiedAppUsers,
  getNewVerifiedCompetitionUsers,
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
    return { summary: { totalTips: 0 }, metadata: { newAppUsers: [] }, competitions: [] };
  }

  const competitionIds = activeCompetitions.map((c) => c.id);

  const recentMatches = await getRecentFinishedMatches(competitionIds, startDate, endDate);

  const newAppUsersReq = getNewVerifiedAppUsers(startDate);
  const newCompUsersReq = getNewVerifiedCompetitionUsers(startDate);

  const [newAppUsersRes, newCompUsersRes] = await Promise.all([newAppUsersReq, newCompUsersReq]);

  const metadata = {
    newAppUsers: newAppUsersRes.map((u) => u.username),
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

    for (const pred of matchPreds) {
      if (pred.isExact) {
        stats.exactScore++;
        perfectHits.push(pred.username);
      } else if (pred.isDiff) {
        stats.goalDifference++;
      } else if (pred.isTrend) {
        stats.winnerOnly++;
      } else if (pred.isWrong) {
        stats.missed++;
      }
    }

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

  const filteredCompetitions = Array.from(competitionsMap.values()).filter(
    (c) => c.matches.length > 0 || c.isRegistrationOpen === true,
  );

  return {
    summary: { totalTips },
    metadata,
    competitions: filteredCompetitions,
  };
};
