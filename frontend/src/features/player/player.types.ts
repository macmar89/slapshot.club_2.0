import { SubscriptionPlan } from '../users/users.types';

export interface PlayerStats {
  userId: string;
  username: string;
  subscriptionPlan: SubscriptionPlan;
  createdAt: string;
  currentRank: number;
  totalPoints: number;
  totalMatches: number;
  exactGuesses: number;
  correctTrends: number;
  correctDiffs: number;
  wrongGuesses: number;
  currentForm: string;
  successRate: number;
  averagePoints: number;
  points: number;
}
