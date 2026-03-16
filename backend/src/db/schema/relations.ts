import { relations } from 'drizzle-orm/relations';
import {
  users,
  refreshTokens,
  groups,
  groupMembers,
  predictions,
  userStats,
  userSettings,
  notificationSettings,
  userReferrals,
  subscriptions,
  auditLogs,
  feedback,
  leaderboardEntries,
  competitionSnapshots,
  teams,
  assets,
  teamsLocales,
  matches,
  competitions,
  competitionsLocales,
  generalSettings,
  generalSettingsLocales,
} from './index.js';

export const usersRelations = relations(users, ({ many, one }) => ({
  refreshTokens: many(refreshTokens),
  groupsOwned: many(groups),
  memberships: many(groupMembers),
  predictions: many(predictions),
  stats: one(userStats, {
    fields: [users.id],
    references: [userStats.userId],
  }),
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  notifications: one(notificationSettings, {
    fields: [users.id],
    references: [notificationSettings.userId],
  }),
  referral: one(userReferrals, {
    fields: [users.id],
    references: [userReferrals.referrerId],
  }),
  referredBy: one(userReferrals, {
    fields: [users.id],
    references: [userReferrals.referredUserId],
  }),
  referralsReceived: many(userReferrals),
  subscriptions: many(subscriptions),
  auditLogs: many(auditLogs),
  feedback: many(feedback),
  leaderboardEntries: many(leaderboardEntries),
  competitionSnapshots: many(competitionSnapshots),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  logo: one(assets, {
    fields: [teams.logoId],
    references: [assets.id],
  }),
  locales: many(teamsLocales),
  homeMatches: many(matches, { relationName: 'homeTeam' }),
  awayMatches: many(matches, { relationName: 'awayTeam' }),
}));

export const teamsLocalesRelations = relations(teamsLocales, ({ one }) => ({
  parentTeam: one(teams, {
    fields: [teamsLocales.parentId],
    references: [teams.id],
  }),
}));

export const assetsRelations = relations(assets, ({ many }) => ({
  teams: many(teams),
  generalSettings: many(generalSettings),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  competition: one(competitions, {
    fields: [matches.competitionId],
    references: [competitions.id],
  }),
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: 'homeTeam',
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: 'awayTeam',
  }),
  predictions: many(predictions),
}));

export const competitionsRelations = relations(competitions, ({ many }) => ({
  locales: many(competitionsLocales),
  matches: many(matches),
  groups: many(groups),
  leaderboardEntries: many(leaderboardEntries),
  snapshots: many(competitionSnapshots),
}));

export const competitionsLocalesRelations = relations(competitionsLocales, ({ one }) => ({
  competition: one(competitions, {
    fields: [competitionsLocales.competitionId],
    references: [competitions.id],
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  competition: one(competitions, {
    fields: [groups.competitionId],
    references: [competitions.id],
  }),
  owner: one(users, {
    fields: [groups.ownerId],
    references: [users.id],
  }),
  members: many(groupMembers),
  leaderboardEntries: many(leaderboardEntries),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const predictionsRelations = relations(predictions, ({ one }) => ({
  user: one(users, {
    fields: [predictions.userId],
    references: [users.id],
  }),
  match: one(matches, {
    fields: [predictions.matchId],
    references: [matches.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
  user: one(users, {
    fields: [notificationSettings.userId],
    references: [users.id],
  }),
}));

export const userReferralsRelations = relations(userReferrals, ({ one }) => ({
  user: one(users, {
    fields: [userReferrals.referrerId],
    references: [users.id],
  }),
  referredBy: one(users, {
    fields: [userReferrals.referredUserId],
    references: [users.id],
    relationName: 'referredBy',
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(users, {
    fields: [feedback.userId],
    references: [users.id],
  }),
}));

export const leaderboardEntriesRelations = relations(leaderboardEntries, ({ one }) => ({
  user: one(users, {
    fields: [leaderboardEntries.userId],
    references: [users.id],
  }),
  competition: one(competitions, {
    fields: [leaderboardEntries.competitionId],
    references: [competitions.id],
  }),
  activeLeague: one(groups, {
    fields: [leaderboardEntries.activeLeagueId],
    references: [groups.id],
  }),
}));

export const competitionSnapshotsRelations = relations(competitionSnapshots, ({ one }) => ({
  user: one(users, {
    fields: [competitionSnapshots.userId],
    references: [users.id],
  }),
  competition: one(competitions, {
    fields: [competitionSnapshots.competitionId],
    references: [competitions.id],
  }),
}));

export const generalSettingsRelations = relations(generalSettings, ({ one, many }) => ({
  seoImage: one(assets, {
    fields: [generalSettings.seoImageId],
    references: [assets.id],
  }),
  locales: many(generalSettingsLocales),
}));

export const generalSettingsLocalesRelations = relations(generalSettingsLocales, ({ one }) => ({
  parentSettings: one(generalSettings, {
    fields: [generalSettingsLocales.parentId],
    references: [generalSettings.id],
  }),
}));
