import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db';
import type { AppLocale } from '../types/global';
import { AppError } from '../utils/appError';
import { CompetitionErrors } from '../shared/constants/errors/competition.errors';
import { competitions, matches } from '../db/schema';

export const getCompetitionTeams = async (slug: string, locale: AppLocale) => {
  const competition = await db.query.competitions.findFirst({
    columns: { id: true },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const competitionMatches = await db.query.matches.findMany({
    columns: { homeTeamId: true, awayTeamId: true },
    where: (matches, { eq }) => eq(matches.competitionId, competition.id),
  });

  const teamIds = [
    ...new Set([
      ...competitionMatches.map((m) => m.homeTeamId),
      ...competitionMatches.map((m) => m.awayTeamId),
    ]),
  ];

  if (teamIds.length === 0) return [];

  const competitionTeams = await db.query.teams.findMany({
    columns: { id: true },
    where: (teams, { inArray }) => inArray(teams.id, teamIds),
    with: {
      logo: { columns: { url: true } },
      locales: {
        columns: { name: true, shortName: true },
        where: (locales, { eq }) => eq(locales.locale, locale),
      },
    },
  });

  return competitionTeams.map((team) => ({
    id: team.id,
    name: team.locales[0]?.name ?? '',
    shortName: team.locales[0]?.shortName ?? '',
    logoUrl: team.logo?.url ?? null,
  }));
};
