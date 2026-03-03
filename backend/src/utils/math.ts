export const roundTo = (value: number, decimals: number = 2): number => {
  return Number(value.toFixed(decimals));
};

export const calculateRate = (part: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
};
