import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../lib/jwt';

// Extend Express Request type so TS doesnt complain about req.user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

// Auth middleware - checks if the user is logged in via JWT
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
try {
    const authHeader = req.headers.authorization;

    // check if header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'No token provided',
      });
      return;
    }

    // get the token (stripping 'Bearer ')
    const token = authHeader.substring(7); 

    // verify it
    const payload = verifyAccessToken(token);

    // stick payload on the request
    req.user = payload;

    next();
  } catch (error) {
    // handle expired tokens specifically
    if (error instanceof Error) {
      if (error.message === 'Access token expired') {
        res.status(401).json({
          success: false,
          message: 'Token expired',
          error: 'Please refresh your token',
        });
        return;
      }
    }

    // if anything else goes wrong its just invalid
    res.status(401).json({
      success: false,
      message: 'Invalid authentication',
      error: 'Invalid or malformed token',
    });
  }
};