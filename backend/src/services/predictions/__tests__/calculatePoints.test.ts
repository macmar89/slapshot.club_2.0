import { describe, expect, it } from 'vitest';
import { APP_CONFIG } from '../../../config/app.js';
import { calculatePoints } from '../predictionsLogic.service.js';

type Score = [home: number, away: number];

const evaluate = (tip: Score, real: Score) =>
  calculatePoints(
    { homeGoals: tip[0], awayGoals: tip[1] },
    { resultHomeScore: real[0], resultAwayScore: real[1] },
  );

const pointsOf = (tip: Score, real: Score) => evaluate(tip, real).points;

const MAX_GOALS = 12;

const tipsScoring = (real: Score, points: number) => {
  const matching: string[] = [];

  for (let home = 0; home <= MAX_GOALS; home += 1) {
    for (let away = 0; away <= MAX_GOALS; away += 1) {
      if (pointsOf([home, away], real) === points) {
        matching.push(`${home}:${away}`);
      }
    }
  }

  return matching.sort();
};

const winnerOf = ([home, away]: Score) => {
  if (home > away) return 'home';
  if (home < away) return 'away';
  return 'draw';
};

const flagsOf = ({ isExact, isDiff, isTrend, isWrong }: ReturnType<typeof calculatePoints>) => ({
  isExact,
  isDiff,
  isTrend,
  isWrong,
});

describe('calculatePoints', () => {
  describe('exact score', () => {
    it('awards EXACT points', () => {
      expect(evaluate([3, 2], [3, 2])).toEqual({
        points: APP_CONFIG.POINTS.EXACT,
        isExact: true,
        isTrend: false,
        isDiff: false,
        isWrong: false,
      });
    });

    it('awards EXACT points for a draw', () => {
      expect(evaluate([2, 2], [2, 2])).toEqual({
        points: APP_CONFIG.POINTS.EXACT,
        isExact: true,
        isTrend: false,
        isDiff: false,
        isWrong: false,
      });
    });

    it('awards EXACT points for a goalless draw', () => {
      expect(pointsOf([0, 0], [0, 0])).toBe(APP_CONFIG.POINTS.EXACT);
    });
  });

  describe('one goal off (DIFF)', () => {
    it('awards DIFF points when the home score is one goal off', () => {
      expect(evaluate([4, 2], [3, 2])).toEqual({
        points: APP_CONFIG.POINTS.DIFF,
        isExact: false,
        isTrend: false,
        isDiff: true,
        isWrong: false,
      });
    });

    it('awards DIFF points when the away score is one goal off', () => {
      expect(pointsOf([3, 1], [3, 2])).toBe(APP_CONFIG.POINTS.DIFF);
    });

    it('lists exactly two DIFF tips for a 3:2 result', () => {
      expect(tipsScoring([3, 2], APP_CONFIG.POINTS.DIFF)).toEqual(['3:1', '4:2']);
    });

    it('lists exactly one DIFF tip for a 1:0 result', () => {
      expect(tipsScoring([1, 0], APP_CONFIG.POINTS.DIFF)).toEqual(['2:0']);
    });

    it('lists exactly three DIFF tips for a 2:0 result', () => {
      expect(tipsScoring([2, 0], APP_CONFIG.POINTS.DIFF)).toEqual(['1:0', '2:1', '3:0']);
    });

    it('lists exactly four DIFF tips for a 5:1 result', () => {
      expect(tipsScoring([5, 1], APP_CONFIG.POINTS.DIFF)).toEqual(['4:1', '5:0', '5:2', '6:1']);
    });

    it('lists exactly three DIFF tips for an away win', () => {
      expect(tipsScoring([0, 3], APP_CONFIG.POINTS.DIFF)).toEqual(['0:2', '0:4', '1:3']);
    });

    it('never awards DIFF points for a drawn result', () => {
      expect(tipsScoring([0, 0], APP_CONFIG.POINTS.DIFF)).toEqual([]);
      expect(tipsScoring([2, 2], APP_CONFIG.POINTS.DIFF)).toEqual([]);
      expect(tipsScoring([4, 4], APP_CONFIG.POINTS.DIFF)).toEqual([]);
    });

    it('does not award DIFF points when the one goal flips the winner', () => {
      expect(pointsOf([2, 2], [3, 2])).toBe(APP_CONFIG.POINTS.WRONG);
      expect(pointsOf([3, 3], [3, 2])).toBe(APP_CONFIG.POINTS.WRONG);
      expect(pointsOf([0, 0], [1, 0])).toBe(APP_CONFIG.POINTS.WRONG);
    });
  });

  describe('correct winner only (TREND)', () => {
    it('awards TREND points when the goal difference matches but the score is further off', () => {
      expect(evaluate([2, 1], [3, 2])).toEqual({
        points: APP_CONFIG.POINTS.TREND,
        isExact: false,
        isTrend: true,
        isDiff: false,
        isWrong: false,
      });
    });

    it('awards TREND points for a correct winner with a different goal difference', () => {
      expect(pointsOf([5, 1], [3, 2])).toBe(APP_CONFIG.POINTS.TREND);
    });

    it('awards TREND points for a correctly predicted draw', () => {
      expect(evaluate([1, 1], [2, 2])).toEqual({
        points: APP_CONFIG.POINTS.TREND,
        isExact: false,
        isTrend: true,
        isDiff: false,
        isWrong: false,
      });
    });

    it('awards TREND points for an away win', () => {
      expect(pointsOf([1, 4], [2, 5])).toBe(APP_CONFIG.POINTS.TREND);
    });
  });

  describe('wrong winner (WRONG)', () => {
    it('awards no points when the winner is wrong', () => {
      expect(evaluate([1, 3], [3, 1])).toEqual({
        points: APP_CONFIG.POINTS.WRONG,
        isExact: false,
        isTrend: false,
        isDiff: false,
        isWrong: true,
      });
    });

    it('awards no points for a draw tip against a decided match', () => {
      expect(pointsOf([2, 2], [4, 1])).toBe(APP_CONFIG.POINTS.WRONG);
    });

    it('awards no points for a decided tip against a drawn match', () => {
      expect(pointsOf([3, 1], [2, 2])).toBe(APP_CONFIG.POINTS.WRONG);
    });
  });

  describe('rule change against the previous goal difference rule', () => {
    const droppedToTrend: Score[] = [
      [2, 1],
      [4, 3],
      [1, 0],
      [5, 4],
    ];

    it.each(droppedToTrend)('scores %i:%i as TREND against a 3:2 result', (home, away) => {
      expect(pointsOf([home, away], [3, 2])).toBe(APP_CONFIG.POINTS.TREND);
    });

    const raisedToDiff: Score[] = [
      [4, 2],
      [3, 1],
    ];

    it.each(raisedToDiff)('scores %i:%i as DIFF against a 3:2 result', (home, away) => {
      expect(pointsOf([home, away], [3, 2])).toBe(APP_CONFIG.POINTS.DIFF);
    });

    it('drops a correctly predicted draw from DIFF to TREND', () => {
      expect(pointsOf([1, 1], [2, 2])).toBe(APP_CONFIG.POINTS.TREND);
      expect(pointsOf([0, 0], [3, 3])).toBe(APP_CONFIG.POINTS.TREND);
    });
  });

  describe('invariants across the whole score grid', () => {
    const GRID = 8;
    const allPairs: Array<[Score, Score]> = [];

    for (let realHome = 0; realHome <= GRID; realHome += 1) {
      for (let realAway = 0; realAway <= GRID; realAway += 1) {
        for (let tipHome = 0; tipHome <= GRID; tipHome += 1) {
          for (let tipAway = 0; tipAway <= GRID; tipAway += 1) {
            allPairs.push([
              [tipHome, tipAway],
              [realHome, realAway],
            ]);
          }
        }
      }
    }

    it('covers the whole grid', () => {
      expect(allPairs).toHaveLength((GRID + 1) ** 4);
    });

    it('always sets exactly one outcome flag', () => {
      for (const [tip, real] of allPairs) {
        const flags = Object.values(flagsOf(evaluate(tip, real)));
        expect(flags.filter(Boolean)).toHaveLength(1);
      }
    });

    it('always awards the points configured for the outcome flag', () => {
      for (const [tip, real] of allPairs) {
        const outcome = evaluate(tip, real);
        const expected = outcome.isExact
          ? APP_CONFIG.POINTS.EXACT
          : outcome.isDiff
            ? APP_CONFIG.POINTS.DIFF
            : outcome.isTrend
              ? APP_CONFIG.POINTS.TREND
              : APP_CONFIG.POINTS.WRONG;

        expect(outcome.points).toBe(expected);
      }
    });

    it('only flags DIFF for a correct winner exactly one goal off', () => {
      for (const [tip, real] of allPairs) {
        const deviation = Math.abs(tip[0] - real[0]) + Math.abs(tip[1] - real[1]);
        const expected = deviation === 1 && winnerOf(tip) === winnerOf(real);

        expect(evaluate(tip, real).isDiff).toBe(expected);
      }
    });

    it('never flags DIFF when the result is a draw', () => {
      for (const [tip, real] of allPairs) {
        if (winnerOf(real) === 'draw') {
          expect(evaluate(tip, real).isDiff).toBe(false);
        }
      }
    });

    it('only awards points when the winner was predicted correctly', () => {
      for (const [tip, real] of allPairs) {
        if (winnerOf(tip) !== winnerOf(real)) {
          expect(evaluate(tip, real).points).toBe(APP_CONFIG.POINTS.WRONG);
          expect(evaluate(tip, real).isWrong).toBe(true);
        }
      }
    });

    it('is symmetric when home and away are swapped on both sides', () => {
      for (const [tip, real] of allPairs) {
        const swappedTip: Score = [tip[1], tip[0]];
        const swappedReal: Score = [real[1], real[0]];

        expect(evaluate(swappedTip, swappedReal)).toEqual(evaluate(tip, real));
      }
    });

    it('never awards more points than an exact hit', () => {
      for (const [tip, real] of allPairs) {
        expect(evaluate(tip, real).points).toBeLessThanOrEqual(APP_CONFIG.POINTS.EXACT);
      }
    });
  });

  describe('incomplete data', () => {
    const empty = {
      points: 0,
      isExact: false,
      isTrend: false,
      isDiff: false,
      isWrong: false,
    };

    it('scores nothing when the match has no result', () => {
      expect(
        calculatePoints(
          { homeGoals: 3, awayGoals: 2 },
          { resultHomeScore: null, resultAwayScore: null },
        ),
      ).toEqual(empty);
    });

    it('scores nothing when only one side of the result is missing', () => {
      expect(
        calculatePoints(
          { homeGoals: 3, awayGoals: 2 },
          { resultHomeScore: 3, resultAwayScore: null },
        ),
      ).toEqual(empty);
    });

    it('scores nothing when the prediction is missing', () => {
      expect(
        calculatePoints(
          { homeGoals: null, awayGoals: null },
          { resultHomeScore: 3, resultAwayScore: 2 },
        ),
      ).toEqual(empty);
    });

    it('scores nothing when only one side of the prediction is missing', () => {
      expect(
        calculatePoints(
          { homeGoals: null, awayGoals: 2 },
          { resultHomeScore: 3, resultAwayScore: 2 },
        ),
      ).toEqual(empty);
    });
  });
});
