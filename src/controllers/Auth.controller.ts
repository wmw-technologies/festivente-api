import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

export default class AuthController {
  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password', errors: { password: 'Invalid email or password' } });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email or password', errors: { password: 'Invalid email or password' } });
        return;
      }

      const JWT_SECRET = process.env.JWT_SECRET!;

      const access_token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '1h',
      });

      const refresh_token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.status(200).json({ message: 'Udało się zalogować', data: { access_token, refresh_token, expires_in: 3600 } });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
