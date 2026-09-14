import type { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { getStatsForSlapshotAi } from '../services/slapshotai.service.js';
import { getDailyWindow, getWeeklyWindow } from '../utils/slapshotai/time.utils.js';

export const getSlapshotAiStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`[SlapshotAI] Incoming daily stats request from IP: ${req.ip}`);

    const referenceDate = req.query.date as string | undefined;
    const { startDate, endDate } = getDailyWindow(referenceDate);

    const responseData = await getStatsForSlapshotAi(startDate, endDate);

    responseData.summary = {
      ...responseData.summary,
      startDate,
      endDate,
    };

    return res.status(HttpStatusCode.OK).json(responseData);
  } catch (error) {
    console.error('[SlapshotAI] Error in getSlapshotAiStats:', error);
    next(error);
  }
};

export const getSlapshotAiWeeklyStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`[SlapshotAI] Incoming weekly stats request from IP: ${req.ip}`);

    const week = req.query.week ? parseInt(req.query.week as string, 10) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string, 10) : undefined;

    const { startDate, endDate, reportWeek, reportYear } = getWeeklyWindow(week, year);

    const responseData = await getStatsForSlapshotAi(startDate, endDate);
    
    // Zabalíme week a year do summary
    responseData.summary = {
      ...responseData.summary,
      week: reportWeek,
      year: reportYear,
      startDate,
      endDate,
    };

    return res.status(HttpStatusCode.OK).json(responseData);
  } catch (error) {
    console.error('[SlapshotAI] Error in getSlapshotAiWeeklyStats:', error);
    next(error);
  }
};
