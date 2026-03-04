import { alias } from 'drizzle-orm/pg-core';
import { assets, teams, teamsLocales } from '../db/schema';

export const createTeamAliases = () => {
  const homeTeam = alias(teams, 'homeTeams');
  const awayTeam = alias(teams, 'awayTeams');
  const homeLocales = alias(teamsLocales, 'homeLocales');
  const awayLocales = alias(teamsLocales, 'awayLocales');
  const homeLogo = alias(assets, 'homeLogo');
  const awayLogo = alias(assets, 'awayLogo');

  return { homeTeam, awayTeam, homeLocales, awayLocales, homeLogo, awayLogo };
};
