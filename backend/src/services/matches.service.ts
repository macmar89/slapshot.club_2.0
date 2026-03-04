import { eq, isNull, and, gte, asc, count, lt, sql } from 'drizzle-orm';
import { matches, predictions } from '../db/schema';
import type { AppLocale } from '../types/global';
import { db } from '../db';
import { CompetitionErrors } from '../shared/constants/errors/competition.errors';
import { addDays } from 'date-fns';
import { APP_CONFIG } from '../config/app';
import { createTeamAliases } from '../utils/helpers';
import { MatchMessages } from '../shared/constants/messages/matches.messages';
import { mapMatchToPreview } from '../utils/mappers/matches.mappers';

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

  const { homeTeam, awayTeam, homeLocales, awayLocales, homeLogo, awayLogo } = createTeamAliases();

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

export const getMatchDatesByCompetition = async (slug: string, tz: string) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new Error(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const matchDates = await db
    .select({
      date: sql<string>`DISTINCT(${matches.date})`,
    })
    .from(matches)
    .where(eq(matches.competitionId, competition.id))
    .orderBy(asc(matches.date));

  const safeTz = sql.raw(`'${tz}'`);

  const matchDatesResult = await db
    .select({
      date: sql<string>`DISTINCT (DATE(${matches.date} AT TIME ZONE 'UTC' AT TIME ZONE ${safeTz}))`,
    })
    .from(matches)
    .where(eq(matches.competitionId, competition.id))
    .orderBy(asc(sql`DATE(${matches.date} AT TIME ZONE 'UTC' AT TIME ZONE ${safeTz})`));

  const today = new Date().toLocaleDateString('en-CA', { timeZone: tz });

  let dates = matchDatesResult.map((m) => m.date);
  if (!dates.includes(today)) {
    dates.push(today);
    dates.sort((a, b) => (a < b ? -1 : 1));
  }

  return {
    matchDates: dates,
    today,
  };
};

export const getCompetitionMatches = async (
  date: string,
  userId: string,
  slug: string,
  locale: AppLocale,
  tz: string,
) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new Error(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const matchesResult = await db.query.matches.findMany({
    where: (matches) =>
      and(
        eq(matches.competitionId, competition.id),
        sql`DATE(${matches.date} AT TIME ZONE 'UTC' AT TIME ZONE ${tz}) = ${date}`,
      ),
    columns: {
      competitionId: false,
      homeTeamId: false,
      awayTeamId: false,
      apiHockeyId: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
    },
    with: {
      homeTeam: {
        columns: {
          id: true,
        },
        with: {
          locales: {
            columns: {
              name: true,
              shortName: true,
            },
            where: (l, { eq }) => eq(l.locale, locale),
            limit: 1,
          },
          logo: {
            columns: {
              url: true,
            },
          },
        },
      },
      awayTeam: {
        columns: {
          id: true,
        },
        with: {
          locales: {
            columns: {
              name: true,
              shortName: true,
            },
            where: (l, { eq }) => eq(l.locale, locale),
            limit: 1,
          },
          logo: {
            columns: {
              url: true,
            },
          },
        },
      },
      predictions: {
        columns: {
          id: true,
          homeGoals: true,
          awayGoals: true,
          status: true,
          points: true,
        },
        where: (p, { eq }) => eq(p.userId, userId),
      },
    },
    orderBy: [asc(matches.date), asc(matches.apiHockeyId)],
  });

  return matchesResult.map((match) => mapMatchToPreview(match, userId));
};

export const getMatchInfoById = async (matchId: string, locale: AppLocale, userId: string) => {
  const existMatch = await db.query.matches.findFirst({
    columns: {
      id: true,
    },
    where: (matches) => eq(matches.id, matchId),
  });

  if (!existMatch) {
    throw new Error(MatchMessages.MATCH_NOT_FOUND);
  }

  const match = await db.query.matches.findFirst({
    where: (matches) => eq(matches.id, matchId),
    columns: {
      competitionId: false,
      homeTeamId: false,
      awayTeamId: false,
      apiHockeyId: false,
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
    },
    with: {
      homeTeam: {
        columns: {
          id: true,
        },
        with: {
          locales: {
            columns: {
              name: true,
              shortName: true,
            },
            where: (l, { eq }) => eq(l.locale, locale),
            limit: 1,
          },
          logo: {
            columns: {
              url: true,
            },
          },
        },
      },
      awayTeam: {
        columns: {
          id: true,
        },
        with: {
          locales: {
            columns: {
              name: true,
              shortName: true,
            },
            where: (l, { eq }) => eq(l.locale, locale),
            limit: 1,
          },
          logo: {
            columns: {
              url: true,
            },
          },
        },
      },
      predictions: {
        columns: {
          id: true,
          homeGoals: true,
          awayGoals: true,
          status: true,
          points: true,
        },
        where: (p, { eq }) => eq(p.userId, userId),
      },
    },
    orderBy: [asc(matches.date), asc(matches.apiHockeyId)],
  });

  const rawScores = match?.predictionStats?.scores || {};

  const scores = Object.entries(rawScores)
    .filter(([_, count]) => (count as number) > 0)
    .reduce(
      (acc, [score, count]) => {
        acc[score] = count as number;
        return acc;
      },
      {} as Record<string, number>,
    );

  return {
    match: mapMatchToPreview(match!, userId),
    scores,
  };
};
