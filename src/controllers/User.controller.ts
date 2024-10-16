import { Request, Response } from 'express';
import supabase from '../config/database';

export default class UserController {
  static async me(req: Request, res: Response): Promise<void> {
    const accessToken = req.headers.authorization?.split(' ')[1];

    try {
      const { data, error } = await supabase.auth.getUser(accessToken);

      if (error) {
        res.status(400).json({ message: 'Invalid access token' });
        return;
      }

      res.status(200).json({ data, message: 'Udało się pobrać Cieie :)' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
