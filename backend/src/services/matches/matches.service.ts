import { eq, isNull, and, gte, asc, count, lt, sql } from 'drizzle-orm';
import { matches, predictions, groupMembers } from '../../db/schema/index.js';
import type { AppLocale } from '../../types/global.types.js';
import { db } from '../../db/index.js';
import { CompetitionErrors } from '../../shared/constants/errors/competition.errors.js';
import { addDays } from 'date-fns';
import { APP_CONFIG } from '../../config/app.js';
import { createTeamAliases } from '../../utils/helpers.js';
import { MatchMessages } from '../../shared/constants/messages/matches.messages.js';
import { mapMatchToPreview } from '../../utils/mappers/matches.mappers.js';

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
    APP_CONFIG.DASHBOARD.UPCOMING_DAYS_RANGE,
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

export const getGroupMatches = async (
  groupId: string,
  date: string,
  userId: string,
  locale: AppLocale,
  tz: string,
) => {
  const group = await db.query.groups.findFirst({
    columns: {
      competitionId: true,
    },
    where: (groups) => eq(groups.id, groupId),
  });

  if (!group) {
    throw new Error(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const matchesResult = await db.query.matches.findMany({
    where: (matches) =>
      and(
        eq(matches.competitionId, group.competitionId),
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

  if (matchesResult.length === 0) {
    return [];
  }

  const matchIds = matchesResult.map((m) => m.id);

  // Fetch group-scoped prediction stats
  const groupPredictionStats = await db
    .select({
      matchId: predictions.matchId,
      homeGoals: predictions.homeGoals,
      awayGoals: predictions.awayGoals,
    })
    .from(predictions)
    .innerJoin(groupMembers, eq(groupMembers.userId, predictions.userId))
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        sql`${predictions.matchId} IN (${sql.join(matchIds.map(id => sql`${id}`), sql`, `)})`
      ),
    );

  const matchCounts = new Map<string, { home: number; away: number }>();
  for (const p of groupPredictionStats) {
    if (!matchCounts.has(p.matchId)) matchCounts.set(p.matchId, { home: 0, away: 0 });
    const stats = matchCounts.get(p.matchId)!;
    if (p.homeGoals > p.awayGoals) stats.home++;
    else if (p.awayGoals > p.homeGoals) stats.away++;
  }

  return matchesResult.map((match) => {
    const preview = mapMatchToPreview(match, userId);
    const groupStats = matchCounts.get(match.id);
    
    // Override the globally predicted counts with group-scoped ones
    if (groupStats) {
      preview.homePredictedCount = groupStats.home;
      preview.awayPredictedCount = groupStats.away;
    } else {
      preview.homePredictedCount = 0;
      preview.awayPredictedCount = 0;
    }
    
    return preview;
  });
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

export const getGroupMatchInfoById = async (
  groupId: string,
  matchId: string,
  locale: AppLocale,
  userId: string,
) => {
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
  });

  // Calculate group-scoped prediction stats
  const groupPredictionStats = await db
    .select({
      homeGoals: predictions.homeGoals,
      awayGoals: predictions.awayGoals,
    })
    .from(predictions)
    .innerJoin(groupMembers, eq(groupMembers.userId, predictions.userId))
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(predictions.matchId, matchId)
      ),
    );

  const scores: Record<string, number> = {};
  let homeCount = 0;
  let awayCount = 0;

  for (const p of groupPredictionStats) {
    if (p.homeGoals > p.awayGoals) homeCount++;
    else if (p.awayGoals > p.homeGoals) awayCount++;

    const scoreKey = `${p.homeGoals}:${p.awayGoals}`;
    if (!scores[scoreKey]) scores[scoreKey] = 0;
    scores[scoreKey]++;
  }

  const preview = mapMatchToPreview(match!, userId);
  preview.homePredictedCount = homeCount;
  preview.awayPredictedCount = awayCount;

  return {
    match: preview,
    scores,
  };
};
