import { describe, expect, it } from 'vitest';
import { describeError } from '../errorDetails.js';

describe('describeError', () => {
  it('returns the message of a plain error', () => {
    expect(describeError(new Error('boom'))).toBe('boom');
  });

  it('appends the cause chain', () => {
    const cause = new Error('connection refused');
    const error = new Error('query failed', { cause });

    expect(describeError(error)).toBe('query failed | caused by: connection refused');
  });

  it('exposes postgres error details from the cause', () => {
    const cause = Object.assign(
      new Error(
        'there is no unique or exclusion constraint matching the ON CONFLICT specification',
      ),
      { code: '42P10', constraint: 'monthly_period_competition_period_idx' },
    );
    const error = new Error('Failed query: insert into "monthly_leaderboard_periods"', { cause });

    expect(describeError(error)).toBe(
      'Failed query: insert into "monthly_leaderboard_periods" | caused by: ' +
        'there is no unique or exclusion constraint matching the ON CONFLICT specification ' +
        '(code=42P10, constraint=monthly_period_competition_period_idx)',
    );
  });

  it('skips repeated messages in the chain', () => {
    const error = new Error('same', { cause: new Error('same') });

    expect(describeError(error)).toBe('same');
  });

  it('stops after the depth limit', () => {
    let error = new Error('root');

    for (let i = 0; i < 10; i++) {
      error = new Error(`level-${i}`, { cause: error });
    }

    expect(describeError(error).split(' | caused by: ')).toHaveLength(5);
  });

  it('truncates very long parts', () => {
    const message = 'x'.repeat(2000);

    expect(describeError(new Error(message))).toBe(`${'x'.repeat(500)}…`);
  });

  it('handles non-error values', () => {
    expect(describeError('plain string')).toBe('plain string');
    expect(describeError(null)).toBe('Unknown error');
    expect(describeError(undefined)).toBe('Unknown error');
  });
});
