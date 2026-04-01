export const API_HOCKEY_CONFIG = {
  BASE_URL: process.env.HOCKEY_API_URL || 'https://v1.hockey.api-sports.io',
  ENDPOINTS: {
    GAMES: '/games',
    TEAMS: '/teams',
    LEAGUES: '/leagues',
    STANDINGS: '/standings',
  },
  LEAGUES: {
    SVK_EXTRALIGA: 91,
    CZE_EXTRALIGA: 10,
    NHL: 57,
    OLYMPIC_GAMES_2026: 131,
    WORLD_CHAMPIONSHIP: 111,
  },
  GAME_STATUSES: {
    NS: 'scheduled', // Not Started
    P1: 'live', // First Period
    P2: 'live', // Second Period
    P3: 'live', // Third Period
    OT: 'live', // Over Time
    PT: 'live', // Penalties Time
    BT: 'live', // Break Time
    AW: 'finished', // Awarded
    POST: 'scheduled', // Postponed
    CANC: 'cancelled', // Cancelled
    INTR: 'live', // Interrupted
    ABD: 'cancelled', // Abandoned
    AOT: 'finished', // After Over Time
    AP: 'finished', // After Penalties
    FT: 'finished', // Finished
  },
} as const;
