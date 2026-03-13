import { and, count, eq, ne, sql } from 'drizzle-orm';
import { db } from '../../db';
import type { AppLocale } from '../../types/global.types';
import { CompetitionErrors } from '../../shared/constants/errors/competition.errors';
import {
  competitions,
  leaderboardEntries,
  locales,
  matches,
  predictions,
  teamsLocales,
} from '../../db/schema';
import { calculateRate, roundTo } from '../../utils/math';
import { AppError } from '../../utils/appError';
import { PlayerMessages } from '../../shared/constants/messages/player.messages';

export const findAllCompetitions = async (userId: string, locale: AppLocale) => {
  const competitions = await db.query.competitions.findMany({
    columns: {
      id: true,
      slug: true,
      status: true,
      isRegistrationOpen: true,
      totalParticipants: true,
      startDate: true,
    },
    where: (competitions) => eq(competitions.status, 'active'),
    with: {
      locales: {
        columns: {
          name: true,
          description: true,
        },
        where: (locales, { eq }) => eq(locales.locale, locale as AppLocale),
        limit: 1,
      },
      leaderboardEntries: {
        columns: {
          totalPoints: true,
          currentRank: true,
        },
        where: (leaderboardEntries, { eq }) => eq(leaderboardEntries.userId, userId),
        limit: 1,
      },
    },
    orderBy: (competitions, { asc }) => [asc(competitions.sortOrder)],
  });

  return (
    competitions.map((competition) => ({
      id: competition.id,
      slug: competition.slug,
      name: competition.locales[0]?.name || '',
      description: competition.locales[0]?.description || '',
      status: competition.status,
      startDate: competition.startDate,
      isRegistrationOpen: competition.isRegistrationOpen,
      totalParticipants: competition.totalParticipants,
      isJoined: !!competition.leaderboardEntries[0],
      leaderboardEntries: competition.leaderboardEntries[0] ?? {},
    })) ?? []
  );
};

export const joinCompetition = async (userId: string, competitionId: string) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
      seasonYear: true,
      isRegistrationOpen: true,
    },
    where: (competitions, { eq }) => eq(competitions.id, competitionId),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const leaderboardEntry = await db.query.leaderboardEntries.findFirst({
    where: (leaderboardEntries, { eq, and }) =>
      and(
        eq(leaderboardEntries.userId, userId),
        eq(leaderboardEntries.competitionId, competitionId),
      ),
  });

  if (leaderboardEntry) {
    throw new AppError(CompetitionErrors.USER_ALREADY_JOINED_COMPETITION);
  }

  if (!competition.isRegistrationOpen) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_OPEN_FOR_REGISTRATION);
  }

  await db.transaction(async (tx) => {
    await tx.insert(leaderboardEntries).values({
      userId,
      competitionId,
      seasonYear: competition.seasonYear,
      totalPoints: 0,
      currentRank: 0,
    });

    await tx
      .update(competitions)
      .set({
        totalParticipants: sql`${competitions.totalParticipants} + 1`,
      })
      .where(eq(competitions.id, competitionId));
  });

  return competition;
};

export const findPublicCompetitionName = async (slug: string, locale: AppLocale) => {
  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    with: {
      locales: {
        columns: {
          name: true,
          description: true,
        },
        where: (locales, { eq }) => eq(locales.locale, locale as AppLocale),
        limit: 1,
      },
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  return {
    name: competition?.locales[0]?.name ?? null,
    description: competition?.locales[0]?.description ?? null,
  };
};

export const getPlayerStats = async (username: string, slug: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(sql`lower(${users.username})`, username.toLowerCase()),
  });

  if (!user) {
    throw new AppError(PlayerMessages.ERRORS.PLAYER_NOT_FOUND);
  }

  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  const leaderboardEntry = await db.query.leaderboardEntries.findFirst({
    columns: {
      currentRank: true,
      totalPoints: true,
      totalPredictions: true,
      exactGuesses: true,
      correctTrends: true,
      correctDiffs: true,
      wrongGuesses: true,
      currentForm: true,
    },
    where: (leaderboardEntries, { eq, and }) =>
      and(
        eq(leaderboardEntries.userId, user.id),
        eq(leaderboardEntries.competitionId, competition.id),
      ),
  });

  if (!leaderboardEntry) {
    throw new AppError(CompetitionErrors.USER_NOT_MEMBER_OF_COMPETITION);
  }

  const points = leaderboardEntry.totalPoints || 0;
  const games = leaderboardEntry.totalPredictions || 0;

  const totalCorrect =
    (leaderboardEntry.exactGuesses || 0) +
    (leaderboardEntry.correctTrends || 0) +
    (leaderboardEntry.correctDiffs || 0);

  return {
    userId: user.id,
    username: user.username,
    subscriptionPlan: user.subscriptionPlan,
    createdAt: user.createdAt,

    ...leaderboardEntry,

    successRate: calculateRate(totalCorrect, games),
    averagePoints: roundTo(points / (games || 1), 2),
    points,
  };
};

export const getPlayerPredictions = async (
  username: string,
  slug: string,
  limit: number,
  cursorDate: string | undefined,
  search: string | undefined,
  viewerId: string,
  viewerPlan: string,
  locale: AppLocale,
) => {
  const user = await db.query.users.findFirst({
    columns: {
      id: true,
      subscriptionPlan: true,
    },
    where: (users, { eq }) => eq(sql`lower(${users.username})`, username.toLowerCase()),
  });

  if (!user) {
    throw new AppError(PlayerMessages.ERRORS.PLAYER_NOT_FOUND);
  }

  const isOwner = user.id === viewerId;
  const isLocked = !isOwner && viewerPlan === 'free';
  const isVip = user?.subscriptionPlan === 'vip';

  if (isLocked || isVip) {
    return {
      data: [],
      hasNextPage: false,
      totalPredictions: 0,
      nextCursor: null,
      isLocked: true,
      meta: {
        playerSubscriptionPlan: user?.subscriptionPlan,
      },
    };
  }

  const competition = await db.query.competitions.findFirst({
    columns: {
      id: true,
    },
    where: (competitions) => eq(competitions.slug, slug),
  });

  if (!competition) {
    throw new AppError(CompetitionErrors.COMPETITION_NOT_FOUND);
  }

  // If search is provided, resolve matching team IDs by name/shortName
  let searchTeamMatchIds: string[] | null = null;
  if (search && search.trim().length > 0) {
    const matchingTeamLocales = await db.query.teamsLocales.findMany({
      columns: { parentId: true },
      where: (tl, { or, ilike }) =>
        or(ilike(tl.name, `%${search.trim()}%`), ilike(tl.shortName, `%${search.trim()}%`)),
    });
    const matchingTeamIds = matchingTeamLocales.map((tl) => tl.parentId);

    if (matchingTeamIds.length === 0) {
      searchTeamMatchIds = [];
    } else {
      const matchingMatches = await db.query.matches.findMany({
        columns: { id: true },
        where: (m, { and, eq, or, inArray }) =>
          and(
            eq(m.competitionId, competition.id),
            or(inArray(m.homeTeamId, matchingTeamIds), inArray(m.awayTeamId, matchingTeamIds)),
          ),
      });
      searchTeamMatchIds = matchingMatches.map((m) => m.id);
    }
  }

  const userPredictions = await db.query.predictions.findMany({
    columns: {
      id: true,
      matchId: true,
      status: true,
      homeGoals: true,
      awayGoals: true,
      points: true,
      createdAt: true,
    },
    where: (predictions, { eq, and, ne, lt, inArray }) => {
      const filters = [
        eq(predictions.userId, user.id),
        eq(predictions.competitionId, competition.id),
        ne(predictions.status, 'pending'),
      ];

      if (cursorDate) {
        const normalizedDate =
          cursorDate.includes(' ') && !cursorDate.includes('T')
            ? cursorDate.replace(/ (\d{2})$/, '+$1')
            : cursorDate;
        filters.push(lt(predictions.createdAt, normalizedDate));
      }

      if (searchTeamMatchIds !== null) {
        if (searchTeamMatchIds.length === 0) {
          // No teams matched — force empty result
          filters.push(eq(predictions.id, '__no_match__'));
        } else {
          filters.push(inArray(predictions.matchId, searchTeamMatchIds));
        }
      }

      return and(...filters);
    },
    with: {
      match: {
        columns: {
          resultHomeScore: true,
          resultAwayScore: true,
          status: true,
        },
        with: {
          homeTeam: {
            columns: {
              id: true,
            },
            with: {
              logo: {
                columns: {
                  url: true,
                },
              },
              locales: {
                columns: { name: true, shortName: true },
                where: (locales, { eq }) => eq(locales.locale, locale),
              },
            },
          },
          awayTeam: {
            columns: {
              id: true,
            },
            with: {
              logo: {
                columns: {
                  url: true,
                },
              },
              locales: {
                columns: { name: true, shortName: true },
                where: (locales, { eq }) => eq(locales.locale, locale),
              },
            },
          },
        },
      },
    },
    orderBy: (predictions, { desc }) => [desc(predictions.createdAt)],
    limit,
  });

  const [countResult] = await db
    .select({ count: count() })
    .from(predictions)
    .where(
      and(
        eq(predictions.userId, user.id),
        eq(predictions.competitionId, competition.id),
        ne(predictions.status, 'pending'),
      ),
    );

  const totalPredictions = countResult!.count;
  const hasMore = userPredictions.length === limit;

  const lastPrediction = userPredictions[userPredictions.length - 1];
  const nextCursor =
    hasMore && lastPrediction ? new Date(lastPrediction.createdAt).toISOString() : null;

  return {
    data: userPredictions.map((up) => ({
      id: up.id,
      matchId: up.matchId,
      matchStatus: up.match.status,
      predictionStatus: up.status,
      points: up.points,
      homeTeamName: up.match.homeTeam.locales[0]?.name,
      homeTeamShortName: up.match.homeTeam.locales[0]?.shortName,
      homeTeamLogoUrl: up.match.homeTeam.logo?.url,
      resultHomeScore: up.match.resultHomeScore,
      predictionHomeGoals: up.homeGoals,
      awayTeamName: up.match.awayTeam.locales[0]?.name,
      awayTeamShortName: up.match.awayTeam.locales[0]?.shortName,
      awayTeamLogoUrl: up.match.awayTeam.logo?.url,
      resultAwayScore: up.match.resultAwayScore,
      predictionAwayGoals: up.awayGoals,
      createdAt: up.createdAt,
    })),
    hasNextPage: hasMore,
    totalPredictions,
    nextCursor,
    isLocked: false,
    meta: {
      playerSubscriptionPlan: user?.subscriptionPlan,
    },
  };
};
