import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'sabuj_menar_secret_key_123!';

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden. Invalid session.' });
      }

      req.user = decoded as any;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized. Token missing.' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }
};
