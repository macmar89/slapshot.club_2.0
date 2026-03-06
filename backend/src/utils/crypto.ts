import argon2 from 'argon2';
import crypto from 'crypto';

export const hashPassword = async (password: string) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
};

export const verifyPassword = async (hash: string, password: string) => {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    return false;
  }
};

export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};
