import type { db } from '../../db/index.js';

export type MonthlyPeriod = {
  periodYear: number;
  periodMonth: number;
};

export type MonthlyEntryStats = {
  userId: string;
  totalPoints: number;
  totalPredictions: number;
  exactGuesses: number;
  correctTrends: number;
  correctDiffs: number;
  wrongGuesses: number;
};

export type MonthlyPeriodTotals = {
  totalParticipants: number;
  totalPlayedMatches: number;
  totalPossiblePoints: number;
};

export type RecalculateMonthlyRanksJobData = MonthlyPeriod & {
  competitionId: string;
};

export type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
