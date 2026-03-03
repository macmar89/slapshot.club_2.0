export type CompetitionStatus = 'upcoming' | 'active' | 'finished';

export interface LeaderboardEntry {
  totalPoints: number;
  currentRank: number;
}

export interface Competition {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: CompetitionStatus;
  startDate: string;
  isRegistrationOpen: boolean;
  totalParticipants: number;
  isJoined: boolean;
  leaderboardEntries: LeaderboardEntry | Record<string, never>;
}

export interface CompetitionsResponse {
  success: boolean;
  competitions?: Competition[];
  error?: string;
}

export interface JoinCompetitionResponse {
  success: boolean;
  error?: string;
}

export type CompetitionPublicInfo = Pick<Competition, 'name' | 'description'>;
