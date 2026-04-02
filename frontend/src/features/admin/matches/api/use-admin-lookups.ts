import useSWR from 'swr';
import { API_ROUTES } from '@/lib/api-routes';

export interface CompetitionLookupDto {
  id: string;
  name: string;
  status: string;
  isActive: boolean;
}

export interface TeamLookupDto {
  id: string;
  name: string;
}

export const useAdminCompetitionsLookup = () => {
  const { data, error, isLoading } = useSWR<CompetitionLookupDto[]>(
    API_ROUTES.ADMIN.MATCHES.COMPETITIONS_LOOKUP
  );

  return {
    competitions: data || [],
    isLoading,
    error,
  };
};

export const useAdminTeamsLookup = (competitionId?: string) => {
  const url = competitionId 
    ? `${API_ROUTES.ADMIN.MATCHES.TEAMS_LOOKUP}?competitionId=${competitionId}`
    : API_ROUTES.ADMIN.MATCHES.TEAMS_LOOKUP;

  const { data, error, isLoading } = useSWR<TeamLookupDto[]>(url);

  return {
    teams: data || [],
    isLoading,
    error,
  };
};
