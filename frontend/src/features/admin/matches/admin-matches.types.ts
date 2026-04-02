export interface AdminMatchDto {
  id: string;
  competitionName: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  result: { homeScore: number | null; awayScore: number | null } | null;
  isChecked: boolean;
  isRanked: boolean;
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
