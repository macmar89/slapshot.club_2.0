import { getRedisClient } from '../config/redis.config.js';
import { logger } from './logger.js';

const GRACE_KEY_PREFIX = 'auth:refresh-grace:';
const GRACE_LINK_KEY_PREFIX = 'auth:refresh-grace-link:';
const GRACE_TTL_SECONDS = 20;

const buildGraceKey = (hashedToken: string) => `${GRACE_KEY_PREFIX}${hashedToken}`;
const buildLinkKey = (hashedToken: string) => `${GRACE_LINK_KEY_PREFIX}${hashedToken}`;

const logRedisFailure = (error: unknown, message: string) => {
  logger.warn({ error: error instanceof Error ? error.message : String(error) }, message);
};

export const rememberRotatedRefreshToken = async <T>(
  hashedOldToken: string,
  hashedNewToken: string,
  payload: T,
): Promise<void> => {
  try {
    await getRedisClient()
      .multi()
      .set(buildGraceKey(hashedOldToken), JSON.stringify(payload), 'EX', GRACE_TTL_SECONDS)
      .set(buildLinkKey(hashedNewToken), hashedOldToken, 'EX', GRACE_TTL_SECONDS)
      .exec();
  } catch (error) {
    logRedisFailure(error, 'Failed to store refresh token grace entry');
  }
};

export const readRotatedRefreshToken = async <T>(hashedToken: string): Promise<T | null> => {
  try {
    const cached = await getRedisClient().get(buildGraceKey(hashedToken));

    return cached ? (JSON.parse(cached) as T) : null;
  } catch (error) {
    logRedisFailure(error, 'Failed to read refresh token grace entry');

    return null;
  }
};

export const forgetRotatedRefreshToken = async (hashedToken: string): Promise<void> => {
  try {
    const redis = getRedisClient();
    const linkKey = buildLinkKey(hashedToken);
    const hashedPreviousToken = await redis.get(linkKey);

    const keys = [buildGraceKey(hashedToken), linkKey];

    if (hashedPreviousToken) {
      keys.push(buildGraceKey(hashedPreviousToken));
    }

    await redis.del(...keys);
  } catch (error) {
    logRedisFailure(error, 'Failed to clear refresh token grace entry');
  }
};
