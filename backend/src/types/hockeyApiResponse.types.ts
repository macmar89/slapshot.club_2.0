export interface ApiHockeyStatus {
  long: string;
  short: string;
}

export interface ApiHockeyCountry {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

export interface ApiHockeyLeague {
  id: number;
  name: string;
  type: string;
  logo: string;
  season: number;
}

export interface ApiHockeyTeam {
  id: number;
  name: string;
  logo: string;
}

export interface ApiHockeyTeams {
  home: ApiHockeyTeam;
  away: ApiHockeyTeam;
}

export interface ApiHockeyScores {
  home: number | null;
  away: number | null;
}

export interface ApiHockeyPeriods {
  first: string | number | null;
  second: string | number | null;
  third: string | number | null;
  overtime: string | number | null;
  penalties: string | number | null;
}

export interface ApiHockeyMatch {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  week: string | null;
  timer: string | null;
  status: ApiHockeyStatus;
  country: ApiHockeyCountry;
  league: ApiHockeyLeague;
  teams: ApiHockeyTeams;
  scores: ApiHockeyScores;
  periods: ApiHockeyPeriods;
  events: boolean | any;
}

export interface ApiHockeyTeamDetailed {
  id: number;
  name: string;
  logo: string;
  national: boolean;
  founded: number | null;
  arena: {
    name: string | null;
    capacity: number | null;
    location: string | null;
  };
  country: ApiHockeyCountry;
}

export interface ApiHockeyTeamResponse {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  response: ApiHockeyTeamDetailed[];
}

export interface ApiHockeyResponse {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  response: ApiHockeyMatch[];
}

export interface ApiHockeyStandingGroup {
  name: string;
}

export interface ApiHockeyStandingStats {
  total: number | null;
  percentage: string;
}

export interface ApiHockeyStandingGames {
  played: number;
  win: ApiHockeyStandingStats;
  win_overtime: ApiHockeyStandingStats;
  lose: ApiHockeyStandingStats;
  lose_overtime: ApiHockeyStandingStats;
}

export interface ApiHockeyStandingGoals {
  for: number;
  against: number;
}

export interface ApiHockeyStanding {
  position: number;
  stage: string | null;
  group: ApiHockeyStandingGroup;
  team: ApiHockeyTeam;
  league: ApiHockeyLeague;
  country: ApiHockeyCountry;
  games: ApiHockeyStandingGames;
  goals: ApiHockeyStandingGoals;
  points: number | null;
  form: string | null;
  description: string | null;
}

export interface ApiHockeyStandingResponse {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  response: ApiHockeyStanding[][];
}
