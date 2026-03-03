import { catchAsync } from '../utils/catchAsync';
import { type Request, type Response } from 'express';
import {
  findAllCompetitions,
  joinCompetition,
  findPublicCompetitionName,
} from '../services/competition.service';
import type { AppLocale } from '../types/global';

export const getCompetitionsHandler = catchAsync(async (req: Request, res: Response) => {
  const locale = (req.cookies.NEXT_LOCALE as AppLocale) || 'sk';
  const userId = req.user!.id;

  const competitions = await findAllCompetitions(userId, locale);

  res.status(200).json({
    status: 'success',
    data: {
      competitions,
    },
  });
});

export const joinCompetitionHandler = catchAsync(async (req: Request, res: Response) => {
  const competitionId = req.body.competitionId;
  const userId = req.user!.id;

  const competition = await joinCompetition(userId, competitionId);

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
