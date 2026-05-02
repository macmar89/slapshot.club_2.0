import {
  set,
  subDays,
  subWeeks,
  isBefore,
  parseISO,
  setISOWeek,
  setISOWeekYear,
  setISODay,
  getISOWeek,
  getISOWeekYear,
  addWeeks,
} from 'date-fns';
import { slapshotAiConfig } from '../../config/slapshotai.config.js';

export const getDailyWindow = (referenceDateIso?: string) => {
  const refDate = referenceDateIso ? parseISO(referenceDateIso) : new Date();
  const parts = slapshotAiConfig.dailyReportTime.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;

  let endDate = set(refDate, { hours, minutes, seconds: 0, milliseconds: 0 });

  // If we didn't provide a specific date, and the current time is before today's 09:20,
  // we shift the window back by 1 day.
  if (!referenceDateIso && isBefore(refDate, endDate)) {
    endDate = subDays(endDate, 1);
  }

  const startDate = subDays(endDate, 1);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

export const getWeeklyWindow = (queryWeek?: number, queryYear?: number) => {
  const refDate = new Date();
  const parts = slapshotAiConfig.weeklyReportTime.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;

  let endDate = set(refDate, { hours, minutes, seconds: 0, milliseconds: 0 });

  if (queryWeek) {
    // If week is provided, find the Monday of the NEXT week at 09:30
    // Because the report for week X covers Monday week X to Monday week X+1.
    // So the 'end' date is Monday of week X+1.
    endDate = setISOWeekYear(endDate, queryYear || getISOWeekYear(refDate));
    endDate = setISOWeek(endDate, queryWeek + 1);
    endDate = setISODay(endDate, 1); // 1 = Monday
  } else {
    // Current time relative calculation
    // Shift to current week's Monday 09:30
    let currentMonday = setISODay(endDate, 1);

    // If current time is before this week's Monday 09:30, the "current" week hasn't started yet according to the report schedule.
    if (isBefore(refDate, currentMonday)) {
      currentMonday = subWeeks(currentMonday, 1);
    }
    
    // We want the current ongoing week, so the report window ends 1 week after the start
    endDate = addWeeks(currentMonday, 1);
  }

  const startDate = subWeeks(endDate, 1);
  const reportWeek = getISOWeek(startDate); // The week number this report is about
  const reportYear = getISOWeekYear(startDate);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    reportWeek,
    reportYear,
  };
};
