export interface AdminMatchDto {
  id: string;
  competitionName: string;
  date: string;
  homeTeam: string;
  homeLogoUrl?: string | null;
  awayTeam: string;
  awayLogoUrl?: string | null;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  resultHomeScore: number | null;
  resultAwayScore: number | null;
  resultEndingType: 'regular' | 'ot' | 'so';
  stageType: string;
  isChecked: boolean;
  checkedAt?: string | null;
  checkedBy?: string | null;
  isRanked: boolean;
  rankedAt?: string | null;
  apiHockeyId?: string | null;
  apiHockeyStatus?: string | null;
  totalPredictionsCount: number;
}

export interface AdminMatchesResponse {
  data: AdminMatchDto[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}
