import { Request, Response } from 'express';
import supabase from '../config/database';

export default class AuthController {
  static async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        res.status(400).json({
          errors: { password: 'Invalid email or password' },
          message: 'Invalid email or password',
        });
        return;
      }

      res.status(200).json({ data, message: 'Sign in successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
