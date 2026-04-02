import { matchesRepository } from '../../repositories/matches.repository.js';
import { competitionRepository } from '../../repositories/competitions.repository.js';
import { teamsRepository } from '../../repositories/teams.repository.js';

export const getAllMatches = async (
  limit: number,
  offset: number,
  locale: string,
  sort?: any,
  filters?: any
) => {
  const { data, totalCount } = await matchesRepository.getAdminMatches(
    limit,
    offset,
    sort,
    filters
  );

  const defaultLocale = 'sk';

  const matchesInfo = data.map((match) => {
    const compLocale = match.competition.locales.find((l) => l.locale === locale);
    const compFallback = match.competition.locales.find((l) => l.locale === defaultLocale) || match.competition.locales[0];
    const competitionName = compLocale ? compLocale.name : (compFallback?.name || 'Unknown');

    const homeLocale = match.homeTeam.locales.find((l) => l.locale === locale);
    const homeFallback = match.homeTeam.locales.find((l) => l.locale === defaultLocale) || match.homeTeam.locales[0];
    const homeTeamName = homeLocale ? homeLocale.name : (homeFallback?.name || 'Home Team');

    const awayLocale = match.awayTeam.locales.find((l) => l.locale === locale);
    const awayFallback = match.awayTeam.locales.find((l) => l.locale === defaultLocale) || match.awayTeam.locales[0];
    const awayTeamName = awayLocale ? awayLocale.name : (awayFallback?.name || 'Away Team');

    return {
      id: match.id,
      competitionName,
      date: match.date,
      homeTeam: homeTeamName,
      awayTeam: awayTeamName,
      status: match.status,
      result: match.status !== 'scheduled' ? {
        homeScore: match.resultHomeScore ?? null,
        awayScore: match.resultAwayScore ?? null,
      } : null,
      isChecked: match.isChecked,
      isRanked: match.rankedAt !== null,
    };
  });

  return {
    matches: matchesInfo,
    totalCount,
  };
};

export const getAdminCompetitionsLookup = async (locale: string) => {
  const data = await competitionRepository.getAdminLookup(locale);
  const defaultLocale = 'sk';

  return data.map((comp) => {
    const localeEntry = comp.locales.find((l) => l.locale === locale) || 
                       comp.locales.find((l) => l.locale === defaultLocale) || 
                       comp.locales[0];
    
    return {
      id: comp.id,
      name: localeEntry?.name || 'Unknown',
      status: comp.status,
      isActive: comp.status === 'active',
    };
  }).sort((a, b) => a.name.localeCompare(b.name, locale));
};

export const getAdminTeamsLookup = async (locale: string, competitionId?: string) => {
  const data = await teamsRepository.getAdminLookup(locale, competitionId);
  const defaultLocale = 'sk';

  return data.map((team) => {
    const localeEntry = (team as any).locales.find((l: any) => l.locale === locale) || 
                       (team as any).locales.find((l: any) => l.locale === defaultLocale) || 
                       (team as any).locales[0];
    
    return {
      id: team.id,
      name: localeEntry?.name || 'Unknown Team',
    };
  }).sort((a, b) => a.name.localeCompare(b.name, locale));
};
