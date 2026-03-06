import { set, isAfter, addYears } from 'date-fns';

export const getSubscriptionEndDate = (): string => {
  const now = new Date();

  let endDate = set(now, {
    month: 7,
    date: 31,
    hours: 22,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  if (isAfter(now, endDate)) {
    endDate = addYears(endDate, 1);
  }

  return endDate.toISOString();
};
