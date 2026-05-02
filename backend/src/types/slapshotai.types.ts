export interface SlapshotAiMatchStats {
  exactScore: number;
  goalDifference: number;
  winnerOnly: number;
  missed: number;
}

export interface SlapshotAiMatchData {
  matchName: string;
  score: string;
  date: string;
  stats: SlapshotAiMatchStats;
  percentages: Record<string, number>;
  perfectHitUsernames: string[];
  totalTips: number;
  topPredictions: { score: string; count: number }[];
}

export interface SlapshotAiCompetitionData {
  name: string;
  status: string;
  isRegistrationOpen: boolean;
  totalTips: number;
  totalUsersCount: number;
  newUsersCount: number;
  newCompetitionUsers: string[];
  matches: SlapshotAiMatchData[];
}

export interface SlapshotAiSummary {
  totalTips: number;
  week?: number;
  year?: number;
}

export interface SlapshotAiMetadata {
  newAppUsers: string[];
}

export interface SlapshotAiStatsResponse {
  summary: SlapshotAiSummary;
  metadata: SlapshotAiMetadata;
  competitions: SlapshotAiCompetitionData[];
}
