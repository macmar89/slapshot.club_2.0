export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string | null;
  points: number;
  trend: 'up' | 'down' | 'same';
  isCurrentUser: boolean;
  predictionsCount: number;
  exactScores: number;
  correctDiffs: number;
  winners: number;
  wrongGuesses: number;
  username?: string;
}

export interface CompetitionLeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  isCurrentUser: boolean;
  currentRank: number;
  totalPoints: number;
  totalPredictions: number;
  exactGuesses: number;
  correctTrends: number;
  correctDiffs: number;
  wrongGuesses: number;
}
