import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import User from '../models/User.model';

async function authentication(req: any, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function authorization(permission: string) {
  return async (req: any, res: Response, next: NextFunction) => {
    const user = (await User.findById(req.userId, { password: 0 }).populate('role')) as any;

    if (!user?.role) {
      res.status(403).json({ message: 'No role found for user' });
      return;
    }

    if (!user.role.permissions.includes(permission)) {
      res.status(403).json({ message: `Access denied for the permission: ${permission}` });
      return;
    }

    next();
  };
}

export { authentication, authorization };
