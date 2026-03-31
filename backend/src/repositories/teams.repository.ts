import { teams } from '../db/schema';
import { db } from '../db/index.js';

export const teamsRepository = {
  async getApiLookup() {
    return db.select({ id: teams.id, apiHockeyId: teams.apiHockeyId }).from(teams);
  },
};
