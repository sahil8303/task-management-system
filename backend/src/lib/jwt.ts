import jwt, { SignOptions, Secret } from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate JWT access token (short-lived)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: ACCESS_EXPIRY as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, ACCESS_SECRET as Secret, options);
};

/**
 * Generate JWT refresh token (long-lived)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: REFRESH_EXPIRY as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, REFRESH_SECRET as Secret, options);
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    }
    throw new Error('Invalid access token');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    }
    throw new Error('Invalid refresh token');
  }
};

/**
 * Get token expiry time in milliseconds
 */
export const getRefreshTokenExpiry = (): Date => {
  const expiryDays = parseInt(REFRESH_EXPIRY.replace('d', ''));
  return new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
};
