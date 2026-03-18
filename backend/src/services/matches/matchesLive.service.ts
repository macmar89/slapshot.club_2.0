import { API_HOCKEY_CONFIG } from '../../config/apiHockey.js';
import type { ApiHockeyResponse, ApiHockeyMatch } from '../../types/hockeyApiResponse.types.js';
import { matchesRepository } from '../../repositories/matches.repository.js';
import { matchesQueue } from '../../queues/matches.queue.js';
import { logger } from '../../utils/logger.js';

export const handleLiveUpdates = async () => {
  const apiKey = process.env.SPORT_API_KEY;
  if (!apiKey) {
    logger.error('[LIVE TICKER] SPORT_API_KEY is missing.');
    return;
  }

  const potentialMatches = await matchesRepository.getPotentialLiveMatches();
  if (potentialMatches.length === 0) {
    return;
  }

  // Group matches by (apiHockeyId + date) to minimize API calls
  const syncGroups = new Map<
    string,
    { apiHockeyId: string; season: string; date: string; matchIds: string[] }
  >();

  for (const match of potentialMatches) {
    const competition = match.competition as any;
    if (!competition?.apiHockeyId || !competition?.apiHockeySeason) continue;

    const dateStr = new Date(match.date).toISOString().split('T')[0]!;
    const key = `${competition.apiHockeyId}|${competition.apiHockeySeason}|${dateStr}`;

    if (!syncGroups.has(key)) {
      syncGroups.set(key, {
        apiHockeyId: String(competition.apiHockeyId),
        season: String(competition.apiHockeySeason),
        date: dateStr,
        matchIds: [],
      });
    }
    syncGroups.get(key)!.matchIds.push(match.id);
  }

  for (const group of syncGroups.values()) {
    try {
      const url = new URL(`${API_HOCKEY_CONFIG.BASE_URL}${API_HOCKEY_CONFIG.ENDPOINTS.GAMES}`);
      url.searchParams.append('league', group.apiHockeyId);
      url.searchParams.append('season', group.season);
      url.searchParams.append('date', group.date);

      const response = await fetch(url.toString(), {
        headers: { 'x-apisports-key': apiKey },
      });

      if (!response.ok) {
        logger.error(
          `[LIVE TICKER] API error for league ${group.apiHockeyId}: ${response.statusText}`,
        );
        continue;
      }

      const data: ApiHockeyResponse = await response.json();
      const apiMatches = data.response || [];

      for (const localMatchId of group.matchIds) {
        const localMatch = potentialMatches.find((m) => m.id === localMatchId);
        if (!localMatch) continue;

        const apiMatch = apiMatches.find((am) => String(am.id) === localMatch.apiHockeyId);
        if (!apiMatch) continue;

        await processMatchUpdate(localMatch, apiMatch);
      }
    } catch (error: any) {
      logger.error(`[LIVE TICKER] Error processing group ${group.apiHockeyId}: ${error.message}`);
    }
  }
};

export const processMatchUpdate = async (localMatch: any, apiMatch: ApiHockeyMatch) => {
  const apiStatusShort = apiMatch.status.short;
  const internalStatus =
    (API_HOCKEY_CONFIG.GAME_STATUSES as any)[apiStatusShort] || localMatch.status;

  const newHomeScore = apiMatch.scores.home ?? 0;
  const newAwayScore = apiMatch.scores.away ?? 0;
  const newEndingType = detectEndingType(apiMatch);

  const statusChanged = localMatch.status !== internalStatus;
  const apiStatusChanged = localMatch.apiHockeyStatus !== apiStatusShort;
  const scoreChanged =
    localMatch.resultHomeScore !== newHomeScore || localMatch.resultAwayScore !== newAwayScore;
  const endingTypeChanged = localMatch.resultEndingType !== newEndingType;

  if (statusChanged || apiStatusChanged || scoreChanged || endingTypeChanged) {
    if (statusChanged && internalStatus === 'live') {
      logger.info(`Match ${localMatch.displayTitle}: Status changed to live`);
    }
    if (scoreChanged) {
      logger.info(
        `Match ${localMatch.displayTitle}: Score changed to ${newHomeScore}:${newAwayScore}`,
      );
    }
    if (apiStatusChanged) {
      logger.info(
        `Match ${localMatch.displayTitle}: API Status changed to ${apiStatusShort} (${internalStatus})`,
      );
    }
    if (statusChanged && internalStatus === 'finished') {
      logger.info(`Match ${localMatch.displayTitle}: Finished`);
    }

    await matchesRepository.updateMatch(localMatch.id, {
      status: internalStatus,
      apiHockeyStatus: apiStatusShort,
      resultHomeScore: newHomeScore,
      resultAwayScore: newAwayScore,
      resultEndingType: newEndingType,
    });

    if (internalStatus === 'finished' && statusChanged) {
      await matchesQueue.add('evaluatePredictions', { matchId: localMatch.id });
    }
  }
};

const detectEndingType = (apiMatch: ApiHockeyMatch): 'regular' | 'ot' | 'so' => {
  if (apiMatch.periods.penalties !== null) return 'so';
  if (apiMatch.periods.overtime !== null) return 'ot';
  return 'regular';
};
