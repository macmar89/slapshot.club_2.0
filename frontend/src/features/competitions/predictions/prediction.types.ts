export interface CreatePredictionInput {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
}

export interface Prediction {
  id: string;
  homeGoals: number;
  awayGoals: number;
  points: number;
  userId: string;
  username: string;
  createdAt: string;
}
