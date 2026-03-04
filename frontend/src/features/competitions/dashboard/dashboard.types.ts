import { DashboardMatchPreview } from '../matches/matches.types';

export interface UserCompetitionStats {
  totalPoints: number;
  totalMatches: number;
  currentRank: number;
  exactGuesses: number;
  correctTrends: number;
  correctDiffs: number;
  wrongGuesses: number;
  createdAt: string;
  winRate: number;
  pointsPerGame: number;
  totalCorrect: number;
}

export interface CompetitionDashboardMatchesResponse {
  upcomingMatches: DashboardMatchPreview[];
  unpredictedCount: number;
}
