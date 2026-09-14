import { MatchRound } from './matches.types';

export const mapRoundLabelToEnum = (rawLabel: string): MatchRound | string => {
  const label = rawLabel.toLowerCase();

  if (label.includes('quarter_finals')) return MatchRound.QUARTER_FINALS;
  if (label.includes('semi_finals')) return MatchRound.SEMI_FINALS;
  if (label.includes('finals') && !label.includes('semi') && !label.includes('quarter'))
    return MatchRound.FINALS;

  return rawLabel;
};

export const translateRound = (rawLabel: string, tm: any) => {
  const key = mapRoundLabelToEnum(rawLabel);

  if (/^\d+$/.test(key)) {
    return tm('round_format', { count: key });
  }

  const translated = tm(key);

  if (translated === key || translated.toUpperCase().includes('MATCHES.APIHOCKEYROUND')) {
    return rawLabel;
  }

  return translated;
};

export type PredictionOutcome = 'exact' | 'diff' | 'trend' | 'wrong';

export const getPredictionOutcome = (
  tip: { homeGoals: number; awayGoals: number },
  result: { homeScore: number; awayScore: number },
): PredictionOutcome => {
  if (tip.homeGoals === result.homeScore && tip.awayGoals === result.awayScore) {
    return 'exact';
  }

  const hasSameWinner =
    Math.sign(tip.homeGoals - tip.awayGoals) === Math.sign(result.homeScore - result.awayScore);

  if (!hasSameWinner) {
    return 'wrong';
  }

  const goalDeviation =
    Math.abs(tip.homeGoals - result.homeScore) + Math.abs(tip.awayGoals - result.awayScore);

  return goalDeviation === 1 ? 'diff' : 'trend';
};
