export interface DashboardMatchPreview {
  id: string;
  date: string;
  homeTeamName: string;
  homeTeamShortName: string;
  homeTeamLogoUrl: string | null;
  awayTeamName: string;
  awayTeamShortName: string;
  awayTeamLogoUrl: string | null;
}

export interface UserPrediction {
  id: string;
  homeGoals: number;
  awayGoals: number;
  status: 'pending' | 'finished' | 'cancelled';
  points: number;
}

export interface Match {
  id: string;
  date: string;
  displayTitle: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';

  homeTeamId: string;
  homeTeamName: string;
  homeTeamShortName: string;
  homeTeamLogo: string | null;
  homePredictedCount: number;

  awayTeamId: string;
  awayTeamName: string;
  awayTeamShortName: string;
  awayTeamLogo: string | null;
  awayPredictedCount: number;

  apiHockeyStatus: string;
  stageType: string;
  resultHomeScore: number;
  resultAwayScore: number;
  resultEndingType: 'regular' | 'overtime' | 'penalties' | null;

  roundLabel: string | null;
  roundOrder: number | null;
  groupName: string | null;

  seriesGameNumber: number | null;
  seriesState: string | null;

  rankedAt: string | null;

  userPrediction: UserPrediction | null;
}
