import { catchAsync } from '../utils/catchAsync.js';
import { type Request, type Response } from 'express';
import {
  findAllCompetitions,
  joinCompetition,
  findPublicCompetitionName,
  getPlayerStats,
  getPlayerPredictions,
  getCompetitionCounts,
} from '../services/competitions/competitions.service.js';
import { getCompetitionTeams } from '../services/team.service.js';
import type { AppLocale } from '../types/global.types.js';
import {
  getCompetitionMatches,
  getMatchDatesByCompetition,
  getUpcomingMatches,
} from '../services/matches/matches.service.js';
import { logActivity } from '../services/audit.service.js';

export const getPlayerStatsHandler = catchAsync(async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const slug = req.params.slug as string;

  const stats = await getPlayerStats(username, slug);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

export const getPlayerPredictionsHandler = catchAsync(async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const slug = req.params.slug as string;
  const viewerId = req.user!.id;
  const viewerPlan = req.user!.subscriptionPlan;
  const cursorDate = req.query.cursorDate as string | undefined;
  const search = req.query.search as string | undefined;
  const limit = req.query.count ? Number(req.query.count) : 6;
  const locale = (req.cookies.NEXT_LOCALE as AppLocale) || 'sk';

  const predictions = await getPlayerPredictions(
    username,
    slug,
    limit,
    cursorDate,
    search,
    viewerId,
    viewerPlan,
    locale,
  );

  res.status(200).json({
    status: 'success',
    data: predictions,
  });
});

export const getCompetitionsHandler = catchAsync(async (req: Request, res: Response) => {
  const locale = (req.cookies.NEXT_LOCALE as AppLocale) || 'sk';
  const userId = req.user!.id;
  const tab = (req.query.tab as string) || 'active';

  const competitions = await findAllCompetitions(userId, locale, tab);

  res.status(200).json({
    status: 'success',
    data: {
      competitions,
    },
  });
});

export const getCompetitionCountsHandler = catchAsync(async (req: Request, res: Response) => {
  const counts = await getCompetitionCounts();

  res.status(200).json({
    status: 'success',
    data: counts,
  });
});


export const joinCompetitionHandler = catchAsync(async (req: Request, res: Response) => {
  const competitionId = req.body.competitionId;
  const userId = req.user!.id;

  const competition = await joinCompetition(userId, competitionId);

  await logActivity(
    req,
    'COMP_JOIN',
    { type: 'competition', id: competitionId },
    { competitionSlug: competition.slug },
    { userId },
  );

  res.status(201).json({
    status: 'success',
    data: {
      competition,
    },
  });
});

export const getPublicCompetitionNameHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const locale = (req.cookies.NEXT_LOCALE as AppLocale) || 'sk';

  const competition = await findPublicCompetitionName(slug, locale);

  res.status(200).json({
    status: 'success',
    data: competition,
  });
});

export const getUpcomingMatchesHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const locale = (req.cookies.NEXT_LOCALE as AppLocale) || 'sk';
  const userId = req.user!.id;

  const upcomingMatches = await getUpcomingMatches(userId, slug, locale);

  res.status(200).json({
    status: 'success',
    data: upcomingMatches,
  });
});

export const getCalendarMatchesHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const timezone = req.query.tz as string;

  const data = await getMatchDatesByCompetition(slug, timezone);

  res.status(200).json({
    status: 'success',
    data: data.matchDates,
  });
});

export const getCompetitionMatchesHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const locale = (req.cookies.NEXT_LOCALE as AppLocale) || 'sk';
  const userId = req.user!.id;
  const date = req.query.date as string;
  const timezone = req.query.tz as string;

  const matches = await getCompetitionMatches(date, userId, slug, locale, timezone);

  res.status(200).json({
    status: 'success',
    data: matches,
  });
});

export const getCompetitionTeamsHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const locale = (req.cookies.NEXT_LOCALE as AppLocale) || 'sk';

  const teams = await getCompetitionTeams(slug, locale);

  res.status(200).json({
    status: 'success',
    data: teams,
  });
});
