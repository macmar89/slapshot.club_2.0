import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { syncStandings } from '../competitions.service.js';
import { competitionRepository } from '../../../repositories/competitions.repository.js';
import { competitionStandingsRepository } from '../../../repositories/competitionStandings.repository.js';
import { teamsRepository } from '../../../repositories/teams.repository.js';
import { API_HOCKEY_CONFIG } from '../../../config/apiHockey.js';

vi.mock('axios');
vi.mock('../../../utils/logger.js');
vi.mock('../../../repositories/competitions.repository.js');
vi.mock('../../../repositories/competitionStandings.repository.js');
vi.mock('../../../repositories/teams.repository.js');

describe('competitions.service - syncStandings', () => {
  const competitionId = 'comp_123';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SPORT_API_KEY = 'test_key';
  });

  it('should sync only first group for non-NHL competition (e.g. SVK)', async () => {
    // Arrange
    const mockCompetition = {
      apiHockeyId: String(API_HOCKEY_CONFIG.LEAGUES.SVK_EXTRALIGA),
      apiHockeySeason: 2023,
    };
    
    const mockApiData = [
      [{ team: { id: 1, name: 'Team A' }, position: 1, games: { played: 0, win: { total: 0 }, win_overtime: { total: 0 }, lose: { total: 0 }, lose_overtime: { total: 0 } }, goals: { for: 0, against: 0 } }],
      [{ team: { id: 2, name: 'Team B' }, position: 2, games: { played: 0, win: { total: 0 }, win_overtime: { total: 0 }, lose: { total: 0 }, lose_overtime: { total: 0 } }, goals: { for: 0, against: 0 } }]
    ];

    vi.mocked(competitionRepository.getById).mockResolvedValue(mockCompetition as any);
    vi.mocked(axios.get).mockResolvedValue({ data: { response: mockApiData } });
    vi.mocked(teamsRepository.getApiLookup).mockResolvedValue([{ id: 't1', apiHockeyId: '1' }]);
    vi.mocked(competitionStandingsRepository.upsertMany).mockResolvedValue({} as any);

    // Act
    const result = await syncStandings(competitionId);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].teamId).toBe('t1');
    expect(competitionStandingsRepository.upsertMany).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ teamId: 't1' })
    ]));
    // Should NOT contain Team B because it's in the second group
    expect(result.find(r => r.teamId === 't2')).toBeUndefined();
  });

  it('should sync both groups for NHL competition', async () => {
    // Arrange
    const mockCompetition = {
      apiHockeyId: String(API_HOCKEY_CONFIG.LEAGUES.NHL),
      apiHockeySeason: 2023,
    };
    
    const mockApiData = [
      [
        { team: { id: 1, name: 'Team East' }, position: 1, group: { name: 'Eastern Conference' }, games: { played: 0, win: { total: 0 }, win_overtime: { total: 0 }, lose: { total: 0 }, lose_overtime: { total: 0 } }, goals: { for: 0, against: 0 } }
      ],
      [
        { team: { id: 2, name: 'Team West' }, position: 1, group: { name: 'Western Conference' }, games: { played: 0, win: { total: 0 }, win_overtime: { total: 0 }, lose: { total: 0 }, lose_overtime: { total: 0 } }, goals: { for: 0, against: 0 } }
      ]
    ];

    vi.mocked(competitionRepository.getById).mockResolvedValue(mockCompetition as any);
    vi.mocked(axios.get).mockResolvedValue({ data: { response: mockApiData } });
    vi.mocked(teamsRepository.getApiLookup).mockResolvedValue([
      { id: 'te', apiHockeyId: '1' },
      { id: 'tw', apiHockeyId: '2' }
    ]);
    vi.mocked(competitionStandingsRepository.upsertMany).mockResolvedValue({} as any);

    // Act
    const result = await syncStandings(competitionId);

    // Assert
    expect(result).toHaveLength(2);
    expect(result.find(r => r.teamId === 'te')).toBeDefined();
    expect(result.find(r => r.teamId === 'tw')).toBeDefined();
    expect(result.find(r => r.teamId === 'te')?.groupName).toBe('East');
    expect(result.find(r => r.teamId === 'tw')?.groupName).toBe('West');
    
    expect(competitionStandingsRepository.upsertMany).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ teamId: 'te' }),
      expect.objectContaining({ teamId: 'tw' })
    ]));
  });
});
