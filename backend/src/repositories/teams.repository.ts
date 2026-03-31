import { teams } from '../db/schema/index.js';
import { db } from '../db/index.js';

export const teamsRepository = {
  async getApiLookup() {
    return db.select({ id: teams.id, apiHockeyId: teams.apiHockeyId }).from(teams);
  },
};
