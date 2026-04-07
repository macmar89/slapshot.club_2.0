import { matchesRepository } from '../../repositories/matches.repository.js';
import { competitionRepository } from '../../repositories/competitions.repository.js';
import { teamsRepository } from '../../repositories/teams.repository.js';
import { logActivity, type AuditCtx } from '../audit.service.js';
import {
  evaluateMatch as evaluatePredictions,
  revertMatchEvaluation as revertPredictions,
} from '../predictions/predictionsLogic.service.js';
import type { UpdateMatchBodyInput } from '../../shared/constants/schema/admin/matches.schema.js';

export const updateMatch = async (
  id: string,
  updateData: UpdateMatchBodyInput,
  auditCtx: AuditCtx,
) => {
  const oldMatch = await matchesRepository.getAdminMatchDetail(id);
  if (!oldMatch) return null;

  const dataToUpdate: any = { ...updateData };

  if (updateData.isChecked === true) {
    dataToUpdate.checkedAt = new Date().toISOString();
    dataToUpdate.checkedBy = auditCtx.userId;
  } else if (updateData.isChecked === false) {
    dataToUpdate.checkedAt = null;
    dataToUpdate.checkedBy = null;
  }

  await matchesRepository.updateMatch(id, dataToUpdate);

  const changes: Record<string, { old: any; new: any }> = {};
  for (const key in dataToUpdate) {
    if (Object.prototype.hasOwnProperty.call(dataToUpdate, key)) {
      const oldValue = (oldMatch as any)[key];
      const newValue = (dataToUpdate as any)[key];

      if (oldValue !== newValue) {
        changes[key] = { old: oldValue, new: newValue };
      }
    }
  }

  if (Object.keys(changes).length > 0) {
    await logActivity(auditCtx, 'MATCH_UPDATE', { type: 'match', id }, { changes }).catch((err) =>
      console.error('Failed to log MATCH_UPDATE:', err),
    );
  }

  return true;
};

export const evaluateMatch = async (id: string, auditCtx: AuditCtx) => {
  await evaluatePredictions(id);
  await logActivity(auditCtx, 'MATCH_EVALUATE', { type: 'match', id }).catch((err) =>
    console.error('Failed to log MATCH_EVALUATE:', err),
  );
  return true;
};

export const revertMatchEvaluation = async (id: string, auditCtx: AuditCtx) => {
  await revertPredictions(id);
  await logActivity(auditCtx, 'MATCH_REVERT_EVALUATION', { type: 'match', id }).catch((err) =>
    console.error('Failed to log MATCH_REVERT_EVALUATION:', err),
  );
  return true;
};

export const recalculateMatch = async (id: string, auditCtx: AuditCtx) => {
  await revertPredictions(id);
  await evaluatePredictions(id);
  await logActivity(auditCtx, 'MATCH_RECALCULATE', { type: 'match', id }).catch((err) =>
    console.error('Failed to log MATCH_RECALCULATE:', err),
  );
  return true;
};

export const getAllMatches = async (
  limit: number,
  offset: number,
  locale: string,
  sort?: any,
  filters?: any,
) => {
  const { data, totalCount } = await matchesRepository.getAdminMatches(
    limit,
    offset,
    sort,
    filters,
  );

  const defaultLocale = 'sk';

  const matchesInfo = data.map((match) => {
    const compLocale = match.competition.locales.find((l) => l.locale === locale);
    const compFallback =
      match.competition.locales.find((l) => l.locale === defaultLocale) ||
      match.competition.locales[0];
    const competitionName = compLocale ? compLocale.name : compFallback?.name || 'Unknown';

    const homeLocale = match.homeTeam.locales.find((l) => l.locale === locale);
    const homeFallback =
      match.homeTeam.locales.find((l) => l.locale === defaultLocale) || match.homeTeam.locales[0];
    const homeTeamName = homeLocale ? homeLocale.name : homeFallback?.name || 'Home Team';

    const awayLocale = match.awayTeam.locales.find((l) => l.locale === locale);
    const awayFallback =
      match.awayTeam.locales.find((l) => l.locale === defaultLocale) || match.awayTeam.locales[0];
    const awayTeamName = awayLocale ? awayLocale.name : awayFallback?.name || 'Away Team';

    return {
      id: match.id,
      competitionName,
      date: match.date,
      homeTeam: homeTeamName,
      awayTeam: awayTeamName,
      status: match.status,
      result:
        match.status !== 'scheduled'
          ? {
              homeScore: match.resultHomeScore ?? null,
              awayScore: match.resultAwayScore ?? null,
            }
          : null,
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

  return data
    .map((comp) => {
      const localeEntry =
        comp.locales.find((l) => l.locale === locale) ||
        comp.locales.find((l) => l.locale === defaultLocale) ||
        comp.locales[0];

      return {
        id: comp.id,
        name: localeEntry?.name || 'Unknown',
        status: comp.status,
        isActive: comp.status === 'active',
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));
};

export const getAdminTeamsLookup = async (locale: string, competitionId?: string) => {
  const data = await teamsRepository.getAdminLookup(locale, competitionId);
  const defaultLocale = 'sk';

  return data
    .map((team) => {
      const localeEntry =
        (team as any).locales.find((l: any) => l.locale === locale) ||
        (team as any).locales.find((l: any) => l.locale === defaultLocale) ||
        (team as any).locales[0];

      return {
        id: team.id,
        name: localeEntry?.name || 'Unknown Team',
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));
};

export const getMatchDetail = async (id: string, locale: string, userRole: string) => {
  const match = await matchesRepository.getAdminMatchDetail(id);
  if (!match) return null;

  const defaultLocale = 'sk';

  const compLocale = match.competition.locales.find((l) => l.locale === locale);
  const compFallback =
    match.competition.locales.find((l) => l.locale === defaultLocale) ||
    match.competition.locales[0];
  const competitionName = compLocale ? compLocale.name : compFallback?.name || 'Unknown';

  const homeLocale = match.homeTeam.locales.find((l) => l.locale === locale);
  const homeFallback =
    match.homeTeam.locales.find((l) => l.locale === defaultLocale) || match.homeTeam.locales[0];
  const homeTeamName = homeLocale ? homeLocale.name : homeFallback?.name || 'Home Team';

  const awayLocale = match.awayTeam.locales.find((l) => l.locale === locale);
  const awayFallback =
    match.awayTeam.locales.find((l) => l.locale === defaultLocale) || match.awayTeam.locales[0];
  const awayTeamName = awayLocale ? awayLocale.name : awayFallback?.name || 'Away Team';

  const isAdmin = userRole === 'admin';

  return {
    id: match.id,
    date: match.date,
    competitionName,
    homeTeam: homeTeamName,
    homeLogoUrl: (match.homeTeam as any).logo?.url || null,
    awayTeam: awayTeamName,
    awayLogoUrl: (match.awayTeam as any).logo?.url || null,
    resultHomeScore: match.resultHomeScore ?? null,
    resultAwayScore: match.resultAwayScore ?? null,
    resultEndingType: match.resultEndingType,
    status: match.status,
    stageType: match.stageType,
    isChecked: match.isChecked,
    ...(isAdmin && {
      checkedAt: match.checkedAt,
      checkedBy: (match.checkedBy as any)?.username || null,
    }),
    isRanked: match.rankedAt !== null,
    rankedAt: match.rankedAt,
    apiHockeyId: match.apiHockeyId,
    apiHockeyStatus: match.apiHockeyStatus,
    totalPredictionsCount: (match as any).predictionCount,
  };
};
