import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { eq } from 'drizzle-orm';
import { db } from '../src/db/index';
import {
  users,
  competitions,
  competitionsLocales,
  teams,
  teamsLocales,
  matches,
  predictions,
  assets,
  leagues,
  leaderboardEntries,
} from '../src/db/schema';
import { locales } from '../src/db/schema/locales';

const dataDir = path.join(process.cwd(), 'data', 'old_db_data');

// Types based on the schema
type Locale = 'sk' | 'en' | 'cs';

const DEFAULT_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$+kHZ4Cm3co3aYEESf03mFg$tIyZl/p+cLMDK30Vu64KzcNrp1TLLpYWpQgMUt8e5mk';

// Helper to parse CSV files
async function parseCSV<T>(filename: string): Promise<T[]> {
  const results: T[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(dataDir, filename))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Maps 'sk' to 'cs' and 'en' as default fallbacks
const TARGET_LOCALES: Locale[] = ['sk', 'en', 'cs'];

async function migrate() {
  console.log('🚀 Starting data migration from CSV...');

  try {
    // 1. Read all required CSVs
    console.log('📂 Reading CSV files...');
    const usersData = await parseCSV<any>('users.csv');
    const competitionsData = await parseCSV<any>('competitions.csv');
    const competitionsLocalesData = await parseCSV<any>('competitions_locales.csv');
    const teamsData = await parseCSV<any>('teams.csv');
    const teamsLocalesData = await parseCSV<any>('teams_locales.csv');
    const teamLogosData = await parseCSV<any>('team_logos.csv');
    const matchesData = await parseCSV<any>('matches.csv');
    const predictionsData = await parseCSV<any>('predictions.csv');
    const leaguesData = await parseCSV<any>('leagues.csv');
    const leaderboardEntriesData = await parseCSV<any>('leaderboard_entries.csv');

    console.log(`📊 Loaded ${usersData.length} users`);
    console.log(`📊 Loaded ${competitionsData.length} competitions`);
    console.log(`📊 Loaded ${teamsData.length} teams`);
    console.log(`📊 Loaded ${teamLogosData.length} team logos`);
    console.log(`📊 Loaded ${matchesData.length} matches`);
    console.log(`📊 Loaded ${predictionsData.length} predictions`);
    console.log(`📊 Loaded ${leaguesData.length} leagues`);
    console.log(`📊 Loaded ${leaderboardEntriesData.length} leaderboard entries`);

    // Create Sets to track valid IDs, initializing them with IDs from the CSV data
    const validTeamIds = new Set<string>(teamsData.map((t: any) => t.id));
    const validCompetitionIds = new Set<string>(competitionsData.map((c: any) => c.id));
    const validUserIds = new Set<string>(usersData.map((u: any) => u.id));
    const validMatchIds = new Set<string>(matchesData.map((m: any) => m.id));
    const validLeagueIds = new Set<string>(leaguesData.map((l: any) => l.id));

    // Fetch existing records to pre-populate valid IDs
    const existingTeams = await db.query.teams.findMany({ columns: { id: true } });
    existingTeams.forEach((t) => validTeamIds.add(t.id));

    const existingCompetitions = await db.query.competitions.findMany({ columns: { id: true } });
    existingCompetitions.forEach((c) => validCompetitionIds.add(c.id));

    const existingUsers = await db.query.users.findMany({ columns: { id: true } });
    existingUsers.forEach((u) => validUserIds.add(u.id));

    const existingMatches = await db.query.matches.findMany({ columns: { id: true } });
    existingMatches.forEach((m) => validMatchIds.add(m.id));

    // We'll process this in a single transaction if possible, or outside to trace better
    await db.transaction(async (tx) => {
      // --- ASSETS (Team Logos) ---
      console.log('🖼️  Migrating Team Logos... (Assets)');
      for (const logo of teamLogosData) {
        if (!logo.filename) continue;
        const newUrl = `/team_logo/${logo.filename}`;

        await tx
          .insert(assets)
          .values({
            id: logo.id,
            key: logo.filename,
            alt: logo.alt || '',
            url: newUrl,
            filename: logo.filename,
            mimeType: logo.mime_type || null,
            filesize: logo.filesize ? parseInt(logo.filesize) : null,
            width: logo.width ? parseInt(logo.width) : null,
            height: logo.height ? parseInt(logo.height) : null,
            createdAt: logo.created_at || new Date().toISOString(),
            updatedAt: logo.updated_at || new Date().toISOString(),
          })
          .onConflictDoNothing();
      }

      // --- TEAMS ---
      console.log('⚽ Migrating Teams...');
      for (const t of teamsData) {
        let teamSlug = t.slug;
        if (!teamSlug || teamSlug.trim() === '') {
          // Provide a fallback slug using name if available
          const tl = teamsLocalesData.find((l: any) => l._parent_id === t.id && l._locale === 'sk');
          if (tl && tl.name) {
            teamSlug = tl.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
          } else {
            teamSlug = `team-${t.id.substring(0, 8)}`;
          }
        }

        await tx
          .insert(teams)
          .values({
            id: t.id,
            slug: teamSlug,
            type: t.type === 'national' ? 'national' : 'club',
            logoId: t.logo_id || null,
            colorsPrimary: t.colors_primary || '#000000',
            colorsSecondary: t.colors_secondary || '#ffffff',
            apiHockeyId: t.api_hockey_id || null,
            createdAt: t.created_at || new Date().toISOString(),
            updatedAt: t.updated_at || new Date().toISOString(),
          })
          .onConflictDoNothing();

        if (t.logo_id) {
          await tx.update(teams).set({ logoId: t.logo_id }).where(eq(teams.id, t.id));
        }

        validTeamIds.add(t.id);
      }

      // --- TEAMS LOCALES ---
      console.log('🌍 Migrating Teams Locales...');
      for (const tl of teamsLocalesData) {
        if (tl._locale === 'sk' && validTeamIds.has(tl._parent_id)) {
          // Create entries for all supported locales based on the 'sk' default
          for (const targetLocale of TARGET_LOCALES) {
            await tx
              .insert(teamsLocales)
              .values({
                parentId: tl._parent_id,
                locale: targetLocale as any,
                name: tl.name,
                shortName: tl.short_name,
              })
              .onConflictDoNothing();
          }
        }
      }

      // --- COMPETITIONS ---
      console.log('🏆 Migrating Competitions...');
      for (const c of competitionsData) {
        await tx
          .insert(competitions)
          .values({
            id: c.id,
            slug: c.slug,
            seasonYear: parseInt(c.api_hockey_season || '2024'),
            status:
              c.status === 'active' ? 'active' : c.status === 'finished' ? 'finished' : 'upcoming',
            isRegistrationOpen: c.is_registration_open === 'true',
            startDate: c.start_date || new Date().toISOString(),
            endDate: c.end_date || new Date().toISOString(),
            totalParticipants: 0,
            totalPlayedMatches: parseInt(c.total_played_matches || '0'),
            totalPossiblePoints: parseInt(c.total_possible_points || '0'),
            recalculationHour: parseInt(c.recalculation_hour || '5'),
            apiHockeyId: c.api_hockey_id || null,
            apiHockeySeason: parseInt(c.api_hockey_season) || null,
            createdAt: c.created_at || new Date().toISOString(),
            updatedAt: c.updated_at || new Date().toISOString(),
          })
          .onConflictDoNothing();
        validCompetitionIds.add(c.id);
      }

      // --- COMPETITIONS LOCALES ---
      console.log('🌍 Migrating Competitions Locales...');
      for (const cl of competitionsLocalesData) {
        if (cl._locale === 'sk' && validCompetitionIds.has(cl._parent_id)) {
          for (const targetLocale of TARGET_LOCALES) {
            await tx
              .insert(competitionsLocales)
              .values({
                competitionId: cl._parent_id,
                locale: targetLocale as any,
                name: cl.name,
                description: cl.description || '',
              })
              .onConflictDoNothing();
          }
        }
      }

      // --- LEAGUES ---
      console.log('🏘️  Migrating Leagues...');
      for (const l of leaguesData) {
        if (!validUserIds.has(l.owner_id) || !validCompetitionIds.has(l.competition_id)) continue;

        let slug =
          l.slug ||
          l.name
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        if (!slug) slug = `league-${l.id.substring(0, 8)}`;

        await tx
          .insert(leagues)
          .values({
            id: l.id,
            name: l.name,
            slug: slug,
            type: ['private', 'vip', 'business', 'pub', 'partner'].includes(l.type)
              ? (l.type as any)
              : 'private',
            code: l.code || null,
            ownerId: l.owner_id,
            competitionId: l.competition_id,
            creditCost: 0,
            maxMembers: l.max_members ? parseInt(l.max_members) : 15,
            statsMembersCount: l.stats_member_count ? parseInt(l.stats_member_count) : 0,
            createdAt: l.created_at || new Date().toISOString(),
            updatedAt: l.updated_at || new Date().toISOString(),
          })
          .onConflictDoNothing();
        validLeagueIds.add(l.id);
      }

      // --- USERS ---
      console.log('👤 Migrating Users...');
      for (const u of usersData) {
        await tx
          .insert(users)
          .values({
            id: u.id,
            username: u.username,
            email: u.email,
            password: DEFAULT_PASSWORD_HASH,
            role: ['admin', 'editor', 'user', 'demo'].includes(u.role) ? u.role : 'user',
            lastActiveAt: u.last_activity || new Date().toISOString(),
            preferredLanguage:
              u.preferred_language === 'sk' ||
              u.preferred_language === 'cs' ||
              u.preferred_language === 'en'
                ? u.preferred_language
                : 'sk',
            subscriptionPlan:
              u.subscription_plan === 'pro' || u.subscription_plan === 'pro_family'
                ? u.subscription_plan
                : 'free',
            subscriptionActiveUntil: u.subscription_active_until || new Date().toISOString(),
            isActive: true,
            referralCode: u.referral_data_referral_code || `migrated_${u.id.substring(0, 8)}`,
            referredById: u.referral_data_referred_by_id || null,
            totalRegistered: parseInt(u.referral_data_stats_total_registered || '0'),
            totalPaid: parseInt(u.referral_data_stats_total_paid || '0'),
            verifiedAt: u._verified === 'true' ? u.updated_at : null,
            createdAt: u.created_at || new Date().toISOString(),
            updatedAt: u.updated_at || new Date().toISOString(),
          })
          .onConflictDoNothing();
        validUserIds.add(u.id);
      }

      // --- MATCHES ---
      console.log('🏒 Migrating Matches...');
      for (const m of matchesData) {
        if (
          !validTeamIds.has(m.home_team_id) ||
          !validTeamIds.has(m.away_team_id) ||
          !validCompetitionIds.has(m.competition_id)
        ) {
          continue; // Skip match if references are invalid
        }
        await tx
          .insert(matches)
          .values({
            id: m.id,
            displayTitle: m.display_title || null,
            competitionId: m.competition_id,
            homeTeamId: m.home_team_id,
            awayTeamId: m.away_team_id,
            date: m.date || new Date().toISOString(),
            status: ['scheduled', 'live', 'finished', 'cancelled'].includes(m.status)
              ? m.status
              : 'scheduled',
            stageType: ['regular_season', 'group_phase', 'playoffs', 'pre_season'].includes(
              m.result_stage_type,
            )
              ? m.result_stage_type
              : 'regular_season',
            resultHomeScore: m.result_home_score ? parseInt(m.result_home_score) : 0,
            resultAwayScore: m.result_away_score ? parseInt(m.result_away_score) : 0,
            resultEndingType: ['regular', 'ot', 'so'].includes(m.result_ending_type)
              ? m.result_ending_type
              : 'regular',
            roundLabel: m.result_round_label || null,
            roundOrder: m.result_round_order ? parseInt(m.result_round_order) : null,
            groupName: m.result_group_name || null,
            seriesGameNumber: m.result_series_game_number
              ? parseInt(m.result_series_game_number)
              : null,
            seriesState: m.result_series_state || null,
            rankedAt: m.ranked_at || null,
            apiHockeyId: m.api_hockey_id || null,
            apiHockeyStatus: m.api_hockey_status || null,
            createdAt: m.created_at || new Date().toISOString(),
            updatedAt: m.updated_at || new Date().toISOString(),
          })
          .onConflictDoNothing();
        validMatchIds.add(m.id);
      }

      // --- PREDICTIONS ---
      console.log('🎯 Migrating Predictions... This might take a while...');
      for (const p of predictionsData) {
        if (
          !validUserIds.has(p.user_id) ||
          !validMatchIds.has(p.match_id) ||
          !competitionsData[0]?.id
        ) {
          continue;
        }

        // We need to fetch competitionId from the match or fallback to the first competition
        const matchInfo = matchesData.find((m: any) => m.id === p.match_id);
        const compId = matchInfo ? matchInfo.competition_id : competitionsData[0].id;

        await tx
          .insert(predictions)
          .values({
            id: p.id,
            userId: p.user_id,
            matchId: p.match_id,
            competitionId: compId,
            homeGoals: parseInt(p.home_goals || '0'),
            awayGoals: parseInt(p.away_goals || '0'),
            points: parseInt(p.points || '0'),
            status: ['pending', 'evaluated', 'void'].includes(p.status) ? p.status : 'pending',
            evaluatedAt: p.status === 'evaluated' && p.updated_at ? new Date(p.updated_at) : null,
            isExact: p.is_exact === 'true',
            isTrend: p.is_trend === 'true',
            isDiff: p.is_diff === 'true',
            isWrong: p.is_wrong === 'true',
            editCount: parseInt(p.edit_count || '0'),
            createdAt: p.created_at
              ? new Date(p.created_at).toISOString()
              : new Date().toISOString(),
            updatedAt: p.updated_at
              ? new Date(p.updated_at).toISOString()
              : new Date().toISOString(),
          })
          .onConflictDoNothing();
      }

      // --- LEADERBOARD ENTRIES ---
      console.log('📈 Migrating Leaderboard Entries...');
      for (const le of leaderboardEntriesData) {
        if (!validUserIds.has(le.user_id) || !validCompetitionIds.has(le.competition_id)) continue;

        const comp = competitionsData.find((c: any) => c.id === le.competition_id);
        const seasonYear = comp ? parseInt(comp.api_hockey_season || '2024') : 2024;

        await tx
          .insert(leaderboardEntries)
          .values({
            id: le.id,
            userId: le.user_id,
            competitionId: le.competition_id,
            seasonYear: seasonYear,
            totalPoints: parseInt(le.total_points || '0'),
            totalMatches: parseInt(le.total_matches || '0'),
            exactGuesses: parseInt(le.exact_guesses || '0'),
            correctTrends: parseInt(le.correct_trends || '0'),
            correctDiffs: parseInt(le.correct_diffs || '0'),
            wrongGuesses: parseInt(le.wrong_guesses || '0'),
            currentRank: parseInt(le.current_rank || '0'),
            previousRank: parseInt(le.previous_rank || '0'),
            rankChange: parseInt(le.rank_change || '0'),
            activeLeagueId:
              le.active_league_id && validLeagueIds.has(le.active_league_id)
                ? le.active_league_id
                : null,
            ovr: le.ovr ? parseInt(le.ovr) : 0,
            createdAt: le.created_at || new Date().toISOString(),
            updatedAt: le.updated_at || new Date().toISOString(),
          })
          .onConflictDoNothing();
      }
    });

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
