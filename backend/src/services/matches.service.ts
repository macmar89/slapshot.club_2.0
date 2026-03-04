import { eq, isNull, and, gte, asc, count, lt } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { assets, matches, predictions, teams, teamsLocales } from '../db/schema';
import type { AppLocale } from '../types/global';
import { db } from '../db';
import { CompetitionErrors } from '../shared/constants/errors/competition.errors';
import { addDays } from 'date-fns';
import { APP_CONFIG } from '../config/app';

export const getUpcomingMatches = async (userId: string, slug: string, locale: AppLocale) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new Error(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const now = new Date().toISOString();
  const upcomingMatchesLimit = addDays(
    new Date(),
    APP_CONFIG.dashboard.upcomingDaysRange,
  ).toISOString();

  const homeTeam = alias(teams, 'homeTeams');
  const awayTeam = alias(teams, 'awayTeams');

  const homeLocales = alias(teamsLocales, 'homeLocales');
  const awayLocales = alias(teamsLocales, 'awayLocales');

  const homeLogo = alias(assets, 'homeLogo');
  const awayLogo = alias(assets, 'awayLogo');

  const [upcomingMatches, unpredictedCountResult] = await Promise.all([
    db
      .select({
        id: matches.id,
        date: matches.date,
        homeTeamName: homeLocales.name,
        homeTeamShortName: homeLocales.shortName,
        homeTeamLogoUrl: homeLogo.url,
        awayTeamName: awayLocales.name,
        awayTeamShortName: awayLocales.shortName,
        awayTeamLogoUrl: awayLogo.url,
      })
      .from(matches)
      .leftJoin(
        predictions,
        and(eq(predictions.matchId, matches.id), eq(predictions.userId, userId)),
      )
      .leftJoin(homeTeam, eq(homeTeam.id, matches.homeTeamId))
      .leftJoin(awayTeam, eq(awayTeam.id, matches.awayTeamId))
      .leftJoin(homeLogo, eq(homeLogo.id, homeTeam.logoId))
      .leftJoin(awayLogo, eq(awayLogo.id, awayTeam.logoId))
      .leftJoin(
        homeLocales,
        and(eq(homeLocales.parentId, homeTeam.id), eq(homeLocales.locale, locale)),
      )
      .leftJoin(
        awayLocales,
        and(eq(awayLocales.parentId, awayTeam.id), eq(awayLocales.locale, locale)),
      )
      .where(
        and(
          eq(matches.competitionId, competition.id),
          eq(matches.status, 'scheduled'),
          gte(matches.date, now),
          lt(matches.date, upcomingMatchesLimit),
          isNull(predictions.id),
        ),
      )
      .orderBy(asc(matches.date), asc(matches.apiHockeyId))
      .limit(3),

    db
      .select({ value: count() })
      .from(matches)
      .leftJoin(
        predictions,
        and(eq(predictions.matchId, matches.id), eq(predictions.userId, userId)),
      )
      .where(
        and(
          eq(matches.competitionId, competition.id),
          eq(matches.status, 'scheduled'),
          gte(matches.date, now),
          lt(matches.date, upcomingMatchesLimit),
          isNull(predictions.id),
        ),
      ),
  ]);

  return {
    upcomingMatches,
    unpredictedCount: unpredictedCountResult[0]?.value ?? 0,
  };
};
