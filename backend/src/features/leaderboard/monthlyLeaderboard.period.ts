import type { MonthlyPeriod } from './monthlyLeaderboard.types.js';

export const MONTHLY_PERIOD_TIMEZONE = 'Europe/Bratislava';

const periodFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: MONTHLY_PERIOD_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
});

export const getPeriodFromDate = (date: string | Date): MonthlyPeriod => {
  const parsed = typeof date === 'string' ? new Date(date) : date;

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date passed to getPeriodFromDate: ${String(date)}`);
  }

  const parts = periodFormatter.formatToParts(parsed);
  const periodYear = Number(parts.find((part) => part.type === 'year')?.value);
  const periodMonth = Number(parts.find((part) => part.type === 'month')?.value);

  if (!Number.isInteger(periodYear) || !Number.isInteger(periodMonth)) {
    throw new Error(`Unable to resolve monthly period from date: ${String(date)}`);
  }

  return { periodYear, periodMonth };
};

export const getCurrentPeriod = (): MonthlyPeriod => getPeriodFromDate(new Date());

export const getPreviousPeriod = ({ periodYear, periodMonth }: MonthlyPeriod): MonthlyPeriod =>
  periodMonth === 1
    ? { periodYear: periodYear - 1, periodMonth: 12 }
    : { periodYear, periodMonth: periodMonth - 1 };

export const formatPeriodKey = ({ periodYear, periodMonth }: MonthlyPeriod): string =>
  `${periodYear}-${String(periodMonth).padStart(2, '0')}`;
