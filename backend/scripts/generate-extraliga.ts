import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { createId as generateCuid } from '@paralleldrive/cuid2';

const API_KEY = process.env.SPORT_API_KEY;
const API_URL = process.env.SPORT_API_URL || 'https://v1.hockey.api-sports.io';
const LEAGUE_ID = 10;
const SEASON = 2025;

async function fetchFromApi(endpoint: string) {
  const url = `${API_URL}/${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'x-apisports-key': API_KEY!,
    },
  });
  const data = await response.json();
  if (data.errors && data.errors.length > 0) {
    throw new Error(`API Error: ${JSON.stringify(data.errors)}`);
  }
  return data.response;
}

async function downloadImage(url: string, filepath: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filepath, buffer);
  return buffer.length;
}

async function main() {
  const rootDir = path.resolve(process.cwd(), '..');
  const destDir = path.join(rootDir, 'frontend', 'public', 'images', 'teams');
  const sqlFile = path.join(process.cwd(), 'data', 'extraliga_10.sql');
  
  if (!fsSync.existsSync(destDir)) {
    console.log(`Creating directory ${destDir}`);
    fsSync.mkdirSync(destDir, { recursive: true });
  }

  const dataDir = path.dirname(sqlFile);
  if (!fsSync.existsSync(dataDir)) {
    fsSync.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`Fetching league ${LEAGUE_ID}...`);
  const leagues = await fetchFromApi(`leagues?id=${LEAGUE_ID}`);
  const leagueData = leagues[0];
  
  console.log(`Fetching teams for league ${LEAGUE_ID} season ${SEASON}...`);
  const teamsData = await fetchFromApi(`teams?league=${LEAGUE_ID}&season=${SEASON}`);

  let sql = `-- SQL MIGRATION FOR CZECH EXTRALIGA (LEAGUE 10)\n\n`;

  const compId = generateCuid();
  const startDate = leagueData.seasons.find((s: any) => s.season === SEASON)?.start || '2025-09-09';
  const endDate = leagueData.seasons.find((s: any) => s.season === SEASON)?.end || '2026-03-31';

  // Insert competition
  sql += `-- 1. Competition\n`;
  sql += `INSERT INTO competitions (id, slug, sort_order, season_year, credit_cost, status, is_registration_open, start_date, end_date, api_hockey_id, api_hockey_season, created_at, updated_at) VALUES\n`;
  sql += `('${compId}', 'extraliga-${SEASON}', 100, ${SEASON}, 0, 'upcoming', false, '${startDate} 00:00:00+00', '${endDate} 23:59:59+00', '${LEAGUE_ID}', ${SEASON}, NOW(), NOW());\n\n`;

  // Insert competition locales
  sql += `-- 2. Competition Locales\n`;
  const nameMapComp: Record<string, string> = {
    sk: 'Česká Extraliga',
    cs: 'Česká Extraliga',
    en: 'Czech Extraliga',
  };
  sql += `INSERT INTO competitions_locales (id, competition_id, name, description, locale) VALUES\n`;
  const localesMap = ['sk', 'cs', 'en'];
  for (let i = 0; i < localesMap.length; i++) {
    const loc = localesMap[i];
    sql += `('${generateCuid()}', '${compId}', '${nameMapComp[loc]}', '', '${loc}')${i === localesMap.length - 1 ? ';' : ','}\n`;
  }
  sql += `\n`;

  // Insert assets and teams
  sql += `-- 3. Assets (Logos)\n`;
  sql += `INSERT INTO assets (id, key, alt, url, filename, mime_type, filesize, width, height, created_at, updated_at) VALUES\n`;
  
  const assetValues = [];
  const teamValues = [];
  const teamLocaleValues = [];

  for (const team of teamsData) {
    const logoUrl = team.logo;
    let logoId = null;
    if (logoUrl) {
      const filename = `team_${team.id}.png`;
      const filepath = path.join(destDir, filename);
      const filesize = await downloadImage(logoUrl, filepath);
      
      logoId = generateCuid();
      assetValues.push(`('${logoId}', 'teams/${filename}', '${team.name} Logo', '/images/teams/${filename}', '${filename}', 'image/png', ${filesize}, NULL, NULL, NOW(), NOW())`);
    }

    const teamId = generateCuid();
    const slug = team.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cPrimary = team.colors?.[0] || '#000000';
    const cSecondary = team.colors?.[1] || '#ffffff';
    
    // We don't have exact hex codes from API, so just use basic colors mapping if needed, or fallback.
    // The API returns color names like "Blue", "White", "Red". We will just use them anyway, or map them to hex.
    const colorsMap: Record<string, string> = {
      'Blue': '#0000FF',
      'White': '#FFFFFF',
      'Red': '#FF0000',
      'Black': '#000000',
      'Yellow': '#FFFF00',
      'Burgundy': '#800020',
      'Green': '#008000',
      'Orange': '#FFA500',
      'Silver': '#C0C0C0'
    };
    
    const hexPrim = colorsMap[cPrimary] || (cPrimary.startsWith('#') ? cPrimary : '#000000');
    const hexSec = colorsMap[cSecondary] || (cSecondary.startsWith('#') ? cSecondary : '#ffffff');

    teamValues.push(`('${teamId}', '${slug}', 'club', ${logoId ? `'${logoId}'` : 'NULL'}, '${hexPrim}', '${hexSec}', '${team.id}', NOW(), NOW())`);

    for (const loc of ['sk', 'cs', 'en']) {
      const shortName = team.name.substring(0, 10);
      teamLocaleValues.push(`('${generateCuid()}', '${teamId}', '${loc}', '${team.name}', '${shortName}')`);
    }
    console.log(`Downloaded logo & generated SQL for team: ${team.name}`);
  }

  if (assetValues.length > 0) {
    sql += assetValues.join(',\n') + `;\n\n`;
  } else {
    sql += `-- (No assets found)\n\n`;
  }

  sql += `-- 4. Teams\n`;
  sql += `INSERT INTO teams (id, slug, type, logo_id, colors_primary, colors_secondary, api_hockey_id, created_at, updated_at) VALUES\n`;
  sql += teamValues.join(',\n') + `;\n\n`;

  sql += `-- 5. Team Locales\n`;
  sql += `INSERT INTO teams_locales (id, parent_id, locale, name, short_name) VALUES\n`;
  sql += teamLocaleValues.join(',\n') + `;\n\n`;

  await fs.writeFile(sqlFile, sql);
  console.log(`\nSuccessfully generated SQL file at: ${sqlFile}`);
}

main().catch(console.error);
