import { Router } from 'express';
import { register, login, refresh, logout, getCurrentUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting 
const authLimiter = rateLimit({

  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 100, // 100 requests per window (increased for development)

  message: 'Too many authentication attempts, please try again later',

    standardHeaders: true,

  legacyHeaders: false,
});

// Async handler wrapper to catch errors
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {

  Promise.resolve(fn(req, res, next)).catch(next);

};

  // Public routes
router.post('/register', authLimiter, asyncHandler(register));
  router.post('/login', authLimiter, asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
        router.post('/logout', asyncHandler(logout));





   // Protected routes
router.get('/me', authMiddleware, asyncHandler(getCurrentUser));

export default router;
