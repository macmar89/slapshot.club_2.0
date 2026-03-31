import { logger } from '../../utils/logger.js';
import { competitionRepository } from '../../repositories/competitions.repository.js';
import { AppError } from '../../utils/appError.js';
import { CompetitionErrors } from '../../shared/constants/errors/competition.errors.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { API_HOCKEY_CONFIG } from '../../config/apiHockey.js';
import axios from 'axios';
import type { ApiHockeyStanding } from '../../types/hockeyApiResponse.types';
import { teamsRepository } from '../../repositories/teams.repository.js';
import { createTeamLookupMap } from '../../utils/standings.utils.js';
import { competitionStandingsRepository } from '../../repositories/competitionStandings.repository.js';

export const fetchStandingsFromApi = async (competitionId: string) => {
  const apiKey = process.env.SPORT_API_KEY;

  if (!apiKey) {
    logger.error('[STANDINGS SYNC] SPORT_API_KEY missing.');
    throw new AppError(
      CompetitionErrors.SPORT_API_KEY_MISSING,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  const competition = await competitionRepository.getById(competitionId, [
    'apiHockeyId',
    'apiHockeySeason',
  ]);

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  const leagueId = competition.apiHockeyId;
  const season = competition.apiHockeySeason;

  if (!leagueId || !season) {
    logger.error('[STANDINGS SYNC] Competition missing apiHockeyId or apiHockeySeason.');
    throw new AppError(CompetitionErrors.COMPETITION_CONFIG_MISSING, HttpStatusCode.BAD_REQUEST);
  }

  logger.info(`[STANDINGS SYNC] Fetching standings for league ${leagueId}, season ${season}...`);

  try {
    const response = await axios.get(
      `${API_HOCKEY_CONFIG.BASE_URL}${API_HOCKEY_CONFIG.ENDPOINTS.STANDINGS}`,
      {
        params: {
          league: leagueId,
          season: season,
        },
        headers: {
          'x-apisports-key': apiKey,
        },
      },
    );

    return response.data.response;
  } catch (error: any) {
    logger.error(`[STANDINGS SYNC] API error: ${error.message}`);
    const status = error.response?.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
    throw new AppError(CompetitionErrors.EXTERNAL_API_ERROR, status as HttpStatusCode);
  }
};

const transformApiDataToDbSchema = async (competitionId: string, apiData: ApiHockeyStanding[]) => {
  const teamsData = await teamsRepository.getApiLookup();

  const teamLookup = createTeamLookupMap(teamsData);

  return apiData.map((standing: ApiHockeyStanding) => {
    const teamId = teamLookup[standing.team.id];

    if (!teamId) {
      logger.warn(
        `[STANDINGS SYNC] Team ${standing.team.name} (API ID: ${standing.team.id}) not found in database.`,
      );
      return null;
    }

    let groupName = null;

    if (standing.group?.name === 'Eastern Conference') {
      groupName = 'East';
    } else if (standing.group?.name === 'Western Conference') {
      groupName = 'West';
    }

    return {
      teamId,
      competitionId,
      groupName,
      rank: standing.position,
      points: standing.points || 0,
      played: standing.games.played,
      win: standing.games.win.total || 0,
      winOvertime: standing.games.win_overtime.total || 0,
      lose: standing.games.lose.total || 0,
      loseOvertime: standing.games.lose_overtime.total || 0,
      goalsFor: standing.goals.for,
      goalsAgainst: standing.goals.against,
      form: standing.form,
      phase: standing.stage || 'regular',
    };
  });
};

export const syncStandings = async (competitionId: string) => {
  const apiData = await fetchStandingsFromApi(competitionId);

  if (!apiData || apiData.length === 0) {
    logger.warn(`[STANDINGS SYNC] No standings found for competition ${competitionId}`);
    return [];
  }

  const transformedData = await transformApiDataToDbSchema(competitionId, apiData[0]);

  if (transformedData.length > 0) {
    await competitionStandingsRepository.upsertMany(transformedData);

    logger.info(
      `[STANDINGS SYNC] Successfully synced ${transformedData.length} standings for competition ${competitionId}`,
    );
  }

  return transformedData;
};
