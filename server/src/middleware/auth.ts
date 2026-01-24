import { Request, Response, NextFunction } from 'express';
import { User } from '../db';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string | null;
      picture: string | null;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized', message: 'Please log in to continue' });
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  // Just continue, user may or may not be authenticated
  next();
}
