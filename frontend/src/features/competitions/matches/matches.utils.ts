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
